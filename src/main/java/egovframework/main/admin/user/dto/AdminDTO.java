package egovframework.main.admin.user.dto;

import java.time.LocalDateTime;

import javax.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminDTO {
	
	@NotBlank(message = "Enter Your Name")
    private String user_nm;
	
    private String eml;
    private int group_no;
    private String group_nm;
    private String inst;
    private String dept;
    private String reg_dt;
    private String last_lgn_dt;
    private LocalDateTime mdfcn_dt;
    private int mdfr;
    
	private int offset;
	private int size;
	private String query;
}