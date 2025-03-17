package egovframework.environment.security;

import javax.annotation.Resource;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import egovframework.main.user.auth.service.AuthService;
import egovframework.main.user.auth.dto.AuthDTO;

public class CustomAuthenticationProvider implements AuthenticationProvider {

	@Resource
    private AuthService authService;
	
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    public CustomAuthenticationProvider(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String email = authentication.getName();
        String password = (String) authentication.getCredentials();
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        
        if (!userDetails.isAccountNonLocked()) {
            throw new LockedException("");
        }
        
        AuthDTO user = new AuthDTO();
        user.setEml(email);
        
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            authService.updateLoginCount(user);
            throw new BadCredentialsException("");
        }
        
        authService.resetLoginCount(user);
        
        return new UsernamePasswordAuthenticationToken(
            userDetails, 
            password, 
            userDetails.getAuthorities()
        );
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}