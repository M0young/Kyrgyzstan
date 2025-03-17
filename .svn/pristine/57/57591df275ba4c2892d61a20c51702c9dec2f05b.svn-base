package egovframework.main.admin.code.classification.dao;

import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;

import egovframework.main.admin.code.classification.dto.ClassDTO;
import egovframework.rte.psl.dataaccess.EgovAbstractMapper;
@Repository("classDAO")
public class ClassDAO extends EgovAbstractMapper {


    @Resource(name = "sqlSession")
    public void setSqlSessionFactory(SqlSessionFactory sqlSessionFactory) {
        super.setSqlSessionFactory(sqlSessionFactory);
    }
    
    public int countClass(ClassDTO classDTO) {
        return selectOne("classDAO.countClass", classDTO);
    }
    
    public List<ClassDTO> selectPagedClass(ClassDTO classDTO) {
        return selectList("classDAO.selectPagedClass", classDTO);
    }
    
    public void insertLandClass(ClassDTO classDTO) {
        insert("classDAO.insertLandClass", classDTO);
    }
    
    public int updateClass(ClassDTO classDTO) {
        return update("classDAO.updateClass", classDTO);
    }
    
    public int deleteClass(int lclsf_cd) {
        return update("classDAO.deleteClass", lclsf_cd);
    }
    
    public int countLandClassification(int lclsf_cd) {
        return selectOne("classDAO.countLandClassification", lclsf_cd);
    }
}
