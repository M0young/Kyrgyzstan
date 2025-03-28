package egovframework.main.admin.history.access.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
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
import egovframework.main.admin.history.access.dto.AccessDTO;
import egovframework.main.admin.history.access.service.AccessService;

@RestController
@RequestMapping("/api/admin/history/access")
public class AccessController {

    @Resource(name = "accessService")
    private AccessService accessService;
    
    // 리스트 조회(검색, total, 페이지네이션)
    @GetMapping("/list/paged")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPagedAccess(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "query", required = false) String query) {
        try {
            int offset = page * size;
            
            AccessDTO accessDTO = new AccessDTO();
            accessDTO.setOffset(offset);
            accessDTO.setSize(size);
            accessDTO.setQuery(query);
            
            int totalAccess = accessService.countAccess(accessDTO);
            List<AccessDTO> access = accessService.selectPagedAccess(accessDTO);
            
            Map<String, Object> result = new HashMap<>();
            result.put("total", totalAccess);
            result.put("access", access);
            
            return ApiResponse.success(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Failed to fetch paged Access.");
        }
    }
    
    // 차트 데이터 조회 API 추가
    @GetMapping("/chart")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getChartData(
            @RequestParam(value = "granularity", defaultValue = "monthly") String granularity,
            @RequestParam(value = "year", required = false) String year,
            @RequestParam(value = "month", required = false) String month,
            @RequestParam(value = "dateRange", required = false) String dateRange) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("granularity", granularity);
            
            if ("monthly".equals(granularity)) {
                params.put("year", year);
            } else if ("weekly".equals(granularity)) {
                params.put("year", year);
                params.put("month", month);
            } else if ("daily".equals(granularity)) {
                if (dateRange != null && dateRange.contains("~")) {
                    String[] dates = dateRange.split("~");
                    String startDateStr = dates[0].trim();
                    String endDateStr = dates[1].trim();
                    
                    // 종료 날짜에 하루를 더해 종료일 전체를 포함하도록 처리
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                    LocalDate endDate = LocalDate.parse(endDateStr, formatter).plusDays(1);
                    
                    params.put("startDate", startDateStr);
                    // SQL에서 reg_dt < #{endDate} 조건으로 사용하게 됨
                    params.put("endDate", endDate.format(formatter));
                }
            }
            
            List<AccessDTO> chartData = accessService.selectChartData(params);
            Map<String, Object> result = new HashMap<>();
            result.put("chartData", chartData);
            return ApiResponse.success(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Failed to fetch chart data.");
        }
    }
}