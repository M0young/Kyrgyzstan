package egovframework.main.admin.code.classification.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClassDTO {
	private int lclsf_cd;
	private String lclsf_nm_ru;
	private String lclsf_nm_ky;
	private String lclsf_nm_en;
	private String rmrk;
	private int rgtr;
	private int mdfr;
	
	private int offset;
	private int size;
	private String query;
}
