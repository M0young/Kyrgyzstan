package egovframework.main.admin.code.type.dao;

import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;

import egovframework.main.admin.code.type.dto.TypeDTO;
import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("typeDAO")
public class TypeDAO extends EgovAbstractMapper {

    @Resource(name = "sqlSession")
    public void setSqlSessionFactory(SqlSessionFactory sqlSessionFactory) {
        super.setSqlSessionFactory(sqlSessionFactory);
    }
    
    public int countType(TypeDTO typeDTO) {
        return selectOne("typeDAO.countType", typeDTO);
    }
    
    public List<TypeDTO> selectPagedType(TypeDTO typeDTO) {
        return selectList("typeDAO.selectPagedType", typeDTO);
    }
    
    public void insertLandType(TypeDTO typeDTO) {
        insert("typeDAO.insertLandType", typeDTO);
    }
    
    public int updateType(TypeDTO typeDTO) {
        return update("typeDAO.updateType", typeDTO);
    }
    
    public int deleteType(int type_cd) {
        return update("typeDAO.deleteType", type_cd);
    }
}
