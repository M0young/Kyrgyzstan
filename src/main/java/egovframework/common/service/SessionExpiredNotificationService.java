package egovframework.common.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import egovframework.common.component.MessageProvider;
import egovframework.common.component.SessionTrackingListener;
import egovframework.common.component.SessionTrackingListener.ExpiredSessionInfo;
import egovframework.common.notification.service.NotificationService;

@Component
public class SessionExpiredNotificationService {
    
    @Resource
    private NotificationService notificationService;
    
    @Resource
    private SessionTrackingListener sessionTrackingListener;
    
    @Resource
    private MessageProvider messageProvider;
    
    @Scheduled(fixedDelay = 180000)
    public void processExpiredSessions() {
        // SessionTrackingListener로부터 만료된 세션 정보 가져오기
        List<ExpiredSessionInfo> expiredSessions = sessionTrackingListener.getAndRemoveExpiredSessions();
        
        // 각 만료된 세션에 대해 알림 전송
        for (ExpiredSessionInfo info : expiredSessions) {
        	sendSessionExpiredNotification(info.getUsername(), info.isRememberMe());
        }
    }
    
    private void sendSessionExpiredNotification(String username, boolean isRememberMe) {
    	String message = isRememberMe 
    	        ? messageProvider.getMessage("notification.session.expired.refresh")
    	        : messageProvider.getMessage("notification.session.expired.login");
    	String action = isRememberMe
    			? messageProvider.getMessage("notification.session.action.refresh")
    	        : messageProvider.getMessage("notification.session.action.login");
    	
        Map<String, Object> data = new HashMap<>();
        data.put("type", "SESSION_EXPIRED");
        data.put("title", messageProvider.getMessage("notification.session.expired.title"));
        data.put("message", message);
        data.put("action", action);
        data.put("isRememberMe", isRememberMe);
        
        notificationService.sendNotificationToUser(username, data);
    }
}