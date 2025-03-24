/*========================================================
    DATE: 2024. 03
    AUTHOR: MOYOUNG
    DESC: Symbol Edit Module
========================================================*/
_GL.MAP_SYMBOL = (function() {
    'use strict';
    
    let initialized = false;
    let instance = null;
    let symbolList = [];
    let currentSymbol = null;
    let currentLang = 'ru';
    
    /**
     * DOM 요소 가져오기
     */
    function getElements() {
        return {
            searchTerm: document.getElementById('symbolSearchTerm'),
            createBtn: document.getElementById('symbolCreateBtn'),
            resultTable: document.getElementById('symbolResultTable'),
            preview: document.getElementById('symbolPreview')
        };
    }
   
/* =====================================================
    Symbol Edit Main
======================================================*/
    /**
     * Symbol 목록 가져오기
     */
    function loadSymbols() {
        const elements = getElements();
        currentLang = _GL.COMMON.getCurrentLanguage();
        
        // API 호출
        fetch(`/klums/api/symbol/list?lang=${currentLang}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(result => {
                if (result.success) {
                    symbolList = result.data;
                    renderSymbolTable(symbolList);
                } else {
                    _GL.COMMON.showToast(result.message || '심볼 목록을 불러오는데 실패했습니다.', 'error');
                }
            })
            .catch(error => {
                console.error('Error fetching symbols:', error);
                _GL.COMMON.showToast('네트워크 오류가 발생했습니다.', 'error');
            });
    }
    
    /**
     * 심볼 테이블 렌더링
     */
    function renderSymbolTable(symbols) {
        const elements = getElements();
        elements.resultTable.innerHTML = '';
        
        if (!symbols || symbols.length === 0) {
            elements.resultTable.innerHTML = '<tr><td colspan="4" class="text-center">No symbols found</td></tr>';
            return;
        }
        
        symbols.forEach(symbol => {
            const row = document.createElement('tr');
            
            // 심볼 코드
            const codeCell = document.createElement('td');
            codeCell.textContent = symbol.symbol_cd;
            codeCell.classList.add('text-center');
            row.appendChild(codeCell);
            
            // 심볼 이미지
            const imageCell = document.createElement('td');
            if (symbol.file_path) {
                const img = document.createElement('img');
                img.src = `/klums/local-files${symbol.file_path}`;
                img.alt = 'Symbol Image';
                img.style.width = '40px';
                img.style.height = '40px';
                imageCell.appendChild(img);
            } else {
                imageCell.textContent = 'No Image';
            }
            row.appendChild(imageCell);
            
            // 심볼 이름
            const nameCell = document.createElement('td');
            nameCell.textContent = symbol[`symbol_nm_${currentLang}`] || '';
            row.appendChild(nameCell);
            
            // 편집 버튼
            const actionCell = document.createElement('td');
            
            // 상세보기 버튼
            const viewBtn = document.createElement('button');
            viewBtn.className = 'btn btn-sm btn-outline-primary me-1';
            viewBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"></path></svg>';
            viewBtn.setAttribute('data-bs-toggle', 'tooltip');
            viewBtn.setAttribute('title', 'View Symbol');
            viewBtn.addEventListener('click', () => viewSymbol(symbol.symbol_cd));
            actionCell.appendChild(viewBtn);
            
            // 수정 버튼
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-sm btn-outline-warning me-1';
            editBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path><path d="M16 5l3 3"></path></svg>';
            editBtn.setAttribute('data-bs-toggle', 'tooltip');
            editBtn.setAttribute('title', 'Edit Symbol');
            editBtn.addEventListener('click', () => editSymbol(symbol.symbol_cd));
            actionCell.appendChild(editBtn);
            
            // 삭제 버튼
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-outline-danger';
            deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M4 7h16"></path><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path><path d="M10 12l4 4m0 -4l-4 4"></path></svg>';
            deleteBtn.setAttribute('data-bs-toggle', 'tooltip');
            deleteBtn.setAttribute('title', 'Delete Symbol');
            deleteBtn.addEventListener('click', () => confirmDeleteSymbol(symbol.symbol_cd));
            actionCell.appendChild(deleteBtn);
            
            row.appendChild(actionCell);
            elements.resultTable.appendChild(row);
        });
        
        // 툴팁 초기화
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    /**
     * 심볼 상세 정보 보기
     */
    function viewSymbol(symbolCd) {
        fetch(`/klums/api/symbol/${symbolCd}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(result => {
                if (result.success) {
                    currentSymbol = result.data;
                    renderSymbolPreview(currentSymbol);
                } else {
                    _GL.COMMON.showToast(result.message || '심볼 정보를 불러오는데 실패했습니다.', 'error');
                }
            })
            .catch(error => {
                console.error('Error fetching symbol:', error);
                _GL.COMMON.showToast('네트워크 오류가 발생했습니다.', 'error');
            });
    }
    
    /**
     * 심볼 미리보기 렌더링
     */
    function renderSymbolPreview(symbol) {
        const elements = getElements();
        
        if (!symbol) {
            elements.preview.innerHTML = '<div class="alert alert-info">심볼을 선택하세요.</div>';
            return;
        }
        
        let html = `
            <div class="text-center w-100">
                ${symbol.file_path ? 
                `<img src="/klums/local-files${symbol.file_path}" alt="${symbol[`symbol_nm_${currentLang}`] || '심볼 이미지'}" class="preview-image">` : 
                '<div class="alert alert-warning">이미지가 없습니다.</div>'}
            </div>
        `;
        
        elements.preview.innerHTML = html;
    }

    /**
     * 심볼 생성 모달 표시
     */
    function showCreateSymbolModal() {
        const modalHtml = `
            <div class="modal fade" id="symbolFormModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Create New Symbol</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="symbolForm">
                                <div class="mb-3">
                                    <label class="form-label">Symbol Code</label>
                                    <input type="number" class="form-control" id="symbolCode" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Name (Russian)</label>
                                    <input type="text" class="form-control" id="symbolNameRu">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Name (Kyrgyz)</label>
                                    <input type="text" class="form-control" id="symbolNameKy">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Name (English)</label>
                                    <input type="text" class="form-control" id="symbolNameEn">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Image File</label>
                                    <input type="file" class="form-control" id="symbolFile">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Remarks</label>
                                    <textarea class="form-control" id="symbolRemarks" rows="3"></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="saveSymbolBtn">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 이미 존재하는 모달 제거
        const existingModal = document.getElementById('symbolFormModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // 새 모달 추가
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // 모달 표시
        const modal = new bootstrap.Modal(document.getElementById('symbolFormModal'));
        modal.show();
        
        // 저장 버튼 이벤트 리스너
        document.getElementById('saveSymbolBtn').addEventListener('click', saveSymbol);
    }
    
    /**
     * 심볼 수정 모달 표시
     */
    function editSymbol(symbolCd) {
        // 먼저 심볼 정보 가져오기
        fetch(`/klums/api/symbol/${symbolCd}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(result => {
                if (result.success) {
                    const symbol = result.data;
                    showEditSymbolModal(symbol);
                } else {
                    _GL.COMMON.showToast(result.message || '심볼 정보를 불러오는데 실패했습니다.', 'error');
                }
            })
            .catch(error => {
                console.error('Error fetching symbol:', error);
                _GL.COMMON.showToast('네트워크 오류가 발생했습니다.', 'error');
            });
    }
    
    /**
     * 심볼 수정 모달 표시
     */
    function showEditSymbolModal(symbol) {
        const modalHtml = `
            <div class="modal fade" id="symbolFormModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit Symbol</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="symbolForm">
                                <input type="hidden" id="symbolId" value="${symbol.symbol_cd}">
                                <div class="mb-3">
                                    <label class="form-label">Symbol Code</label>
                                    <input type="number" class="form-control" id="symbolCode" value="${symbol.symbol_cd}" readonly>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Name (Russian)</label>
                                    <input type="text" class="form-control" id="symbolNameRu" value="${symbol.symbol_nm_ru || ''}">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Name (Kyrgyz)</label>
                                    <input type="text" class="form-control" id="symbolNameKy" value="${symbol.symbol_nm_ky || ''}">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Name (English)</label>
                                    <input type="text" class="form-control" id="symbolNameEn" value="${symbol.symbol_nm_en || ''}">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Image File</label>
                                    ${symbol.file_path ? 
                                    `<div class="mb-2">
                                        <img src="/files/${symbol.file_path}" alt="Current Image" style="max-height: 100px;">
                                        <p class="small">${symbol.file_orgnl_nm || ''}</p>
                                    </div>` : ''}
                                    <input type="file" class="form-control" id="symbolFile">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Remarks</label>
                                    <textarea class="form-control" id="symbolRemarks" rows="3">${symbol.rmrk || ''}</textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="updateSymbolBtn">Update</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 이미 존재하는 모달 제거
        const existingModal = document.getElementById('symbolFormModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // 새 모달 추가
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // 모달 표시
        const modal = new bootstrap.Modal(document.getElementById('symbolFormModal'));
        modal.show();
        
        // 업데이트 버튼 이벤트 리스너
        document.getElementById('updateSymbolBtn').addEventListener('click', updateSymbol);
    }
    
    /**
     * 심볼 삭제 확인
     */
    function confirmDeleteSymbol(symbolCd) {
        _GL.COMMON.showAlertModal({
            type: 'warning',
            title: '심볼 삭제',
            message: '정말로 이 심볼을 삭제하시겠습니까?',
            btn1: {
                text: '삭제',
                callback: function() {
                    deleteSymbol(symbolCd);
                }
            },
            btn2: {
                text: '취소'
            }
        });
    }
    
    /**
     * 심볼 저장
     */
    function saveSymbol() {
        const symbolCode = document.getElementById('symbolCode').value;
        const symbolNameRu = document.getElementById('symbolNameRu').value;
        const symbolNameKy = document.getElementById('symbolNameKy').value;
        const symbolNameEn = document.getElementById('symbolNameEn').value;
        const symbolRemarks = document.getElementById('symbolRemarks').value;
        const symbolFile = document.getElementById('symbolFile').files[0];
        
        if (!symbolCode) {
            _GL.COMMON.showToast('심볼 코드를 입력해주세요.', 'error');
            return;
        }
        
        const formData = new FormData();
        
        // 파일 업로드가 있는 경우, 별도 처리 필요
        if (symbolFile) {
            formData.append('file', symbolFile);
            
            // 파일 업로드 API 호출 (파일 업로드 API가 있다고 가정)
            fetch('/klums/api/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': _GL.csrf.token
                }
            })
            .then(response => response.json())
            .then(fileResult => {
                if (fileResult.success) {
                    // 파일 업로드 성공 후 심볼 저장
                    const fileId = fileResult.data.fileId;
                    saveSymbolData(symbolCode, symbolNameRu, symbolNameKy, symbolNameEn, symbolRemarks, fileId);
                } else {
                    _GL.COMMON.showToast(fileResult.message || '파일 업로드에 실패했습니다.', 'error');
                }
            })
            .catch(error => {
                console.error('Error uploading file:', error);
                _GL.COMMON.showToast('파일 업로드 중 오류가 발생했습니다.', 'error');
            });
        } else {
            // 파일 없이 심볼 저장
            saveSymbolData(symbolCode, symbolNameRu, symbolNameKy, symbolNameEn, symbolRemarks, null);
        }
    }
    
    /**
     * 심볼 데이터 저장
     */
    function saveSymbolData(symbolCode, symbolNameRu, symbolNameKy, symbolNameEn, symbolRemarks, fileId) {
        const symbolData = {
            symbol_cd: parseInt(symbolCode),
            symbol_nm_ru: symbolNameRu,
            symbol_nm_ky: symbolNameKy,
            symbol_nm_en: symbolNameEn,
            rmrk: symbolRemarks
        };
        
        if (fileId) {
            symbolData.file_id = fileId;
        }
        
        fetch('/klums/api/symbol', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': _GL.csrf.token
            },
            body: JSON.stringify(symbolData)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // 모달 닫기
                const modal = bootstrap.Modal.getInstance(document.getElementById('symbolFormModal'));
                modal.hide();
                
                _GL.COMMON.showToast('심볼이 성공적으로 저장되었습니다.', 'success');
                loadSymbols(); // 목록 새로고침
            } else {
                _GL.COMMON.showToast(result.message || '심볼 저장에 실패했습니다.', 'error');
            }
        })
        .catch(error => {
            console.error('Error saving symbol:', error);
            _GL.COMMON.showToast('심볼 저장 중 오류가 발생했습니다.', 'error');
        });
    }
    
    /**
     * 심볼 업데이트
     */
    function updateSymbol() {
        const symbolId = document.getElementById('symbolId').value;
        const symbolCode = document.getElementById('symbolCode').value;
        const symbolNameRu = document.getElementById('symbolNameRu').value;
        const symbolNameKy = document.getElementById('symbolNameKy').value;
        const symbolNameEn = document.getElementById('symbolNameEn').value;
        const symbolRemarks = document.getElementById('symbolRemarks').value;
        const symbolFile = document.getElementById('symbolFile').files[0];
        
        if (!symbolCode) {
            _GL.COMMON.showToast('심볼 코드를 입력해주세요.', 'error');
            return;
        }
        
        // 파일 업로드가 있는 경우
        if (symbolFile) {
            const formData = new FormData();
            formData.append('file', symbolFile);
            
            // 파일 업로드 API 호출
            fetch('/klums/api/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': _GL.csrf.token
                }
            })
            .then(response => response.json())
            .then(fileResult => {
                if (fileResult.success) {
                    // 파일 업로드 성공 후 심볼 업데이트
                    const fileId = fileResult.data.fileId;
                    updateSymbolData(symbolId, symbolCode, symbolNameRu, symbolNameKy, symbolNameEn, symbolRemarks, fileId);
                } else {
                    _GL.COMMON.showToast(fileResult.message || '파일 업로드에 실패했습니다.', 'error');
                }
            })
            .catch(error => {
                console.error('Error uploading file:', error);
                _GL.COMMON.showToast('파일 업로드 중 오류가 발생했습니다.', 'error');
            });
        } else {
            // 파일 없이 심볼 업데이트
            updateSymbolData(symbolId, symbolCode, symbolNameRu, symbolNameKy, symbolNameEn, symbolRemarks, null);
        }
    }
    
    /**
     * 심볼 데이터 업데이트
     */
    function updateSymbolData(symbolId, symbolCode, symbolNameRu, symbolNameKy, symbolNameEn, symbolRemarks, fileId) {
        const symbolData = {
            symbol_cd: parseInt(symbolCode),
            symbol_nm_ru: symbolNameRu,
            symbol_nm_ky: symbolNameKy,
            symbol_nm_en: symbolNameEn,
            rmrk: symbolRemarks
        };
        
        if (fileId) {
            symbolData.file_id = fileId;
        }
        
        fetch(`/klums/api/symbol/${symbolId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': _GL.csrf.token
            },
            body: JSON.stringify(symbolData)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                // 모달 닫기
                const modal = bootstrap.Modal.getInstance(document.getElementById('symbolFormModal'));
                modal.hide();
                
                _GL.COMMON.showToast('심볼이 성공적으로 업데이트되었습니다.', 'success');
                loadSymbols(); // 목록 새로고침
                
                // 현재 선택된 심볼이 있으면 갱신
                if (currentSymbol && currentSymbol.symbol_cd === parseInt(symbolId)) {
                    viewSymbol(symbolId);
                }
            } else {
                _GL.COMMON.showToast(result.message || '심볼 업데이트에 실패했습니다.', 'error');
            }
        })
        .catch(error => {
            console.error('Error updating symbol:', error);
            _GL.COMMON.showToast('심볼 업데이트 중 오류가 발생했습니다.', 'error');
        });
    }
    
    /**
     * 심볼 삭제
     */
    function deleteSymbol(symbolCd) {
        fetch(`/klums/api/symbol/${symbolCd}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': _GL.csrf.token
            }
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                _GL.COMMON.showToast('심볼이 성공적으로 삭제되었습니다.', 'success');
                loadSymbols(); // 목록 새로고침
                
                // 현재 선택된 심볼이 삭제된 경우 미리보기 초기화
                if (currentSymbol && currentSymbol.symbol_cd === symbolCd) {
                    currentSymbol = null;
                    renderSymbolPreview(null);
                }
            } else {
                _GL.COMMON.showToast(result.message || '심볼 삭제에 실패했습니다.', 'error');
            }
        })
        .catch(error => {
            console.error('Error deleting symbol:', error);
            _GL.COMMON.showToast('심볼 삭제 중 오류가 발생했습니다.', 'error');
        });
    }
    
    /**
     * 검색 기능
     */
    function filterSymbols(term) {
        if (!term) {
            renderSymbolTable(symbolList);
            return;
        }
        
        const filtered = symbolList.filter(symbol => {
            const nameField = `symbol_nm_${currentLang}`;
            return (
                symbol[nameField] && symbol[nameField].toLowerCase().includes(term.toLowerCase()) ||
                symbol.symbol_cd.toString().includes(term)
            );
        });
        
        renderSymbolTable(filtered);
    }
    
/* =====================================================
    Event Handlers
======================================================*/
    function handleSearch() {
        const elements = getElements();
        const searchTerm = elements.searchTerm.value.trim();
        filterSymbols(searchTerm);
    }
    
/* =====================================================
    Event Listeners
======================================================*/
    function initializeEventListeners() {
        const elements = getElements();
        
        // 검색 기능
        elements.searchTerm.addEventListener('input', handleSearch);
        
        // 심볼 생성 버튼
        elements.createBtn.addEventListener('click', showCreateSymbolModal);
    }
  
/* =====================================================
    Public API
======================================================*/
    return {
        init: function() {
            if (initialized) return;
            instance = _GL.MAP.getInstance();
            initializeEventListeners();
            loadSymbols(); // 초기 심볼 목록 로드
            initialized = true;
        }
    };
})();

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    _GL.MAP_SYMBOL.init();
});