package krgz.layer.service.impl;

import java.io.File;
import java.sql.SQLException;
import java.text.SimpleDateFormat;

import javax.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import krgz.layer.service.LayerService;
import krgz.layer.service.LayerVO;
import krgz.layer.service.ShapeFileService;
import krgz.progress.service.ProgressVO;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service("layerService")
public class LayerServiceImpl extends EgovAbstractServiceImpl implements LayerService {
	@Resource(name = "layerDAO")
	private LayerDAO layerDAO;

	@Resource(name = "shapefileService")
	private ShapeFileService shapefileService;

	@Override
	public int createLandUseMapTable(Map<String, Object> params) throws SQLException {
		return layerDAO.createLandUseMapTable(params);
	}

	@Override
	public int insertDataByLandUseMap(Map<String, Object> params) throws SQLException {
		return layerDAO.insertDataByLandUseMap(params);
	}

	@Override
	public LayerVO selectLandUseTypeCode(LayerVO LayerVO) throws SQLException {
		return layerDAO.selectLandUseTypeCode(LayerVO);
	}

	@Override
	public int copyTableToBackup(Map<String, Object> params) throws SQLException {
		return layerDAO.copyTableToBackup(params);
	}
	
	@Override
	public int moveTableToBackup(Map<String, Object> params) throws SQLException {
		return layerDAO.moveTableToBackup(params);
	}

	@Override
	public boolean checkTableExists(String mapType) throws SQLException {
		return layerDAO.checkTableExists(mapType);
	}
	
	@Override
	public int selectSridFromExistLayer(String mapType) throws SQLException {
		return layerDAO.selectSridFromExistLayer(mapType);
	}

	@Transactional(rollbackFor = Exception.class)
	public void processShapefileWithTransaction(File shpFile, String mapType, String layerProcess, int coord, ProgressVO progressVO) throws Exception {
		try {
	       // 1. 테이블 존재 여부 확인
	       boolean tableExists = checkTableExists(mapType);
	       
	       // 2. 테이블 생성 또는 SRID 체크
	       if (tableExists) {
	           int existingSRID = selectSridFromExistLayer(mapType);
	           if (existingSRID != 0 && existingSRID != coord) {
	               throw new IllegalStateException(
	                   String.format("Coordinate system mismatch: Layer uses EPSG:%d but input data uses EPSG:%d", 
	                   existingSRID, coord)
	               );
	           }
	           
	           if ("replace".equals(layerProcess)) {
	               String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
	               Map<String, Object> backupParams = new HashMap<>();
	               backupParams.put("mapType", mapType);
	               backupParams.put("backupTableName", mapType + "_" + timestamp);
	               moveTableToBackup(backupParams);
	           } else {
	               String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
	               Map<String, Object> backupParams = new HashMap<>();
	               backupParams.put("mapType", mapType);
	               backupParams.put("backupTableName", mapType + "_" + timestamp);
	               copyTableToBackup(backupParams);
	           }
	       }

	       // replace이거나 테이블이 없는 경우 새로 생성
	       if ("replace".equals(layerProcess) || !tableExists) {
	           Map<String, Object> params = new HashMap<>();
	           params.put("mapType", mapType);
	           params.put("coord", coord);
	           createLandUseMapTable(params);
	       }
	       
	       // 3. ShapeFile 처리
	       shapefileService.processShapefile(shpFile, mapType, coord, progressVO);
	       
	   } catch (Exception e) {
	       if (e instanceof IllegalStateException) {
	           throw new RuntimeException(e.getMessage(), e);
	       }
	       throw new RuntimeException("Failed to process layer. Please check your data and try again", e);
	   }
	}
}