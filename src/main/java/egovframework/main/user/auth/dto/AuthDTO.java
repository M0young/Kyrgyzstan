package egovframework.main.user.auth.dto;

import lombok.Getter;
import lombok.Setter;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Email;
import java.time.LocalDateTime;

@Getter
@Setter
public class AuthDTO {
	
	public interface SignUp {}
    public interface EmailVerification  {}
    
	@NotBlank(message = "auth.validation.name.required")
    @Size(max = 20, message = "auth.validation.name.length")
	private String user_nm;
	
	@NotBlank(message = "auth.validation.email.required", groups = EmailVerification.class)
    @Email(message = "auth.validation.email.invalid", groups = EmailVerification.class)
	private String eml;
	
	@NotBlank(message = "auth.validation.password.required")
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