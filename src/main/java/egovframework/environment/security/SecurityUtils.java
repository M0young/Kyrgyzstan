package egovframework.environment.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.RememberMeAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import egovframework.environment.security.CustomUserDetails;

public class SecurityUtils {
    
    private static final Logger logger = LoggerFactory.getLogger(SecurityUtils.class);
    
    // 사용자 번호
    public static int getUserNo() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
                CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
                return userDetails.getUserNo();
            }
        } catch (Exception e) {
            logger.warn("사용자 번호 조회 중 예외 발생: {}", e.getMessage());
        }
        return -1; // 또는 다른 적절한 기본값(0 등)
    }
    
    // 사용자 명
    public static String getUserName() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
                CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
                return userDetails.getRealName();
            }
        } catch (Exception e) {
            logger.warn("사용자 실명 조회 중 예외 발생: {}", e.getMessage());
        }
        return null;
    }
    
    // 사용자 이메일
    public static String getUserEmail() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
                return auth.getName();
            }
        } catch (Exception e) {
            logger.warn("사용자 이름 조회 중 예외 발생: {}", e.getMessage());
        }
        return null;
    }
    
    // 사용자 그룹
    public static String getUserGroupName() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
                CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
                return userDetails.getGroupName();
            }
        } catch (Exception e) {
            logger.warn("사용자 그룹명 조회 중 예외 발생: {}", e.getMessage());
        }
        return null;
    }
    
    // RememberMe 여부
    public static boolean isRememberMeAuthentication() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            return auth != null && auth instanceof RememberMeAuthenticationToken;
        } catch (Exception e) {
            logger.warn("Remember-Me 인증 확인 중 예외 발생: {}", e.getMessage());
            return false;
        }
    }
    
    // 인증 여부
    public static boolean isAuthenticated() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            return auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName());
        } catch (Exception e) {
            logger.warn("인증 확인 중 예외 발생: {}", e.getMessage());
            return false;
        }
    }
    
    // 사용자 상세 정보
    public static CustomUserDetails getUserDetails() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
                return (CustomUserDetails) auth.getPrincipal();
            }
        } catch (Exception e) {
            logger.warn("사용자 상세 정보 조회 중 예외 발생: {}", e.getMessage());
        }
        return null;
    }
}