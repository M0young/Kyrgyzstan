package egovframework.common.component;

import java.io.IOException;

import javax.annotation.Resource;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import egovframework.environment.security.SecurityUtils;

@Component
public class UserActivityTrackingFilter extends OncePerRequestFilter {
    
	@Resource
    private SessionTrackingListener sessionTracker;
	
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        
    	// SSE 요청은 세션 활동 추적에서 제외
    	String requestURI = request.getRequestURI();
        if (requestURI.endsWith("/api/notifications/subscribe") || 
        	requestURI.endsWith("/api/notifications/check-session-status")) {
            chain.doFilter(request, response);
            return;
        }
        
        if (SecurityUtils.isAuthenticated()) {
            String username = SecurityUtils.getUserEmail();
            boolean isRememberMe = SecurityUtils.isRememberMeAuthentication();
            sessionTracker.setUserRememberMeStatus(username, isRememberMe);
            HttpSession session = request.getSession(false);
            
            if (session != null) {
                String sessionId = session.getId();
                
                // 이미 추적 중인 세션인지 확인 후 추가
                if (!sessionTracker.isSessionTracked(sessionId)) {
                    sessionTracker.addSession(sessionId, username, session.getMaxInactiveInterval());
                } else {
                    sessionTracker.updateSessionActivity(sessionId, username);
                }
            }
        }
        chain.doFilter(request, response);
    }
}