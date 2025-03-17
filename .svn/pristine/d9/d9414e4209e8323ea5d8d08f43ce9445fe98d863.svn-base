package egovframework.main.user.activity.dao;

import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;

import egovframework.main.user.activity.dto.ActivityDTO;
import egovframework.rte.psl.dataaccess.EgovAbstractMapper;

@Repository("activityDAO")
public class ActivityDAO extends EgovAbstractMapper {
	
	@Resource(name = "sqlSession")
	public void setSqlSessionFactory(SqlSessionFactory sqlSession) {
		super.setSqlSessionFactory(sqlSession);
	}
	
	public int insertUserLog(ActivityDTO activity) {
		return insert("activityDAO.insertUserLog", activity);
	}
	
	public List<ActivityDTO> selectUsrLogList(ActivityDTO activity) {
		return selectList("activityDAO.selectUsrLogList", activity);
	}
}
