package egovframework.environment.config;

import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;
import java.util.Arrays;

import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.client.StandardHttpRequestRetryHandler;
import org.apache.http.impl.client.DefaultConnectionKeepAliveStrategy;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.client.config.RequestConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.ByteArrayHttpMessageConverter;
import org.springframework.web.client.RestTemplate;
import javax.net.ssl.SSLContext;

@Configuration
public class RestTemplateConfig {
    
    @Bean
    public RestTemplate restTemplate() throws KeyStoreException, NoSuchAlgorithmException, KeyManagementException {
        TrustStrategy acceptingTrustStrategy = (X509Certificate[] chain, String authType) -> true;
        SSLContext sslContext = org.apache.http.ssl.SSLContexts.custom()
                .loadTrustMaterial(null, acceptingTrustStrategy)
                .build();
        SSLConnectionSocketFactory csf = new SSLConnectionSocketFactory(sslContext);

        RequestConfig requestConfig = RequestConfig.custom()
                .setSocketTimeout(30000)        // WMS 요청은 더 긴 타임아웃이 필요할 수 있음
                .setConnectTimeout(5000)
                .setConnectionRequestTimeout(5000)
                .setExpectContinueEnabled(true)
                .setRedirectsEnabled(true)      // WMS 리다이렉트 허용
                .build();

        CloseableHttpClient httpClient = HttpClients.custom()
                .setSSLSocketFactory(csf)
                .setDefaultRequestConfig(requestConfig)
                .setRetryHandler(new StandardHttpRequestRetryHandler(3, true))
                .setKeepAliveStrategy(DefaultConnectionKeepAliveStrategy.INSTANCE)
                .setMaxConnTotal(100)           // 최대 연결 수 설정
                .setMaxConnPerRoute(20)         // 라우트당 최대 연결 수
                .disableContentCompression()
                .build();
        
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        factory.setHttpClient(httpClient);
        factory.setBufferRequestBody(false);
        
        RestTemplate restTemplate = new RestTemplate(factory);
        
        // 큰 응답을 처리하기 위한 메시지 컨버터 설정
        restTemplate.getMessageConverters().add(
            new ByteArrayHttpMessageConverter() {{
                setSupportedMediaTypes(Arrays.asList(
                    MediaType.IMAGE_PNG,
                    MediaType.IMAGE_JPEG,
                    MediaType.APPLICATION_OCTET_STREAM
                ));
            }}
        );
        
        return restTemplate;
    }
}