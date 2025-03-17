package egovframework.main.user.auth.service;

import java.security.SecureRandom;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import egovframework.common.service.MailService;
import egovframework.environment.network.NetworkUtil;
import egovframework.main.user.auth.service.AuthService;
import lombok.AllArgsConstructor;
import lombok.Data;
import egovframework.main.user.auth.dto.AuthDTO;

@Service
public class EmailVerificationService {
    private static final Logger logger = LoggerFactory.getLogger(EmailVerificationService.class);
    private static final long VERIFICATION_TTL = 300; // 5분
    private static final int MAX_ATTEMPTS = 5;

    // 인증 코드 저장소
    private final ConcurrentHashMap<String, VerificationData> verificationStore = new ConcurrentHashMap<>();
    // IP 시도 횟수 저장소
    private final ConcurrentHashMap<String, AttemptCount> ipAttemptStore = new ConcurrentHashMap<>();
    // 이메일 시도 횟수 저장소
    private final ConcurrentHashMap<String, AttemptCount> emailAttemptStore = new ConcurrentHashMap<>();

    @Resource(name = "mailService")
    private MailService mailService;
    
    @Resource(name = "authService")
    private AuthService authService;
    
    @Resource(name = "passwordService")
    private PasswordService passwordService;
    
    @PostConstruct
    public void init() {
        // 하루에 한 번 정도만 만료된 데이터 정리
        ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
        scheduler.scheduleAtFixedRate(this::cleanupExpiredData, 1, 24, TimeUnit.HOURS);
    }

    @Data
    @AllArgsConstructor
    private static class VerificationData {
        private String code;
        private long expirationTime;
    }

    @Data
    @AllArgsConstructor
    private static class AttemptCount {
        private int count;
        private long expirationTime;
        private boolean blocked;
    }

    public void sendEmailVerificationCode(String email) throws Exception {
        AuthDTO user = authService.selectUserByEmail(email);
        if (user != null) {
        	throw new IllegalStateException("auth.validation.email.duplicate");
        }

        // IP 시도 횟수 체크
        String ip = NetworkUtil.getCurrentIpAddress();
        AttemptCount ipAttempt = ipAttemptStore.get(ip);
        if (ipAttempt != null && ipAttempt.isBlocked() && 
            ipAttempt.getExpirationTime() > System.currentTimeMillis()) {
        	throw new IllegalStateException("auth.verification.limit");
        }

        // 이메일 시도 횟수 체크
        AttemptCount emailAttempt = emailAttemptStore.get(email);
        if (emailAttempt != null && emailAttempt.isBlocked() && 
            emailAttempt.getExpirationTime() > System.currentTimeMillis()) {
        	throw new IllegalStateException("auth.verification.limit");
        }

        // 인증 코드 생성 및 저장
        String verificationCode = String.format("%06d", new SecureRandom().nextInt(888888) + 111111);
        long expirationTime = System.currentTimeMillis() + (VERIFICATION_TTL * 1000);
        verificationStore.put(email, new VerificationData(verificationCode, expirationTime));

        // 시도 횟수 증가
        incrementAttemptCount(ip, ipAttemptStore);
        incrementAttemptCount(email, emailAttemptStore);

        logger.info("Verification code sent: email={}, code={}", email, verificationCode);
        mailService.sendVerificationCode(email, verificationCode);
    }

    public void sendEmailTempPassword(String email) throws Exception {
    	// 사용자 존재 여부 확인
    	AuthDTO auth = authService.selectUserByEmail(email);
    	if(auth == null) {
    		throw new IllegalStateException("auth.password.email.notfound");
    	}
    	
        // IP 시도 횟수 체크
        String ip = NetworkUtil.getCurrentIpAddress();
        AttemptCount ipAttempt = ipAttemptStore.get(ip);
        if (ipAttempt != null && ipAttempt.isBlocked() && 
            ipAttempt.getExpirationTime() > System.currentTimeMillis()) {
        	throw new IllegalStateException("auth.verification.limit");
        }

        // 이메일 시도 횟수 체크
        AttemptCount emailAttempt = emailAttemptStore.get(email);
        if (emailAttempt != null && emailAttempt.isBlocked() && 
            emailAttempt.getExpirationTime() > System.currentTimeMillis()) {
        	throw new IllegalStateException("auth.verification.limit");
        }
        
        // 임시 비밀번호 생성 및 발송
        String tempPassword = passwordService.generateTempPassword();
        auth.setPwd(tempPassword);
        authService.updateTempPassword(auth);
        
        // 시도 횟수 증가
        incrementAttemptCount(ip, ipAttemptStore);
        incrementAttemptCount(email, emailAttemptStore);
        
        logger.info("Temporary password issued: email={}, temp_password={}", email, tempPassword);
        mailService.sendTempPassword(email, tempPassword);
    }
    
    private void incrementAttemptCount(String key, ConcurrentHashMap<String, AttemptCount> store) {
        AttemptCount attempt = store.get(key);
        if (attempt == null || attempt.getExpirationTime() < System.currentTimeMillis()) {
            store.put(key, new AttemptCount(1, 
                System.currentTimeMillis() + (VERIFICATION_TTL * 1000), false));
        } else {
            int newCount = attempt.getCount() + 1;
            boolean blocked = newCount >= MAX_ATTEMPTS;
            long expirationTime = System.currentTimeMillis() + 
                (blocked ? (1800 * 1000) : (VERIFICATION_TTL * 1000));
            store.put(key, new AttemptCount(newCount, expirationTime, blocked));
        }
    }

    public boolean verifyCode(String email, String code) {
        VerificationData data = verificationStore.get(email);
        if (data != null && data.getExpirationTime() > System.currentTimeMillis() && 
            data.getCode().equals(code)) {
            // 인증 성공시 관련 데이터 삭제
            verificationStore.remove(email);
            emailAttemptStore.remove(email);
            return true;
        }
        return false;
    }

    private void cleanupExpiredData() {
        long currentTime = System.currentTimeMillis();
        verificationStore.entrySet().removeIf(entry -> entry.getValue().getExpirationTime() < currentTime);
        ipAttemptStore.entrySet().removeIf(entry -> entry.getValue().getExpirationTime() < currentTime);
        emailAttemptStore.entrySet().removeIf(entry -> entry.getValue().getExpirationTime() < currentTime);
    }
}