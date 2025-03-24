package egovframework.common.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import egovframework.common.component.MessageProvider;
import egovframework.common.component.SessionTrackingListener;
import egovframework.common.notification.dto.NotificationDto;
import egovframework.common.notification.service.NotificationService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import javax.annotation.Resource;

@Component
public class SessionExpiryWarningService {
    
    @Resource
    private SessionTrackingListener sessionTracker;
    
    @Resource
    private NotificationService notificationService;
    
    @Resource
    private MessageProvider messageProvider;
    
    @Value("${session.timeout.seconds:2100}")
    private int sessionTimeoutSeconds;
    private static final int WARNING_SECONDS_BEFORE_EXPIRY = 300;
    private final Map<String, Long> warnedSessions = new ConcurrentHashMap<>(); // 세션 ID, 갱신 시간 정보

    @Scheduled(fixedDelay = 60000)
    public void checkSessionsForExpiry() {
    	// 만료 임박 세션 가져오기
        List<SessionTrackingListener.SessionInfo> expiringList = 
        		sessionTracker.getSessionsNearingExpiry(WARNING_SECONDS_BEFORE_EXPIRY);
        
        // 각 세션에 대해 경고 전송
        for (SessionTrackingListener.SessionInfo info : expiringList) {
            String sessionId = info.getSessionId();
            String username = info.getUsername();
            long lastActivity = info.getLastActivity();
            // 이미 경고를 보낸 세션인지 확인하고, 세션이 갱신되었는지 확인
            Long lastWarningTime = warnedSessions.get(sessionId);
            
            // 경고를 보낸 적이 없거나, 세션이 경고 후 갱신된 경우 다시 경고 발송
            if (lastWarningTime == null || lastActivity > lastWarningTime) {
                long elapsedMs = System.currentTimeMillis() - info.getLastActivity();
                int maxInactiveMs = info.getMaxInactiveInterval() * 1000;
                long remainingSeconds = (maxInactiveMs - elapsedMs) / 1000;
                
                sendSessionExpiryWarning(username, remainingSeconds);
                
                warnedSessions.put(sessionId, System.currentTimeMillis());
            }
        }
    }
    
    private void sendSessionExpiryWarning(String username, long secondsRemaining) {
        int minutesRemaining = (int) (secondsRemaining / 60);
        
        Map<String, Object> data = new HashMap<>();
        data.put("type", "SESSION_EXPIRING");
        data.put("minutesRemaining", minutesRemaining);
        data.put("secondsRemaining", secondsRemaining);
        data.put("message", messageProvider.getMessage("notification.session.expiring"));
        data.put("timestamp", System.currentTimeMillis());
        
        NotificationDto notification = new NotificationDto(
            "SESSION_EXPIRING",
            messageProvider.getMessage("notification.session.expiring"),
            data
        );
        
        notificationService.sendNotificationToUser(username, notification);
    }
    
    @Scheduled(fixedDelay = 3600000)
    public void cleanupWarnedSessions() {
        Set<String> activeSession = sessionTracker.getActiveSession();
        
        // 경고가 발송된 세션 중 더 이상 활성 상태가 아닌 것들 제거
        warnedSessions.keySet().removeIf(sessionId -> !activeSession.contains(sessionId));
    }
}