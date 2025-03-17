package egovframework.main.admin.history.log.dao;

import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;

import egovframework.main.admin.history.log.dto.LogDTO;
import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("logDAO")
public class LogDAO extends EgovAbstractMapper {

    @Resource(name = "sqlSession")
    public void setSqlSessionFactory(SqlSessionFactory sqlSessionFactory) {
        super.setSqlSessionFactory(sqlSessionFactory);
    }
    
    public int countLogs(LogDTO logDTO) {
        return selectOne("logDAO.countLogs", logDTO);
    }
    
    public List<LogDTO> selectPagedLogs(LogDTO logDTO) {
        return selectList("logDAO.selectPagedLogs", logDTO);
    }
}
