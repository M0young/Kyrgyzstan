package krgz.layer.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import krgz.layer.service.LayerService;
import krgz.progress.service.ProgressService;
import krgz.progress.service.ProgressVO;
import krgz.layer.service.FileUploadService;
import krgz.layer.service.GeoServerService;
import krgz.layer.service.ShapeFileService;
import krgz.util.JsonUtils;

import javax.annotation.Resource;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Controller
@RequestMapping("/layer")
public class LayerController {
    private static final Logger logger = LoggerFactory.getLogger(LayerController.class);
    
    @Resource(name = "layerService")
    private LayerService layerService;
    
    @Resource(name = "progressService")
    private ProgressService progressService;
    
    @Resource(name = "fileUploadService")
    private FileUploadService fileUploadService;
    
    @Resource(name = "geoServerService")
    private GeoServerService geoServerService;
    
    @Resource(name = "shapefileService")
    private ShapeFileService shapefileService;

    @PostMapping("/uploadShpData.do")
    public ResponseEntity<?> uploadShpData(MultipartHttpServletRequest request) throws IOException {
        Map<String, File> shpFiles = new HashMap<>();
        String mapType = request.getParameter("mapType");
        int coord = Integer.parseInt(request.getParameter("coord"));
        String year = request.getParameter("year");
        String layerProcess = request.getParameter("layerProcess");
        logger.info("Coord: {}", coord);
        try {
    	   // 1. 파일 업로드 처리
    	   if (!fileUploadService.processUploadedFiles(request, shpFiles)) {
    	       return createErrorResponse("Required files were not uploaded", HttpStatus.BAD_REQUEST);
    	   }
    	   
    	   // 2. Shape 파일 검증
    	   shapefileService.validateShapefile(shpFiles.get(".shp"));
    	   
    	   // 3. Progress 객체 생성 및 초기화
    	   ProgressVO progressVO = initializeProgress(request);
    	   
    	   // 4. 초기 응답 생성
    	   Map<String, Object> response = createInitialResponse(progressVO);
    	   
    	   // 5. 비동기 데이터 처리 시작
    	   CompletableFuture.runAsync(() -> 
    	       processDataAsync(shpFiles, mapType, coord, progressVO, layerProcess));
    	   
    	   return ResponseEntity.ok(JsonUtils.convertToJson(response));
    	   
    	} catch (Exception e) {
    	   return createErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
    	}
    }

    @GetMapping("/progress.do")
    public ResponseEntity<?> getProgress(@RequestHeader("X-Progress-ID") String progressId) throws IOException {
    	try {
            ProgressVO progress = progressService.getProgress(progressId);
            if (progress == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Progress information not found");
                return ResponseEntity.ok(JsonUtils.convertToJson(errorResponse));
            }
            return ResponseEntity.ok(JsonUtils.convertToJson(createProgressResponse(progress)));
        } catch (Exception e) {
        	return createErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    @PostMapping("/analyzePrj.do")
    public ResponseEntity<?> analyzePrjFile(MultipartFile prjFile) throws IOException {
        try {
            Integer coord = fileUploadService.extractCRSFromPrj(prjFile);
            
            Map<String, Object> response = new HashMap<>();
            if (coord != null) {
                response.put("coord", coord);
                response.put("success", true);
            } else {
                response.put("success", false);
                response.put("error", "Unable to determine coordinate system from PRJ file");
            }
            
            return ResponseEntity.ok(JsonUtils.convertToJson(response));
        } catch (Exception e) {
            return createErrorResponse("Error occurred while analyzing PRJ file", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    private ProgressVO initializeProgress(MultipartHttpServletRequest request) throws Exception {
        ProgressVO progressVO = new ProgressVO();
        progressVO.setPrgrs_id(UUID.randomUUID().toString());
        progressVO.setUser_no(request.getHeader("userId"));
        progressVO.setPrgrs(0);
        progressVO.setCmptn_rcd(0);
        progressVO.setCmptn_yn("N");
        progressVO.setStts("INITIALIZING");
        progressService.insertProgress(progressVO);
        return progressVO;
    }

    private Map<String, Object> createInitialResponse(ProgressVO progressVO) {
        Map<String, Object> response = new HashMap<>();
        response.put("stts", "processing");
        response.put("prgrs_id", progressVO.getPrgrs_id());
        response.put("prgrs", progressVO.getPrgrs());
        response.put("cmptn_rcd", progressVO.getCmptn_rcd());
        response.put("tnocs_rcd", progressVO.getTnocs_rcd());
        response.put("cmptn_yn", progressVO.getCmptn_yn());
        return response;
    }

    private void processDataAsync(Map<String, File> shpFiles, String mapType, int coord, ProgressVO progressVO, String layerProcess) {
        try {
            progressVO.setPrgrs(0);
            progressVO.setStts("PROCESSING");
            progressService.updateProgress(progressVO);
            
            // 1. DB 작업 수행 (트랜잭션 처리)
			//    - replace: 기존 테이블 백업 후 새 데이터 입력
			//    - append: 기존 테이블에 데이터 추가
            layerService.processShapefileWithTransaction(shpFiles.get(".shp"), mapType, layerProcess, coord, progressVO);

            // 2. GeoServer 레이어 발행
            geoServerService.publishLayerToGeoServer(mapType, coord);

            progressVO.setPrgrs(100);
            progressVO.setCmptn_yn("Y");
            progressVO.setStts("COMPLETED");
            progressService.updateProgress(progressVO);
        } catch (Exception e) {
            String errorMsg = "Error occurred while processing records: " + e.getMessage();
            progressVO.setErr(errorMsg);
            progressVO.setCmptn_yn("N");
            progressVO.setStts("ERROR");
            try {
                progressService.updateProgress(progressVO);
            } catch (Exception ex) {
                logger.error("Failed to update error status: {}", ex.getMessage());
            }
        } finally {
            cleanupFiles(shpFiles);
        }
    }

    private Map<String, Object> createProgressResponse(ProgressVO progress) {
        Map<String, Object> response = new HashMap<>();
        response.put("prgrs_id", progress.getPrgrs_id());
        response.put("user_no", progress.getUser_no());
        response.put("prgrs", progress.getPrgrs());
        response.put("tnocs_rcd", progress.getTnocs_rcd());
        response.put("cmptn_rcd", progress.getCmptn_rcd());
        response.put("cmptn_yn", progress.getCmptn_yn());
        response.put("err", progress.getErr());
        response.put("reg_dt", progress.getReg_dt());
        response.put("cmptn_dt", progress.getCmptn_dt());
        response.put("file_nm", progress.getFile_nm());
        response.put("stts", progress.getStts());
        
        return response;
    }

    private void cleanupFiles(Map<String, File> shpFiles) {
        try {
            fileUploadService.cleanupFiles(shpFiles);
            logger.info("임시 파일 정리 완료");
        } catch (Exception e) {
            logger.error("임시 파일 정리 중 오류", e);
        }
    }
    
    private ResponseEntity<?> createErrorResponse(String message, HttpStatus status) {
        Map<String, String> errorResponse = new HashMap<>();
        try {
            errorResponse.put("error", message);
            logger.error("Error details: {}", message);
            
            return ResponseEntity.status(status)
                .contentType(MediaType.APPLICATION_JSON)
                .body(JsonUtils.convertToJson(errorResponse));
        } catch (Exception e) {
            logger.error("Error response creation failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"error\":\"Internal Server Error\"}");
        }
    }
}