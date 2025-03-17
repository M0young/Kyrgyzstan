package egovframework.main.user.activity.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActivityDTO {
	private int log_no;
	private int user_no;
	private int group_no;
	private int log_cd;
	private int log_level;
	private String msg;
	private String reg_dt;
	private String ip;
	
	//기본생성자
	public ActivityDTO(){
	}
	
	//커스텀 생성자
	public ActivityDTO(int user_no,int group_no,int log_cd,int log_level,String msg){
		this.user_no=user_no;
		this.group_no=group_no;
		this.log_cd=log_cd;
		this.log_level=log_level;
		this.msg=msg;
	}
}
