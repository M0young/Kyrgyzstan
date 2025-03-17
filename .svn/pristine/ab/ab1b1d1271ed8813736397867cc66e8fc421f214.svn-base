package egovframework.main.map.upload.shapefile.dao;

import java.util.Map;
import javax.annotation.Resource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;
import egovframework.rte.psl.dataaccess.EgovAbstractMapper;
import egovframework.main.map.upload.shapefile.dto.ShapefileDTO;

@Repository("shapefileDAO")
public class ShapefileDAO extends EgovAbstractMapper {
	
    @Resource(name = "sqlSession")
    public void setSqlSessionFactory(SqlSessionFactory sqlSession) {
        super.setSqlSessionFactory(sqlSession);
    }
    
    public int createShapefileTable(int coord) {
        return update("shapefileDAO.createShapefileTable", coord);
    }
    
    public int insertShapefileData(Map<String, Object> params) {
        return insert("shapefileDAO.insertShapefileData", params);
    }
    
    public int copyTableToBackup(String backupTableName) {
        return update("shapefileDAO.copyTableToBackup", backupTableName);
    }
    
    public int moveTableToBackup(String backupTableName) {
        return update("shapefileDAO.moveTableToBackup", backupTableName);
    }
    
    public ShapefileDTO selectLandUseTypeCode(ShapefileDTO shapefileDTO) {
        return selectOne("shapefileDAO.selectLandUseTypeCode", shapefileDTO);
    }
    
    public int checkTableExists() {
        return selectOne("shapefileDAO.checkTableExists");
    }
    
    public int selectSridFromExistLayer() {
        return selectOne("shapefileDAO.selectSridFromExistLayer");
    }
}