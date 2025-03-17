package egovframework.main.user.auth.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthSessionDTO {
    private int user_no;
    private int group_no;
    private String user_id;
    private String user_nm;
    private String group_nm;
    private String eml;
    private String telno;
    private String inst;
    private String dept;
    private String srvc_yn;
    private List<String> authorities;
    
    public boolean hasAuthority(String authorityName) {
        return authorities != null && authorities.contains(authorityName);
    }
}
