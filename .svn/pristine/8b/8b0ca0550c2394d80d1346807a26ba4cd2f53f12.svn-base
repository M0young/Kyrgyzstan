package egovframework.main.map.region.dao;

import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;
import egovframework.main.map.region.dto.RegionDTO;

@Repository("regionDAO")
public class RegionDAO extends EgovAbstractMapper {

	@Resource(name = "sqlSession")
	public void setSqlSessionFactory(SqlSessionFactory sqlSession) {
		super.setSqlSessionFactory(sqlSession);
	}
	
	public List<?> selectRegionList(RegionDTO regionDTO) {
		return selectList("regionDAO.selectRegionList", regionDTO);
	}

	public int selectRegionListCount(RegionDTO regionDTO) {
		return selectOne("regionDAO.selectRegionListCount", regionDTO);
	}
}