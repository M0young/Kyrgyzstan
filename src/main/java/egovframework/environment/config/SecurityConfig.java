package egovframework.environment.config;

import javax.annotation.Resource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextPersistenceFilter;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.security.web.session.HttpSessionEventPublisher;

import egovframework.common.component.UserActivityTrackingFilter;
import egovframework.environment.security.CustomAuthenticationFailureHandler;
import egovframework.environment.security.CustomAuthenticationProvider;
import egovframework.environment.security.CustomLogoutSuccessHandler;
import egovframework.environment.security.CustomUserDetailsService;

@Configuration
@EnableWebSecurity 
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
    @Resource
    private CustomUserDetailsService userDetailsService;
    
    @Resource
    private CustomAuthenticationProvider authenticationProvider;
    
    @Resource
    private CustomAuthenticationFailureHandler authenticationFailureHandler;
    
    @Resource
    private CustomLogoutSuccessHandler logoutSuccessHandler;
    
    @Resource
    private UserActivityTrackingFilter userActivityTrackingFilter;
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            // 세션 관리
	        .sessionManagement()
		        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
		        .maximumSessions(1)
		            .sessionRegistry(sessionRegistry())
		            .expiredUrl("/auth/login")
		            .maxSessionsPreventsLogin(true)
		        .and()
		        .invalidSessionUrl("/auth/login")
		        .sessionFixation().migrateSession()
		    .and()
            // 요청 권한 설정
            .authorizeRequests()
                .antMatchers(
                    "/auth/**",
                    "/api/auth/**",
                    "/change-language",
                    "/resources/**"
                ).permitAll()
                .antMatchers("/admin/**").hasAuthority("ADMIN_VIEW")
                .anyRequest().authenticated()
            .and()
            // 로그인 설정
            .formLogin()
                .loginPage("/auth/login")
                .loginProcessingUrl("/api/login")
                .defaultSuccessUrl("/dashboard", true)
                .failureHandler(authenticationFailureHandler)
                .permitAll()
            .and()
            // 로그아웃 설정
            .logout()
            	.logoutSuccessHandler(logoutSuccessHandler)
                .logoutUrl("/logout")
                .logoutSuccessUrl("/auth/login")
                .deleteCookies("JSESSIONID")
                .clearAuthentication(true)
                .invalidateHttpSession(true)
            .and()
            // 로그인 상태 유지
            .rememberMe()
	            .key("uniqueAndSecret")
	            .rememberMeParameter("remember-me")
	            .tokenValiditySeconds(86400 * 7)
	            .userDetailsService(userDetailsService)
            .and()
            // 예외 처리
            .exceptionHandling()
                .authenticationEntryPoint(new LoginUrlAuthenticationEntryPoint("/auth/login"))
            .and()
            // CSRF 설정
            .csrf()
            	.csrfTokenRepository(csrfTokenRepository())
                .ignoringAntMatchers();
        http.addFilterBefore(securityContextPersistenceFilter(), LogoutFilter.class);
    	http.addFilterAfter(userActivityTrackingFilter, SecurityContextPersistenceFilter.class);
    }
    
    @Bean
    public HttpSessionCsrfTokenRepository csrfTokenRepository() {
        HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
        repository.setHeaderName("X-CSRF-TOKEN");
        return repository;
    }
    
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(authenticationProvider);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CustomAuthenticationProvider customAuthenticationProvider() {
        return new CustomAuthenticationProvider(userDetailsService, passwordEncoder());
    }

    @Bean
    public HttpSessionEventPublisher httpSessionEventPublisher() {
        return new HttpSessionEventPublisher();
    }
    
    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }
    
    @Bean
    public SecurityContextRepository securityContextRepository() {
        HttpSessionSecurityContextRepository repository = new HttpSessionSecurityContextRepository();
        repository.setAllowSessionCreation(true);
        repository.setDisableUrlRewriting(true);
        return repository;
    }

    @Bean
    public SecurityContextPersistenceFilter securityContextPersistenceFilter() {
        return new SecurityContextPersistenceFilter(securityContextRepository());
    }
}