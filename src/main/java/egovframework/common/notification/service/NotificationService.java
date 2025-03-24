package egovframework.common.notification.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NotificationService {
    
    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    
    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();
    
    public void addEmitter(String username, SseEmitter emitter) {
        emitters.put(username, emitter);
        
        emitter.onCompletion(() -> removeEmitter(username));
        emitter.onTimeout(() -> removeEmitter(username));
    }
    
    public void removeEmitter(String username) {
        emitters.remove(username);
    }
    
    public void sendNotificationToUser(String username, Object notification) {
        SseEmitter emitter = emitters.get(username);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                    .name("notification")
                    .data(notification));
            } catch (IOException e) {
                logger.error("Notification send failed: " + username, e);
                removeEmitter(username);
            }
        }
    }
    
    public void broadcastNotification(Object notification) {
        for (Map.Entry<String, SseEmitter> entry : emitters.entrySet()) {
            try {
                entry.getValue().send(SseEmitter.event()
                    .name("notification")
                    .data(notification));
            } catch (IOException e) {
                logger.error("Broadcast notification failed: " + entry.getKey(), e);
                removeEmitter(entry.getKey());
            }
        }
    }
    
    public int getActiveConnectionCount() {
        return emitters.size();
    }
}