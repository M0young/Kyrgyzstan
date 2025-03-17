package egovframework.main.map.layer.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import egovframework.common.component.MessageProvider;
import egovframework.common.response.ApiResponse;
import egovframework.main.map.layer.dto.LayerDTO;
import egovframework.main.map.layer.service.LayerService;

import javax.annotation.Resource;

import java.util.List;

@RestController
@RequestMapping("/api/layer")
public class LayerController {
    private static final Logger logger = LoggerFactory.getLogger(LayerController.class);
    
    @Resource(name = "layerService")
    private LayerService layerService;
    
    @Resource
    private MessageProvider messageProvider;
    
    @GetMapping("/classifications")
    public ResponseEntity<ApiResponse<List<LayerDTO>>> getClassifications(
            @RequestParam String lang,
            @RequestParam String classType) {
        try {
            List<LayerDTO> classifications = classType.equals("type") ? 
                    layerService.selectLandtypeClassifications(lang) :
                    layerService.selectLanduseClassifications(lang);
            
            return ApiResponse.success(classifications);
        } catch (Exception e) {
            logger.error("분류 목록 조회 중 오류 발생: ", e);
            return ApiResponse.error("layer.classifications.failed"); 
        }
    }
    
    @GetMapping("/field-labels")
    public ResponseEntity<ApiResponse<List<LayerDTO>>> getAllFieldLabels(
            @RequestParam String lang) {
        try {
            List<LayerDTO> fieldLabels = layerService.selectFieldLabelList(lang);
            return ApiResponse.success(fieldLabels);
        } catch (Exception e) {
            logger.error("필드 레이블 목록 조회 중 오류 발생: ", e);
            return ApiResponse.error("field.labels.failed"); 
        }
    }
    
    @GetMapping("/codes/{type}")
    public ResponseEntity<ApiResponse<List<LayerDTO>>> getCodeList(
            @PathVariable String type,
            @RequestParam String lang) {
        try {
            List<LayerDTO> codeList = null;
            
            switch (type) {
                case "type":
                    codeList = layerService.selectLandTypeList(lang);
                    break;
                case "symbol":
                    codeList = layerService.selectLandSymbolList(lang);
                    break;
                case "lclsf":
                    codeList = layerService.selectLandLclsfList(lang);
                    break;
                case "sclsf":
                    codeList = layerService.selectLandSclsfList(lang);
                    break;
                default:
                    return ApiResponse.error("invalid.code.type");
            }
            
            return ApiResponse.success(codeList);
        } catch (Exception e) {
            logger.error("코드 목록 조회 중 오류 발생: ", e);
            return ApiResponse.error("code.list.failed");
        }
    }
}