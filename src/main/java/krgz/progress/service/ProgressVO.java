package krgz.progress.service;

public class ProgressVO {
    private String prgrs_id;      // 진행상황 고유 ID
    private String user_no;          // 사용자 번호
    private int prgrs;          // 진행률
    private int tnocs_rcd;      // 전체 레코드 수
    private int cmptn_rcd;  // 처리된 레코드 수
    private String cmptn_yn;     // 완료 여부
    private String err;          // 에러 메시지
    private String reg_dt;      // 생성일
    private String cmptn_dt;      // 수정일
    private String file_nm;       // 파일명
    private String stts; // INITIALIZING, PARSING, PROCESSING, COMPLETED, ERROR
    
    
	public String getPrgrs_id() {
		return prgrs_id;
	}
	public void setPrgrs_id(String prgrs_id) {
		this.prgrs_id = prgrs_id;
	}
	public String getUser_no() {
		return user_no;
	}
	public void setUser_no(String user_no) {
		this.user_no = user_no;
	}
	public int getPrgrs() {
		return prgrs;
	}
	public void setPrgrs(int prgrs) {
		this.prgrs = prgrs;
	}
	public int getTnocs_rcd() {
		return tnocs_rcd;
	}
	public void setTnocs_rcd(int tnocs_rcd) {
		this.tnocs_rcd = tnocs_rcd;
	}
	public int getCmptn_rcd() {
		return cmptn_rcd;
	}
	public void setCmptn_rcd(int cmptn_rcd) {
		this.cmptn_rcd = cmptn_rcd;
	}
	public String getCmptn_yn() {
		return cmptn_yn;
	}
	public void setCmptn_yn(String cmptn_yn) {
		this.cmptn_yn = cmptn_yn;
	}
	public String getErr() {
		return err;
	}
	public void setErr(String err) {
		this.err = err;
	}
	public String getReg_dt() {
		return reg_dt;
	}
	public void setReg_dt(String reg_dt) {
		this.reg_dt = reg_dt;
	}
	public String getCmptn_dt() {
		return cmptn_dt;
	}
	public void setCmptn_dt(String cmptn_dt) {
		this.cmptn_dt = cmptn_dt;
	}
	public String getFile_nm() {
		return file_nm;
	}
	public void setFile_nm(String file_nm) {
		this.file_nm = file_nm;
	}
	public String getStts() {
		return stts;
	}
	public void setStts(String stts) {
		this.stts = stts;
	}
	
}