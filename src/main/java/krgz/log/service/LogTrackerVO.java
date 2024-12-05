/**
 * 
 */
package krgz.log.service;

/**
 * LogTrackerVO.java
 * krgz
 * 2024. 3. 29.
 * @author 오영진
 * @Comment
 *
 */
public class LogTrackerVO {
	private String log_id;
	private String usr_no;
	private String grp_id;
	private String log_code;
	private String log_level;
	private String message;
	private String reg_date;
	private String ip;
	
	//기본생성자
	public LogTrackerVO(){
		
	}
	//커스텀 생성자
	public LogTrackerVO(String usr_no,String grp_id,String log_code,String log_level,String message){
		this.usr_no=usr_no;
		this.grp_id=grp_id;
		this.log_code=log_code;
		this.log_level=log_level;
		this.message=message;
	}
		
	public String getLog_id() {
		return log_id;
	}
	public void setLog_id(String log_id) {
		this.log_id = log_id;
	}
	public String getUsr_no() {
		return usr_no;
	}
	public void setUsr_no(String usr_no) {
		this.usr_no = usr_no;
	}
	public String getGrp_id() {
		return grp_id;
	}
	public void setGrp_id(String grp_id) {
		this.grp_id = grp_id;
	}
	public String getLog_code() {
		return log_code;
	}
	public void setLog_code(String log_code) {
		this.log_code = log_code;
	}
	public String getLog_level() {
		return log_level;
	}
	public void setLog_level(String log_level) {
		this.log_level = log_level;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getReg_date() {
		return reg_date;
	}
	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}
	public String getIp() {
		return ip;
	}
	public void setIp(String ip) {
		this.ip = ip;
	}
}
