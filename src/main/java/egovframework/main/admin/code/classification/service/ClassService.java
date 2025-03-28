package egovframework.main.admin.code.classification.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.main.admin.code.classification.dao.ClassDAO;
import egovframework.main.admin.code.classification.dto.ClassDTO;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
@Service("classService")
public class ClassService extends EgovAbstractServiceImpl {
    
    @Resource(name = "classDAO")
    private ClassDAO classDAO;
    
    public int countClass(ClassDTO classDTO) {
        return classDAO.countClass(classDTO);
    }
    
    public List<ClassDTO> selectPagedClass(ClassDTO classDTO) {
        return classDAO.selectPagedClass(classDTO);
    }
    
    public void insertLandClass(ClassDTO classDTO) throws Exception{
        int count = classDAO.countLandClassification(classDTO.getLclsf_cd());
        if(count > 0) {
            throw new Exception("\"The Land Use Classification record already exists. Please verify the classification code.\"");
        }
        classDAO.insertLandClass(classDTO);
    }
    
    public void updateClass(ClassDTO classDTO) {
    	classDAO.updateClass(classDTO);
    }
    
    public void deleteClass(int lclsf_cd) {
    	classDAO.deleteClass(lclsf_cd);
    }
    
    public boolean DuplicateClassCode(int lclsf_cd) {
    	return classDAO.countLandClassification(lclsf_cd) > 0;
    }
}