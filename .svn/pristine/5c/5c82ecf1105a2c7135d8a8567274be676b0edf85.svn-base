package egovframework.environment.security;

import javax.servlet.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class SecurityHeadersFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        // XSS 방지
        httpResponse.setHeader("X-XSS-Protection", "1; mode=block");
        
        // 클릭재킹 방지
        httpResponse.setHeader("X-Frame-Options", "SAMEORIGIN");
        
        // MIME 스니핑 방지
        httpResponse.setHeader("X-Content-Type-Options", "nosniff");
        
        // HSTS (HTTPS 강제)
        // httpResponse.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        
        chain.doFilter(request, response);
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void destroy() {
    }
}