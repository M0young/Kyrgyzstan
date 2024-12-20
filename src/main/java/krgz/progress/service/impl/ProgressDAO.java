package krgz.progress.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;
import krgz.progress.service.ProgressVO;

@Repository("progressDAO")
public class ProgressDAO extends EgovAbstractMapper {

	@Resource(name = "sqlSession")
	public void setSqlSessionFactory(SqlSessionFactory sqlSession) {
		super.setSqlSessionFactory(sqlSession);
	}
	
	public int insertProgress(ProgressVO progressVO) {
		return update("progressDAO.insertProgress", progressVO);
	};
    
    // 진행상황 업데이트
    public int updateProgress(ProgressVO progressVO) {
		return update("progressDAO.updateProgress", progressVO);
	}
    
    // 진행상황 조회
    public ProgressVO selectProgress(String progressId) {
		return selectOne("progressDAO.selectProgress", progressId);
	}
    
    // 사용자별 진행상황 목록 조회
    public List<ProgressVO> selectProgressList(String userNo) {
		return selectList("progressDAO.selectProgressList", userNo);
	}
    
    // 완료된 오래된 데이터 삭제
    public int deleteOldProgress(String date) {
		return delete("progressDAO.deleteOldProgress", date);
	}
    
}