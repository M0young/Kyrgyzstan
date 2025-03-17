package egovframework.main.admin.user.dao;

import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;

import egovframework.main.admin.user.dto.AdminDTO;
import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("adminDAO")
public class AdminDAO extends EgovAbstractMapper {
    
    @Resource(name = "sqlSession")
    public void setSqlSessionFactory(SqlSessionFactory sqlSession) {
        super.setSqlSessionFactory(sqlSession);
    }
    
    public int countAllUsers(AdminDTO adminDTO) {
        return selectOne("adminDAO.countAllUsers", adminDTO);
    }
    
    public List<AdminDTO> selectPagedUsers(AdminDTO adminDTO) {
        return selectList("adminDAO.selectPagedUsers", adminDTO);
    }
    
    public int updateUser(AdminDTO user) {
        int rowsAffected = update("adminDAO.updateUser", user);
        return rowsAffected;
    }
    
    public int deleteUser(String eml) {
        return update("adminDAO.deleteUser", eml);
    }
    

    
    public List<AdminDTO> selectUserGroups() {
    	return selectList("adminDAO.selectUserGroups");
    }
}