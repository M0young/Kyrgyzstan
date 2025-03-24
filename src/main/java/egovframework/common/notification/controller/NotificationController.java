package egovframework.common.notification.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.RememberMeAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import egovframework.common.component.MessageProvider;
import egovframework.common.notification.service.NotificationService;
import egovframework.common.response.ApiResponse;
import egovframework.environment.security.SecurityUtils;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    
	private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);
    private static final long SSE_TIMEOUT = 1800000;

    @Resource
    private NotificationService notificationService;
    
    @Resource
    private MessageProvider messageProvider;

    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe() {
    	if (SecurityUtils.isAuthenticated()) {
    	    String username = SecurityUtils.getUserEmail();
    	    
            // 타임아웃 설정된 이미터 생성
            SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);
            
            // 완료 핸들러
            emitter.onCompletion(() -> notificationService.removeEmitter(username));
            
            // 타임아웃 핸들러
            emitter.onTimeout(() -> notificationService.removeEmitter(username));
            
            try {
                // 에미터 저장
                notificationService.addEmitter(username, emitter);

                // 자동 재연결을 위한 핑 이벤트 전송
                emitter.send(SseEmitter.event()
                    .name("keepalive")
                    .data(""));
                
                // 클라이언트에게 재연결 주기 설정
                emitter.send(SseEmitter.event()
                    .comment("retry: 300000"));  // 5분마다 재연결
                
                return emitter;
            } catch (Exception e) {
                logger.error("SSE 초기화 중 오류: {}", e.getMessage());
                try {
                    emitter.complete();
                } catch (Exception ex) {
                    // 이미 완료된 emitter에 대한 예외 무시
                }
                return new SseEmitter(0L);
            }
        }
        // 인증되지 않은 사용자
        return new SseEmitter(0L);
    }
    
    // 세션 연장 API
    @PostMapping("/extend-session")
    public ResponseEntity<ApiResponse<Void>> extendSession(HttpServletRequest request) {
        try {
        	if (SecurityUtils.isAuthenticated()) {
                // 세션 활동 시간을 갱신하는 코드
                request.getSession(false).setMaxInactiveInterval(request.getSession().getMaxInactiveInterval());
                return ApiResponse.success("세션이 성공적으로 연장되었습니다.");
            }
            return ApiResponse.error("세션을 연장할 수 없습니다. 로그인이 필요합니다.");
        } catch (Exception e) {
            logger.error("Error extending session: {}", e.getMessage());
            return ApiResponse.error("세션 연장 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    // 세션 확인 API
    @GetMapping("/check-session-status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkSessionStatus(HttpServletRequest request) {
        try {
            // 세션 가져오기
            HttpSession session = request.getSession(false);
            Map<String, Object> response = new HashMap<>();

            // 자동 로그인 상태 확인
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            boolean isRememberMe = authentication instanceof RememberMeAuthenticationToken;
            
            String message = isRememberMe 
            		? messageProvider.getMessage("notification.session.expired.refresh")
            				: messageProvider.getMessage("notification.session.expired.login");
    		String action = isRememberMe
    				? messageProvider.getMessage("notification.session.action.refresh")
					: messageProvider.getMessage("notification.session.action.login");
    				
	        if (session == null) {
	            response.put("type", "SESSION_EXPIRED");
	            response.put("title", messageProvider.getMessage("notification.session.expired.title"));
	            response.put("message", message);
	            response.put("action", action);
	            response.put("isRememberMe", isRememberMe);
	            
	            return ApiResponse.success(response);
	        }
            
            // 세션 만료 시간 계산
            long now = System.currentTimeMillis();
            long lastAccessedTime = session.getLastAccessedTime();
            int maxInactiveInterval = session.getMaxInactiveInterval();
            long expiryTime = lastAccessedTime + (maxInactiveInterval * 1000);
            long secondsRemaining = (expiryTime - now) / 1000;
            
            if (secondsRemaining <= 0) {
            	response.put("type", "SESSION_EXPIRED");
	            response.put("title", messageProvider.getMessage("notification.session.expired.title"));
	            response.put("message", message);
	            response.put("action", action);
	            response.put("isRememberMe", isRememberMe);
            } else if (secondsRemaining <= 300) {
            	int minutesRemaining = (int) (secondsRemaining / 60);
            	
                response.put("type", "SESSION_EXPIRING");
                response.put("title", messageProvider.getMessage("notification.session.expiring.title"));
                response.put("message", messageProvider.getMessage("notification.session.expiring"));
                response.put("action", messageProvider.getMessage("notification.session.action.login"));
                response.put("minutesRemaining", minutesRemaining);
                response.put("secondsRemaining", secondsRemaining);
            } else {
                response.put("status", "SESSION_ACTIVE");
            }
            
            return ApiResponse.success(response);
        } catch (Exception e) {
            logger.error("세션 상태 확인 중 오류가 발생했습니다: ", e.getMessage());
            return ApiResponse.error("Error checking session status: {}" + e.getMessage());
        }
    }
}