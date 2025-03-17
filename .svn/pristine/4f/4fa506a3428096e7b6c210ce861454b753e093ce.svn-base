package egovframework.main.map.layer.dao;

import java.util.List;

import javax.annotation.Resource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;
import egovframework.rte.psl.dataaccess.EgovAbstractMapper;
import egovframework.main.map.layer.dto.LayerDTO;

@Repository("layerDAO")
public class LayerDAO extends EgovAbstractMapper {
	
    @Resource(name = "sqlSession")
    public void setSqlSessionFactory(SqlSessionFactory sqlSession) {
        super.setSqlSessionFactory(sqlSession);
    }
    
    public List<LayerDTO> selectLanduseClassifications(String lang) {
        return selectList("layerDAO.selectLanduseClassifications", lang);
    }
    
    public List<LayerDTO> selectLandtypeClassifications(String lang) {
        return selectList("layerDAO.selectLandtypeClassifications", lang);
    }
    
    public List<LayerDTO> selectFieldLabelList(String lang) {
        return selectList("layerDAO.selectFieldLabelList", lang);
    }
    
    public List<LayerDTO> selectLandTypeList(String lang) {
        return selectList("layerDAO.selectLandTypeList", lang);
    }
    
    public List<LayerDTO> selectLandSymbolList(String lang) {
        return selectList("layerDAO.selectLandSymbolList", lang);
    }
    
    public List<LayerDTO> selectLandLclsfList(String lang) {
        return selectList("layerDAO.selectLandLclsfList", lang);
    }
    
    public List<LayerDTO> selectLandSclsfList(String lang) {
        return selectList("layerDAO.selectLandSclsfList", lang);
    }
}