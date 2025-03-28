package egovframework.main.admin.code.subclass.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubClassDTO {
    private int sclsf_cd;
    private String sclsf_nm_ru;
    private String sclsf_nm_ky;
    private String sclsf_nm_en;
    private String fld_nm;
    private String rmrk;
    private int rgtr;
    private int mdfr;
    private int lclsf_cd;
    
    private int offset;
    private int size;
    private String query;
}
