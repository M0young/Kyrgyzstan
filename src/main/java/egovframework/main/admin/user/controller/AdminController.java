package egovframework.main.admin.user.controller;

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

import egovframework.common.component.MessageProvider;
import egovframework.common.response.ApiResponse;
import egovframework.main.admin.user.dto.AdminDTO;
import egovframework.main.admin.user.service.AdminService;

@RestController
@RequestMapping("/api/admin/user")
public class AdminController {

    @Resource(name = "adminService")
    private AdminService adminService;

    @Resource
    private MessageProvider messageProvider;
    
    @GetMapping("/list/paged")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPagedUsers(
        @RequestParam(value = "page", defaultValue = "0") int page,
        @RequestParam(value = "size", defaultValue = "10") int size,
        @RequestParam(value = "query", required = false) String query) {
        try {
            int offset = page * size;
            
            AdminDTO adminDTO = new AdminDTO();
            adminDTO.setOffset(offset);
            adminDTO.setSize(size);
            adminDTO.setQuery(query);
            
            int totalUsers = adminService.countAllUsers(adminDTO);
            List<AdminDTO> pagedUsers = adminService.selectPagedUsers(adminDTO);
            
            Map<String, Object> result = new HashMap<>();
            result.put("total", totalUsers);
            result.put("users", pagedUsers);
            
            return ApiResponse.success(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Failed to fetch paged results.");
        }
    }

    @PostMapping("/update")
    public ResponseEntity<ApiResponse<Void>> updateUser(@Valid @RequestBody AdminDTO user, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ApiResponse.error(bindingResult.getFieldError().getDefaultMessage());
        }
        try {
            adminService.updateUser(user);
            return ApiResponse.success("User updated successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Failed to update user.");
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@RequestBody AdminDTO user) {
        try {
            adminService.deleteUser(user.getEml());
            return ApiResponse.success("User deleted successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Failed to delete user.");
        }
    }   
    
    @GetMapping("/groups")
    public ResponseEntity<ApiResponse<List<AdminDTO>>> selectUserGroups() {
        try {
            List<AdminDTO> groups = adminService.selectUserGroups();
            return ApiResponse.success(groups);
        } catch (Exception e) {
            return ApiResponse.error("Failed to fetch user groups");
        }
    }
}
