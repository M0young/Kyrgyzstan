package egovframework.main.map.layer.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.main.map.layer.dao.LayerDAO;
import egovframework.main.map.layer.dto.LayerDTO;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

@Service("layerService")
public class LayerService extends EgovAbstractServiceImpl {
	
	@Resource(name = "layerDAO")
	private LayerDAO layerDAO;
	
	public List<LayerDTO> selectLanduseClassifications(String lang) {
		return layerDAO.selectLanduseClassifications(lang);
	}
	
	public List<LayerDTO> selectLandtypeClassifications(String lang) {
		return layerDAO.selectLandtypeClassifications(lang);
	}
	
	public List<LayerDTO> selectFieldLabelList(String lang) {
		return layerDAO.selectFieldLabelList(lang);
	}
	
	public List<LayerDTO> selectLandTypeList(String lang) {
		return layerDAO.selectLandTypeList(lang);
	}
	
	public List<LayerDTO> selectLandSymbolList(String lang) {
		return layerDAO.selectLandSymbolList(lang);
	}
	
	public List<LayerDTO> selectLandLclsfList(String lang) {
		return layerDAO.selectLandLclsfList(lang);
	}
	
	public List<LayerDTO> selectLandSclsfList(String lang) {
		return layerDAO.selectLandSclsfList(lang);
	}
}
