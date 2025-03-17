package egovframework.main.map.upload.shapefile.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShapefileDTO {
	/* 토지정보 필드 */
	private int objectid;
	private String ink;
	private String ink_1;
    private String coate_raio;
    private String name_raion;
    private String coate_aa;
    private String name_aa;
    private Integer nomer_kont;
    private Integer staryi_nom;
    private String vid_ugodii;
    private int uslcode;
    private String ispolzovan;
    private String opisanie;
    private String primechani;
    private int kategoria_;
    private Integer kolichestv;
    private Double obshay_plo;
    private Double ploshad_or;
    private int lclsf_cd;
    private int sclsf_cd;
    private Double cnt;
    private Double kdar;
    private String geom;
    
	/* 소분류 필드 */
    private String sclsf_nm_rus;
    private String sclsf_nm_kgz;
    private String sclsf_nm_eng;
    private String fld_nm;
    private String fld_nm_orgnl;
    private String rmrk;
}
