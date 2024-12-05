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
 * layerributed under the License is layerributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package krgz.cmm.web;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springmodules.validation.commons.DefaultBeanValidator;

import egovframework.rte.fdl.property.EgovPropertyService;
import krgz.usr.service.UsrService;
import krgz.usr.service.UsrVO;
import krgz.session.SessionVO;

/**
 * 
* <pre>
* 간략 : 공통
* 상세 : 공통
* krgz.cmm.web
*   |_ CmmController.java
* </pre>
* 
* @Company : EGIS
* @Author  : egis
* @Date    : 2024. 3. 6.
* @Version : 1.0
 */

@Controller
public class CmmController {
	
	/** EgovPropertyService */
	@Resource(name = "propertiesService")
	protected EgovPropertyService propertiesService;

	/** Validator */
	@Resource(name = "beanValidator")
	protected DefaultBeanValidator beanValidator;
	
	@Resource(name = "UsrService")
	private UsrService UsrService;
	
	/**
	 * 
	* <PRE>
	* 간략 : 메인화면
	* 상세 : 메인화면
	* <PRE>
	* @param model
	* @param req
	* @param res
	* @return
	 */
	@RequestMapping("/main.do")
	public String main(Model model, HttpServletRequest request) throws Exception {
	    HttpSession session = request.getSession();

	    SessionVO sessionVO = new SessionVO();
	    UsrVO uvo = new UsrVO();

	    sessionVO = (SessionVO) session.getAttribute("sessionUsrInfo");
	    if (sessionVO != null) {
	        uvo.setUsr_id(sessionVO.getSessUsrId());
	        uvo = UsrService.selectUsrInfo(uvo);
	        sessionVO.setSessAuthorMenu(uvo.getAuthor_menu());

	        model.addAttribute("usrInfo", sessionVO);
	    }

	    return "/krgz/cmm/main";
	}
	
	@PostMapping("/setLanguage.do")
	public String setLanguage(@RequestParam("lang") String lang, HttpSession session, Model model) {
	    session.setAttribute("userLanguage", lang);
	    model.addAttribute("language", lang);
	    
	    return "jsonView";
	}
}
