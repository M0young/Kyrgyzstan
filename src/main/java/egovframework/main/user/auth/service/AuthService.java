package egovframework.main.user.auth.service;

import java.util.List;
import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import egovframework.main.user.auth.service.PasswordService;
import egovframework.main.user.auth.dao.AuthDAO;
import egovframework.main.user.auth.dto.AuthDTO;

@Service("authService")
public class AuthService extends EgovAbstractServiceImpl {
   
	@Resource(name = "authDAO")
	private AuthDAO authDAO;

	@Resource(name = "passwordService")
	private PasswordService passwordService;

	public AuthDTO selectUserByEmail(String email) {
		return authDAO.selectUserByEmail(email);
	}

	public AuthDTO selectUserForAuth(String email) {
		return authDAO.selectUserForAuth(email);
	}

	public List<String> selectAuthoritiesByGroup(int groupNo) {
		return authDAO.selectAuthoritiesByGroup(groupNo);
	}
	
	public int insertUserInfo(AuthDTO auth) {
		String encodedPassword = passwordService.encryptPassword(auth.getPwd());
		auth.setPwd(encodedPassword);
		return authDAO.insertUserInfo(auth);
	}

	public int updateLoginCount(AuthDTO auth) {
		return authDAO.updateLoginCount(auth);
	}

	public int resetLoginCount(AuthDTO auth) {
		return authDAO.resetLoginCount(auth);
	}
	
	public int updateTempPassword(AuthDTO auth) {
		String encodedPassword = passwordService.encryptPassword(auth.getPwd());
		auth.setPwd(encodedPassword);
		return authDAO.updateTempPassword(auth);
	}

	public int updatePassword(AuthDTO auth) {
		String encodedPassword = passwordService.encryptPassword(auth.getPwd());
		auth.setPwd(encodedPassword);
		return authDAO.updatePassword(auth);
	}
	
}