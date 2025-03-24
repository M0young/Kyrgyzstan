package egovframework.main.map.upload.imagefile.service;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import egovframework.main.map.upload.imagefile.dao.ImagefileDAO;
import egovframework.main.map.upload.imagefile.dto.ImagefileDTO;

@Service("imagefileService")
public class ImagefileService extends EgovAbstractServiceImpl {
	
	@Resource(name = "imagefileDAO")
	private ImagefileDAO imagefileDAO;
	
	public ImagefileDTO insertImagefile (ImagefileDTO imagefileDTO) {
		return imagefileDAO.insertImagefile(imagefileDTO);
	}
	
}
