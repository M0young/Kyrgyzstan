package egovframework.environment.security;

import java.io.IOException;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.session.SessionAuthenticationException;
import org.springframework.stereotype.Component;

import egovframework.common.component.ActivityLogHelper;
import egovframework.main.user.activity.code.LogCode;

@Component
public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler {
	
	@Resource
    private ActivityLogHelper activityLogHelper;
	
	@Override
	   public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
	           AuthenticationException exception) throws IOException, ServletException {
       String errorCode = "";
       String username = request.getParameter("username");
       String ip = request.getRemoteAddr();
       
       if (exception instanceof BadCredentialsException) {
           errorCode = "auth.login.invalid";
       } else if (exception instanceof LockedException) {
           errorCode = "auth.login.locked";
           activityLogHelper.logUserActivity(username, ip, LogCode.LOGIN_LOCKED, 2);
       } else if (exception instanceof SessionAuthenticationException) {
           errorCode = "auth.login.duplicate";
           activityLogHelper.logUserActivity(username, ip, LogCode.DUPLICATE_LOGIN, 2);
       } else {
           errorCode = "auth.login.failed";
       }
       
       request.getSession().setAttribute("errorMessage", errorCode);
       response.sendRedirect("/klums/sign-in");
   }
}