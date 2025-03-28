package egovframework.main.admin.code.type.dto;

import javax.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TypeDTO {
	private int type_cd;
	@NotNull(message = "Land Type in Russian is required")
    private String type_nm_ru;

	@NotNull(message = "Land Type in Kirghiz is required")
    private String type_nm_ky;

	@NotNull(message = "Land Type in English is required")
    private String type_nm_en;
	private String rmrk;
	private String mdfcn_dt;
	private int rgtr;
	private int mdfr;
	
	private int offset;
	private int size;
	private String query;
}
