package krgz.layer.service;

import org.geotools.referencing.CRS;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class FileUploadService {
    private static final Logger logger = LoggerFactory.getLogger(FileUploadService.class);
    private static final String[] REQUIRED_EXTENSIONS = {".shp", ".dbf", ".shx", ".prj"};

    public boolean processUploadedFiles(MultipartHttpServletRequest request, Map<String, File> shpFiles) throws Exception {
        List<MultipartFile> files = request.getFiles("files");
        logger.info("업로드된 파일 수: " + files.size());
        
        String baseFileName = null;
        
        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                String originalFileName = file.getOriginalFilename();
                
                if (originalFileName == null) continue;
                int lastDotIndex = originalFileName.lastIndexOf(".");
                if (lastDotIndex > 0) {
                    String extension = originalFileName.substring(lastDotIndex).toLowerCase();
                    String nameWithoutExt = originalFileName.substring(0, lastDotIndex);
                    
                    if (isRequiredExtension(extension)) {
                        if (baseFileName == null) {
                            baseFileName = nameWithoutExt
                                .replaceAll("[\\s\\p{Punct}]+", "_")
                                .replaceAll("_{2,}", "_")
                                .replaceAll("^_|_$", "");
                        }
                        
                        File tempFile = new File(System.getProperty("java.io.tmpdir"), baseFileName + extension);
                        file.transferTo(tempFile);
                        shpFiles.put(extension, tempFile);
                        logger.info("임시 파일 생성됨: " + tempFile.getAbsolutePath());
                    }
                }
            }
        }
        
        if (baseFileName == null) {
            throw new IllegalStateException("유효한 파일이 업로드되지 않았습니다.");
        }
        
        validateFiles(shpFiles);
        return true;
    }
    
    public Integer extractCRSFromPrj(MultipartFile prjFile) throws IOException {
        File tempFile = File.createTempFile("temp", ".prj");
        try {
            prjFile.transferTo(tempFile);
            return parseCRSFromPrj(tempFile);
        } finally {
            tempFile.delete();
        }
    }

    private Integer parseCRSFromPrj(File prjFile) {
        try {
            String wkt = new String(Files.readAllBytes(prjFile.toPath()));
            CoordinateReferenceSystem crs = CRS.parseWKT(wkt);
            String crsName = crs.getName().toString();
            
            if (crsName.contains("Pulkovo_1942") && crsName.contains("GK_Zone_13N")) {
                logger.info("Pulkovo 1942 GK Zone 13N detected ({}), using EPSG:28473", crsName);
                return 28473;
            }
            if (crsName.contains("Popular_Visualisation_CRS_Mercator")) {
                logger.info("Mercator projection CRS detected ({}), using EPSG:3857", crsName);
                return 3857;
            }
            if (crsName.contains("Kyrg-06") || crsName.contains("TM_Zone_3")) {
                logger.info("Kyrgyzstan local CRS detected ({}), using EPSG:7694", crsName);
                return 7694;
            }
            Integer coord = CRS.lookupEpsgCode(crs, false);
            if (coord != null) {
                logger.info("Found EPSG code: {}", coord);
                return coord;
            }
            
            logger.error("Unable to determine CRS from: {}", crsName);
            return null;
        } catch (Exception e) {
            logger.error("CRS parsing failed: {}", e.getMessage());
            return null;
        }
    }

    private void validateFiles(Map<String, File> files) {
        if (files.size() < REQUIRED_EXTENSIONS.length) {
            // 누락된 파일 확인
            List<String> missing = new ArrayList<>();
            for (String ext : REQUIRED_EXTENSIONS) {
                if (!files.containsKey(ext)) {
                    missing.add(ext);
                }
            }
            throw new IllegalStateException("필수 파일이 누락되었습니다: " + String.join(", ", missing));
        }
        
        for (File file : files.values()) {
            if (!file.exists() || !file.canRead()) {
                throw new IllegalStateException("파일 접근 오류: " + file.getAbsolutePath());
            }
        }
    }

    private boolean isRequiredExtension(String extension) {
        for (String ext : REQUIRED_EXTENSIONS) {
            if (ext.equals(extension)) return true;
        }
        return false;
    }

    public void cleanupFiles(Map<String, File> files) {
        for (File file : files.values()) {
            if (file.exists() && !file.delete()) {
                logger.warn("임시 파일 삭제 실패: " + file.getAbsolutePath());
            }
        }
    }
}