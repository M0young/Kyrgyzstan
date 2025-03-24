package egovframework.main.map.upload.imagefile.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import egovframework.common.component.MessageProvider;
import egovframework.common.response.ApiResponse;
import egovframework.environment.security.CustomUserDetails;
import egovframework.main.map.upload.imagefile.service.ImagefileProcessService;

import javax.annotation.Resource;

@RestController
@RequestMapping("/api/imagefile")
public class ImagefileController {
    private static final Logger logger = LoggerFactory.getLogger(ImagefileController.class);
    
    @Resource(name = "imagefileProcessService")
    private ImagefileProcessService imagefileProcessService;
    
    @Resource
    private MessageProvider messageProvider;
    
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Void>> uploadImagefile(MultipartHttpServletRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        int userNo = userDetails.getUserNo();
        
        try {
            imagefileProcessService.handleImageUploadProcess(request, userNo);
            
            return ApiResponse.success(messageProvider.getMessage("shapefile.upload.started"));
        } catch (Exception e) { 
        	logger.error("파일 업로드 중 오류 발생: ", e);
            return ApiResponse.error(messageProvider.getMessage("shapefile.upload.failed"));
        }
    }
}