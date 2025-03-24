package egovframework.main.map.upload.imagefile.dao;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;

import egovframework.rte.psl.dataaccess.EgovAbstractMapper;
import egovframework.main.map.upload.imagefile.dto.ImagefileDTO;

@Repository("imagefileDAO")
public class ImagefileDAO extends EgovAbstractMapper {

	@Resource(name = "sqlSession")
	public void setSqlSessionFactory(SqlSessionFactory sqlSession) {
		super.setSqlSessionFactory(sqlSession);
	}
	
	public ImagefileDTO insertImagefile(ImagefileDTO imagefileDTO) {
        return selectOne("imagefileDAO.insertImagefile", imagefileDTO);
    }
}