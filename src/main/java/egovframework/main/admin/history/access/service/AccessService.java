package egovframework.main.admin.history.access.service;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.main.admin.history.access.dao.AccessDAO;
import egovframework.main.admin.history.access.dto.AccessDTO;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("accessService")
public class AccessService extends EgovAbstractServiceImpl {

    @Resource(name = "accessDAO")
    private AccessDAO accessDAO;
    
    public int countAccess(AccessDTO accessDTO) {
        return accessDAO.countAccess(accessDTO);
    }
    
    public List<AccessDTO> selectPagedAccess(AccessDTO accessDTO) {
        return accessDAO.selectPagedAccess(accessDTO);
    }
    
    public List<AccessDTO> selectChartData(Map<String, Object> params) {
        return accessDAO.selectChartData(params);
    }
    
    
}