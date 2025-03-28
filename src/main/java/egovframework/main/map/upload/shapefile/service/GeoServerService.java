package egovframework.main.map.upload.shapefile.service;

import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import egovframework.environment.config.GeoServerConfig;

import javax.net.ssl.SSLContext;
import java.nio.charset.StandardCharsets;
import java.security.cert.X509Certificate;
import java.util.Base64;

@Service
public class GeoServerService {
    private static final Logger logger = LoggerFactory.getLogger(GeoServerService.class);
    private final GeoServerConfig config;
    private final RestTemplate restTemplate;
    
    public GeoServerService(GeoServerConfig config) {
        this.config = config;
        this.restTemplate = createRestTemplate();
    }

    public void publishLayerToGeoServer(int coord) {
        try {
            String[] auth = config.getAuth();
            String workspaceName = config.getWorkspace();
            String storeName = config.getStore();
            String typeName = "land_use";

            HttpHeaders headers = createAuthHeaders(auth[0], auth[1]);
            
            // 1. 기존 리소스 삭제
            deleteExistingResources(typeName, workspaceName, storeName, headers);
            
            // 2. 새로운 피처타입 생성
            createFeatureType(typeName, workspaceName, storeName, headers, coord);
            
            // 3. 스타일 설정
            setLayerStyle(typeName, workspaceName, headers);
            
        } catch (Exception e) {
            logger.error("GeoServer 발행 실패: {}", e.getMessage());
            throw new RuntimeException("GeoServer layer publishing failed");
        }
    }

    private void deleteExistingResources(String typeName, String workspaceName, String storeName, HttpHeaders headers) {
        String baseUrl = config.getUrl();
        String[] urls = {
            String.format("%s/rest/layers/%s", baseUrl, typeName),
            String.format("%s/rest/workspaces/%s/layers/%s", baseUrl, workspaceName, typeName),
            String.format("%s/rest/workspaces/%s/datastores/%s/featuretypes/%s", baseUrl, workspaceName, storeName, typeName)
        };

        for (String url : urls) {
            try {
                restTemplate.exchange(url, HttpMethod.DELETE, new HttpEntity<>(headers), String.class);
            } catch (HttpStatusCodeException e) {
                if (e.getStatusCode() != HttpStatus.NOT_FOUND) {
                    throw new RuntimeException("Failed to delete resource: " + url);
                }
            }
        }
    }

    private void createFeatureType(String typeName, String workspaceName, String storeName, HttpHeaders headers, int coord) {
        String url = String.format("%s/rest/workspaces/%s/datastores/%s/featuretypes", 
            config.getUrl(), workspaceName, storeName);

        String configureJson = String.format(
            "{\n" +
            "  \"featureType\": {\n" +
            "    \"name\": \"%s\",\n" +
            "    \"nativeName\": \"%s\",\n" +
            "    \"title\": \"%s\",\n" +
            "    \"srs\": \"EPSG:%d\",\n" +
            "    \"enabled\": true\n" +
            "  }\n" +
            "}", typeName, typeName, typeName, coord);

        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> request = new HttpEntity<>(configureJson, headers);
        
        ResponseEntity<String> response = restTemplate.exchange(
            url, HttpMethod.POST, request, String.class);
            
        if (response.getStatusCode() != HttpStatus.OK && response.getStatusCode() != HttpStatus.CREATED) {
            throw new RuntimeException("Failed to create feature type");
        }
    }

    private void setLayerStyle(String typeName, String workspaceName, HttpHeaders headers) {
        String url = String.format("%s/rest/workspaces/%s/layers/%s", 
            config.getUrl(), workspaceName, typeName);
        
        String styleJson = "{\n" +
            "  \"layer\": {\n" +
            "    \"defaultStyle\": {\n" +
            "      \"name\": \"polygon\"\n" +
            "    }\n" +
            "  }\n" +
            "}";

        HttpEntity<String> request = new HttpEntity<>(styleJson, headers);
        try {
            restTemplate.exchange(url, HttpMethod.PUT, request, String.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to set layer style");
        }
    }

    private HttpHeaders createAuthHeaders(String username, String password) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            String auth = username + ":" + password;
            byte[] encodedAuth = Base64.getEncoder().encode(auth.getBytes(StandardCharsets.UTF_8));
            String authHeader = "Basic " + new String(encodedAuth);
            headers.set("Authorization", authHeader);
            return headers;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create auth headers");
        }
    }

    private RestTemplate createRestTemplate() {
        try {
            TrustStrategy acceptingTrustStrategy = (X509Certificate[] chain, String authType) -> true;
            SSLContext sslContext = org.apache.http.ssl.SSLContexts.custom()
                    .loadTrustMaterial(null, acceptingTrustStrategy)
                    .build();
            SSLConnectionSocketFactory csf = new SSLConnectionSocketFactory(sslContext);
            CloseableHttpClient httpClient = HttpClients.custom()
                    .setSSLSocketFactory(csf)
                    .build();
            HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
            requestFactory.setHttpClient(httpClient);
            return new RestTemplate(requestFactory);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create SSL context");
        }
    }
}