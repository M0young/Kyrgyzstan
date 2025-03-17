package egovframework.main.map.upload.progress.dao;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;
import egovframework.main.map.upload.progress.dto.ProgressDTO;

@Repository("progressDAO")
public class ProgressDAO extends EgovAbstractMapper {

	@Resource(name = "sqlSession")
	public void setSqlSessionFactory(SqlSessionFactory sqlSession) {
		super.setSqlSessionFactory(sqlSession);
	}
	
	public int insertProgress(ProgressDTO progressDTO) {
		return update("progressDAO.insertProgress", progressDTO);
	};
    
    public int updateProgress(ProgressDTO progressDTO) {
		return update("progressDAO.updateProgress", progressDTO);
	}
    
    public ProgressDTO selectProgress(String progressId) {
		return selectOne("progressDAO.selectProgress", progressId);
	}
    
    public int deleteOldProgress() {
		return delete("progressDAO.deleteOldProgress");
	}
}