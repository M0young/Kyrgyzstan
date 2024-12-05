package krgz.progress.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import krgz.progress.service.ProgressService;
import krgz.progress.service.ProgressVO;

@Service("progressService")
public class ProgressServiceImpl extends EgovAbstractServiceImpl implements ProgressService {

	@Resource(name="progressDAO")
	private ProgressDAO progressDAO;
	
	@Override
	public int insertProgress(ProgressVO progressVO) throws Exception {
		return progressDAO.insertProgress(progressVO);
	}
	   
	@Override
	public ProgressVO getProgress(String progressId) throws Exception {
		return progressDAO.selectProgress(progressId);
	}
	   
	@Override
	public List<ProgressVO> getProgressList(String usrNo) throws Exception {
		return progressDAO.selectProgressList(usrNo);
	}
	   
	@Override
	public int deleteOldProgress(String date) throws Exception {
		return progressDAO.deleteOldProgress(date);
	}
	
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public int updateProgress(ProgressVO progressVO) throws Exception {
		return progressDAO.updateProgress(progressVO);
	}
}
