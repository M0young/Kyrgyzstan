package egovframework.main.admin.code.subclass.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.main.admin.code.subclass.dao.SubClassDAO;
import egovframework.main.admin.code.subclass.dto.SubClassDTO;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("subclassService")
public class SubClassService extends EgovAbstractServiceImpl {
    
    @Resource(name = "subclassDAO")
    private SubClassDAO subclassDAO;
    
    public int countSubClass(SubClassDTO subclassDTO) {
        return subclassDAO.countSubClass(subclassDTO);
    }
    
    public List<SubClassDTO> selectPagedSubClass(SubClassDTO subclassDTO) {
        return subclassDAO.selectPagedSubClass(subclassDTO);
    }
    
    public int checkLandClassificationExistence(int lclsf_cd) {
        return subclassDAO.countLandClassification(lclsf_cd);
    }
    
    public void insertLandSubClass(SubClassDTO subclassDTO) throws Exception {
        subclassDAO.insertLandSubClass(subclassDTO);
    }
    
    
    public void updateSubClass(SubClassDTO subclassDTO) {
        subclassDAO.updateSubClass(subclassDTO);
    }
    
    public void deleteSubClass(int sclsf_cd) {
        subclassDAO.deleteSubClass(sclsf_cd);
    }
    
    public boolean DuplicateSubclassCode(int sclsf_cd) {
        return subclassDAO.countLandClassification(sclsf_cd) > 0;
    }
}
