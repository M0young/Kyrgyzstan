package krgz.usr.service.impl;

import java.util.HashMap;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;
import krgz.usr.service.UsrVO;

@Repository("UsrDAO")
public class UsrDAO extends EgovAbstractMapper {

	@Resource(name = "sqlSession")
	public void setSqlSessionFactory(SqlSessionFactory sqlSession) {
		super.setSqlSessionFactory(sqlSession);
	}
	
	public int selectUsrId(String id) {
		return selectOne("UsrDAO.selectUsrId", id);
	}
	
	public int selectEml(String eml) {
		return selectOne("UsrDAO.selectEml", eml);
	}
	
	public UsrVO selectUsrInfo(UsrVO UsrVO) {
		return selectOne("UsrDAO.selectUsrInfo", UsrVO);
	}
	
	public int insertUsrInfo(HashMap<String, String> map) {
		return insert("UsrDAO.insertUsrInfo", map);
	}
	
	public int updateUsrInfo(UsrVO UsrVO) {
		return update("UsrDAO.updateUsrInfo",UsrVO);
	}
	
	public int deleteUsrInfo(String id) {
		return delete("UsrDAO.deleteUsrInfo", id);
	}
	
	public HashMap<String, Object> checkLogin(HashMap<String, String> map){
		return selectOne("UsrDAO.checkLogin", map);
	}
	
	public HashMap<String, Object> selectFindUsrId(HashMap<String, String> map) {
		return selectOne("UsrDAO.selectFindUsrId", map);
	}
	
	public int selectFindPwd(UsrVO UsrVO) {
		return selectOne("UsrDAO.selectFindPwd", UsrVO);
	}
	
	public int updateUsrPw(UsrVO UsrVO) {
		return update("UsrDAO.updateUsrPw",UsrVO);
	}
	
	public int updateLoginCount(UsrVO UsrVO) {
		return update("UsrDAO.updateLoginCount",UsrVO);
	}
	
	public int resetLoginCount(UsrVO UsrVO) {
		return update("UsrDAO.resetLoginCount",UsrVO);
	}
	
	public int updateUsrLoginDate(UsrVO UsrVO) {
		return update("UsrDAO.updateUsrLoginDate", UsrVO);
	}
}