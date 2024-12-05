/**
 * 
 */
package krgz.log.service.impl;

import java.sql.SQLException;
import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;

import krgz.log.service.LogTrackerVO;
import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

/**
 * LogTrackerDAO.java
 * krgz
 * 2024. 3. 29.
 * @author 오영진
 * @Comment
 *
 */
@Repository("LogTrackerDAO")
public class LogTrackerDAO extends EgovAbstractMapper {
	
	@Resource(name = "sqlSession")
	public void setSqlSessionFactory(SqlSessionFactory sqlSession) {
		super.setSqlSessionFactory(sqlSession);
	}
	
	public int insertLogTracker(LogTrackerVO LogTrackerVO) throws SQLException {
		return insert("LogTrackerDAO.insertLogTracker", LogTrackerVO);
	}
	
	public List<LogTrackerVO> selectUsrLogList(LogTrackerVO LogTrackerVO) {
		return selectList("LogTrackerDAO.selectUsrLogList", LogTrackerVO);
	}
}
