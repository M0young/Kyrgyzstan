package egovframework.main.admin.code.type.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.main.admin.code.type.dao.TypeDAO;
import egovframework.main.admin.code.type.dto.TypeDTO;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("typeService")
public class TypeService extends EgovAbstractServiceImpl {
    
    @Resource(name = "typeDAO")
    private TypeDAO typeDAO;
    
    public int countType(TypeDTO typeDTO) {
        return typeDAO.countType(typeDTO);
    }
    
    public List<TypeDTO> selectPagedType(TypeDTO typeDTO) {
        return typeDAO.selectPagedType(typeDTO);
    }
    
    public void insertLandType(TypeDTO typeDTO) {
        typeDAO.insertLandType(typeDTO);
    }
    
    public void updateType(TypeDTO typeDTO) {
        typeDAO.updateType(typeDTO);
    }
    
    public void deleteType(int type_cd) {
        typeDAO.deleteType(type_cd);
    }
    
    public boolean isDuplicateTypeCode(int type_cd) {
        return typeDAO.countByTypeCode(type_cd) > 0;
    }

}
