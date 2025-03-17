package egovframework.main.map.upload.shapefile.service;

import java.io.File;
import java.text.SimpleDateFormat;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import egovframework.main.map.upload.shapefile.dao.ShapefileDAO;
import egovframework.main.map.upload.shapefile.dto.ShapefileDTO;
import egovframework.main.map.upload.shapefile.service.ShapefileService;
import egovframework.main.map.upload.shapefile.service.ShapefileProcessService;
import egovframework.main.map.upload.progress.dto.ProgressDTO;
import egovframework.main.map.upload.progress.service.ProgressService;

import java.util.Date;
import java.util.Map;

@Service("shapefileService")
public class ShapefileService extends EgovAbstractServiceImpl {
	private static final Logger logger = LoggerFactory.getLogger(ShapefileService.class);
	
	@Resource(name = "shapefileDAO")
	private ShapefileDAO shapefileDAO;
	
	@Resource(name = "geoServerService")
    private GeoServerService geoServerService;
    
    @Resource(name = "progressService")
    private ProgressService progressService;
    
	@Resource(name = "shapefileValidationService")
    private ShapefileValidationService shapefileValidationService;
	
	@Resource(name = "shapefileProcessService")
	private ShapefileProcessService shapefileProcessService;
	
	@Autowired
    private ShapefileService shapefileService;
	
	public void handleLayerUploadProcess(Map<String, File> files, String layerProcess, int coord, ProgressDTO progressDTO) {
        try {
        	// 1. DB 작업 수행 (트랜잭션 처리)
			//    - replace: 기존 테이블 백업 후 새 데이터 입력
			//    - append : 기존 테이블에 데이터 추가
        	shapefileService.processLayerWithTableManagement(files.get(".shp"), layerProcess, coord, progressDTO);
            
            // 2. GeoServer 발행
            geoServerService.publishLayerToGeoServer(coord);
            
            // 3. 성공 상태 업데이트
            progressService.handleProgressStatus(progressDTO, "COMPLETED", null);
            
        } catch (Exception e) {
        	// 오류 상태 업데이트
            progressService.handleProgressStatus(progressDTO, "ERROR", e);
            throw new RuntimeException("Failed to process shapefile", e);
        } finally {
        	// 임시 파일 제거
        	shapefileValidationService.cleanupTemporaryFiles(files);
		}
    }
	
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
	public void processLayerWithTableManagement(File shpFile, String layerProcess, int coord, ProgressDTO progressDTO) {
		try {
	        // 1. 테이블 존재 여부 확인
	        int tableExists = checkTableExists();
	       
	        // 2. SRID 체크
	        validateSRID(coord, tableExists);
	        
	        // 3. 테이블 관리 (백업 및 생성)
	        handleTableManagement(layerProcess, coord, tableExists);
	       
	        // 4. ShapeFile 처리
	        shapefileProcessService.processShapefile(shpFile, coord, progressDTO);
	       
	    } catch (Exception e) {
	        logger.error("레이어 처리 중 오류 발생: {}", e.getMessage(), e);
	        throw new RuntimeException("Failed to process layer: " + e.getMessage(), e);
	    }
	}
	
	private void validateSRID(int coord, int tableExists) {
		if (tableExists > 0) {
			int existingSRID = selectSridFromExistLayer();
			if (existingSRID != 0 && existingSRID != coord) {
				throw new RuntimeException(
	                String.format("Coordinate system mismatch: Layer uses EPSG:%d but input data uses EPSG:%d", 
	                existingSRID, coord)
	            );
			}
		}
	}
	
	private void handleTableManagement(String layerProcess, int coord, int tableExists) {
	    String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
	    String backupTableName = "land_use_" + timestamp;

	    try {
	        if (tableExists > 0) {
	            if ("replace".equals(layerProcess)) {
	                moveTableToBackup(backupTableName);
	            } else {
	                copyTableToBackup(backupTableName);
	            }
	        }
	        
	        if ("replace".equals(layerProcess) || tableExists == 0) {
	            createShapefileTable(coord);
	        }
	    } catch (Exception e) {
	        logger.error("테이블 관리 중 오류 발생: {}", e.getMessage(), e);
	        throw new RuntimeException("Failed to manage table: " + e.getMessage(), e);
	    }
	}
	
	public int createShapefileTable(int coord) {
		return shapefileDAO.createShapefileTable(coord);
	}

	public int insertShapefileData(Map<String, Object> params) {
		return shapefileDAO.insertShapefileData(params);
	}

	public ShapefileDTO selectLandUseTypeCode (ShapefileDTO shapefileDTO) {
		return shapefileDAO.selectLandUseTypeCode(shapefileDTO);
	}

	public int copyTableToBackup(String backupTableName) {
		return shapefileDAO.copyTableToBackup(backupTableName);
	}
	
	public int moveTableToBackup(String backupTableName) {
		return shapefileDAO.moveTableToBackup(backupTableName);
	}

	public int checkTableExists() {
		return shapefileDAO.checkTableExists();
	}
	
	public int selectSridFromExistLayer() {
		return shapefileDAO.selectSridFromExistLayer();
	}
}