/*========================================================
    DATE: 2024. 02
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
    function getElements(type) {
	   switch(type) {
	       case 'layer':
	           return {
	               form: {
	                   uploadForm: document.getElementById('layerUploadForm'),
	                   process: document.getElementsByName('layerProcess'),
	                   fileInput: document.getElementById('layerFile')
	               },
	               progress: {
	                   area: document.getElementById('progressArea'),
	                   bar: document.getElementById('progressBar'),
	                   text: document.getElementById('progressText')
	               },
	               buttons: {
	                   clear: document.getElementById('layerClearBtn'),
	                   upload: document.getElementById('layerUploadBtn')
	               }
	           };
	       case 'symbol':
	           return {
	               form: {
	                   uploadForm: document.getElementById('symbolUploadForm'),
	                   symbolType: document.getElementById('symbolType'), 
	                   fileInput: document.getElementById('symbolFile')
	               },
	               buttons: {
	                   clear: document.getElementById('symbolClearBtn'),
	                   upload: document.getElementById('symbolUploadBtn')
	               }
	           };
    	}
    }

/* =====================================================
    Upload Main
======================================================*/
    /**
     * 폼 데이터 검증
     */
    function validateForm(elements) {
        // 레이어 프로세스 체크
        let processSelected = false;
        elements.form.process.forEach(function(radio) {
            if (radio.checked) processSelected = true;
        });
        if (!processSelected) {
            _GL.COMMON.showToast('Please select layer process', 'warning');
            return false;
        }

        // 파일 체크
        const files = elements.form.fileInput.files;
        if (files.length === 0) {
            _GL.COMMON.showToast('Please select files', 'warning');
            return false;
        }

        // 필수 파일 확장자 체크
        const requiredExtensions = ['.shp', '.shx', '.dbf', '.prj'];
        const uploadedExtensions = Array.from(files).map(file => {
            return '.' + file.name.split('.').pop().toLowerCase();
        });
        
        const missingExtensions = requiredExtensions.filter(ext => 
            !uploadedExtensions.includes(ext)
        );

        if (missingExtensions.length > 0) {
            _GL.COMMON.showToast('Missing required files: ' + missingExtensions.join(', '), 'warning');
            return false;
        }

        return true;
    }

    /**
     * 파일 업로드 처리
     */
    function handleFileUpload(elements) {
        const formData = new FormData(elements.form.uploadForm);
        elements.buttons.upload.disabled = true;
        elements.progress.area.classList.remove('d-none');

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
                startProgressCheck(result.data.prgrs_id);
                _GL.COMMON.showToast('File upload started', 'info');
            } else {
                throw new Error(result.data.err);
            }
        })
        .catch(error => {
            console.error('Upload error:', error);
            _GL.COMMON.showToast(error, 'error');
            resetForm(elements);
        });
    }

    /**
     * 진행상황 체크
     */
    function startProgressCheck(progressId) {
        if (progressCheckInterval) {
            clearInterval(progressCheckInterval);
        }

        progressCheckInterval = setInterval(function() {
            fetch('/klums/api/shapefile/progress', {
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
                            _GL.COMMON.showToast('Upload completed successfully', 'success');
                        } else {
                            _GL.COMMON.showToast(result.data.err || 'Upload failed', 'error');
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
        const fileCount = elements.form.fileInput.files.length;
        let hasProcess = false;
        elements.form.process.forEach(function(radio) {
            if (radio.checked) hasProcess = true;
        });

        elements.buttons.upload.disabled = !(fileCount > 0 && hasProcess);
    }
    
    /**
     * 진행상황 업데이트
     */
    function updateProgress(progressData) {
        const elements = getElements('layer');
        elements.progress.bar.style.width = progressData.prgrs + '%';
        elements.progress.text.textContent = 
        	`${progressData.cmptn_rcd || 0} / ${progressData.tnocs_rcd || 0} records processed`;
    }

    /**
     * 폼 초기화
     */
    function resetForm(elements) {
        elements.form.uploadForm.reset();
        elements.progress.area.classList.add('d-none');
        elements.progress.bar.style.width = '0%';
        elements.progress.text.textContent = '';
        elements.buttons.upload.disabled = false;
        if (progressCheckInterval) {
            clearInterval(progressCheckInterval);
        }
    }

/* =====================================================
    Symbol Upload
======================================================*/
    
    
/* =====================================================
    Event Listeners
======================================================*/
    function initializeEventListeners() {
    	initializeLayerUploadEvents();   // 레이어 업로드 관련 이벤트
    }
    
    function initializeLayerUploadEvents() {
        const elements = getElements('layer');

        // 폼 제출 이벤트
        elements.form.uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(elements)) {
                handleFileUpload(elements);
            }
        });

        // 파일 선택 이벤트
        elements.form.fileInput.addEventListener('change', function() {
            updateUploadButtonState(elements);
        });

        // Process 선택 이벤트
        elements.form.process.forEach(function(radio) {
            radio.addEventListener('change', function() {
                updateUploadButtonState(elements);
            });
        });

        // 초기화 버튼 이벤트
        elements.buttons.clear.addEventListener('click', function() {
            resetForm(elements);
            updateUploadButtonState(elements);
        });
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