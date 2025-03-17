package egovframework.common.uriMapper;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UriMapper {
	// Root
	@GetMapping("/")
	public String root() {
		return "redirect:/dashboard";
	}
	
	// Authentication
	@GetMapping("/auth/login")
	public String login() {
		return "/main/user/auth/login";
	}
	
	@GetMapping("/auth/join")
	public String join() {
		return "/main/user/auth/join";
	}
	
	@GetMapping("/auth/password")
	public String password() {
		return "/main/user/auth/password";
	}
	
	// Main pages
	@GetMapping("/dashboard")
	public String dashboard() {
		return "/main/dashboard/view";
	}
	
	@GetMapping("/map")
	public String map() {
		return "/main/map/view";
	}
	
	// Admin - User & Role Management
    @GetMapping("/admin/user/list")
    public String adminUser() {
        return "/main/admin/user/list";
    }
    
    @GetMapping("/admin/role/list")
    public String adminRole() {
        return "/main/admin/role/list";
    }
	
    // Admin - Land Code Management
    @GetMapping("/admin/code/type")
    public String adminCodeType() {
        return "/main/admin/code/type";
    }
    
    @GetMapping("/admin/code/class")
    public String adminCodeClass() {
        return "/main/admin/code/class";
    }
    
    @GetMapping("/admin/code/subclass")
    public String adminCodeSubClass() {
        return "/main/admin/code/subclass";
    }
    
    @GetMapping("/admin/code/mapping")
    public String adminCodeMapping() {
        return "/main/admin/code/mapping";
    }
    
	
    // Admin - History Management
    @GetMapping("/admin/history/access")
    public String adminAccess() {
        return "/main/admin/history/access";
    }
    
    @GetMapping("/admin/history/log")
    public String adminLog() {
        return "/main/admin/history/log";
    }
    
    @GetMapping("/admin/history/upload")
    public String adminUpload() {
        return "/main/admin/history/upload";
    }
}
