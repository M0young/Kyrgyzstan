package krgz.util;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;

@Component
public class JsonUtils {
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final Logger logger = LoggerFactory.getLogger(JsonUtils.class);

    public static String convertToJson(Object obj) throws IOException {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            logger.error("JSON 변환 중 오류 발생: " + e.getMessage(), e);
            
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("error", "JSON 변환 중 오류 발생: " + e.getMessage());
            
            try {
                return objectMapper.writeValueAsString(errorMap);
            } catch (JsonProcessingException e2) {
                return "{\"error\": \"JSON 변환 중 치명적 오류 발생\"}";
            }
        }
    }
}
