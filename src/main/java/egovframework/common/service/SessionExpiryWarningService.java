package egovframework.common.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import egovframework.common.component.MessageProvider;
import egovframework.common.component.SessionTrackingListener;
import egovframework.common.notification.service.NotificationService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    
    @Value("${session.timeout.seconds:1800}")
    private int sessionTimeoutSeconds;
    private final Map<String, Long> warnedSessions = new ConcurrentHashMap<>();

    @Scheduled(fixedDelay = 60000)
    public void checkSessionsForExpiry() {
    	// 만료 임박 세션 가져오기
        List<SessionTrackingListener.SessionInfo> expiringList = 
        		sessionTracker.getSessionsNearingExpiry(300);
        
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
        data.put("title", messageProvider.getMessage("notification.session.expiring.title"));
        data.put("message", messageProvider.getMessage("notification.session.expiring"));
        data.put("action", messageProvider.getMessage("notification.session.action.login"));
        data.put("minutesRemaining", minutesRemaining);
        data.put("secondsRemaining", secondsRemaining);
        
        notificationService.sendNotificationToUser(username, data);
    }
    
    @Scheduled(fixedDelay = 3600000)
    public void cleanupWarnedSessions() {
        warnedSessions.keySet().removeIf(sessionId -> !sessionTracker.isSessionTracked(sessionId));
    }
}