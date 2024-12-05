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
package krgz.usr.web;

import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.io.UnsupportedEncodingException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Properties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Resource;
import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springmodules.validation.commons.DefaultBeanValidator;


import egovframework.rte.fdl.property.EgovPropertyService;
import krgz.usr.service.UsrService;
import krgz.usr.service.UsrVO;
import krgz.log.service.LogTrackerService;
import krgz.log.service.LogTrackerVO;
import krgz.mail.service.MailService;
import krgz.util.AES256Cipher;
import krgz.util.GetClientIPAddr;
import krgz.session.SessionConfig;
import krgz.session.SessionVO;

/**
 * 
* <pre>
* 간략 : 공통
* 상세 : 공통
* krgz.usr.web
*   |_ UsrController.java
* </pre>
* 
* @Company : EGIS
* @Author  : 오영진
* @Date    : 2024. 3. 13.
* @Version : 1.0
 */

@Controller
public class UsrController {
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	/** EgovPropertyService */
	@Resource(name = "propertiesService")
	protected EgovPropertyService propertiesService;

	/** Validator */
	@Resource(name = "beanValidator")
	protected DefaultBeanValidator beanValidator;
	
	@Resource(name = "globalProperties")
	protected Properties globalProperties;
	
	@Resource(name = "UsrService")
	private UsrService UsrService;
	
	@Autowired
	private MailService MailService;
	
	@Autowired
	private LogTrackerService LogTrackerService;
	
	/**
	 * 
	* <PRE>
	* 간략 : 사용자
	* 상세 : 사용자
	* <PRE>
	* @param model
	* @param map
	* @return
	 */
	@RequestMapping(value="/usr/selectUsrId.do",method=RequestMethod.POST)
	public String selectUsrId(@RequestParam HashMap<String,String> map, Model model) throws Exception {
		
		String usrId = map.get("usrId");
		int rs = UsrService.selectUsrId(usrId);
		
		model.addAttribute("rs", rs);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/usr/selectEml.do",method=RequestMethod.POST)
	public String selectEml(@RequestParam HashMap<String,String> map, Model model) throws Exception {
		
		String eml = map.get("eml");
		int rs = UsrService.selectEml(eml);
		
		model.addAttribute("rs", rs);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/usr/insertUsrInfo.do",method=RequestMethod.POST)
	public String insertUsrInfo(@RequestParam HashMap<String,String> map,Model model,HttpServletRequest request) throws Exception{
		
		String id = map.get("usrId");	

		int rs = UsrService.insertUsrInfo(map);
		
		if(rs == 1) {
			UsrVO uvo = new UsrVO();
			uvo.setUsr_id(id);
			uvo = UsrService.selectUsrInfo(uvo);
			LogTrackerVO lvo = new LogTrackerVO();
			lvo.setUsr_no(uvo.getUsr_no());
			lvo.setGrp_id(uvo.getGrp_id());
			lvo.setLog_code("20");
			lvo.setLog_level("2");
			lvo.setMessage("회원 가입:{ID:"+id+"}");
			GetClientIPAddr ip = new GetClientIPAddr();
			String clientIP=ip.getClientIP(request);//클라이언트 ip
			lvo.setIp(clientIP);
			try {
				LogTrackerService.insertLogTracker(lvo);
			} catch (SQLException e) {
				logger.error("insertUsrInfo SQLExeption");
			}
			model.addAttribute("rs", "DONE");
		}else {
			model.addAttribute("rs", "ERROR");
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/usr/checkLogin.do",method=RequestMethod.POST)
	public String checkLogin(@RequestParam HashMap<String,String> map, Model model, HttpServletRequest request) throws Exception {
		HashMap<String, Object> rs = UsrService.checkLogin(map);
		
		LogTrackerVO lvo = new LogTrackerVO();
		
		if(rs != null) {
			String pwd=map.get("pwd");
			String pwdDB = rs.get("pwd").toString();
			if (pwd.equals(pwdDB)) {
				model.addAttribute("usr_info", rs);
	        } else {
	        	//로그인 카운트
	        	UsrVO loginCount = new UsrVO();
				loginCount.setUsr_id(rs.get("usr_id").toString());
				loginCount.setLogin_count(rs.get("login_count").toString()); 
	        	UsrService.updateLoginCount(loginCount); // 로그인 횟수 업데이트
	        	//로그인 실패시 +1 -- 5가 넘어가면 뷰에 넘어가는 값이 5를 넘지 않도록 함 
	        	int loginCountInfo = Integer.parseInt(rs.get("login_count").toString())+1;
	        	if(loginCountInfo>=5) {
	        		loginCountInfo = 5;
	        	}
	        	model.addAttribute("login_count", loginCountInfo);
	        	model.addAttribute("usr_info", "NONE");
				model.addAttribute("pwd", "INCORRECT");
				
				lvo.setMessage("패스워드 오류:{ID:"+rs.get("usr_id").toString()+"}");
				lvo.setUsr_no("-1");
				lvo.setGrp_id("-1");
				lvo.setLog_code("11");
				lvo.setLog_level("1");
				
				GetClientIPAddr ip = new GetClientIPAddr();
				String clientIP=ip.getClientIP(request);
				lvo.setIp(clientIP);
				LogTrackerService.insertLogTracker(lvo);
	        }
		}else {
			model.addAttribute("usr_info", "NONE");
		}
		return "jsonView";
	}
	
	@RequestMapping(value="/usr/loginSession.do",method=RequestMethod.POST)
	public String loginSession(@RequestParam HashMap<String,String> map, Model model, HttpServletRequest request,HttpServletResponse response) throws Exception{

		HttpSession session = request.getSession(true);
		SessionVO sessionVO = new SessionVO();
		
		HashMap<String, Object> rs = UsrService.checkLogin(map);
		String AES_SECRETKEY="digitaltwin";
		String enUsrId="";
		if(rs != null) {
			String pwd=map.get("pwd");
			String pwdDB = rs.get("pwd").toString();
			
			if (pwd.equals(pwdDB)) {
				model.addAttribute("usr_info", rs);

				sessionVO.setSessUsrNo(rs.get("usr_no").toString());
				String key = new java.math.BigInteger(AES_SECRETKEY.getBytes()).toString(2).substring(0, 16);
				AES256Cipher a256 = AES256Cipher.getInstance(key);
				try {
					enUsrId = a256.AES_Encode(rs.get("usr_id").toString(),key);
				} catch (InvalidKeyException | UnsupportedEncodingException | NoSuchAlgorithmException | NoSuchPaddingException
						| InvalidAlgorithmParameterException | IllegalBlockSizeException | BadPaddingException e) {
					logger.error("AES_Encode Exception");
				}
//		        String userId = SessionConfig.getSessionidCheck("sessionUsrId", rs.get("usr_id").toString());
				String userId = "Dev";
		        if(userId == "DUPLICATE") {
		        	model.addAttribute("usr_info", "ERROR");
		        } else {
		        	sessionVO.setSessEncryUsrId(enUsrId);
		        	sessionVO.setSessUsrId(rs.get("usr_id").toString());
		        	session.setAttribute("usr_info", rs);
		        	session.setAttribute("sessionUsrId", rs.get("usr_id").toString());
		        	
		        	UsrVO uvo = new UsrVO();
		        	uvo.setUsr_id(rs.get("usr_id").toString());
		        	UsrService.updateUsrLoginDate(uvo);
		        	
		        	try {
		        		uvo = UsrService.selectUsrInfo(uvo);
		        		
		        		sessionVO.setSessEncryUsrId(enUsrId);
		        		sessionVO.setSessUsrNo(uvo.getUsr_no());
		        		sessionVO.setSessUsrId(uvo.getUsr_id());
		        		sessionVO.setSessUsrNm(uvo.getUsr_nm());
		        		sessionVO.setSessGrpId(uvo.getGrp_id());
		        		sessionVO.setSessGrpNm(uvo.getGrp_nm());
		        		sessionVO.setSessEml(uvo.getEml());
		        		sessionVO.setSessTelno(uvo.getTelno());
		        		sessionVO.setSessInst(uvo.getInst());
		        		sessionVO.setSessDept(uvo.getDept());
		        		sessionVO.setSessSrvcYn(uvo.getSrvc_yn());
		        		sessionVO.setSessAuthorMenu(uvo.getAuthor_menu());
		        		
		        		session.setAttribute("sessionUsrInfo", sessionVO);
		        		// 세션 시간
		        		session.setMaxInactiveInterval(3600);
		        		UsrVO resetUVO = new UsrVO();
		        		resetUVO.setUsr_id(rs.get("usr_id").toString());
		        		// 로그인 횟수 0으로 초기화
		        		UsrService.resetLoginCount(resetUVO);
		        		
		        		LogTrackerVO lvo = new LogTrackerVO(uvo.getUsr_no(),uvo.getGrp_id(),"10", "1", "로그인 성공");
		        		GetClientIPAddr ip = new GetClientIPAddr();
		        		
		        		String clientIP=ip.getClientIP(request);//클라이언트 ip
		        		lvo.setIp(clientIP);
		        		
		        		LogTrackerService.insertLogTracker(lvo);
		        		
		        	} catch (SQLException e) {
		        		logger.error("loginSession SQLException");
		        	}
		        }
	        } else {
				model.addAttribute("usr_info", "NONE");
	        }
			
		}else {
			model.addAttribute("usr_info", "NONE");
		}
		
		return "jsonView";
	}

	@RequestMapping(value="/usr/selectFindUsrId.do",method=RequestMethod.POST)
	public String selectFindUsrId(@RequestParam HashMap<String,String> map,Model model,HttpServletRequest request) throws Exception{
		
		LogTrackerVO lvo = new LogTrackerVO();
		
		HashMap<String, Object> rs = UsrService.selectFindUsrId(map);
		
		if(rs != null) {
			String usrNo = rs.get("usr_no").toString();
			String usrId = rs.get("usr_id").toString();
			String grpId = rs.get("grp_id").toString();
			
			lvo.setMessage("아이디 찾기:{ID:"+usrId+"}");
			lvo.setUsr_no(usrNo);
			lvo.setGrp_id(grpId);
			lvo.setLog_code("13");
			lvo.setLog_level("2");
			
			GetClientIPAddr ip = new GetClientIPAddr();
			String clientIP=ip.getClientIP(request);
			lvo.setIp(clientIP);
			LogTrackerService.insertLogTracker(lvo);
			
			model.addAttribute("rs", usrId);
		} else {
			model.addAttribute("rs", "NONE");
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/usr/selectFindPwd.do",method=RequestMethod.POST)
	public String selectFindPwd(@RequestParam HashMap<String,String> map,Model model,HttpServletRequest request) throws Exception{
		
		String usrId = map.get("usrId");
		String email = map.get("eml");
		
		LogTrackerVO lvo = new LogTrackerVO();
		UsrVO uvo = new UsrVO();
		uvo.setUsr_id(usrId);
		UsrVO usrInfo = UsrService.selectUsrInfo(uvo);
		
		int rs = UsrService.selectFindPwd(usrInfo);
		
		if(rs == 1) {
			String authPwd = MailService.tempPwdMail(email);
			if(authPwd != null) {
				uvo.setPwd(authPwd);
				uvo.setTmpr_pwd_yn("Y");
				uvo.setUsr_id(usrId);
				UsrService.updateUsrPw(uvo);
				
				lvo.setMessage("비밀번호 찾기:{ID:"+usrInfo.getUsr_id()+"}");
				lvo.setUsr_no(usrInfo.getUsr_no());
				lvo.setGrp_id(usrInfo.getGrp_id());
				lvo.setLog_code("14");
				lvo.setLog_level("2");
				
				GetClientIPAddr ip = new GetClientIPAddr();
				String clientIP=ip.getClientIP(request);
				lvo.setIp(clientIP);
				LogTrackerService.insertLogTracker(lvo);
				
				model.addAttribute("rs", "DONE");
			} else {
				model.addAttribute("rs", "NULL");
			}
		} else {
			model.addAttribute("rs", "ERROR");
		}
		    
		return "jsonView";
	}
	
	@RequestMapping(value="/usr/logout.do",method=RequestMethod.GET)
	public String logout(HttpServletRequest request, Model model) throws Exception {
		
		HttpSession session = request.getSession(true);
		SessionVO sessionVO  = (SessionVO) session.getAttribute("sessionUsrInfo");
		
		UsrVO uvo = new UsrVO();
		uvo.setUsr_id(sessionVO.getSessUsrId());
		uvo=UsrService.selectUsrInfo(uvo);
		LogTrackerVO lvo = new LogTrackerVO(uvo.getUsr_no(),uvo.getGrp_id(),"18", "1", "로그아웃");
		GetClientIPAddr ip = new GetClientIPAddr();
		String clientIP=ip.getClientIP(request);//클라이언트 ip
		lvo.setIp(clientIP);
		try {
			LogTrackerService.insertLogTracker(lvo);
			session.removeAttribute("usr_info");
			session.removeAttribute("sessionUsrInfo");
		} catch(Exception e) {
			e.printStackTrace();
		}
		session.invalidate();
		
		model.addAttribute("rs", "DONE");
		
		return "jsonView";
	}
	
	@RequestMapping(value="/usr/selectUsrInfo.do",method=RequestMethod.POST)
	public String selectUsrInfo(@RequestParam HashMap<String,String> map,Model model,HttpServletRequest request) throws Exception{
		
		String id = map.get("usrId");
		
		UsrVO usrInfo = new UsrVO();
		usrInfo.setUsr_id(id);
		usrInfo = UsrService.selectUsrInfo(usrInfo);
		
		model.addAttribute("rs", usrInfo);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/usr/updateUsrInfo.do",method=RequestMethod.POST)
	public String updateUsrInfo(@RequestParam HashMap<String,String> map,Model model,HttpServletRequest request) throws Exception{
		
		String usrId = map.get("usrId");
		String usrNm = map.get("usrNm");
		String eml = map.get("eml");
		String pwd = map.get("pwd");
		String pwdChg = map.get("pwdChg");
		String telno = map.get("telno");
		String inst = map.get("inst");
		String dept = map.get("dept");
		
		UsrVO uvo = new UsrVO();
		uvo.setUsr_id(usrId);
		uvo = UsrService.selectUsrInfo(uvo);
		if(uvo != null) {
			String usrNo = uvo.getUsr_no();
			String usrNmDB = uvo.getUsr_nm();
			String grpId = uvo.getGrp_id();
			String emlDB = uvo.getEml();
			String pwdDB = uvo.getPwd();
			String telnoDB = uvo.getTelno();
			String instDB = uvo.getInst();
			String deptDB = uvo.getDept();
			if(!usrNm.equals(usrNmDB)) {
				model.addAttribute("rs", "ERROR");
			} else {
				if(pwd.equals(pwdDB)) {
					// 비밀번호 변경 여부
					if(pwdChg != "") {
						if(eml.equals(emlDB) && pwdChg.equals(pwdDB) && telno.equals(telnoDB) && inst.equals(instDB) && dept.equals(deptDB)) {
							model.addAttribute("rs", "PWSAME");
						} else {
							uvo.setEml(eml);
							uvo.setPwd(pwdChg);
							uvo.setTelno(telno);
							uvo.setInst(inst);
							uvo.setDept(dept);
							uvo.setMdfr(usrId);
							try {
								LogTrackerVO lvo = new LogTrackerVO(usrNo, grpId, "15", "2", "회원 정보 수정[비밀번호 변경]");
								GetClientIPAddr ip = new GetClientIPAddr();
								
								String clientIP=ip.getClientIP(request);//클라이언트 ip
								lvo.setIp(clientIP);
								
								LogTrackerService.insertLogTracker(lvo);
								
								int rs = UsrService.updateUsrInfo(uvo);
								if (rs == 1) {
									model.addAttribute("rs", "PWDONE");
								} else {
									model.addAttribute("rs", "ERROR");
								}
							} catch (SQLException e) {
								logger.error("updateUsrInfo SQLException");
							}
						}
					} else {
						if(eml.equals(emlDB) && telno.equals(telnoDB) && inst.equals(instDB) && dept.equals(deptDB)) {
							model.addAttribute("rs", "SAME");
						} else {
							uvo.setEml(eml);
							uvo.setPwd(pwd);
							uvo.setTelno(telno);
							uvo.setInst(inst);
							uvo.setDept(dept);
							uvo.setMdfr(usrId);
							
							try {
								LogTrackerVO lvo = new LogTrackerVO(usrNo, grpId, "16", "2", "회원 정보 수정");
								GetClientIPAddr ip = new GetClientIPAddr();
								
								String clientIP=ip.getClientIP(request);
								lvo.setIp(clientIP);
								
								LogTrackerService.insertLogTracker(lvo);
								
								int rs = UsrService.updateUsrInfo(uvo);
								if (rs == 1) {
									model.addAttribute("rs", "DONE");
								} else {
									model.addAttribute("rs", "ERROR");
								}
							} catch (SQLException e) {
								logger.error("updateUsrInfo SQLException");
							}
						}
					}
				} else {
					model.addAttribute("rs", "FAIL");
				}
			}
		} else {
			model.addAttribute("rs", "ERROR");
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/usr/deleteUsrInfo.do",method=RequestMethod.POST)
	public String deleteUsrInfo(@RequestParam HashMap<String,String> map, Model model,  HttpServletRequest request) throws Exception {
		
		String pwd = map.get("pwd");
		
		SessionVO sessionVO = new SessionVO();
    	HttpSession session = request.getSession();
    	sessionVO = (SessionVO) session.getAttribute("sessionUsrInfo");
    	String id = sessionVO.getSessUsrId();
    	
    	UsrVO uvo = new UsrVO();
		uvo.setUsr_id(id);
		uvo = UsrService.selectUsrInfo(uvo);
		String pwdDB = uvo.getPwd();
		
		if(pwd.equals(pwdDB)) {
			LogTrackerVO lvo = new LogTrackerVO();
			lvo.setUsr_no(uvo.getUsr_no());
			lvo.setGrp_id(uvo.getGrp_id());
			lvo.setLog_code("21");
			lvo.setLog_level("2");
			lvo.setMessage("회원 탈퇴:{ID:"+id+"}");
			GetClientIPAddr ip = new GetClientIPAddr();
			String clientIP=ip.getClientIP(request);//클라이언트 ip
			lvo.setIp(clientIP);
			try {
				LogTrackerService.insertLogTracker(lvo);
				
				int rs = UsrService.deleteUsrInfo(id);
				if (rs == 1) {
					model.addAttribute("rs", "DONE");
				} else {
					model.addAttribute("rs", "ERROR");
				}
			} catch (SQLException e) {
				logger.error("deleteUsrInfo SQLExeption");
			}
			
			session.invalidate();
			
		} else {
			model.addAttribute("rs", "FAIL");
		}
		 
		return "jsonView";
	}
	
	//이메일 인증
	@RequestMapping(value="/usr/checkMail.do",method=RequestMethod.POST)
	public String checkMail(@RequestParam HashMap<String,String> map,Model model) throws MessagingException {
		
		String email = map.get("eml");
		
		System.out.println("이메일 인증 요청이 들어옴!");
		System.out.println("이메일 인증 이메일 : " + email);
		
		String rs = MailService.joinEmail(email);
		model.addAttribute("rs", rs);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/usr/sessionCheck.do",method=RequestMethod.POST)
	public String sessionCheck(Model model, HttpServletRequest request){
		
		HttpSession session = request.getSession(false);
		
		model.addAttribute("sessionExpiry", session.getAttribute("sessionExpiry"));
		model.addAttribute("latestTouch", session.getAttribute("latestTouch"));
		
		return "jsonView";
	}
	
	@RequestMapping(value="/usr/sessionRefresh.do", method = RequestMethod.POST)
	public String sessionRefresh(HttpServletRequest request,Model model) {
		
		HttpSession session = request.getSession(true);
		
		return "jsonView";
	}
}
