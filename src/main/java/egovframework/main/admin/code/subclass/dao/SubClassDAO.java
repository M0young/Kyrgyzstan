package egovframework.main.admin.code.subclass.dao;

import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;

import egovframework.main.admin.code.subclass.dto.SubClassDTO;
import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("subclassDAO")
public class SubClassDAO extends EgovAbstractMapper {

    @Resource(name = "sqlSession")
    public void setSqlSessionFactory(SqlSessionFactory sqlSessionFactory) {
        super.setSqlSessionFactory(sqlSessionFactory);
    }
    
    public int countSubClass(SubClassDTO subclassDTO) {
        return selectOne("subclassDAO.countSubClass", subclassDTO);
    }
    
    public List<SubClassDTO> selectPagedSubClass(SubClassDTO subclassDTO) {
        return selectList("subclassDAO.selectPagedSubClass", subclassDTO);
    }
    
    public void insertLandSubClass(SubClassDTO subclassDTO) {
        insert("subclassDAO.insertSubLandClass", subclassDTO);
    }
    
    public int updateSubClass(SubClassDTO subclassDTO) {
        return update("subclassDAO.updateSubClass", subclassDTO);
    }
    
    public int deleteSubClass(int sclsf_cd) {
        return update("subclassDAO.deleteSubClass", sclsf_cd);
    }
    
    public int countLandClassification(int lclsf_cd) {
        return selectOne("subclassDAO.countLandClassification", lclsf_cd);
    }
    
    public void insertLandClassification(int lclsf_cd) {
        insert("subclassDAO.insertLandClassification", lclsf_cd);
    }
}
