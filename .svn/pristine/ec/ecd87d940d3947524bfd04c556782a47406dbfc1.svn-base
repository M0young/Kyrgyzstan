package egovframework.main.map.region.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import egovframework.rte.ptl.mvc.tags.ui.pagination.PaginationInfo;
import egovframework.main.map.region.service.RegionService;
import egovframework.main.map.region.dto.RegionDTO;
import egovframework.common.response.ApiResponse;

@RestController
@RequestMapping("/region")
public class RegionController {
    
    @Resource(name = "regionService")
    private RegionService regionService;
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Map<String, Object>>> searchRegion(
            @RequestParam String search, @RequestParam String lang,
            @RequestParam int pageIndex, @RequestParam int pageUnit) {
        try {
            RegionDTO regionDTO = new RegionDTO();
            regionDTO.setSearch(search);
            regionDTO.setLang(lang);
            regionDTO.setPageIndex(pageIndex);
            regionDTO.setPageUnit(pageUnit);
            regionDTO.setPageSize(5);
            
            PaginationInfo paginationInfo = new PaginationInfo();
            paginationInfo.setCurrentPageNo(regionDTO.getPageIndex());
            paginationInfo.setRecordCountPerPage(regionDTO.getPageUnit());
            paginationInfo.setPageSize(regionDTO.getPageSize());
            
            regionDTO.setFirstIndex(paginationInfo.getFirstRecordIndex());
            
            // 전체 데이터 수 조회
            int totalCount = regionService.selectRegionListCount(regionDTO);
            paginationInfo.setTotalRecordCount(totalCount);
            
            // 목록 데이터 조회
            List<?> list = regionService.selectRegionList(regionDTO);
            
            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("list", list);
            resultMap.put("count", totalCount);
            resultMap.put("paginationInfo", paginationInfo);
            
            return ApiResponse.success(resultMap);
            
        } catch (Exception e) {
            return ApiResponse.error("검색 중 오류가 발생했습니다.");
        }
    }
}
