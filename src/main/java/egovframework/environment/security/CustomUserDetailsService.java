package egovframework.environment.security;

import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import egovframework.main.user.auth.service.AuthService;
import egovframework.main.user.auth.dto.AuthDTO;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Resource
    private AuthService authService;

    @Override
    public UserDetails loadUserByUsername(String email) throws BadCredentialsException {
        AuthDTO auth = authService.selectUserForAuth(email);

        if (auth == null) {
            throw new BadCredentialsException("");
        }
        
        List<String> authorities = authService.selectAuthoritiesByGroup(auth.getGroup_no());
        
        return new CustomUserDetails(
        	auth.getUser_no(),
            auth.getEml(), 
            auth.getUser_nm(),    
            auth.getPwd(),    
            auth.getDel_yn().equals("N"),
            true,
            true,
            auth.getLgn_cnt() < 5,
            authorities.stream()
	            .map(authority -> new SimpleGrantedAuthority(authority.toUpperCase()))
	            .collect(Collectors.toList()),
            auth.getGroup_nm().toUpperCase()
        );
    }
}