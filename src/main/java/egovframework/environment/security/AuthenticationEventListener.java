package egovframework.environment.security;

import javax.annotation.Resource;

import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.session.SessionDestroyedEvent;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Component;

import egovframework.common.component.ActivityLogHelper;
import egovframework.main.user.activity.code.LogCode;

@Component
public class AuthenticationEventListener {
    
    @Resource
    private ActivityLogHelper activityLogHelper;
    
    @EventListener
    public void onSuccess(AuthenticationSuccessEvent event) {
        WebAuthenticationDetails details = (WebAuthenticationDetails) event.getAuthentication().getDetails();
        String username = event.getAuthentication().getName();
        String ip = details.getRemoteAddress();
        activityLogHelper.logUserActivity(username, ip, LogCode.LOGIN_SUCCESS, 1);
    }
    
    @EventListener
    public void onFailure(AuthenticationFailureBadCredentialsEvent event) {
        WebAuthenticationDetails details = (WebAuthenticationDetails) event.getAuthentication().getDetails();
        String username = event.getAuthentication().getName();
        String ip = details.getRemoteAddress();
        activityLogHelper.logUserActivity(username, ip, LogCode.LOGIN_FAIL, 2);
    }
    
    @EventListener
    public void onSessionExpired(SessionDestroyedEvent event) {
        Authentication auth = event.getSecurityContexts().stream()
                .findFirst()
                .map(SecurityContext::getAuthentication)
                .orElse(null);
        if (auth != null) {
            String username = auth.getName();
            activityLogHelper.logUserActivity(username, "unknown", LogCode.SESSION_EXPIRED, 1);
        }
    }
}