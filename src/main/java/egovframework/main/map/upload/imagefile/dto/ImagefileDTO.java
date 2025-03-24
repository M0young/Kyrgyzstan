package egovframework.main.map.upload.imagefile.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class ImagefileDTO {
	private int file_id;
    private String file_path;
    private String file_orgnl_nm;
    private int rgtr;
    private LocalDateTime reg_dt;
}