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
    
    public void insertLandSubClass(SubClassDTO subclassDTO) throws Exception {
        // 대분류(Land Use Classification) 레코드 존재 여부 확인
        int count = subclassDAO.countLandClassification(subclassDTO.getLclsf_cd());
        if(count == 0) {
            throw new Exception("\"Land Use Classification record does not exist. Please check the classification code.\"");
        }
        
        // 중분류(land_sclsf) 레코드 삽입
        subclassDAO.insertLandSubClass(subclassDTO);
    }
    
    
    public void updateSubClass(SubClassDTO subclassDTO) {
        subclassDAO.updateSubClass(subclassDTO);
    }
    
    public void deleteSubClass(int sclsf_cd) {
        subclassDAO.deleteSubClass(sclsf_cd);
    }
}
