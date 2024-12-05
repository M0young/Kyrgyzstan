package krgz.progress.service;

import java.util.List;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

public interface ProgressService {
	
    public int insertProgress(ProgressVO progressVO) throws Exception;
    
    public ProgressVO getProgress(String progressId) throws Exception;
    
    public List<ProgressVO> getProgressList(String usrNo) throws Exception;
    
    public int deleteOldProgress(String date) throws Exception;
    
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public int updateProgress(ProgressVO progressVO) throws Exception;
}
