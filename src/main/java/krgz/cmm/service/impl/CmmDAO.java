package krgz.cmm.service.impl;

import org.springframework.stereotype.Repository;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;
import krgz.cmm.service.CmmVO;

@Repository("CmmDAO")
public class CmmDAO extends EgovAbstractMapper {

	public int getTest(CmmVO CmmVO){
		// TODO Auto-generated method stub
		return selectOne("CmmDAO.getTest", CmmVO);
	}
}