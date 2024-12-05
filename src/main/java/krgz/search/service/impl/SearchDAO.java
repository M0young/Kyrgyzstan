package krgz.search.service.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;
import krgz.search.service.SearchVO;

@Repository("searchDAO")
public class SearchDAO extends EgovAbstractMapper {

	public List<?> selectProvinceList(SearchVO vo) {
		return selectList("searchDAO.selectProvinceList", vo);
	}

	public int selectProvinceListCnt(SearchVO vo) {
		return (int) selectOne("searchDAO.selectProvinceListCnt", vo);
	}
}