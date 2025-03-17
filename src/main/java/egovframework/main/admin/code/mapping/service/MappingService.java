package egovframework.main.admin.code.mapping.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.main.admin.code.mapping.dao.MappingDAO;
import egovframework.main.admin.code.mapping.dto.MappingDTO;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("mappingService")
public class MappingService extends EgovAbstractServiceImpl {
    
    @Resource(name = "mappingDAO")
    private MappingDAO mappingDAO;
    
    public int countMapping(MappingDTO mappingDTO) {
        return mappingDAO.countMapping(mappingDTO);
    }
    
    public List<MappingDTO> selectClassificationList(MappingDTO mappingDTO) {
        return mappingDAO.selectClassificationList(mappingDTO);
    }
    
    public List<MappingDTO> selectSubClassificationList(MappingDTO mappingDTO) {
        return mappingDAO.selectSubClassificationList(mappingDTO);
    }
    
    public int updateSubclassification(MappingDTO mapping) {
        return mappingDAO.updateSubclassification(mapping);
    }
}
