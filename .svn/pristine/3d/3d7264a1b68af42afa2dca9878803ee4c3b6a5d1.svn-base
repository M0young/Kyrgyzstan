package egovframework.main.user.auth.dao;

import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;
import egovframework.rte.psl.dataaccess.EgovAbstractMapper;
import egovframework.main.user.auth.dto.AuthDTO;

@Repository("authDAO")
public class AuthDAO extends EgovAbstractMapper {
	
	@Resource(name = "sqlSession")
	public void setSqlSessionFactory(SqlSessionFactory sqlSession) {
		super.setSqlSessionFactory(sqlSession);
	}
	
	public AuthDTO selectUserByEmail(String email) {
        return selectOne("authDAO.selectUserByEmail", email);
    }
    
	public AuthDTO selectUserForAuth(String email) {
		return selectOne("authDAO.selectUserForAuth", email);
	}
	
    public List<String> selectAuthoritiesByGroup(int groupNo) {
        return selectList("authDAO.selectAuthoritiesByGroup", groupNo);
    }
    
    public int insertUserInfo(AuthDTO auth) {
        return insert("authDAO.insertUserInfo", auth);
    }
    
    public int updateLoginCount(AuthDTO auth) {
    	return update("authDAO.updateLoginCount", auth);
    }
    
    public int resetLoginCount(AuthDTO auth) {
    	return update("authDAO.resetLoginCount", auth);
    }
    
    public int updateTempPassword(AuthDTO auth) {
    	return update("authDAO.updateTempPassword", auth);
    }

    public int updatePassword(AuthDTO auth) {
        return update("authDAO.updatePassword", auth);
    }
}