package egovframework.common.response;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;

@Getter
@Setter
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
    
    private ApiResponse() {}
    
    // 데이터만 포함한 성공 응답
    public static <T> ResponseEntity<ApiResponse<T>> success(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setData(data);
        return ResponseEntity.ok(response);
    }
    
    // 메시지만 포함한 성공 응답
    public static <T> ResponseEntity<ApiResponse<T>> success(String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage(message);
        return ResponseEntity.ok(response);
    }
    
    // 데이터와 메시지를 포함한 성공 응답
    public static <T> ResponseEntity<ApiResponse<T>> success(T data, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setData(data);
        response.setMessage(message);
        return ResponseEntity.ok(response);
    }
    
    // 에러 응답 (메시지 코드만 포함)
    public static <T> ResponseEntity<ApiResponse<T>> error(String messageCode) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(false);
        response.setMessage(messageCode);
        return ResponseEntity.badRequest().body(response);
    }
}