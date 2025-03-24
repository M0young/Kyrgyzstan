package egovframework.main.map.symbol.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SymbolDTO {
    private int symbol_cd;
    private String symbol_nm_ru;
    private String symbol_nm_ky;
    private String symbol_nm_en;
    private String file_id;
    private String file_path;
    private String rmrk;
    private int rgtr;
    private int mdfr;
    private LocalDateTime reg_dt;
    private LocalDateTime mdfcn_dt;
    private String del_yn;
    private LocalDateTime del_dt;
}
