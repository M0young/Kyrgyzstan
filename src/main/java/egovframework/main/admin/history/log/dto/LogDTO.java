package egovframework.main.admin.history.log.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LogDTO {
	private int user_no;
	private String msg;
	private String ip;
	private String reg_dt;
	private String user_nm;
	
	private int offset;
	private int size;
	private String query;
}
