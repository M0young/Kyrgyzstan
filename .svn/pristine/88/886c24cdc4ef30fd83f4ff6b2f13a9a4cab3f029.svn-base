package egovframework.main.map.upload.imagefile.service;

import java.io.File;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import egovframework.main.map.upload.imagefile.dto.ImagefileDTO;

@Service("imagefileProcessService")
public class ImagefileProcessService {
    private static final Logger logger = LoggerFactory.getLogger(ImagefileProcessService.class);
    
    @Resource(name = "imagefileService")
    private ImagefileService imagefileService;
    
    @Value("#{globalProperties['Globals.file.path']}")
    private String fileStorePath;
    
    @Value("#{globalProperties['Globals.file.url']}")
    private String fileUrlPath;
    
    public boolean handleImageUploadProcess(MultipartHttpServletRequest request, int userNo) {
        try {
            // 업로드된 파일들 가져오기
            Iterator<String> fileNames = request.getFileNames();
            
            if (!fileNames.hasNext()) {
                return false;
            }
            
            boolean atLeastOneSuccess = false;
            
            while (fileNames.hasNext()) {
                String fileName = fileNames.next();
                
                // 동일한 이름의 파일이 여러 개일 경우 처리
                List<MultipartFile> files = request.getFiles(fileName);
                
                if (files != null && !files.isEmpty()) {
                    for (MultipartFile file : files) {
                        if (file != null && !file.isEmpty()) {
                            try {
                                // 파일 저장 및 DB 등록
                                ImagefileDTO imagefileDTO = saveSymbolFile(file, userNo);
                                imagefileService.insertImagefile(imagefileDTO);
                                atLeastOneSuccess = true;
                            } catch (Exception e) {
                                logger.error("파일 처리 중 오류: " + file.getOriginalFilename(), e);
                            }
                        }
                    }
                }
            }
            
            return atLeastOneSuccess;
        } catch (Exception e) {
            logger.error("심볼 파일 처리 중 오류 발생", e);
            return false;
        }
    }
    
    // 이미지 파일 저장
    private ImagefileDTO saveSymbolFile(MultipartFile file, int userNo) throws Exception {
        // 원본 파일명
        String originalFilename = file.getOriginalFilename();
        
        // 파일 확장자 추출
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        
        // 저장할 파일명 생성 (UUID + 원본 파일명)
        String savedFilename = UUID.randomUUID().toString() + fileExtension;
        
        // 파일이 저장될 전체 경로 (물리적 파일 시스템 경로)
        String fullStorePath = fileStorePath;
        
        // 파일이 저장될 경로 확인 및 생성
        File uploadDir = new File(fullStorePath);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
        
        // 파일 저장 경로
        File saveFile = new File(uploadDir, savedFilename);
        
        // 파일 저장
        file.transferTo(saveFile);
        
        // DB에 저장할 데이터 준비
        ImagefileDTO imagefileDTO = new ImagefileDTO();
        
        // DB에는 URL 경로 저장 (접근 가능한 URL 형태의 경로)
        String dbFilePath = fileUrlPath + savedFilename;
        imagefileDTO.setFile_path(dbFilePath);
        imagefileDTO.setFile_orgnl_nm(originalFilename);
        imagefileDTO.setRgtr(userNo);
        
        return imagefileDTO;
    }
}