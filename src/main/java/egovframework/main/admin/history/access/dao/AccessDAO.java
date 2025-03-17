package egovframework.main.admin.history.access.dao;

import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;

import egovframework.main.admin.history.access.dto.AccessDTO;
import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("accessDAO")
public class AccessDAO extends EgovAbstractMapper {

    @Resource(name = "sqlSession")
    public void setSqlSessionFactory(SqlSessionFactory sqlSessionFactory) {
        super.setSqlSessionFactory(sqlSessionFactory);
    }
    
    public int countAccess(AccessDTO accessDTO) {
        return selectOne("accessDAO.countAccess", accessDTO);
    }
    
    public List<AccessDTO> selectPagedAccess(AccessDTO accessDTO) {
        return selectList("accessDAO.selectPagedAccess", accessDTO);
    }
}
