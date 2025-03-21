package egovframework.main.map.region.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import egovframework.main.map.region.dao.RegionDAO;
import egovframework.main.map.region.dto.RegionDTO;

@Service("regionService")
public class RegionService extends EgovAbstractServiceImpl {

	@Resource(name="regionDAO")
	private RegionDAO regionDAO;

	public List<?> selectRegionList(RegionDTO regionDTO) {
		return regionDAO.selectRegionList(regionDTO);
	}

	public int selectRegionListCount(RegionDTO regionDTO) {
		return regionDAO.selectRegionListCount(regionDTO);
	}
}
