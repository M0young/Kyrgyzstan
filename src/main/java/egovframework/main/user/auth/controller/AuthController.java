package egovframework.main.user.auth.controller;

import javax.annotation.Resource;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import egovframework.common.component.ActivityLogHelper;
import egovframework.common.component.MessageProvider;
import egovframework.common.response.ApiResponse;
import egovframework.main.user.activity.code.LogCode;
import egovframework.main.user.activity.service.ActivityService;
import egovframework.main.user.auth.dto.AuthDTO;
import egovframework.main.user.auth.service.AuthService;
import egovframework.main.user.auth.service.EmailVerificationService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
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
    
    // 회원가입
    @PostMapping("/signUp")
    public ResponseEntity<ApiResponse<String>> signUp(
    		@Valid AuthDTO auth, BindingResult bindingResult,
    		@RequestParam String verificationCode) {
    	try {
            // 1. 유효성 검사
            ResponseEntity<ApiResponse<String>> validationResult = handleValidationErrors(bindingResult);
            if (validationResult != null) {
                return validationResult;
            }

            // 2. 인증코드 확인
            if (!emailVerificationService.verifyCode(auth.getEml(), verificationCode)) {
                return ApiResponse.error(messageProvider.getMessage("auth.verification.invalid"));
            }

            // 3. 사용자 등록
            int result = authService.insertUserInfo(auth);
            if (result != 1) {
                logger.error("사용자 정보 등록 실패");
                return ApiResponse.error(messageProvider.getMessage("auth.signup.failed"));
            }

            // 4. 활동 로그 기록
            activityLogHelper.logUserActivity(auth.getEml(), LogCode.REGISTER, 1);
            
            // 5. 성공 응답
            return ApiResponse.success(messageProvider.getMessage("auth.signup.success"));

        } catch (Exception e) {
        	// 기타 예외 처리
            logger.error("회원가입 처리 중 오류 발생", e);
            return ApiResponse.error(messageProvider.getMessage("auth.signup.failed"));
        }
    }
    
    // 인증 코드
    @PostMapping("/send-verification")
    public ResponseEntity<ApiResponse<String>> sendVerification(
    		@Validated(AuthDTO.EmailVerification.class) @RequestBody AuthDTO auth,
    		BindingResult bindingResult) {
    	try {
    		// 1. 유효성 검사
    		ResponseEntity<ApiResponse<String>> validationResult = handleValidationErrors(bindingResult);
            if (validationResult != null) {
                return validationResult;
            }
            
            // 2. 이메일 인증 코드 발송
            emailVerificationService.sendEmailVerificationCode(auth.getEml());
            
            // 3. 성공 응답
            return ApiResponse.success(messageProvider.getMessage("auth.verification.sent"));
            
        } catch (IllegalStateException e) {
        	// 이메일 존재여부, 인증 시도횟수 등 검증 실패
        	logger.error("사용자 요청 검증 실패: email={}", auth.getEml());
            return ApiResponse.error(messageProvider.getMessage(e.getMessage()));
            
        } catch (Exception e) {
        	// 기타 예외 처리
            logger.error("인증 코드 발송 중 오류 발생", e);
            return ApiResponse.error(messageProvider.getMessage("auth.verification.failed"));
        }
    }
    
    // 임시 비밀번호
    @PostMapping("/send-password")
    public ResponseEntity<ApiResponse<String>> sendPassword(
    		@Validated(AuthDTO.EmailVerification.class) @RequestBody AuthDTO auth,
    		BindingResult bindingResult) {
        try {
        	// 1. 유효성 검사
        	ResponseEntity<ApiResponse<String>> validationResult = handleValidationErrors(bindingResult);
            if (validationResult != null) {
                return validationResult;
            }
            
            // 2. 임시 비밀번호 발송
            emailVerificationService.sendEmailTempPassword(auth.getEml());
            
            // 3. 활동 로그 기록
            activityLogHelper.logUserActivity(auth.getEml(), LogCode.TEMP_PASSWORD_ISSUED, 1);
            
            // 4. 성공 응답
            return ApiResponse.success(messageProvider.getMessage("auth.password.temp.sent"));
            
        } catch (IllegalStateException e) {
        	// 이메일 존재여부, 인증 시도횟수 등 검증 실패
        	logger.error("사용자 요청 검증 실패: email={}", auth.getEml());
            return ApiResponse.error(messageProvider.getMessage(e.getMessage()));
            
        } catch (Exception e) {
        	// 기타 예외 처리
        	logger.error("임시 비밀번호 발송 중 오류 발생", e);
            return ApiResponse.error(messageProvider.getMessage("auth.password.temp.failed"));
        }
    }
}