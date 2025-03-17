package egovframework.main.admin.history.access.controller;

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
}
