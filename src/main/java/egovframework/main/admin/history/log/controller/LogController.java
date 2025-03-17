package egovframework.main.admin.history.log.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import egovframework.common.response.ApiResponse;
import egovframework.main.admin.history.log.dto.LogDTO;
import egovframework.main.admin.history.log.service.LogService;

@RestController
@RequestMapping("/api/admin/history/log")
public class LogController {

    @Resource(name = "logService")
    private LogService logService;
    
    // 리스트 조회(검색, total, 페이지네이션)
    @GetMapping("/list/paged")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPagedLogs(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "query", required = false) String query) {
        try {
            int offset = page * size;
            
            LogDTO logDTO = new LogDTO();
            logDTO.setOffset(offset);
            logDTO.setSize(size);
            logDTO.setQuery(query);
            
            int totalLogs = logService.countLogs(logDTO);
            List<LogDTO> logs = logService.selectPagedLogs(logDTO);
            
            Map<String, Object> result = new HashMap<>();
            result.put("total", totalLogs);
            result.put("logs", logs);
            
            return ApiResponse.success(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Failed to fetch paged logs.");
        }
    }
}
