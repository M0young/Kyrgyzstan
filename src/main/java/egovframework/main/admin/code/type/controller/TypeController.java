package egovframework.main.admin.code.type.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import egovframework.common.response.ApiResponse;
import egovframework.main.admin.code.type.dto.TypeDTO;
import egovframework.main.admin.code.type.service.TypeService;

@RestController
@RequestMapping("/api/admin/code/type")
public class TypeController {

    @Resource(name = "typeService")
    private TypeService typeService;
    
    @GetMapping("/list/paged")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPagedType(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "query", required = false) String query) {
        try {
            int offset = page * size;
            
            TypeDTO typeDTO = new TypeDTO();
            typeDTO.setOffset(offset);
            typeDTO.setSize(size);
            typeDTO.setQuery(query);
            
            int totalType = typeService.countType(typeDTO);
            List<TypeDTO> type = typeService.selectPagedType(typeDTO);
            
            Map<String, Object> result = new HashMap<>();
            result.put("total", totalType);
            result.put("type", type);
            
            return ApiResponse.success(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Failed to fetch paged types.");
        }
    }
    
    // 토지 유형 생성
    @PostMapping("/insert")
    public ResponseEntity<ApiResponse<Void>> insertLandType(@RequestBody TypeDTO typeDTO) {
        try {
            typeService.insertLandType(typeDTO);
            return ApiResponse.success("insert success");
        } catch (Exception e) {
            return ApiResponse.error("insert failed");
        }
    }
    
    // 토지 유형 업데이트
    @PostMapping("/update")
    public ResponseEntity<ApiResponse<Void>> updateType(@RequestBody TypeDTO typeDTO) {
        try {
            typeService.updateType(typeDTO);
            return ApiResponse.success("update success");
        } catch (Exception e) {
            return ApiResponse.error("update failed");
        }
    }
    
    // 토지 유형 삭제
    @PostMapping("/delete")
    public ResponseEntity<ApiResponse<Void>> deleteType(@RequestBody TypeDTO typeDTO) {
        try {
            typeService.deleteType(typeDTO.getType_cd());
            return ApiResponse.success("Type deleted successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Failed to delete Type.");
        }
    } 
}
