package krgz.layer.service;

import java.sql.SQLException;
import java.util.Map;
import java.io.File;
import krgz.progress.service.ProgressVO;

public interface LayerService {
   int createLandUseMapTable(Map<String, Object> params) throws SQLException;
   
   int insertDataByLandUseMap(Map<String, Object> params) throws SQLException;
   
   int copyTableToBackup(Map<String, Object> params) throws SQLException;
   
   int moveTableToBackup(Map<String, Object> params) throws SQLException;
   
   LayerVO selectLandUseTypeCode(LayerVO LayerVO) throws SQLException;
   
   boolean checkTableExists(String mapType) throws SQLException;
   
   int selectSridFromExistLayer(String mapType) throws SQLException;
   
   void processShapefileWithTransaction(File shpFile, String mapType, String layerProcess, int coord, ProgressVO progressVO) throws Exception;
}