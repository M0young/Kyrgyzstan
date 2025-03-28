package egovframework.main.admin.code.mapping.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MappingDTO {
	private Integer lclsf_cd;
	private Integer sclsf_cd;
	private String lclsf_nm_ru;
	private String lclsf_nm_ky;
	private String lclsf_nm_en;
	private String sclsf_nm_ru;
	private String sclsf_nm_ky;
	private String sclsf_nm_en;
	private String rmrk;
	private int rgtr;
	private int mdfr;
	
	private int offset;
	private int size;
	
	private String lang;
	private String lclsf_nm;
	private String sclsf_nm;
}
