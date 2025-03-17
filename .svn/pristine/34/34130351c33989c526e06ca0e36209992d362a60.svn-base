package egovframework.main.map.symbol.dao;

import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;
import egovframework.main.map.symbol.dto.SymbolDTO;

@Repository("symbolDAO")
public class SymbolDAO extends EgovAbstractMapper {
	
    @Resource(name = "sqlSession")
    public void setSqlSessionFactory(SqlSessionFactory sqlSession) {
        super.setSqlSessionFactory(sqlSession);
    }
    
    public List<SymbolDTO> selectSymbolList(String lang) {
        return selectList("symbolDAO.selectSymbolList", lang);
    }
    
    public SymbolDTO selectSymbolById(int symbolCd) {
        return selectOne("symbolDAO.selectSymbolById", symbolCd);
    }
    
    public int insertSymbol(SymbolDTO symbolDTO) {
        return insert("symbolDAO.insertSymbol", symbolDTO);
    }
    
    public int updateSymbol(SymbolDTO symbolDTO) {
        return update("symbolDAO.updateSymbol", symbolDTO);
    }
    
    public int removeSymbol(int symbolCd) {
        return update("symbolDAO.removeSymbol", symbolCd);
    }
}