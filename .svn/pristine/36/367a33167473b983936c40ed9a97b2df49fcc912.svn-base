package egovframework.environment.network;

import egovframework.environment.config.GeoServerConfig;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/geoserver")
public class GeoServerProxyController {
    private static final Logger logger = LoggerFactory.getLogger(GeoServerProxyController.class);
    
    @Autowired
    private GeoServerConfig geoServerConfig;
    
    @Autowired
    private RestTemplate restTemplate;

    @RequestMapping("/**")
    public ResponseEntity<byte[]> proxyRequest(HttpServletRequest request, @RequestBody(required = false) byte[] body) {
        try {
            String resourcePath = new AntPathMatcher()
                    .extractPathWithinPattern("/api/geoserver/**", request.getRequestURI().replace("/klums", ""));
                    
            String targetUrl = geoServerConfig.getUrl() + "/" + geoServerConfig.getWorkspace() + "/" + resourcePath;
            
            // 쿼리 파라미터 처리
            String queryString = request.getQueryString();
            if (queryString != null) {
                queryString = URLDecoder.decode(queryString, "UTF-8");
                targetUrl += (targetUrl.contains("?") ? "&" : "?") + queryString;
            }

            HttpHeaders headers = new HttpHeaders();
            
            // 원본 요청의 Content-Type 복사
            String contentType = request.getContentType();
            if (contentType != null) {
                headers.set(HttpHeaders.CONTENT_TYPE, contentType);
            }
            
            // 인증 설정
            String[] auth = geoServerConfig.getAuth();
            String credentials = Base64.getEncoder().encodeToString((auth[0] + ":" + auth[1]).getBytes(StandardCharsets.UTF_8));
            headers.set("Authorization", "Basic " + credentials);

            // body가 있는 경우에만 포함
            HttpEntity<?> entity = body != null ? 
                new HttpEntity<>(body, headers) : 
                new HttpEntity<>(headers);

            ResponseEntity<byte[]> response = restTemplate.exchange(
                targetUrl,
                HttpMethod.valueOf(request.getMethod()),
                entity,
                byte[].class
            );
            
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.putAll(response.getHeaders());
            responseHeaders.remove(HttpHeaders.TRANSFER_ENCODING);
            responseHeaders.setContentLength(response.getBody() != null ? response.getBody().length : 0);
            
            return ResponseEntity
                .status(response.getStatusCode())
                .headers(responseHeaders)
                .body(response.getBody());
        } catch (Exception e) {
            logger.error("GeoServer proxy error: {} for URL: {}", e.getMessage(), request.getRequestURI(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(("Error: " + e.getMessage()).getBytes());
        }
    }
}