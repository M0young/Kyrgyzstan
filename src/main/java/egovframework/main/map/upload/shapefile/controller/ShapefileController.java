package egovframework.main.map.upload.shapefile.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import egovframework.common.component.MessageProvider;
import egovframework.common.response.ApiResponse;
import egovframework.environment.security.CustomUserDetails;
import egovframework.main.map.upload.progress.service.ProgressService;
import egovframework.main.map.upload.progress.dto.ProgressDTO;
import egovframework.main.map.upload.shapefile.service.ShapefileService;
import egovframework.main.map.upload.shapefile.service.ShapefileValidationService;

import javax.annotation.Resource;
import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/shapefile")
public class ShapefileController {
    private static final Logger logger = LoggerFactory.getLogger(ShapefileController.class);
    
    @Resource(name = "shapefileService")
    private ShapefileService shapefileService;
    
    @Resource(name = "progressService")
    private ProgressService progressService;
    
    @Resource(name = "shapefileValidationService")
    private ShapefileValidationService shapefileValidationService;
    
    @Resource
    private MessageProvider messageProvider;
    
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<ProgressDTO>> uploadShapefile(MultipartHttpServletRequest request,
    		@AuthenticationPrincipal CustomUserDetails userDetails) {
        Map<String, File> shpFiles = new HashMap<>();
        int userNo = userDetails.getUserNo();
        
        try {
        	String layerProcess = request.getParameter("layerProcess");
        	int coord = shapefileValidationService.prepareShapefiles(request, shpFiles);
            ProgressDTO progressDTO = progressService.initializeProgress(userNo);
            
            CompletableFuture.runAsync(() ->
                    shapefileService.handleLayerUploadProcess(shpFiles, layerProcess, coord, progressDTO));
            
            return ApiResponse.success(progressDTO, messageProvider.getMessage("shapefile.upload.started"));
        } catch (Exception e) { 
        	logger.error("파일 업로드 중 오류 발생: ", e);
            return ApiResponse.error(messageProvider.getMessage("shapefile.upload.failed"));
        }
    }

	@GetMapping("/progress")
	public ResponseEntity<ApiResponse<ProgressDTO>> getProgress(@RequestHeader("X-Progress-ID") String progressId) {
	    try {
	        ProgressDTO progressDTO = progressService.getProgress(progressId);
	        if (progressDTO == null) {
	            return ApiResponse.error(messageProvider.getMessage("shapefile.progress.notfound"));
	        }
	        return ApiResponse.success(progressDTO);
	    } catch (Exception e) {
	    	logger.error("진행상태 조회 중 오류 발생: ", e);
	        return ApiResponse.error(messageProvider.getMessage("shapefile.progress.failed"));
	    }
	}
}