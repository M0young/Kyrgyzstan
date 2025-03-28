package egovframework.main.admin.role.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoleDTO {
    private int group_no;
    private String group_nm;
    private String rgtr;
    private String reg_dt;
    private String mdfcn_dt;
    private String authry_cd;
    private int authry_no;
    
	private int offset;
	private int size;
}
