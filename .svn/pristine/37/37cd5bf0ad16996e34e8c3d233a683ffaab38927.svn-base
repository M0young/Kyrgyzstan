package egovframework.main.admin.history.log.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.main.admin.history.log.dao.LogDAO;
import egovframework.main.admin.history.log.dto.LogDTO;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("logService")
public class LogService extends EgovAbstractServiceImpl {
	
	@Resource(name = "logDAO")
	private LogDAO logDAO;

    public int countLogs(LogDTO logDTO) {
        return logDAO.countLogs(logDTO);
    }

    public List<LogDTO> selectPagedLogs(LogDTO logDTO) {
        return logDAO.selectPagedLogs(logDTO);
    }
}