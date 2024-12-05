package krgz.adm.usr.service.impl;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;
import krgz.usr.service.UsrVO;

@Repository("AdmUsrDAO")
public class AdmUsrDAO extends EgovAbstractMapper {

	@Resource(name = "sqlSession")
	public void setSqlSessionFactory(SqlSessionFactory sqlSession) {
		super.setSqlSessionFactory(sqlSession);
	}
	
	public List<UsrVO> selectUsrList(UsrVO UsrVO) {
		return selectList("AdmUsrDAO.selectUsrList", UsrVO);
	}
	
	public int selectUsrCount(UsrVO UsrVO) {
		return selectOne("AdmUsrDAO.selectUsrCount", UsrVO);
	}
	
	public int updateAdmUsrInfo(HashMap<String, String> map) {
		return update("AdmUsrDAO.updateAdmUsrInfo", map);
	}

}