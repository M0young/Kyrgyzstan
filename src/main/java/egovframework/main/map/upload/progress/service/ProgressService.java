package egovframework.main.map.upload.progress.service;

import java.util.UUID;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import egovframework.main.map.upload.progress.service.ProgressService;
import egovframework.main.map.upload.progress.dao.ProgressDAO;
import egovframework.main.map.upload.progress.dto.ProgressDTO;

@Service("progressService")
public class ProgressService extends EgovAbstractServiceImpl {
	
	private static final Logger logger = LoggerFactory.getLogger(ProgressService.class);
	
	@Resource(name="progressDAO")
	private ProgressDAO progressDAO;
	
	@Resource(name = "progressService")
    private ProgressService progressService;
	
	public int insertProgress(ProgressDTO progressDTO) {
		return progressDAO.insertProgress(progressDTO);
	}
	
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public int updateProgress(ProgressDTO progressDTO) {
		return progressDAO.updateProgress(progressDTO);
	}
	
    public ProgressDTO initializeProgress(int userNo) {
        ProgressDTO progressDTO = new ProgressDTO();
        progressDTO.setPrgrs_id(UUID.randomUUID().toString());
        progressDTO.setPrgrs(0);
        progressDTO.setCmptn_rcd(0);
        progressDTO.setCmptn_yn("N");
        progressDTO.setStts("INITIALIZING");
        
        try {
	        this.insertProgress(progressDTO);
	    } catch (Exception e) {
	        logger.error("Failed to initailize progress: {}", e.getMessage());
	    }
        
        return progressDTO;
    }
    
    public void handleProgressStatus(ProgressDTO progressDTO, String status, Exception e) {
        switch(status) {
            case "INITIALIZING":
                progressDTO.setPrgrs(0);
                progressDTO.setStts("INITIALIZING");
                break;
                
            case "PARSING":
                progressDTO.setStts("PARSING");
                break;
                
            case "PROCESSING":
                progressDTO.setStts("PROCESSING");
                break;
                
            case "COMPLETED":
                progressDTO.setPrgrs(100);
                progressDTO.setCmptn_yn("Y");
                progressDTO.setStts("COMPLETED");
                break;
                
            case "ERROR":
                String errMsg = "Error occurred while processing records: " + e.getMessage();
                progressDTO.setErr_msg(errMsg);
                progressDTO.setCmptn_yn("N");
                progressDTO.setStts("ERROR");
                break;
        }
        
        try {
        	progressService.updateProgress(progressDTO);
        } catch (Exception ex) {
            logger.error("Failed to update status: {}", ex.getMessage());
        }
    }
    
	public void updateProgressCount(ProgressDTO progressDTO, int processedCount, int totalRecords) {
	    progressDTO.setCmptn_rcd(processedCount);
	    progressDTO.setTnocs_rcd(totalRecords);
	    int progress = (int) Math.round((double) processedCount / totalRecords * 100);
	    progressDTO.setPrgrs(progress);
	    try {
	    	progressService.updateProgress(progressDTO);
	    } catch (Exception e) {
	        logger.error("Failed to update progress: {}", e.getMessage());
	    }
	}
	
	public ProgressDTO getProgress(String progressId) {
		return progressDAO.selectProgress(progressId);
	}
	
	@Scheduled(cron = "0 0 3 * * *")
	public int cleanupOldProgress() {
	    logger.info("Running scheduled cleanup of old progress data");
	    int deletedCount = progressDAO.deleteOldProgress();
	    logger.info("Deleted {} old progress records", deletedCount);
	    return deletedCount;
	}
}
