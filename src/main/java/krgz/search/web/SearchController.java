package krgz.search.web;

import java.io.IOException;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springmodules.validation.commons.DefaultBeanValidator;

import egovframework.rte.fdl.property.EgovPropertyService;
import egovframework.rte.ptl.mvc.tags.ui.pagination.PaginationInfo;
import krgz.search.service.SearchService;
import krgz.search.service.SearchVO;

/**
 * 
* <pre>
* 간략 : 검색 컨트롤러
* 상세 : 검색 컨트롤러
* krgz.search.web
*   |_ SearchController.java
* </pre>
* 
* @Company : EGIS
* @Author  : egis
* @Date    : 2024.03.18.
* @Version : 1.0
 */

@Controller
public class SearchController {
	
	/** EgovPropertyService */
	@Resource(name = "propertiesService")
	protected EgovPropertyService propertiesService;

	/** Validator */
	@Resource(name = "beanValidator")
	protected DefaultBeanValidator beanValidator;
	
	@Resource(name = "searchService")
	private SearchService searchService;
	
	/**
	 * 
	* <PRE>
	* 간략 : 행정구역 목록
	* 상세 : 행정구역 목록을 받아온다.
	* <PRE>
	* @param req
	* @return
	* @throws IOException
	 */
	@RequestMapping("/search/selectProvinceList.do")
	public String selectProvinceList(Model model, HttpServletRequest req) throws IOException {
		String search = req.getParameter("search") == null ? "" : req.getParameter("search");
		SearchVO vo = new SearchVO();
		vo.setPageUnit(20);
		vo.setPageSize(5);
		vo.setPageIndex(Integer.parseInt(req.getParameter("pageIndex")));
		vo.setSearch(search);
		
		/** pageing setting */
		PaginationInfo paginationInfo = new PaginationInfo();
		paginationInfo.setCurrentPageNo(vo.getPageIndex());
		paginationInfo.setRecordCountPerPage(vo.getPageUnit());
		paginationInfo.setPageSize(vo.getPageSize());
		
		vo.setFirstIndex(paginationInfo.getFirstRecordIndex());
		vo.setLastIndex(paginationInfo.getLastRecordIndex());
		vo.setRecordCountPerPage(paginationInfo.getRecordCountPerPage());

		List<?> list = searchService.selectProvinceList(vo);
		int count = searchService.selectProvinceListCnt(vo);
		paginationInfo.setTotalRecordCount(count);
		
		model.addAttribute("list", list);
		model.addAttribute("count", count);
		model.addAttribute("paginationInfo", paginationInfo);
		
		return "jsonView";
	}
}
