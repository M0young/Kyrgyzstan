package egovframework.common.component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import lombok.AllArgsConstructor;
import lombok.Data;

@Component
public class SessionTrackingListener implements HttpSessionListener {

    private static final Logger logger = LoggerFactory.getLogger(SessionTrackingListener.class);
    private static final Map<String, Boolean> userRememberMeStatus = new ConcurrentHashMap<>();
    private static final Map<String, SessionInfo> activeSessions = new ConcurrentHashMap<>();
    private final List<ExpiredSessionInfo> expiredSessions = new CopyOnWriteArrayList<>();
    
    // 내부 세션 정보
    @Data
    public static class SessionInfo {
        private final String sessionId;
        private final String username;
        private long lastActivity;
        private final int maxInactiveInterval;

        public SessionInfo(String sessionId, String username, long lastActivity, int maxInactiveInterval) {
            this.sessionId = sessionId;
            this.username = username;
            this.lastActivity = lastActivity;
            this.maxInactiveInterval = maxInactiveInterval;
        }
    }
    
    // 만료된 세션 정보
    @Data
    @AllArgsConstructor
    public static class ExpiredSessionInfo {
        private String sessionId;
        private String username;
        private long expiryTime;
        private boolean isRememberMe;
    }
    
    // 사용자의 RememberMe 상태 설정
    public void setUserRememberMeStatus(String username, boolean isRememberMe) {
        userRememberMeStatus.put(username, isRememberMe);
    }

    // 사용자의 RememberMe 상태 확인
    public boolean isUserRememberMe(String username) {
        return userRememberMeStatus.getOrDefault(username, false);
    }
    
    // 추적 중인 세션 확인
    public boolean isSessionTracked(String sessionId) {
        return activeSessions.containsKey(sessionId);
    }

    // 활동 중인 세션 반환
    public Set<String> getActiveSession() {
        return new HashSet<>(activeSessions.keySet());
    }

    // 세션 추가
    public void addSession(String sessionId, String username, int maxInactiveInterval) {
        activeSessions.put(sessionId, new SessionInfo(sessionId, username, System.currentTimeMillis(), maxInactiveInterval));
    }

    // 세션 활동 업데이트
    public void updateSessionActivity(String sessionId, String username) {
        if (activeSessions.containsKey(sessionId)) {
            SessionInfo info = activeSessions.get(sessionId);
            info.setLastActivity(System.currentTimeMillis());
        } else if (username != null) {
            try {
                ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
                HttpSession session = attributes.getRequest().getSession(false);

                if (session != null) {
                    activeSessions.put(sessionId, new SessionInfo(sessionId, username, System.currentTimeMillis(), session.getMaxInactiveInterval()));
                }
            } catch (IllegalStateException e) {
            	logger.error("세션 활동 업데이트 실패: {}", e.getMessage());
            }
        }
    }

    // 활동 세션 동기화
    @Scheduled(fixedDelay = 180000)
    public void syncActiveSessions() {
        try {
            long now = System.currentTimeMillis();
            Set<String> sessionsToRemove = new HashSet<>();
            
            for (Map.Entry<String, SessionInfo> entry : activeSessions.entrySet()) {
                String sessionId = entry.getKey();
                SessionInfo info = entry.getValue();
                
                long elapsedMs = now - info.getLastActivity();
                int maxInactiveMs = info.getMaxInactiveInterval() * 1000;
                
                if (elapsedMs > maxInactiveMs) {
                	boolean rememberMeStatus = isUserRememberMe(info.getUsername());
                    // 만료된 세션 정보 저장 (알림 전송은 하지 않음)
                    expiredSessions.add(new ExpiredSessionInfo(
                        sessionId, info.getUsername(), now, rememberMeStatus
                    ));
                    
                    sessionsToRemove.add(sessionId);
                }
            }
            
            for (String sessionId : sessionsToRemove) {
                activeSessions.remove(sessionId);
            }
            
            if (!sessionsToRemove.isEmpty()) {
                logger.info("세션 정보 동기화: {} 개 만료된 세션 제거, 현재 {} 개 활성 세션", 
                        sessionsToRemove.size(), activeSessions.size());
            }
                    
        } catch (Exception e) {
            logger.error("세션 동기화 중 오류 발생: {}", e.getMessage(), e);
        }
    }
    
    // 만료된 세션 정보를 가져오고 목록을 비우는 메서드 추가
    public List<ExpiredSessionInfo> getAndRemoveExpiredSessions() {
        List<ExpiredSessionInfo> expired = new ArrayList<>(expiredSessions);
        expiredSessions.clear();
        return expired;
    }
    
    // 만료 예정 세션 확인
    public List<SessionInfo> getSessionsNearingExpiry(int warningThresholdSeconds) {
        List<SessionInfo> expiringList = new ArrayList<>();
        long now = System.currentTimeMillis();

        for (Map.Entry<String, SessionInfo> entry : activeSessions.entrySet()) {
            SessionInfo info = entry.getValue();
            long elapsedMs = now - info.getLastActivity();
            int maxInactiveMs = info.getMaxInactiveInterval() * 1000;
            long remainingMs = maxInactiveMs - elapsedMs;

            // 만료까지 남은 시간이 경고 임계값 이하인 경우
            if (remainingMs > 0 && remainingMs <= warningThresholdSeconds * 1000) {
                expiringList.add(info);
            }
        }
        return expiringList;
    }

    // 세션 제거
    public void removeSession(String sessionId) {
        SessionInfo removed = activeSessions.remove(sessionId);
        if (removed != null) {
        	logger.debug("세션 제거: {}", sessionId);
        }
    }

    @Override
    public void sessionCreated(HttpSessionEvent se) {
        // 세션 생성 시 필요한 로직만 수행
    }
    
    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        // 세션 소멸 시 활성 세션 목록에서 제거
        HttpSession session = se.getSession();
        String sessionId = session.getId();
        removeSession(sessionId);
    }
}