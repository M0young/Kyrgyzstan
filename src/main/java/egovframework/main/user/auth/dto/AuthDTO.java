package egovframework.main.user.auth.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.validation.constraints.Pattern;

import java.time.LocalDateTime;

@Getter
@Setter
public class AuthDTO {
	
	public interface SignUp {}
    public interface EmailVerification  {}
    
	@NotNull(message = "auth.validation.name.required")
    @Size(min = 1, max = 20, message = "auth.validation.name.length")
	private String user_nm;
	
	@NotNull(message = "auth.validation.email.required", groups = EmailVerification.class)
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$", 
             message = "auth.validation.email.invalid", 
             groups = EmailVerification.class)
	private String eml;
	
	@NotNull(message = "auth.validation.password.required")
	@Size(min = 1, message = "auth.validation.password.required")
	@Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,15}$", 
	        message = "auth.validation.password.format")
	private String pwd;
	
    private int user_no;
    private int group_no;
    private String group_nm;
    private String inst;
    private String dept;
    private String mdfr;
    private LocalDateTime reg_dt;
    private LocalDateTime mdfcn_dt;
    private LocalDateTime last_lgn_dt;
    private String prvc_clct_agre_yn;
    private String tmpr_pwd_yn;
    private int lgn_cnt;
    private String del_yn;
    private LocalDateTime del_dt;
}