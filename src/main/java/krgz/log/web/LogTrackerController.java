/**
 * 
 */
package krgz.log.web;

import java.sql.SQLException;
import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.codehaus.plexus.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import krgz.log.service.LogTrackerService;
import krgz.log.service.LogTrackerVO;
import krgz.usr.service.UsrService;
import krgz.usr.service.UsrVO;
import krgz.util.GetClientIPAddr;
import krgz.util.SessionVO;

/**
 * LogTrackerController.java
 * krgz
 * 2024. 3. 29.
 * @author 오영진
 * @Comment
 *
 */

@Controller
public class LogTrackerController {
	
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Resource(name="LogTrackerService")
	private LogTrackerService LogTrackerService;
	
	@Resource(name="UsrService")
	private UsrService UsrService;
	
	
	@RequestMapping(value="/logger/addLogTracker.do", method=RequestMethod.POST)
	public String checkMetaAssetApplication(Model model, HttpServletRequest request, @RequestParam HashMap<String,Object> map) throws Exception {
		String rs = "fail";
		System.out.println(map);
		try {
			
			HttpSession session = request.getSession(true);
			
			SessionVO sessionVO = new SessionVO();
			sessionVO = (SessionVO) session.getAttribute("sessionUsrInfo");
			
			GetClientIPAddr ip = new GetClientIPAddr();
			String clientIP=ip.getClientIP(request);//클라이언트 ip
			if(sessionVO!=null) { // 세션 값이 있는 경우
				if(!StringUtils.isEmpty(map.get("log_code").toString())) {
					
					String usr_id = sessionVO.getSessUsrId();
					
					UsrVO UsrVO = new UsrVO();
					
					UsrVO.setUsr_id(usr_id);
					
					UsrVO = UsrService.selectUsrInfo(UsrVO);
					
					String log_code = map.get("log_code").toString();
					
					String usr_no = UsrVO.getUsr_no();
					String grp_id = UsrVO.getGrp_id();
					
					String message = "";
					
					if(!StringUtils.isEmpty(map.get("message").toString())) {
						message = map.get("message").toString();
					}
					
					String log_level = "1";
					
					LogTrackerVO lvo = new LogTrackerVO();
					
					if(!StringUtils.isEmpty(map.get("log_level").toString())) {
						lvo.setLog_level(log_level);
					} else {
						lvo.setLog_level(map.get("log_level").toString());
					}
					
					lvo.setUsr_no(usr_no);
					lvo.setGrp_id(grp_id);
					lvo.setLog_code(log_code);
					lvo.setMessage(message);
					lvo.setIp(clientIP);
					if(LogTrackerService.insertLogTracker(lvo) > 0) {
						rs = "complete";
					}
				}

			}else { //세션 값이 없을 경우(로그인 전)
					if(!StringUtils.isEmpty(map.get("log_code").toString())
							&&!StringUtils.isEmpty(map.get("message").toString())
							&&!StringUtils.isEmpty(map.get("log_level").toString())) {
						LogTrackerVO lvo = new LogTrackerVO();
						String usr_no = "-1";
						String grp_id = "-1";
						lvo.setUsr_no(usr_no);
						lvo.setGrp_id(grp_id);
						lvo.setLog_level(map.get("log_level").toString());
						lvo.setLog_code(map.get("log_code").toString());
						lvo.setMessage(map.get("message").toString());
						lvo.setIp(clientIP);
						
						if(LogTrackerService.insertLogTracker(lvo) > 0) {
							rs = "complete";
						}
					}
			}
			
		} catch (SQLException e) {
			logger.error("SQL Error-SQLException");
		} catch (NullPointerException e) {
			logger.error("Map NullPointerException");
		} catch(NumberFormatException e) {
			logger.error("NumberFormat Error-NumberFormatException");
		}
		
		model.addAttribute("rs", rs);
		
		return "jsonView";
	}

}
