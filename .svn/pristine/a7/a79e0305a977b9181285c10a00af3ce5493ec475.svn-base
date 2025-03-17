package egovframework.environment.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {
    @Bean
    public ObjectMapper objectMapper() {
        // ObjectMapper 생성 및 설정
        ObjectMapper mapper = new ObjectMapper();
        // Java 8 Date/Time 타입을 지원하도록 모듈 추가
        mapper.registerModule(new JavaTimeModule());
        // 타임스탬프 대신 ISO 8601 포맷 사용
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return mapper;
    }
}