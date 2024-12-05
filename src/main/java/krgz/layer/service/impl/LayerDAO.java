package krgz.layer.service.impl;

import java.sql.SQLException;
import java.util.Map;
import javax.annotation.Resource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;
import egovframework.rte.psl.dataaccess.EgovAbstractMapper;
import krgz.layer.service.LayerVO;

@Repository("layerDAO")
public class LayerDAO extends EgovAbstractMapper {
    @Resource(name = "sqlSession")
    public void setSqlSessionFactory(SqlSessionFactory sqlSession) {
        super.setSqlSessionFactory(sqlSession);
    }
    
    public int createLandUseMapTable(Map<String, Object> params) throws SQLException {
        return update("layerDAO.createLandUseMapTable", params);
    }
    
    public int insertDataByLandUseMap(Map<String, Object> params) throws SQLException {
        return insert("layerDAO.insertDataByLandUseMap", params);
    }
    
    public int copyTableToBackup(Map<String, Object> params) throws SQLException {
        return update("layerDAO.copyTableToBackup", params);
    }
    
    public int moveTableToBackup(Map<String, Object> params) throws SQLException {
        return update("layerDAO.moveTableToBackup", params);
    }
    
    public LayerVO selectLandUseTypeCode(LayerVO LayerVO) throws SQLException {
        return selectOne("layerDAO.selectLandUseTypeCode", LayerVO);
    }
    
    public boolean checkTableExists(String mapType) throws SQLException {
        return selectOne("layerDAO.checkTableExists", mapType);
    }
    
    public int selectSridFromExistLayer(String mapType) throws SQLException {
        return selectOne("layerDAO.selectSridFromExistLayer", mapType);
    }
}