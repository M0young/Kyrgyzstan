package egovframework.main.map.upload.shapefile.service;

import org.geotools.data.FileDataStore;
import org.geotools.data.FileDataStoreFinder;
import org.geotools.data.shapefile.ShapefileDataStore;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.data.simple.SimpleFeatureSource;
import org.geotools.data.FeatureReader;
import org.locationtech.jts.geom.Geometry;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.opengis.feature.type.GeometryDescriptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import egovframework.main.map.upload.progress.service.ProgressService;
import egovframework.main.map.upload.shapefile.dto.ShapefileDTO;
import egovframework.main.map.upload.progress.dto.ProgressDTO;

import java.io.File;
import java.nio.charset.Charset;
import java.sql.SQLException;
import java.util.*;

import javax.annotation.Resource;

@Service("shapefileProcessService")
public class ShapefileProcessService {
    private static final Logger logger = LoggerFactory.getLogger(ShapefileProcessService.class);
    private static final int BATCH_SIZE = 50;
    private static final int PROGRESS_UPDATE_INTERVAL = 1;
    private static final String CHARSET_NAME = "UTF-8";
	private static final Set<String> REQUIRED_FIELDS = new HashSet<>(Arrays.asList(
	    "coate_raio", "name_raion", "coate_aa", "name_aa", "nomer_kont", "staryi_nom", "vid_ugodii",
	    "uslcode", "ispolzovan", "opisanie", "primechani", "kategoria_", "kolichestv", "obshay_plo", "ploshad_or"
	));
    private static final Set<String> EXCLUDED_FIELDS = new HashSet<>(Arrays.asList(
	    "pashni_vse", "mn_vsego", "zalej_vseg", "senakosy_v", "pastbisha_", "vsego_sh_u", "priusade_1",
	    "lesnye_plo", "drevesno_k", "bolota_vse", "narushenny", "prochi_zem"
	));
    private static final Set<String> COUNT_FIELDS = new HashSet<>(Arrays.asList(
		"priusadebn", "kollektivn", "kollekti_3"
	));
    
    @Resource(name = "shapefileService")
    private ShapefileService shapefileService;
    
    @Resource(name = "progressService")
    private ProgressService progressService;

    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
    public void processShapefile(File shpFile, int coord, ProgressDTO progressDTO) throws Exception {
        FileDataStore fds = null;
        try {
            // 1. Shapefile 데이터 스토어 초기화
            fds = FileDataStoreFinder.getDataStore(shpFile);
            ShapefileDataStore sds = (ShapefileDataStore) fds;
            sds.setCharset(Charset.forName(CHARSET_NAME));
            
            // 2. 파싱 상태 업데이트 및 스키마 정보 로깅
            progressService.handleProgressStatus(progressDTO, "PARSING", null);
            SimpleFeatureSource featureSource = sds.getFeatureSource();
            SimpleFeatureType schema = featureSource.getSchema();
            logSchemaInfo(schema);
            
            // 3. 피처 컬렉션 가져오기
            SimpleFeatureCollection features = featureSource.getFeatures();
            
            // 4. 배치 처리 시작
            processFeaturesInBatch(sds, coord, features.size(), progressDTO);
        } catch (Exception e) {
            throw new RuntimeException("Failed to process shapefile: " + e.getMessage(), e);
        } finally {
            if (fds != null) {
                fds.dispose();
            }
        }
    }

    private void processFeaturesInBatch(ShapefileDataStore sds, int coord, int totalRecords, ProgressDTO progressDTO) throws Exception {
        List<ShapefileDTO> batch = new ArrayList<>(BATCH_SIZE);
        int processedCount = 0;
        int batchCount = 0;
        
        progressService.handleProgressStatus(progressDTO, "PROCESSING", null);
        
        try (FeatureReader<SimpleFeatureType, SimpleFeature> reader = sds.getFeatureReader()) {
            while (reader.hasNext()) {
                SimpleFeature feature = reader.next();
                try {
	                ShapefileDTO shapefileDTO = convertFeatureToDTO(feature, coord);
	                
	                if (shapefileDTO != null) {
	                    batch.add(shapefileDTO);
	                    processedCount++;
	                    
	                    if (processedCount % PROGRESS_UPDATE_INTERVAL == 0) {
	                        progressService.updateProgressCount(progressDTO, processedCount, totalRecords);
	                    }
	                    
	                    if (batch.size() >= BATCH_SIZE || !reader.hasNext()) {
	                        insertBatch(batch, coord);
	                        batchCount++;
	                        batch.clear();
	                    }
	                }
                } catch (Exception e) {
                    throw new RuntimeException(e.getMessage());
                }
            }
        }
        logger.info("Processing completed - Total batches: {}, Total processed: {}", batchCount, processedCount);
    }
    
    private ShapefileDTO convertFeatureToDTO(SimpleFeature feature, int coord) {
        ShapefileDTO shapefileDTO = new ShapefileDTO();
        try {
            // 1. 필수 필드 처리
            List<String> fieldList = new ArrayList<>(REQUIRED_FIELDS);
            
            // ink나 ink_1으로 존재하는 두가지 경우 하나로 처리
            String inkValue = extractFeatureAttribute(feature, "INK");
            String inkField = (inkValue != null) ? "INK" : "ink_1";
            fieldList.add(inkField);

            // 필수 필드 값 처리
            for (String field : fieldList) {
                String value = extractFeatureAttribute(feature, field);
                setRequierdFieldsValue(shapefileDTO, field, value);
            }

            // 지오메트리 처리
            processGeometry(feature, shapefileDTO, coord);

            // 토지 이용 필드 처리
            processLandUseFields(feature, shapefileDTO);

            return shapefileDTO;
        } catch (Exception e) {
            logger.error("Error converting feature to DTO. Feature attributes: {}", feature.getAttributes());
            logger.error("Error details: ", e);
            throw new RuntimeException("Error processing record. Please check your data", e);
        }
    }
    
    private String extractFeatureAttribute(SimpleFeature feature, String fieldName) {
        try {
            Object value = feature.getAttribute(fieldName);
            if (value != null) {
                String strValue = value.toString().trim();
                return strValue.isEmpty() ? null : strValue;
            }
        } catch (Exception e) {
            logger.debug("Field {} not found or invalid", fieldName);
        }
        return null;
    }

    private void processGeometry(SimpleFeature feature, ShapefileDTO shapefileDTO, int coord) {
        Geometry geometry = (Geometry) feature.getDefaultGeometry();
        if (geometry != null) {
            // SRID 검증
            int geomSRID = geometry.getSRID();
            if (geomSRID != 0 && geomSRID != coord) {
                throw new IllegalStateException(
                    String.format("Coordinate system mismatch. File uses EPSG:%d but selected EPSG:%d", 
                        geomSRID, coord)
                );
            }

            // 지오메트리 유효성 확인 및 설정
            if (!geometry.isValid()) {
                geometry = geometry.buffer(0);
            }
            geometry.setSRID(coord);
            shapefileDTO.setGeom("SRID=" + coord + ";" + geometry.toText());
        }
    }

    private void insertBatch(List<ShapefileDTO> batch, int coord) throws Exception {
        if (batch.isEmpty()) return;
        
        Map<String, Object> params = new HashMap<>();
        params.put("coord", coord);
        
        for (ShapefileDTO shapefileDTO : batch) {
            params.put("layer", shapefileDTO);
            shapefileService.insertShapefileData(params);
        }
    }

    private void logSchemaInfo(SimpleFeatureType schema) {
        if (schema == null) return;

        try {
            logger.info("=== Schema 정보 ===");
            logger.info("Schema Name: " + 
                (schema.getName() != null ? schema.getName().getLocalPart() : "unknown"));

            // Geometry 정보 로깅
            GeometryDescriptor geomDesc = schema.getGeometryDescriptor();
            if (geomDesc != null) {
                logger.info("Geometry Type: " + 
                    geomDesc.getType().getBinding().getSimpleName());
            }

            // 속성 정보 로깅
            schema.getAttributeDescriptors().forEach(attr -> {
                if (attr != null) {
                    logger.info(String.format("- 필드명: %-20s 타입: %-20s",
                        attr.getLocalName(),
                        attr.getType().getBinding().getSimpleName()));
                }
            });
        } catch (Exception e) {
            logger.error("Schema 정보 로깅 중 오류:", e.getMessage());
        }
    }

    private void processLandUseFields(SimpleFeature feature, ShapefileDTO shapefileDTO) throws SQLException {
        String[] fieldNames = {
        	// 경작지
        	"pashni_vse", "pashni_vtc", "pashni_v_1",
            // 다년생 식재지
        	"mn_vsego", "mn_vtch_or", "mn_vtch_sa", "mn_sadami_", "mn_vtch_ya", "mn_vtch_vi","mn_vtch_pi", "mn_vtch_tu", "mn_vtch_dr",
            // 퇴적지
        	"zalej_vseg", "zalej_vtch", "zalej_vt_1",
            // 건초지
        	"senakosy_v", "senakosy_1", "senakosy_2",
            // 목초지
        	"pastbisha_", "pastbisha1", "pastbish_1", "pastbish_2", "pastbish_3", "pastbish_4", "pastbish_5", "pastbish_6", "pastbish_7", "pastbish_8", "pastbish_9", "pastbish_10", "pastbish_11",
            // 일반 생산의 전체 농경지
        	"vsego_sh_u", "sh_vtch_or", "sh_vtch_bo", "sh_vtch_in",
            // 가정용 토지 및 서민서비스 토지
            "priusadebn", "priusade_1", "priusade_2", "priusade_3", "priusade_4", "priusade_5", "priusade_6", "priusade_7", "priusade_8", "priusade_9", "priusad_10",
            // 정원 및 텃밭
            "kollektivn","kollekti_1", "kollekti_2", "kollekti_3", "kollekti_4", "kollekti_5",
            // 개간 준비 단계 토지
            "zemel_naho", "zemel_na_1",
            // 산림
            "lesnye_plo", "lesnye_p_1", "lesnye_p_2", "lesnye_p_3", "lesnye_p_4",
            // 국가 산림 기금에 포함되지않은 나무 및 관목 식재지
            "drevesno_k", "drevesno_1", "drevesno_2", "drevesno_3", "drevesno_4", "drevesno_5",
            // 습지
            "bolota_vse", "pod_vodoi1", "pod_vodo_1", "pod_vodo_2", "pod_vodo_3",
            // 도로, 통로, 광장
            "pod_doroga", "pod_dvoram",
            // 공공 건물
            "pod_postro",
            // 훼손된 토지
            "narushenny", "narushen_1", "narushen_2",
            // 기타 토지
            "prochi_zem", "prochi_z_1", "prochi_z_2", "prochi_z_3", "prochi_z_4", "prochi_z_5", "prochi_z_6", "bashka_jer"
        };

        // 1.  값이 있는 모든 필드 찾기 
        List<String> fieldsWithValues = new ArrayList<>();
        for (String fieldName : fieldNames) {
            String value = extractFeatureAttribute(feature, fieldName);
            if (value != null) {
                Double doubleValue = parseDoubleValue(value);
                if (doubleValue > 0) {
                    fieldsWithValues.add(fieldName);
                }
            }
        }

        // 2. 값이 있는 필드 처리
        for (String fieldName : fieldNames) {
            // 값이 있는 필드가 excluded_field 하나뿐이면 제외하지 않음
            boolean skipExcluded = fieldsWithValues.size() > 1;
            
            if (skipExcluded && EXCLUDED_FIELDS.contains(fieldName)) {
                continue;  // 다른 값이 있는 경우에만 제외
            }

            String value = extractFeatureAttribute(feature, fieldName);
            if (value != null) {
                Double doubleValue = parseDoubleValue(value);
                if (doubleValue > 0) {
                    shapefileDTO.setFld_nm(fieldName);
                    
                    if (COUNT_FIELDS.contains(fieldName)) {
                        shapefileDTO.setCnt(doubleValue);
                    } else {
                        shapefileDTO.setKdar(doubleValue);
                    }
                    
                    ShapefileDTO resultDTO = shapefileService.selectLandUseTypeCode(shapefileDTO);
                    if (resultDTO != null) {
                        shapefileDTO.setLclsf_cd(resultDTO.getLclsf_cd());
                        shapefileDTO.setSclsf_cd(resultDTO.getSclsf_cd());
                    }
                    break;
                }
            }
        }
    }
    
    private void setRequierdFieldsValue(ShapefileDTO shapefileDTO, String fieldName, String value) {
        try {
            switch(fieldName) {
	            case "INK": 
	            case "ink_1": shapefileDTO.setInk(value); break;
                case "coate_raio": shapefileDTO.setCoate_raio(value); break;
                case "name_raion": shapefileDTO.setName_raion(value); break;
                case "coate_aa": shapefileDTO.setCoate_aa(value); break;
                case "name_aa": shapefileDTO.setName_aa(value); break;
                case "nomer_kont": shapefileDTO.setNomer_kont(parseIntegerValue(value)); break;
                case "staryi_nom": shapefileDTO.setStaryi_nom(parseIntegerValue(value)); break;
                case "vid_ugodii": shapefileDTO.setVid_ugodii(value); break;
                case "uslcode": shapefileDTO.setUslcode(parseIntValue(value)); break;
                case "ispolzovan": shapefileDTO.setIspolzovan(value); break;
                case "opisanie": shapefileDTO.setOpisanie(value); break;
                case "primechani": shapefileDTO.setPrimechani(value); break;
                case "kategoria_": shapefileDTO.setKategoria_(parseIntValue(value)); break;
                case "kolichestv": shapefileDTO.setKolichestv(parseIntegerValue(value)); break;
                case "obshay_plo": shapefileDTO.setObshay_plo(parseDoubleValue(value)); break;
                case "ploshad_or": shapefileDTO.setPloshad_or(parseDoubleValue(value)); break;
            }
        } catch (NumberFormatException e) {
            logger.error("Failed to parse integer value for field {}: {}", fieldName, value, e);
        } catch (Exception e) {
            logger.error("Error setting field {}: {}", fieldName, value, e);
            throw e;
        }
    }
    
    // 문자열 값을 int로 변환
    private int parseIntValue(String value) {
        if (value == null || value.trim().isEmpty() || value.equals("-")) {
            return 0;
        }
        try {
            return (int) Double.parseDouble(value.trim());
        } catch (NumberFormatException e) {
            logger.error("Failed to parse int value: {}", value);
            return 0;
        }
    }
    
    // 문자열 값을 Integer로 변환
    private Integer parseIntegerValue(String value) {
        if (value == null || value.trim().isEmpty() || value.equals("-")) {
            return null;
        }
        try {
            return (int) Double.parseDouble(value.trim());
        } catch (NumberFormatException e) {
            logger.error("Failed to parse Integer value: {}", value);
            return null;
        }
    }

    // 문자열 값을 Double로 변환
    private Double parseDoubleValue(String value) {
        if (value == null || value.trim().isEmpty() || value.equals("-")) {
            return null;
        }
        try {
            String normalized = value.trim().replace(",", ".");
            double parsedValue = Double.parseDouble(normalized);
            // 소수점 둘째자리까지 반올림
            return Math.round(parsedValue * 100.0) / 100.0;
        } catch (NumberFormatException e) {
            logger.error("Failed to parse Double value: {}", value);
            return null;
        }
    }
}