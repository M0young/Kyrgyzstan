package egovframework.main.user.activity.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.main.user.activity.dao.ActivityDAO;
import egovframework.main.user.activity.service.ActivityService;
import egovframework.main.user.activity.dto.ActivityDTO;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("activityService")
public class ActivityService extends EgovAbstractServiceImpl {
	
	@Resource(name="activityDAO")
	private ActivityDAO activityDAO;

	public int insertUserLog(ActivityDTO activity) {
		return activityDAO.insertUserLog(activity);
	}
	
	public List<ActivityDTO> selectUsrLogList(ActivityDTO activity) {
		return activityDAO.selectUsrLogList(activity);
	}

}
