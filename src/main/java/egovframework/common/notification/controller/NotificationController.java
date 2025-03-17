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

import egovframework.common.notification.dto.NotificationDto;
import egovframework.common.notification.service.NotificationService;
import egovframework.common.response.ApiResponse;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    
	private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);
    private static final long SSE_TIMEOUT = 300000; // 5분(300초) 타임아웃으로 설정

    @Resource
    private NotificationService notificationService;

    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            String username = auth.getName();

            // 타임아웃 설정된 이미터 생성
            SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);
            
            // 완료 핸들러
            emitter.onCompletion(new Runnable() {
                @Override
                public void run() {
                    notificationService.removeEmitter(username);
                }
            });
            
            // 타임아웃 핸들러
            emitter.onTimeout(new Runnable() {
                @Override
                public void run() {
                    notificationService.removeEmitter(username);
                }
            });
            
            // 에미터 저장
            notificationService.addEmitter(username, emitter);

            // 초기 연결 성공 이벤트 전송
            try {
                Map<String, Object> connectionInfo = new HashMap<>();
                connectionInfo.put("status", "connected");
                connectionInfo.put("username", username);
                connectionInfo.put("timestamp", System.currentTimeMillis());

                NotificationDto connectedNotification = new NotificationDto(
                    "CONNECTED", 
                    "알림 서비스에 연결되었습니다.", 
                    connectionInfo
                );

                emitter.send(SseEmitter.event()
                    .name("connection")
                    .data(connectedNotification));
                
                // 자동 재연결을 위한 핑 이벤트 전송
                emitter.send(SseEmitter.event()
                    .name("keepalive")
                    .data(""));
                
                // 클라이언트에게 5분마다 재연결 요청
                emitter.send(SseEmitter.event()
                    .comment("retry: 300000"));
            } catch (Exception e) {
                logger.error("Failed to send SSE event: {}", e.getMessage());
                notificationService.removeEmitter(username);
                try {
                    emitter.complete();
                } catch (Exception ex) {
                    // 이미 완료된 emitter에 대한 예외 무시
                }
                return new SseEmitter(0L);
            }

            return emitter;
        }
        // 인증되지 않은 사용자
        return new SseEmitter(0L);
    }
    
    // 세션 연장 API
    @PostMapping("/extend-session")
    public ResponseEntity<ApiResponse<Void>> extendSession(HttpServletRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            if (auth != null && auth.isAuthenticated()) {
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
    
    // remember-me 인증 확인
    @GetMapping("/check-remember-me")
    public ResponseEntity<ApiResponse<Boolean>> checkRememberMe(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.isAuthenticated()) {
            boolean isRememberMe = authentication instanceof RememberMeAuthenticationToken;
            return ApiResponse.success(isRememberMe);
        }
        return ApiResponse.error("인증되지 않은 사용자입니다.");
    }
}