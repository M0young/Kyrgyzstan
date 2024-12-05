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
package krgz.adm.grp.web;

import java.util.HashMap;
import java.util.List;
import java.util.Properties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springmodules.validation.commons.DefaultBeanValidator;

import egovframework.rte.fdl.property.EgovPropertyService;
import egovframework.rte.ptl.mvc.tags.ui.pagination.PaginationInfo;
import krgz.adm.grp.service.AdmGrpService;
import krgz.adm.grp.service.AdmGrpVO;

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
* @Date    : 2024. 4. 13.
* @Version : 1.0
 */

@Controller
public class AdmGrpController {
	protected Logger logger = LoggerFactory.getLogger(this.getClass());
	/** EgovPropertyService */
	@Resource(name = "propertiesService")
	protected EgovPropertyService propertiesService;

	/** Validator */
	@Resource(name = "beanValidator")
	protected DefaultBeanValidator beanValidator;
	
	@Resource(name = "globalProperties")
	protected Properties globalProperties;
	
	@Resource(name = "AdmGrpService")
	private AdmGrpService AdmGrpService;
	
	/**
	 * 
	* <PRE>
	* 간략 : 관리자그룹
	* 상세 : 관리자그룹
	* <PRE>
	* @param model
	* @param map
	* @return
	 */
	@RequestMapping(value="/adm/selectGrpList.do")
	public String selectGrpList(HttpServletRequest request, Model model) throws Exception {
		
		AdmGrpVO agvo = new AdmGrpVO();
		agvo.setPageUnit(15);
		agvo.setPageSize(5);
		agvo.setPageIndex(Integer.parseInt(request.getParameter("pageIndex")));
		
		/** pageing setting */
		PaginationInfo paginationInfo = new PaginationInfo();
		paginationInfo.setCurrentPageNo(agvo.getPageIndex());
		paginationInfo.setRecordCountPerPage(agvo.getPageUnit());
		paginationInfo.setPageSize(agvo.getPageSize());
		
		agvo.setFirstIndex(paginationInfo.getFirstRecordIndex());
		agvo.setLastIndex(paginationInfo.getLastRecordIndex());
		agvo.setRecordCountPerPage(paginationInfo.getRecordCountPerPage());

		List<?> list = AdmGrpService.selectGrpList();
		int count = AdmGrpService.selectGrpCount();
		paginationInfo.setTotalRecordCount(count);
		
		model.addAttribute("list", list);
		model.addAttribute("count", count);
		model.addAttribute("paginationInfo", paginationInfo);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/adm/selectGrpInfoUsrCount.do")
	public String selectUsrLogList(HttpServletRequest request, Model model) throws Exception {
		String grpId = request.getParameter("grpId") == null ? "" : request.getParameter("grpId");
		AdmGrpVO agvo = new AdmGrpVO();
		agvo.setGrp_id(grpId);
		int count = AdmGrpService.selectGrpInfoUsrCount(agvo);
		
		model.addAttribute("count", count);
		
		return "jsonView";
	}
	
	@RequestMapping(value="/adm/insertGrpInfo.do",method=RequestMethod.POST)
	public String insertGrpInfo(@RequestParam HashMap<String,String> map,Model model,HttpServletRequest request) throws Exception{
		
		try {
	        if (AdmGrpService.countByGrpId(map) > 0) {
	            model.addAttribute("rs", "DI");
	            return "jsonView";
	        }
	        if (AdmGrpService.countByGrpNm(map) > 0) {
	            model.addAttribute("rs", "DN");
	            return "jsonView";
	        }

	        int rs = AdmGrpService.insertGrpInfo(map);
	        model.addAttribute("rs", rs == 1 ? "DONE" : "ERROR");
	    } catch (Exception e) {
	        model.addAttribute("rs", "ERROR");
	    }
		
		return "jsonView";
	}
	
	@RequestMapping(value="/adm/updateGrpStat.do",method=RequestMethod.POST)
	public String updateGrpStat(@RequestParam HashMap<String,String> map,Model model,HttpServletRequest request) throws Exception{
		
		int rs = AdmGrpService.updateGrpStat(map);
		
		if(rs == 1) {
			model.addAttribute("rs", "DONE");
		}else {
			model.addAttribute("rs", "ERROR");
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/adm/updateGrpInfo.do",method=RequestMethod.POST)
	public String updateGrpInfo(@RequestParam HashMap<String,String> map,Model model,HttpServletRequest request) throws Exception{
		
		int rs = AdmGrpService.updateGrpInfo(map);
		
		if(rs == 1) {
			model.addAttribute("rs", "DONE");
		}else {
			model.addAttribute("rs", "ERROR");
		}
		
		return "jsonView";
	}
	
	@RequestMapping(value="/adm/deleteGrpInfo.do",method=RequestMethod.POST)
	public String deleteGrpInfo(@RequestParam HashMap<String,String> map,Model model,HttpServletRequest request) throws Exception{
		
		int rs = AdmGrpService.deleteGrpInfo(map);
		
		if(rs == 1) {
			model.addAttribute("rs", "DONE");
		}else {
			model.addAttribute("rs", "ERROR");
		}
		
		return "jsonView";
	}
}
