package egovframework.main.admin.code.mapping.dao;

import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;

import egovframework.main.admin.code.mapping.dto.MappingDTO;
import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("mappingDAO")
public class MappingDAO extends EgovAbstractMapper {

    @Resource(name = "sqlSession")
    public void setSqlSessionFactory(SqlSessionFactory sqlSessionFactory) {
        super.setSqlSessionFactory(sqlSessionFactory);
    }
    
    public int countMapping(MappingDTO mappingDTO) {
        return selectOne("mappingDAO.countMapping", mappingDTO);
    }
    
    public List<MappingDTO> selectClassificationList(MappingDTO mappingDTO) {
        return selectList("mappingDAO.selectClassificationList", mappingDTO);
    }
    
    public List<MappingDTO> selectSubClassificationList(MappingDTO mappingDTO) {
        return selectList("mappingDAO.selectSubClassificationList", mappingDTO);
    }
    
    public int updateSubclassification(MappingDTO mapping) {
    	return update("mappingDAO.updateSubclassification", mapping);
    }
}
