/**
 * 
 */
package krgz.log.service.impl;

import java.sql.SQLException;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import krgz.log.service.LogTrackerService;
import krgz.log.service.LogTrackerVO;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * LogTrackerServiceImpl.java
 * krgz
 * 2024. 3. 29.
 * @author 오영진
 * @Comment
 *
 */
@Service("LogTrackerService")
public class LogTrackerServiceImpl extends EgovAbstractServiceImpl implements LogTrackerService {
	
	@Resource(name="LogTrackerDAO")
	
	private LogTrackerDAO LogTrackerDAO;

	@Override
	public int insertLogTracker(LogTrackerVO LogTrackerVO) throws SQLException {
		return LogTrackerDAO.insertLogTracker(LogTrackerVO);
	}
	
	@Override
	public List<LogTrackerVO> selectUsrLogList(LogTrackerVO LogTrackerVO) {
		return LogTrackerDAO.selectUsrLogList(LogTrackerVO);
	}

}
