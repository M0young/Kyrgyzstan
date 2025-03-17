package egovframework.main.map.upload.progress.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class ProgressDTO {
    private String prgrs_id;
    private int prgrs;
    private int tnocs_rcd;
    private int cmptn_rcd;
    private String cmptn_yn;
    private String err_msg;
    private LocalDateTime strt_dt;
    private LocalDateTime cmptn_dt;
    private String stts;
}