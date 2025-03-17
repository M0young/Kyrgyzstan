package egovframework.main.admin.code.subclass.controller;

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
import egovframework.main.admin.code.subclass.dto.SubClassDTO;
import egovframework.main.admin.code.subclass.service.SubClassService;

@RestController
@RequestMapping("/api/admin/code/subclass")
public class SubClassController {
    @Resource(name = "subclassService")
    private SubClassService subclassService;

    @GetMapping("/list/paged")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPagedSubClass(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "query", required = false) String query) {
        try {
            int offset = page * size;
            
            SubClassDTO subclassDTO = new SubClassDTO();
            subclassDTO.setOffset(offset);
            subclassDTO.setSize(size);
            subclassDTO.setQuery(query);
            
            int totalClass = subclassService.countSubClass(subclassDTO);
            List<SubClassDTO> subclass = subclassService.selectPagedSubClass(subclassDTO);
            
            Map<String, Object> result = new HashMap<>();
            result.put("total", totalClass);
            result.put("subclass", subclass);
            
            return ApiResponse.success(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Failed to fetch paged types.");
        }
    }
    
    // 생성: 생성 시 현재 로그인 사용자의 user_no를 생성자로 삽입하고, 대분류도 생성
    @PostMapping("/insert")
    public ResponseEntity<ApiResponse<Void>> insertLandSubClass(@RequestBody SubClassDTO subclassDTO) {
        try {
            subclassService.insertLandSubClass(subclassDTO);
            return ApiResponse.success("insert success");
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    // 업데이트: 수정 시 수정일 및 수정자 삽입
    @PostMapping("/update")
    public ResponseEntity<ApiResponse<Void>> updateSubClass(@RequestBody SubClassDTO subclassDTO) {
        try {
            subclassService.updateSubClass(subclassDTO);
            return ApiResponse.success("update success");
        } catch (Exception e) {
            return ApiResponse.error("update failed");
        }
    }
    
    // 삭제
    @PostMapping("/delete")
    public ResponseEntity<ApiResponse<Void>> deleteSubClass(@RequestBody SubClassDTO subclassDTO) {
        try {
            subclassService.deleteSubClass(subclassDTO.getSclsf_cd());
            return ApiResponse.success("Type deleted successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Failed to delete Type.");
        }
    } 
}
