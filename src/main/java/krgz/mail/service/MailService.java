/*
 * Copyright 2008-2009 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package krgz.mail.service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
public class MailService {
	@Autowired
	private JavaMailSenderImpl mailSender;
	private Map<String, Integer> consecutiveAttemptsMap = new HashMap<>();
	private Map<String, Long> lastAttemptTimeMap = new HashMap<>();
	
	private int authNumber;
	private String authPwd;
	private String tempPwd;
	private final long FIVE_MINUTES_IN_MILLIS = 5 * 60 * 1000;
	private final long Thirty_MINUTES_IN_MILLIS = 30 * 60 * 1000;
	
	public void makeRandomNumber() {
        SecureRandom secureRandom = new SecureRandom();
        authNumber = secureRandom.nextInt(888888) + 111111;
        System.out.println("인증번호 : " + authNumber);
    }
	
	public void makeRandomPwd() throws NoSuchAlgorithmException {
		tempPwd = "";
        String allCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

        SecureRandom random = new SecureRandom();
        for (int i = 0; i < 12; i++) {
            int randomIndex = random.nextInt(allCharacters.length());
            tempPwd += allCharacters.charAt(randomIndex);
        }

		MessageDigest md;
		md = MessageDigest.getInstance("SHA-512");
        md.update(tempPwd.getBytes());
        
        StringBuilder builder = new StringBuilder();
        for (byte b: md.digest()) {
          builder.append(String.format("%02x", b));
        }
        authPwd = builder.toString();
        System.out.println("임시비밀번호 : " + tempPwd);
    }
	
	public String joinEmail(String email) throws MessagingException {
		if (!consecutiveAttemptsMap.containsKey(email)) {
            consecutiveAttemptsMap.put(email, 0);
        }
		int consecutiveAttempts = consecutiveAttemptsMap.get(email);
		long lastAttemptTime = lastAttemptTimeMap.getOrDefault(email, 0L);
		
		if(System.currentTimeMillis() > lastAttemptTime + Thirty_MINUTES_IN_MILLIS) {
        	consecutiveAttempts = 0;
        }
        
        if (consecutiveAttempts >= 3 && System.currentTimeMillis() < lastAttemptTime + FIVE_MINUTES_IN_MILLIS) {
            return null; // 제한 시간 내에 3번 이상의 연속된 인증 시도인 경우 처리
        } else if(consecutiveAttempts >= 3) {
        	consecutiveAttempts = 0;
        }
        
		makeRandomNumber();
		String setFrom = ".com"; // email-config에 설정한 자신의 이메일 주소를 입력 
		String toMail = email;
		String title = "[EGIS] 회원 가입 인증 이메일 입니다."; // 이메일 제목 
		String content = "<html>" +
		                 "<body>" +
		                 "<div style='text-align: center;'>" +
		                 "<h1>홈페이지를 방문해주셔서 감사합니다.</h1><br>" +
		                 "<p style='font-size: 18px;'>인증 번호는 <strong>" + authNumber + "</strong>입니다.</p>" +
		                 "<p style='font-size: 18px;'>해당 인증번호를 인증번호 확인란에 기입하여 주세요.</p>" +
		                 "</div>" +
		                 "</body>" +
		                 "</html>";
		mailSend(setFrom, toMail, title, content);
		
		consecutiveAttemptsMap.put(email, consecutiveAttempts + 1);
        lastAttemptTimeMap.put(email, System.currentTimeMillis());
	    
		return Integer.toString(authNumber);
	}
	
	public String tempPwdMail(String email) throws MessagingException, NoSuchAlgorithmException {
		if (!consecutiveAttemptsMap.containsKey(email)) {
            consecutiveAttemptsMap.put(email, 0);
        }
		int consecutiveAttempts = consecutiveAttemptsMap.get(email);
        long lastAttemptTime = lastAttemptTimeMap.getOrDefault(email, 0L);
        
        if(System.currentTimeMillis() > lastAttemptTime + Thirty_MINUTES_IN_MILLIS) {
        	consecutiveAttempts = 0;
        }
        
        if (consecutiveAttempts >= 3 && System.currentTimeMillis() < lastAttemptTime + FIVE_MINUTES_IN_MILLIS) {
            return null; // 제한 시간 내에 3번 이상의 연속된 인증 시도인 경우 처리
        } else if(consecutiveAttempts >= 3) {
        	consecutiveAttempts = 0;
        }
        
		makeRandomPwd();
		String setFrom = ".com"; // email-config에 설정한 자신의 이메일 주소를 입력 
		String toMail = email;
		String title = "[EGIS] 임시 비밀번호 발급 이메일 입니다."; // 이메일 제목 
		String content = "<html>" +
		                 "<body>" +
		                 "<div style='text-align: center;'>" +
		                 "<h1>임시 비밀번호가 발급되었습니다.</h1><br>" +
		                 "<p style='font-size: 18px;'>임시 비밀번호는 <strong>" + tempPwd + "</strong>입니다.</p>" +
		                 "<p style='font-size: 18px;'>발급된 임시비밀번호는 다시 조회가 불가능하니 잊어버리지 않도록 주의하시기 바랍니다.</p>" +
		                 "<p style='font-size: 18px;'>발급된 임시비밀번호는 임시적인 것이므로 로그인 후 꼭 비밀번호를 변경하십시오.</p>" +
		                 "</div>" +
		                 "</body>" +
		                 "</html>";
		mailSend(setFrom, toMail, title, content);
		
		consecutiveAttemptsMap.put(email, consecutiveAttempts + 1);
        lastAttemptTimeMap.put(email, System.currentTimeMillis());
	    
		return authPwd;
	}
	
	//이메일 전송 메소드
	public void mailSend(String setFrom, String toMail, String title, String content) throws MessagingException{
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");
            helper.setFrom(setFrom);
            helper.setTo(toMail);
            helper.setSubject(title);
            helper.setText(content, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
            throw e;
        }
    }
}
