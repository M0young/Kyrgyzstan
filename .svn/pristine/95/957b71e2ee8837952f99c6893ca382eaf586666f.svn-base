package egovframework.environment.network;

import javax.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.request.RequestAttributes;

public class NetworkUtil {
	private static final Logger logger = LoggerFactory.getLogger(NetworkUtil.class);

	public static String getCurrentIpAddress() {
        try {
            RequestAttributes requestAttributes = RequestContextHolder.currentRequestAttributes();
            HttpServletRequest request = ((ServletRequestAttributes) requestAttributes).getRequest();

            String ip = request.getHeader("X-Forwarded-For");

            if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
                String[] ipArray = ip.split(",");
                return ipArray[0].trim();
            }

            ip = request.getHeader("Proxy-Client-IP");
            if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
                return ip;
            }

            ip = request.getHeader("WL-Proxy-Client-IP");
            if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
                return ip;
            }

            ip = request.getHeader("HTTP_CLIENT_IP");
            if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
                return ip;
            }

            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
            if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
                return ip;
            }

            ip = request.getRemoteAddr();

            return ip;
        } catch (Exception e) {
        	logger.error("Failed to get IP address: {}", e.getMessage(), e);
            return "unknown";
        }
    }
}