package krgz.session;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class SessionTimeoutCookieFilter implements Filter {
 
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        String path = request.getRequestURI();
        if(!path.equals("/usr/sessionCheck.do")) {
            long serverTime = System.currentTimeMillis();
            long sessionExpiryTime = serverTime + request.getSession().getMaxInactiveInterval() * 1000;
            Cookie cookie = new Cookie("latestTouch", "" + serverTime);
            cookie.setSecure(true);
            cookie.setPath("/");
            response.addCookie(cookie);
            cookie = new Cookie("sessionExpiry", "" + sessionExpiryTime);
            cookie.setSecure(true);
            cookie.setPath("/");
            response.addCookie(cookie);
            
    		request.getSession().setAttribute("sessionExpiry", sessionExpiryTime);
    		request.getSession().setAttribute("latestTouch", serverTime);
        }

        filterChain.doFilter(servletRequest, servletResponse);
    }
 
    @Override
    public void destroy() {
    }
 
    @Override
    public void init(FilterConfig arg0) throws ServletException {
    }
     
}
