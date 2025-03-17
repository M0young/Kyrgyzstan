package egovframework.main.map.symbol.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.main.map.symbol.dao.SymbolDAO;
import egovframework.main.map.symbol.dto.SymbolDTO;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("symbolService")
public class SymbolService extends EgovAbstractServiceImpl {
	
    @Resource(name="symbolDAO")
    private SymbolDAO symbolDAO;
    
    public List<SymbolDTO> selectSymbolList(String lang) {
        return symbolDAO.selectSymbolList(lang);
    }
    
    public SymbolDTO selectSymbolById(int symbolCd) {
        return symbolDAO.selectSymbolById(symbolCd);
    }
    
    public int insertSymbol(SymbolDTO symbolDTO) {
        return symbolDAO.insertSymbol(symbolDTO);
    }
    
    public int updateSymbol(SymbolDTO symbolDTO) {
        return symbolDAO.updateSymbol(symbolDTO);
    }
    
    public int removeSymbol(int symbolCd) {
        return symbolDAO.removeSymbol(symbolCd);
    }
}
