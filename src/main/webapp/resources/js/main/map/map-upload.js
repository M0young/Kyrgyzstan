/*========================================================
    DATE: 2024. 03
    AUTHOR: MOYOUNG
    DESC: Map Upload Module
========================================================*/
_GL.MAP_UPLOAD = (function() {
    'use strict';
    
    let initialized = false;
    let progressCheckInterval = null;
        
    /**
     * DOM 요소 가져오기
     */
    function getElements() {
       return {
           uploadForm: document.getElementById('dataUploadForm'),
           uploadType: document.getElementsByName('uploadType'),
           layerProcess: document.getElementsByName('layerProcess'),
           fileInput: document.getElementById('dataFile'),
           progressArea: document.getElementById('progressArea'),
           progressBar: document.getElementById('progressBar'),
           progressText: document.getElementById('progressText'),
           clearBtn: document.getElementById('dataClearBtn'),
           uploadBtn: document.getElementById('dataUploadBtn'),
           processContainer: document.getElementById('processContainer'),
           alertContainer: document.getElementById('dataUploadAlertContainer')
       };
    }

/* =====================================================
    Upload Main
======================================================*/
    /**
     * 폼 데이터 검증
     */
    function validateForm(elements) {
        // 업로드 타입 체크
        let typeSelected = false;
        let selectedType = '';
        elements.uploadType.forEach(function(radio) {
            if (radio.checked) {
                typeSelected = true;
                selectedType = radio.value;
            }
        });
        
        if (!typeSelected) {
            showAlert('warning', 'Please select upload type');
            return false;
        }

        // 업로드 타입이 Layer인 경우 레이어 프로세스 체크
        if (selectedType === 'layer') {
            let processSelected = false;
            elements.layerProcess.forEach(function(radio) {
                if (radio.checked) processSelected = true;
            });
            if (!processSelected) {
                showAlert('warning', 'Please select layer processing method');
                return false;
            }
            
            // 필수 파일 확장자 체크 (Layer 타입인 경우만)
            const files = elements.fileInput.files;
            if (files.length === 0) {
                showAlert('warning', 'Please select files');
                return false;
            }
            
            const requiredExtensions = ['.shp', '.shx', '.dbf', '.prj'];
            const uploadedExtensions = Array.from(files).map(file => {
                return '.' + file.name.split('.').pop().toLowerCase();
            });
            
            const missingExtensions = requiredExtensions.filter(ext => 
                !uploadedExtensions.includes(ext)
            );

            if (missingExtensions.length > 0) {
                showAlert('warning', 'Missing required files: ' + missingExtensions.join(', '));
                return false;
            }
        } else if (selectedType === 'symbol') {
            // 심볼 타입인 경우 파일 체크만
            const files = elements.fileInput.files;
            if (files.length === 0) {
                showAlert('warning', 'Please select files');
                return false;
            }
            
            // 이미지 파일 확장자 체크
            const allowedExtensions = ['.jpg', '.jpeg', '.png'];
            const invalidFiles = Array.from(files).filter(file => {
                const ext = '.' + file.name.split('.').pop().toLowerCase();
                return !allowedExtensions.includes(ext);
            });
            
            if (invalidFiles.length > 0) {
                showAlert('warning', 'Invalid file types. Please upload image files (jpg, png)');
                return false;
            }
        }

        return true;
    }

    /**
     * 알림 표시
     */
    function showAlert(type, message) {
        const elements = getElements();
        elements.alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible">
                <div>${message}</div>
                <a class="btn-close" data-bs-dismiss="alert" aria-label="close"></a>
            </div>
        `;
        
        // 기존 토스트 메시지 표시 방식이 있다면 사용
        if (typeof _GL.COMMON !== 'undefined' && typeof _GL.COMMON.showToast === 'function') {
            _GL.COMMON.showToast(message, type);
        }
    }

    /**
     * 파일 업로드 처리
     */
    function handleFileUpload(elements) {
        const formData = new FormData(elements.uploadForm);
        elements.uploadBtn.disabled = true;
        elements.progressArea.classList.remove('d-none');

        // 업로드 타입 확인
        let uploadType = '';
        elements.uploadType.forEach(function(radio) {
            if (radio.checked) uploadType = radio.value;
        });
        
        // 타입에 따라 다른 업로드 처리 방식 사용
        if (uploadType === 'layer') {
            // Shape 파일은 기존 방식으로 처리 (fetch API)
            handleShapefileUpload(elements, formData);
        } else {
            // 이미지 파일은 xhr 방식으로 처리 (실시간 진행률 표시)
            handleImagefileUpload(elements, formData);
        }
    }
    
    /**
     * Shape 파일 업로드 처리
     */
    function handleShapefileUpload(elements, formData) {
        elements.progressBar.style.width = '0%';
        elements.progressText.textContent = 'Starting upload...';
        
        fetch('/klums/api/shapefile/upload', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': _GL.csrf.token
            },
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                _GL.COMMON.showToast('File upload started', 'info');
                startProgressCheck(result.data.prgrs_id, 'layer');
            } else {
                throw new Error(result.data && result.data.err ? result.data.err : 'Upload failed');
            }
        })
        .catch(error => {
            console.error('Upload error:', error);
            _GL.COMMON.showToast(error.message || 'Upload failed', 'error');
            _GL.COMMON.showAlert('dataUploadAlert', error.message || 'Upload failed', 'error');
            resetForm(elements);
        });
    }
    
    /**
     * 이미지 파일 업로드 처리
     */
    function handleImagefileUpload(elements, formData) {
        // XMLHttpRequest 객체 생성
        const xhr = new XMLHttpRequest();
        
        // 업로드 진행 상황 이벤트 리스너 (실시간 진행률 표시)
        xhr.upload.addEventListener('progress', function(event) {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                elements.progressBar.style.width = percentComplete + '%';
                elements.progressText.textContent = 
                    `${Math.round(event.loaded / 1024)} KB / ${Math.round(event.total / 1024)} KB`;
            }
        });
        
        // 요청 완료 이벤트 리스너
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                try {
                    const result = JSON.parse(xhr.responseText);
                    if (result.success) {
                        _GL.COMMON.showToast('Image upload completed successfully', 'success');
                        _GL.COMMON.showAlert('dataUploadAlert', 'Image upload completed successfully', 'success');
                    } else {
                        throw new Error(result.data && result.data.err ? result.data.err : 'Upload failed');
                    }
                } catch (error) {
                    console.error('Upload response parsing error:', error);
                    _GL.COMMON.showToast(error.message || 'Upload failed', 'error');
                    _GL.COMMON.showAlert('dataUploadAlert', error.message || 'Upload failed', 'error');
                    resetForm(elements);
                }
            } else {
                _GL.COMMON.showToast('Upload failed with status ' + xhr.status, 'error');
                _GL.COMMON.showAlert('dataUploadAlert', 'Upload failed with status ' + xhr.status, 'error');
                resetForm(elements);
            }
        });
        
        // 오류 이벤트 리스너
        xhr.addEventListener('error', function() {
            console.error('Upload network error');
            _GL.COMMON.showToast('A network error occurred during the upload', 'error');
            _GL.COMMON.showAlert('dataUploadAlert', 'A network error occurred during the upload', 'error');
            resetForm(elements);
        });
        
        // 요청 취소 이벤트 리스너
        xhr.addEventListener('abort', function() {
            console.error('Upload aborted');
            _GL.COMMON.showToast('Upload was cancelled', 'warning');
            _GL.COMMON.showAlert('dataUploadAlert', 'Upload was cancelled', 'warning');
            resetForm(elements);
        });
        
        // 요청 설정 및 전송
        xhr.open('POST', '/klums/api/imagefile/upload', true);
        xhr.setRequestHeader('X-CSRF-TOKEN', _GL.csrf.token);
        xhr.send(formData);
    }

    /**
     * 진행상황 체크
     */
    function startProgressCheck(progressId, uploadType) {
        const elements = getElements();
        
        if (progressCheckInterval) {
            clearInterval(progressCheckInterval);
        }

        // 업로드 타입에 따라 API 엔드포인트 결정
        const endpoint = uploadType === 'layer' ? 
            '/klums/api/shapefile/progress' : 
            '/klums/api/imagefile/progress';

        progressCheckInterval = setInterval(function() {
            fetch(endpoint, {
                headers: {
                    'X-Progress-ID': progressId,
                    'X-CSRF-TOKEN': _GL.csrf.token
                }
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    updateProgress(result.data);
                    if (['COMPLETED', 'ERROR'].includes(result.data.stts)) {
                        clearInterval(progressCheckInterval);
                        if (result.data.stts === 'COMPLETED') {
                            showAlert('success', 'Upload completed successfully');
                            // Layer인 경우 맵 레이어 갱신
                            if (uploadType === 'layer' && typeof _GL.MAP !== 'undefined') {
                                _GL.MAP.refreshLayers();
                            }
                        } else {
                            showAlert('error', result.data.err || 'Upload failed');
                        }
                    }
                }
            })
            .catch(error => {
                console.error('Progress check error:', error);
                clearInterval(progressCheckInterval);
            });
        }, 100);
    }

    /**
     * 업로드 버튼 상태 업데이트
     */
    function updateUploadButtonState(elements) {
        const fileCount = elements.fileInput.files.length;
        let hasType = false;
        let hasProcess = true; // 기본값은 true로 설정 (Symbol 타입인 경우 process 체크 안함)
        
        // 업로드 타입 체크
        elements.uploadType.forEach(function(radio) {
            if (radio.checked) {
                hasType = true;
                // Layer 타입인 경우만 process 체크
                if (radio.value === 'layer') {
                    hasProcess = false;
                    elements.layerProcess.forEach(function(processRadio) {
                        if (processRadio.checked) hasProcess = true;
                    });
                }
            }
        });

        elements.uploadBtn.disabled = !(fileCount > 0 && hasType && hasProcess);
    }
    
    /**
     * 진행상황 업데이트
     */
    function updateProgress(progressData) {
        const elements = getElements();
        elements.progressBar.style.width = progressData.prgrs + '%';
        elements.progressText.textContent = 
            `${progressData.cmptn_rcd || 0} / ${progressData.tnocs_rcd || 0} records processed`;
    }

    /**
     * 폼 초기화
     */
    function resetForm(elements) {
        elements.uploadForm.reset();
        elements.progressArea.classList.add('d-none');
        elements.progressBar.style.width = '0%';
        elements.progressText.textContent = '';
        elements.uploadBtn.disabled = true;
        elements.alertContainer.innerHTML = '';
        
        // Layer Processing 영역 초기 상태 설정
        toggleLayerProcessingVisibility(elements, false);
        
        if (progressCheckInterval) {
            clearInterval(progressCheckInterval);
        }
    }

    /**
     * Layer Processing 영역 표시/숨김 처리
     */
    function toggleLayerProcessingVisibility(elements, isLayer) {
        if (isLayer) {
            elements.processContainer.style.display = 'block';
        } else {
            elements.processContainer.style.display = 'none';
            // 레이어 프로세스 선택 해제
            elements.layerProcess.forEach(function(radio) {
                radio.checked = false;
            });
        }
    }

    /**
     * 파일 입력 필드 초기화 및 설정
     */
    function updateFileInput(elements, isLayer) {
        // 파일 입력 필드 초기화
        elements.fileInput.value = '';
        
        // 허용 파일 타입 설정
        if (isLayer) {
            elements.fileInput.accept = '.shp,.shx,.dbf,.prj';
        } else {
            elements.fileInput.accept = '.jpg,.jpeg,.png';
        }
    }

/* =====================================================
    Event Listeners
======================================================*/
    function initializeEventListeners() {
        const elements = getElements();

        // 폼 제출 이벤트
        elements.uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(elements)) {
                handleFileUpload(elements);
            }
        });

        // 파일 선택 이벤트
        elements.fileInput.addEventListener('change', function() {
            updateUploadButtonState(elements);
        });

        // 업로드 타입 선택 이벤트
        elements.uploadType.forEach(function(radio) {
            radio.addEventListener('change', function() {
                const isLayer = this.value === 'layer';
                
                resetForm(elements);
                
                toggleLayerProcessingVisibility(elements, isLayer);
                updateFileInput(elements, isLayer);
                updateUploadButtonState(elements);
                
                this.checked = true;
            });
        });

        // 레이어 프로세스 선택 이벤트
        elements.layerProcess.forEach(function(radio) {
            radio.addEventListener('change', function() {
                updateUploadButtonState(elements);
            });
        });

        // 초기화 버튼 이벤트
        elements.clearBtn.addEventListener('click', function() {
            resetForm(elements);
        });
        
        // 초기 상태 설정
        resetForm(elements);
    }

    // public API
    return {
        init: function() {
            if (initialized) return;
            initializeEventListeners();
            initialized = true;
        }
    };
})();

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    _GL.MAP_UPLOAD.init();
});