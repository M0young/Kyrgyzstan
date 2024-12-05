/**
 * 
 */
package krgz.log.service;

import java.sql.SQLException;
import java.util.List;

/**
 * LogTrackerService.java
 * krgz
 * 2024. 3. 29.
 * @author 오영진
 * @Comment
 *
 */
public interface LogTrackerService {
	
	public int insertLogTracker(LogTrackerVO LogTrackerVO) throws SQLException; 
	
	public List<LogTrackerVO> selectUsrLogList(LogTrackerVO LogTrackerVO);
	
}
