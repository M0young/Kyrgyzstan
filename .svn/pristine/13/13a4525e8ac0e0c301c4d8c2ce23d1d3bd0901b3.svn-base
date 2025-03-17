package egovframework.environment.security;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

public class CustomUserDetails extends User {
    private static final long serialVersionUID = 7542461012103308787L;
    
    private int userNo;
    private String realName;
    private String groupName;
    
    public CustomUserDetails() {
        super("default", "default", true, true, true, true, new ArrayList<>());
    }
    
    public CustomUserDetails(int userNo,
    					   String email,
                           String realName,
                           String password, 
                           boolean enabled,
                           boolean accountNonExpired, 
                           boolean credentialsNonExpired,
                           boolean accountNonLocked, 
                           Collection<? extends GrantedAuthority> authorities,
                           String groupName) {
        super(email, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
        this.userNo = userNo;
        this.realName = realName;
        this.groupName = groupName;
    }
    
    public int getUserNo() {
        return this.userNo;
    }
    
    public String getRealName() {
        return this.realName;
    }
    
    public String getGroupName() {
        return this.groupName;
    }
}