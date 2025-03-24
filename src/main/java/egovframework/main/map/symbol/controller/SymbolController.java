package egovframework.main.map.symbol.controller;

import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import egovframework.main.map.symbol.service.SymbolService;
import egovframework.main.map.symbol.dto.SymbolDTO;
import egovframework.common.component.MessageProvider;
import egovframework.common.response.ApiResponse;
import egovframework.environment.security.SecurityUtils;

@RestController
@RequestMapping("/api/symbol")
public class SymbolController {
    
    private static final Logger logger = LoggerFactory.getLogger(SymbolController.class);
    
    @Resource(name = "symbolService")
    private SymbolService symbolService;
    
    @Resource
    private MessageProvider messageProvider;
    
    // 심볼 목록 조회
    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<SymbolDTO>>> getSymbolList(
            @RequestParam String lang) {
        try {
            List<SymbolDTO> symbolList = symbolService.selectSymbolList(lang);
            return ApiResponse.success(symbolList);
        } catch (Exception e) {
            logger.error("심볼 목록 조회 중 오류 발생: ", e);
            return ApiResponse.error("symbol.list.failed");
        }
    }
    
    // 심볼 파일 목록 조회
    @GetMapping("/files")
    public ResponseEntity<ApiResponse<List<SymbolDTO>>> getSymbolFileList() {
        try {
            List<SymbolDTO> fileList = symbolService.selectSymbolFileList();
            return ApiResponse.success(fileList);
        } catch (Exception e) {
            logger.error("심볼 파일 목록 조회 중 오류 발생: ", e);
            return ApiResponse.error("symbol.file.list.failed");
        }
    }
    
    // 특정 심볼 상세 조회
    @GetMapping("/{symbolCd}")
    public ResponseEntity<ApiResponse<SymbolDTO>> getSymbolById(
            @PathVariable int symbolCd) {
        try {
            SymbolDTO symbol = symbolService.selectSymbolById(symbolCd);
            if (symbol == null) {
                return ApiResponse.error("symbol.not.found");
            }
            return ApiResponse.success(symbol);
        } catch (Exception e) {
            logger.error("심볼 상세 조회 중 오류 발생: ", e);
            return ApiResponse.error("symbol.detail.failed");
        }
    }
    
    // 심볼 등록
    @PostMapping
    public ResponseEntity<ApiResponse<SymbolDTO>> addSymbol(
            @RequestBody SymbolDTO symbolDTO) {
        try {
            int userNo = SecurityUtils.getUserNo();
            symbolDTO.setRgtr(userNo);
            
            int result = symbolService.insertSymbol(symbolDTO);
            if (result > 0) {
                return ApiResponse.success(symbolDTO, "symbol.add.success");
            } else {
                return ApiResponse.error("symbol.add.failed");
            }
        } catch (Exception e) {
            logger.error("심볼 등록 중 오류 발생: ", e);
            return ApiResponse.error("symbol.add.error");
        }
    }
    
    // 심볼 수정
    @PutMapping("/{symbolCd}")
    public ResponseEntity<ApiResponse<SymbolDTO>> updateSymbol(
            @PathVariable int symbolCd,
            @RequestBody SymbolDTO symbolDTO) {
        try {
            int userNo = SecurityUtils.getUserNo();
            
            symbolDTO.setSymbol_cd(symbolCd);
            symbolDTO.setMdfr(userNo);
            
            int result = symbolService.updateSymbol(symbolDTO);
            if (result > 0) {
                return ApiResponse.success(symbolDTO, "symbol.update.success");
            } else {
                return ApiResponse.error("symbol.update.failed");
            }
        } catch (Exception e) {
            logger.error("심볼 수정 중 오류 발생: ", e);
            return ApiResponse.error("symbol.update.error");
        }
    }
    
    // 심볼 삭제
    @DeleteMapping("/{symbolCd}")
    public ResponseEntity<ApiResponse<Void>> deleteSymbol(
            @PathVariable int symbolCd) {
        try {
            int result = symbolService.deleteSymbol(symbolCd);
            if (result > 0) {
                return ApiResponse.success(null, "symbol.delete.success");
            } else {
                return ApiResponse.error("symbol.delete.failed");
            }
        } catch (Exception e) {
            logger.error("심볼 삭제 중 오류 발생: ", e);
            return ApiResponse.error("symbol.delete.error");
        }
    }
}