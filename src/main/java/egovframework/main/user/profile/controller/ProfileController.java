package egovframework.main.user.profile.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.validation.Valid;

import egovframework.main.user.auth.service.AuthService;
import egovframework.main.user.auth.dto.AuthDTO;
import egovframework.main.user.auth.service.EmailVerificationService;
import egovframework.main.user.activity.service.ActivityService;
import egovframework.common.component.ActivityLogHelper;
import egovframework.common.component.MessageProvider;
import egovframework.common.response.ApiResponse;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private static final Logger logger = LoggerFactory.getLogger(ProfileController.class);
    
    @Resource(name = "authService")
    private AuthService authService;
    
    @Resource(name = "activityService")
    private ActivityService activityService;
    
    @Resource(name = "emailVerificationService")
    private EmailVerificationService emailVerificationService;
    
    @Resource
	private ActivityLogHelper activityLogHelper;
    
    @Resource
    private MessageProvider messageProvider;
    
    // 유효성 검사
    private ResponseEntity<ApiResponse<String>> handleValidationErrors(BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            FieldError fieldError = bindingResult.getFieldError();
            logger.error("유효성 검사 실패: {}", bindingResult.getAllErrors());
            return ApiResponse.error(messageProvider.getMessage(fieldError.getDefaultMessage()));
        }
        return null;
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(@Valid AuthDTO auth, BindingResult bindingResult) {
        try {
        	ResponseEntity<ApiResponse<String>> validationResult = handleValidationErrors(bindingResult);
            if (validationResult != null) {
                return validationResult;
            }
            
            int result = authService.updatePassword(auth);
            if (result > 0) {
                return ApiResponse.success(messageProvider.getMessage("auth.password.reset.success"));
            }
            logger.error("비밀번호 변경 실패. email: {}", auth.getEml());
            return ApiResponse.error(messageProvider.getMessage("auth.password.reset.failed"));
        } catch (Exception e) {
            logger.error("비밀번호 변경 중 오류 발생", e);
            return ApiResponse.error(messageProvider.getMessage("auth.password.reset.failed"));
        }
    }
}