package egovframework.main.admin.code.classification.dto;

import javax.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClassDTO {
	private int lclsf_cd;
	@NotNull(message = "Land Use Classification in Russian is required")
    private String lclsf_nm_ru;
    
	@NotNull(message = "Land Use Classification in Kirghiz is required")
    private String lclsf_nm_ky;
    
	@NotNull(message = "Land Use Classification in English is required")
    private String lclsf_nm_en;
	private String rmrk;
	private int rgtr;
	private int mdfr;
	
	private int offset;
	private int size;
	private String query;
}
