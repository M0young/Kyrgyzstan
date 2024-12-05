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
package krgz.adm.usr.web;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springmodules.validation.commons.DefaultBeanValidator;

import egovframework.rte.fdl.property.EgovPropertyService;
import egovframework.rte.ptl.mvc.tags.ui.pagination.PaginationInfo;
import krgz.usr.service.UsrService;
import krgz.usr.service.UsrVO;
import krgz.util.GetClientIPAddr;
import krgz.adm.usr.service.AdmUsrService;
import krgz.log.service.LogTrackerService;
import krgz.log.service.LogTrackerVO;

/**
 * 
* <pre>
* 간략 : 공통
* 상세 : 공통
* krgz.adm.web
*   |_ AdmUsrController.java
* </pre>
* 
* @Company : EGIS
* @Author  : 오영진
* @Date    : 2024. 3. 13.
* @Version : 1.0
 */

@Controller
public class AdmUsrController {
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	/** EgovPropertyService */
	@Resource(name = "propertiesService")
	protected EgovPropertyService propertiesService;

	/** Validator */
	@Resource(name = "beanValidator")
	protected DefaultBeanValidator beanValidator;
	
	@Resource(name = "globalProperties")
	protected Properties globalProperties;
	
	@Resource(name = "AdmUsrService")
	private AdmUsrService AdmUsrService;
	
	@Resource(name = "UsrService")
	private UsrService UsrService;
	
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
	@RequestMapping(value="/adm/selectUsrList.do")
	public String selectUsrList(HttpServletRequest request, Model model) throws Exception {
		String type = request.getParameter("type") == null ? "" : request.getParameter("type");
		String search = request.getParameter("search") == null ? "" : request.getParameter("search");
		String grp_search = request.getParameter("grp_search") == null ? "" : request.getParameter("grp_search");
		
		UsrVO uvo = new UsrVO();
		uvo.setPageUnit(15);
		uvo.setPageSize(5);
		uvo.setPageIndex(Integer.parseInt(request.getParameter("pageIndex")));
		uvo.setSearch(search);
		uvo.setGrp_search(grp_search);
		uvo.setType(type);
		
		/** pageing setting */
		PaginationInfo paginationInfo = new PaginationInfo();
		paginationInfo.setCurrentPageNo(uvo.getPageIndex());
		paginationInfo.setRecordCountPerPage(uvo.getPageUnit());
		paginationInfo.setPageSize(uvo.getPageSize());
		
		uvo.setFirstIndex(paginationInfo.getFirstRecordIndex());
		uvo.setLastIndex(paginationInfo.getLastRecordIndex());
		uvo.setRecordCountPerPage(paginationInfo.getRecordCountPerPage());

		List<?> list = AdmUsrService.selectUsrList(uvo);
		int count = AdmUsrService.selectUsrCount(uvo);
		paginationInfo.setTotalRecordCount(count);
		
		model.addAttribute("list", list);
		model.addAttribute("count", count);
		model.addAttribute("paginationInfo", paginationInfo);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/adm/selectUsrLogList.do")
	public String selectUsrLogList(HttpServletRequest request, Model model) throws Exception {
		String usrId = request.getParameter("usrId") == null ? "" : request.getParameter("usrId");
		UsrVO uvo = new UsrVO();
		uvo.setUsr_id(usrId);
		uvo = UsrService.selectUsrInfo(uvo);
		
		LogTrackerVO lvo = new LogTrackerVO();
		lvo.setUsr_no(uvo.getUsr_no());
		
		List<?> list = LogTrackerService.selectUsrLogList(lvo);
		
		model.addAttribute("list", list);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/adm/updateAdmUsrInfo.do")
	public String updateAdmUsrInfo(@RequestParam HashMap<String,String> map, HttpServletRequest request, Model model) throws Exception {
		String id = map.get("usrId");
		String grpId = map.get("grpId");
		String eml = map.get("eml");
		String telno = map.get("telno");
		String inst = map.get("inst");
		String dept = map.get("dept");
		String mdfr = map.get("mdfr");
		
		UsrVO uvo = new UsrVO();
		uvo.setUsr_id(id);
		uvo = UsrService.selectUsrInfo(uvo);
		
		if(uvo != null) {
			String usrNo = uvo.getUsr_no();
			String grpIdDB = uvo.getGrp_id();
			String emlDB = uvo.getEml();
			String telnoDB = uvo.getTelno();
			String instDB = uvo.getInst();
			String deptDB = uvo.getDept();
			
			if(eml.equals(emlDB) && telno.equals(telnoDB) && grpId.equals(grpIdDB) && inst.equals(instDB) && dept.equals(deptDB)) {
				model.addAttribute("rs", "SAME");
			} else {
				map.put("usrNo", usrNo);
				map.put("grpId", grpId);
				map.put("eml", eml);
				map.put("telno", telno);
				map.put("inst", inst);
				map.put("dept", dept);
				map.put("mdfr", mdfr);
				
				try {
					LogTrackerVO lvo = new LogTrackerVO(usrNo, grpId, "22", "1", "회원 정보 수정");
					GetClientIPAddr ip = new GetClientIPAddr();
					
					String clientIP=ip.getClientIP(request);
					lvo.setIp(clientIP);
					
					int rs = AdmUsrService.updateAdmUsrInfo(map);
					if (rs == 1) {
						LogTrackerService.insertLogTracker(lvo);
						model.addAttribute("rs", "DONE");
					} else {
						model.addAttribute("rs", "ERROR");
					}
				} catch (SQLException e) {
					logger.error("updateAdmUsrInfo SQLException");
				}
			}
		} else {
			model.addAttribute("rs", "FAIL");
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/adm/deleteAdmUsrInfo.do",method=RequestMethod.POST)
	public String deleteAdmUsrInfo(@RequestParam HashMap<String,String> map, Model model,  HttpServletRequest request) throws Exception {
		String id = map.get("usrId");
		
    	UsrVO uvo = new UsrVO();
		uvo.setUsr_id(id);
		uvo = UsrService.selectUsrInfo(uvo);
		
		LogTrackerVO lvo = new LogTrackerVO();
		lvo.setUsr_no(uvo.getUsr_no());
		lvo.setGrp_id(uvo.getGrp_id());
		lvo.setLog_code("23");
		lvo.setLog_level("1");
		lvo.setMessage("회원 정보 삭제:{ID:"+id+"}");
		GetClientIPAddr ip = new GetClientIPAddr();
		String clientIP=ip.getClientIP(request);
		lvo.setIp(clientIP);
		try {
			int rs = UsrService.deleteUsrInfo(uvo.getUsr_no());
			if (rs == 1) {
				LogTrackerService.insertLogTracker(lvo);
				model.addAttribute("rs", "DONE");
			} else {
				model.addAttribute("rs", "ERROR");
			}
		} catch (SQLException e) {
			logger.error("deleteUsrInfo SQLExeption");
		}
		 
		return "jsonView";
	}
}
