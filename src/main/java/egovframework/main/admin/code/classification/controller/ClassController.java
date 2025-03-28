package egovframework.main.admin.code.classification.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import egovframework.common.response.ApiResponse;
import egovframework.main.admin.code.classification.dto.ClassDTO;
import egovframework.main.admin.code.classification.service.ClassService;


@RestController
@RequestMapping("/api/admin/code/class")
public class ClassController {

    @Resource(name = "classService")
    private ClassService classService;
    
    // 페이지네이션된 코드 유형 조회 (검색어 포함)
    @GetMapping("/list/paged")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPagedClass(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "query", required = false) String query) {
        try {
            int offset = page * size;
            
            ClassDTO classDTO = new ClassDTO();
            classDTO.setOffset(offset);
            classDTO.setSize(size);
            classDTO.setQuery(query);
            
            int totalClass = classService.countClass(classDTO);
            List<ClassDTO> classification = classService.selectPagedClass(classDTO);
            
            Map<String, Object> result = new HashMap<>();
            result.put("total", totalClass);
            result.put("classification", classification);
            
            return ApiResponse.success(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Failed to fetch paged types.");
        }
    }
    
    // 토지 유형 생성
    @PostMapping("/insert")
    public ResponseEntity<ApiResponse<Void>> insertLandClass(@RequestBody ClassDTO classDTO) {
        try {
        	classService.insertLandClass(classDTO);
            return ApiResponse.success("insert success");
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    // 토지 유형 업데이트
    @PostMapping("/update")
    public ResponseEntity<ApiResponse<Void>> updateClass(@Valid @RequestBody ClassDTO classDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ApiResponse.error("Validation error: " 
                    + bindingResult.getFieldError().getDefaultMessage());
        }
        try {
            classService.updateClass(classDTO);
            return ApiResponse.success("update success");
        } catch (Exception e) {
            return ApiResponse.error("update failed");
        }
    }
    
    // 토지 유형 삭제
    @PostMapping("/delete")
    public ResponseEntity<ApiResponse<Void>> deleteClass(@RequestBody ClassDTO classDTO) {
        try {
        	classService.deleteClass(classDTO.getLclsf_cd());
            return ApiResponse.success("Type deleted successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Failed to delete Type.");
        }
    } 
    
    @GetMapping("/validation")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkDuplicate(@RequestParam("code") int lclsf_cd) {
        try {
            boolean duplicate = classService.DuplicateClassCode(lclsf_cd);
            Map<String, Object> result = new HashMap<>();
            result.put("duplicate", duplicate);
            return ApiResponse.success(result);
        } catch(Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Failed to check duplicate");
        }
    }
}