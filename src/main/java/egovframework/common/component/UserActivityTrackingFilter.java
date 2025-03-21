package egovframework.common.component;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class UserActivityTrackingFilter extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            String username = auth.getName();
            HttpSession session = request.getSession(false);
            
            if (session != null) {
                String sessionId = session.getId();
                
                // 이미 추적 중인 세션인지 확인 후 추가
                if (!SessionTrackingListener.isSessionTracked(sessionId)) {
                    SessionTrackingListener.addSession(sessionId, username, session.getMaxInactiveInterval());
                } else {
                    // 기존 세션 활동 시간 업데이트
                    SessionTrackingListener.updateSessionActivity(sessionId, username);
                }
            }
        }
        chain.doFilter(request, response);
    }
}