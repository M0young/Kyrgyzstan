package egovframework.environment.security;

import java.io.IOException;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;
import org.springframework.stereotype.Component;

import egovframework.common.component.ActivityLogHelper;
import egovframework.main.user.activity.code.LogCode;
import egovframework.main.user.activity.service.ActivityService;
import egovframework.main.user.auth.service.AuthService;

@Component
public class CustomLogoutSuccessHandler extends SimpleUrlLogoutSuccessHandler {
    
    @Resource
    private AuthService authService;
    
    @Resource
    private ActivityService activityService;
    
    @Resource
    private ActivityLogHelper activityLogHelper;
    
    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, 
            Authentication authentication) throws IOException, ServletException {
        if (authentication != null) {
            String username = authentication.getName();
            String ip = request.getRemoteAddr();
            activityLogHelper.logUserActivity(username, ip, LogCode.LOGOUT, 1);
        }
        
        super.onLogoutSuccess(request, response, authentication);
    }
}