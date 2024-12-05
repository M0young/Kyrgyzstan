package krgz.layer.service;

import krgz.layer.service.LayerService;
import krgz.layer.service.LayerVO;
import krgz.progress.service.ProgressService;
import krgz.progress.service.ProgressVO;
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

import java.io.File;
import java.nio.charset.Charset;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("shapefileService")
public class ShapeFileService {
    private static final Logger logger = LoggerFactory.getLogger(ShapeFileService.class);
    private static final int BATCH_SIZE = 100;          // 배치 처리 크기
    private static final int PROGRESS_UPDATE_INTERVAL = 1;  // 진행률 업데이트 주기

    private final LayerService layerService;
    private final ProgressService progressService;

    public ShapeFileService(LayerService layerService, ProgressService progressService) {
        this.layerService = layerService;
        this.progressService = progressService;
    }

    public void validateShapefile(File shpFile) throws Exception {
        // 1. 파일 기본 검증
        if (shpFile == null || !shpFile.exists()) {
            throw new IllegalArgumentException("Invalid Shape file");
        }
        
        // 2. Shape file 형식 검증
        FileDataStore fds = null;
        try {
        	fds = FileDataStoreFinder.getDataStore(shpFile);
        	if (fds == null || !(fds instanceof ShapefileDataStore)) {
        	    throw new IllegalStateException("Invalid Shape file Conversion or DataStore is null");
        	}
        } finally {
            if (fds != null) fds.dispose();
        }
    }
    
    public void processShapefile(File shpFile, String mapType, int coord, ProgressVO progressVO) throws Exception {
        FileDataStore fds = null;
        
        try {
        	// 1. ShapeFile 초기화
            fds = FileDataStoreFinder.getDataStore(shpFile);
            ShapefileDataStore sds = (ShapefileDataStore) fds;
            sds.setCharset(Charset.forName("UTF-8"));

            // 2. 스키마 분석
            updateProcessStatus(progressVO, "PARSING", 0); 
            SimpleFeatureSource featureSource = sds.getFeatureSource();
            SimpleFeatureType schema = featureSource.getSchema();
            logSchemaInfo(schema);
            
            // 3. 데이터 처리 및 입력
            SimpleFeatureCollection features = featureSource.getFeatures();
            int totalRecords = features.size();
            processFeaturesData(sds, mapType, coord, totalRecords, progressVO);
        } catch (Exception e) {
        	throw new RuntimeException(e.getMessage());
        } finally {
            if (fds != null) {
                fds.dispose();
            }
        }
    }

    private void processFeaturesData(ShapefileDataStore sds, String mapType, int coord, int totalRecords, ProgressVO progressVO) throws Exception {
        updateProcessStatus(progressVO, "PROCESSING", totalRecords);
        int processedCount = 0;
        int batchCount = 0;
        List<LayerVO> batch = new ArrayList<>(BATCH_SIZE);
        
        try (FeatureReader<SimpleFeatureType, SimpleFeature> reader = sds.getFeatureReader()) {
            while (reader.hasNext()) {
                SimpleFeature feature = reader.next();
                try {
                    LayerVO layerVO = mapFeatureToLayerVO(feature, coord, progressVO);
                    if (layerVO != null) {
                        batch.add(layerVO);
                        processedCount++;
                        
                        // 일정 간격으로 진행률 업데이트
                        if (processedCount % PROGRESS_UPDATE_INTERVAL == 0) {
                            updateProgressCount(progressVO, processedCount, totalRecords);
                        }
                    }

                    // 배치 처리
                    if (batch.size() >= BATCH_SIZE || !reader.hasNext()) {
                        insertBatch(batch, mapType, coord);
                        batchCount++;
                        
                        logger.info("Batch {}: Processed {} records out of {} (Current batch size: {})", 
                            batchCount, processedCount, totalRecords, batch.size());
                        
                        batch.clear();
                    }
                } catch (Exception e) {
                    throw new RuntimeException(e.getMessage());
                }
            }
        }
        updateProgressCount(progressVO, processedCount, totalRecords);
        logger.info("Processing completed - Total batches: {}, Total processed: {}, Total records: {}", 
            batchCount, processedCount, totalRecords);
    }

    private LayerVO mapFeatureToLayerVO(SimpleFeature feature, int coord, ProgressVO progressVO) {
        LayerVO layerVO = new LayerVO();
        try {
            mapStringFields(feature, layerVO);
            
            // ink가 null인 경우 에러 처리
            if (layerVO.getInk() == null) {
                String featureId = feature.getID().replaceAll("\\D+", "");
                throw new IllegalStateException(
                    String.format("Required data is missing in record %s", featureId)
                );
            }
            
            // Geometry 처리
            Geometry geometry = (Geometry) feature.getDefaultGeometry();
            if (geometry != null) {
                int geomSRID = geometry.getSRID();
                if (geomSRID != 0 && geomSRID != coord) {
                    throw new IllegalStateException(
                        String.format("Coordinate system mismatch. File uses EPSG:%d but selected EPSG:%d", 
                                    geomSRID, coord)
                    );
                }
                
                if (!geometry.isValid()) {
                    geometry = geometry.buffer(0);
                }
                geometry.setSRID(coord);
                layerVO.setGeom("SRID=" + coord + ";" + geometry.toText());
            }
            
            findValidField(feature, layerVO);
            return layerVO;
        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error processing record. Please check your data");
        }
    }
    
    private void mapStringFields(SimpleFeature feature, LayerVO layerVO) {
    	List<String> fieldList = new ArrayList<>(Arrays.asList(
	        "coate_raio", "name_raion", "coate_aa", "name_aa",
	        "nomer_kont", "staryi_nom", "vid_ugodii", "uslcode",
	        "ispolzovan", "opisanie", "primechani", "kolichestv"
	    ));
	    
	    String inkField = (getStringAttribute(feature, "ink") != null) ? "ink" : "ink_1";
	    fieldList.add(inkField);

	    String[] fields = fieldList.toArray(new String[0]);
        
        for (String field : fields) {
            setFieldValue(layerVO, field, getStringAttribute(feature, field));
        }
    }

    private String getStringAttribute(SimpleFeature feature, String fieldName) {
        try {
            Object value = feature.getAttribute(fieldName);
            if (value != null) {
                String strValue = value.toString().trim();
                return strValue.isEmpty() ? null : strValue;
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }

    private void insertBatch(List<LayerVO> batch, String mapType, int coord) throws Exception {
        if (batch.isEmpty()) return;
        
        Map<String, Object> params = new HashMap<>();
        params.put("mapType", mapType);
        params.put("coord", coord);
        
        for (LayerVO vo : batch) {
            params.put("layer", vo);
            layerService.insertDataByLandUseMap(params);
        }
    }

    private void updateProcessStatus(ProgressVO progressVO, String status, int totalRecords) throws Exception {
        progressVO.setStts(status);
        progressVO.setTnocs_rcd(totalRecords);
        progressService.updateProgress(progressVO);
    }

    private void updateProgressCount(ProgressVO progressVO, int processedCount, int totalRecords) throws Exception {
        progressVO.setCmptn_rcd(processedCount);
        progressVO.setTnocs_rcd(totalRecords);
        int progress = (int) Math.round((double) processedCount / totalRecords * 100);
        progressVO.setPrgrs(progress);
        progressService.updateProgress(progressVO);
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

    private void setFieldValue(LayerVO layerVO, String fieldName, String value) {
        switch(fieldName) {
            case "ink": layerVO.setInk(value); break;
            case "ink_1": layerVO.setInk(value); break;
            case "coate_raio": layerVO.setCoate_raio(value); break;
            case "name_raion": layerVO.setName_raion(value); break;
            case "coate_aa": layerVO.setCoate_aa(value); break;
            case "name_aa": layerVO.setName_aa(value); break;
            case "nomer_kont": layerVO.setNomer_kont(value); break;
            case "staryi_nom": layerVO.setStaryi_nom(value); break;
            case "vid_ugodii": layerVO.setVid_ugodii(value); break;
            case "uslcode": layerVO.setUslcode(value); break;
            case "ispolzovan": layerVO.setIspolzovan(value); break;
            case "opisanie": layerVO.setOpisanie(value); break;
            case "primechani": layerVO.setPrimechani(value); break;
            case "kolichestv": layerVO.setKolichestv(value); break;
        }
    }

    private void findValidField(SimpleFeature feature, LayerVO layerVO) throws SQLException {
        String[] fieldNames = {
            "pashni_v_1", "pashni_vtc", "bolota_vse", "pod_vodoi1", 
            "pod_vodo_1", "pod_vodo_2", "pod_vodo_3", "pod_doroga", 
            "pod_dvoram", "pod_postro", "narushen_1", "narushen_2", 
            "zemel_naho", "zemel_na_1", "prochi_z_1", "prochi_z_2", 
            "prochi_z_3", "prochi_z_4", "prochi_z_5", "prochi_z_6", 
            "sh_vtch_or", "sh_vtch_bo", "sh_vtch_in", "mn_vtch_dr", 
            "mn_vtch_pi", "mn_vtch_or", "mn_sadami_", "mn_vtch_sa", 
            "mn_vtch_ya", "mn_vtch_vi", "mn_vtch_tu", "zalej_vtch", 
            "zalej_vt_1", "senakosy_2", "senakosy_1", "pastbisha1", 
            "pastbish_1", "pastbish_2", "pastbish_3", "pastbish_4", 
            "pastbish_5", "pastbish_6", "pastbish_7", "pastbish_8", 
            "pastbish_9", "pastbish_10", "pastbish_11", "priusadebn", 
            "priusade_1", "priusade_2", "priusade_3", "priusade_4", 
            "priusade_5", "priusade_6", "priusade_7", "priusade_8", 
            "priusade_9", "priusad_10", "kollektivn", "kollekti_1", 
            "kollekti_2", "kollekti_3", "kollekti_4", "kollekti_5", 
            "lesnye_p_1", "lesnye_p_2", "lesnye_p_3", "lesnye_p_4", 
            "drevesno_1", "drevesno_2", "drevesno_3", "drevesno_4", 
            "drevesno_5"
        };

        for (String fieldName : fieldNames) {
            String value = getStringAttribute(feature, fieldName);
            if (value != null && !"0".equals(value)) {
                layerVO.setFld_nm(fieldName);
                
                if (fieldName.equals("priusadebn") || fieldName.equals("kollektivn") || 
                    fieldName.equals("kollekti_3")) {
                    layerVO.setCnt(value);
                } else {
                    layerVO.setKdar(value);
                }
                
                LayerVO resultVO = layerService.selectLandUseTypeCode(layerVO);
                if (resultVO != null) {
                    layerVO.setLclsf_cd(resultVO.getLclsf_cd());
                    layerVO.setSclsf_cd(resultVO.getSclsf_cd());
                }
                break;
            }
        }
    }
}