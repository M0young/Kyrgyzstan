package krgz.adm.grp.service.impl;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;
import krgz.adm.grp.service.AdmGrpVO;

@Repository("AdmGrpDAO")
public class AdmGrpDAO extends EgovAbstractMapper {

	@Resource(name = "sqlSession")
	public void setSqlSessionFactory(SqlSessionFactory sqlSession) {
		super.setSqlSessionFactory(sqlSession);
	}

	public List<AdmGrpVO> selectGrpList() {
		return selectList("AdmGrpDAO.selectGrpList");
	}
	
	public int selectGrpCount() {
		return selectOne("AdmGrpDAO.selectGrpCount");
	}
	
	public int selectGrpInfoUsrCount(AdmGrpVO AdmGrpVO) {
		return selectOne("AdmGrpDAO.selectGrpInfoUsrCount", AdmGrpVO);
	}
	
	public int countByGrpId(HashMap<String, String> map) {
		return selectOne("AdmGrpDAO.countByGrpId", map);
	}
	
	public int countByGrpNm(HashMap<String, String> map) {
		return selectOne("AdmGrpDAO.countByGrpNm", map);
	}
	
	public int insertGrpInfo(HashMap<String, String> map) {
		return insert("AdmGrpDAO.insertGrpInfo", map);
	}
	
	public int updateGrpStat(HashMap<String, String> map) {
		return update("AdmGrpDAO.updateGrpStat", map);
	}
	
	public int updateGrpInfo(HashMap<String, String> map) {
		return update("AdmGrpDAO.updateGrpInfo", map);
	}
	
	public int deleteGrpInfo(HashMap<String, String> map) {
		return delete("AdmGrpDAO.deleteGrpInfo", map);
	}
}