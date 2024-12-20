var UPLOAD = {
	detectedCoord: null,
    // DOM Elements
    elements: {
        uploadButton: document.querySelector('.Upload-Btn'),
        form: document.getElementById('shpUploadForm'),
        uploadArea: document.getElementById('popupDiUploadArea'),
        fileInput: document.getElementById('popupIpFiles'),
        fileList: document.getElementById('popupDiFileList'),
        progressBar: document.getElementById('progressBar'),
        progressPercentage: document.getElementById('progressPercentage'),
        processedRecords: document.getElementById('processedRecords'),
        totalRecords: document.getElementById('totalRecords'),
        loadingText: document.querySelector('.loading-text'),
        mapType: document.getElementById('popupSlMaptype'),
        coordSystem: document.getElementById('popupSlCoord'),
        year: document.getElementById('popupIpYear'),
        finalRecords: document.getElementById('finalRecords'),
        clearBtn: document.querySelector('.clear-btn'),
        nextBtn: document.getElementById('popupBtNext'),
        backBtn: document.getElementById('popupBtBack'),
        uploadBtn: document.getElementById('popupBtUpload'),
        closeBtn: document.querySelector('.Popclose-Btn'),
        doneBtn: document.querySelector('.done-btn')
    },
    
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            UPLOAD.eventHandlers.initializeEventListeners();
        });
    },
    
    // Constants
    REQUIRED_EXTENSIONS: ['.shp', '.shx', '.dbf', '.prj'],
    
    // Event Handlers
    eventHandlers: {
        initializeEventListeners() {
            // File Upload Area Events
            UPLOAD.elements.uploadArea.onclick = () => UPLOAD.elements.fileInput.click();
            UPLOAD.elements.uploadArea.ondragover = this.handleDragOver;
            UPLOAD.elements.uploadArea.ondragleave = this.handleDragLeave;
            UPLOAD.elements.uploadArea.ondrop = this.handleDrop;
            UPLOAD.elements.fileInput.onchange = () => UPLOAD.fileListManager.updateFileList();
            
            // Button Events
            UPLOAD.elements.clearBtn.onclick = this.handleClear;
            UPLOAD.elements.nextBtn.onclick = this.handleNext;
            UPLOAD.elements.backBtn.onclick = () => UPLOAD.uiManager.showStep('popupDiUpload');
            UPLOAD.elements.uploadBtn.onclick = this.handleUpload;
            UPLOAD.elements.doneBtn.onclick = this.handleDone;
            UPLOAD.elements.closeBtn.onclick = this.handleClose;
            
            // 좌표계 번경시 Event
            UPLOAD.elements.coordSystem.onchange = this.handleCoordChange;

            // Set Current Year
            UPLOAD.elements.year.value = new Date().getFullYear();
        },

        handleDragOver(e) {
            e.preventDefault();
            UPLOAD.elements.uploadArea.classList.add('dragover');
        },

        handleDragLeave() {
            UPLOAD.elements.uploadArea.classList.remove('dragover');
        },

        handleDrop(e) {
            e.preventDefault();
            UPLOAD.elements.uploadArea.classList.remove('dragover');
            UPLOAD.elements.fileInput.files = e.dataTransfer.files;
            UPLOAD.fileListManager.updateFileList();
        },
        
        handleUploadButton() {
            const currentStep = document.querySelector('.step-container.active');
            const stepId = currentStep ? currentStep.id : '';
            
            if (stepId === 'popupDiProgress' || stepId === 'popupDiComplete') {
                return;
            }
            
            UPLOAD.uiManager.resetUpload();
            UPLOAD.uiManager.resetSettingsForm();
        },
        
        handleClear() {
            UPLOAD.elements.fileInput.value = '';
            UPLOAD.elements.fileList.innerHTML = '';
            UPLOAD.elements.uploadArea.style.pointerEvents = '';
            UPLOAD.elements.uploadArea.style.opacity = '';
        },

        handleNext() {
            if (UPLOAD.elements.fileInput.files.length === 0) {
            	CMM.sweetAlert.info('Please select files first');
                return;
            }
            if (!UPLOAD.fileListManager.validateFiles()) {
                return;
            }

            // PRJ 파일 분석 후 좌표계 설정
            const files = UPLOAD.elements.fileInput.files;
            const prjFile = Array.from(files).find(file => file.name.toLowerCase().endsWith('.prj'));
            
            if (prjFile) {
                const formData = new FormData();
                formData.append('prjFile', prjFile);

                fetch('./layer/analyzePrj.do', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
				    if (data.success && data.coord) {
				    	UPLOAD.uiManager.resetSettingsForm();
				        UPLOAD.elements.coordSystem.value = data.coord;
				        UPLOAD.detectedCoord = data.coord;
				        document.getElementById('coordSystemNote').style.display = 'block';
				    } else {
				    	CMM.sweetAlert.error('Coordinate system analysis failed. Please select manually');
				        document.getElementById('coordSystemNote').style.display = 'none';
				        UPLOAD.uiManager.resetSettingsForm();
				    }
				    UPLOAD.uiManager.showStep('popupDiSettings');
				})
                .catch(error => {
                	CMM.sweetAlert.error('Coordinate system analysis failed. Please select manually');
                    UPLOAD.uiManager.showStep('popupDiSettings');
                    UPLOAD.uiManager.resetSettingsForm();
                });
            } else {
                UPLOAD.uiManager.showStep('popupDiSettings');
                UPLOAD.uiManager.resetSettingsForm();
            }
        },

        handleCoordChange(e) {
            const selectedCoord = e.target.value;
            if (selectedCoord == UPLOAD.detectedCoord) {
                return;
            }
            if (UPLOAD.detectedCoord && UPLOAD.detectedCoord !== selectedCoord) {
                CMM.sweetAlert.warning(
                    `You have selected a different coordinate system (EPSG:${selectedCoord}) ` +
                    `from the one detected in the PRJ file (EPSG:${UPLOAD.detectedCoord})<br><br>` +
                    `If an incorrect coordinate system is selected, the data may not be displayed properly`,
                    (confirmed) => {
                        if (!confirmed) {
                            e.target.value = UPLOAD.detectedCoord;
                        }
                    }
                );
            }
        },
    
        handleUpload() {
            if (!UPLOAD.formManager.validateSettings()) {
                return;
            }
            UPLOAD.formManager.submitForm();
        },
        
        handleDone() {
            UPLOAD.uiManager.resetUpload();
        },

        handleClose() {
            const activeStep = document.querySelector('.step-container.active');
            if (activeStep.id === 'popupDiUpload') {
                UPLOAD.eventHandlers.handleClear();
            }
        }
    },
    
    // File List Manager
    fileListManager: {
        updateFileList() {
            UPLOAD.elements.fileList.innerHTML = '';
            Array.from(UPLOAD.elements.fileInput.files).forEach(this.createFileListItem.bind(this));
            
            if (!this.validateFileNames()) {
            	CMM.sweetAlert.error('Only one Shapefile set can be uploaded at a time. Please reselect the files');
                this.clearFileInput();
            }
        },

        createFileListItem(file, index) {
            const item = document.createElement('div');
            item.className = 'file-item';
            
            item.innerHTML = `
                <div class="file-icon">${this.getFileIcon(file.name)}</div>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${this.formatFileSize(file.size)}</div>
                </div>
                <span class="remove-file">×</span>
            `;

            item.querySelector('.remove-file').onclick = () => this.removeFile(index);
            UPLOAD.elements.fileList.appendChild(item);
        },

        removeFile(index) {
            const dt = new DataTransfer();
            Array.from(UPLOAD.elements.fileInput.files)
                .filter((_, i) => i !== index)
                .forEach(file => dt.items.add(file));
            UPLOAD.elements.fileInput.files = dt.files;
            this.updateFileList();
        },

        validateFiles() {
            const uploadedExts = Array.from(UPLOAD.elements.fileInput.files)
                .map(f => '.' + f.name.split('.').pop().toLowerCase());
            const missingExts = UPLOAD.REQUIRED_EXTENSIONS.filter(ext => !uploadedExts.includes(ext));
            
            if (missingExts.length > 0) {
            	CMM.sweetAlert.error("Required files missing: " + missingExts.join(", "));
                return false;
            }
            return true;
        },

        validateFileNames() {
            const selectedFiles = UPLOAD.elements.fileInput.files;
            const fileNames = new Set();

            for (let i = 0; i < selectedFiles.length; i++) {
                fileNames.add(selectedFiles[i].name.split('.')[0]);
            }

            if (fileNames.size > 1) {
            	CMM.sweetAlert.error('Only one Shapefile set can be uploaded at a time. Please reselect the files');
                return false;
            }

            return true;
        },
        
        clearFileInput() {
            UPLOAD.elements.fileInput.value = '';
            this.updateFileList();
        },
        
        getFileIcon(fileName) {
            const ext = fileName.split('.').pop().toLowerCase();
            return ext === 'shp' ? '📍' : ext === 'dbf' ? '📊' : ext === 'shx' ? '📑' : ext === 'prj' ? '🌐' : '📄';
        },

        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
    },
    
    // Form Manager
    formManager: {
        validateSettings() {
            const mapType = UPLOAD.elements.mapType.value;
            const coordSystem = UPLOAD.elements.coordSystem.value;
            const year = UPLOAD.elements.year.value;
            const selectedLayerProcess = document.querySelector('input[name="layerProcess"]:checked');
            const layerProcessValue = selectedLayerProcess ? selectedLayerProcess.value : null;

            if (!mapType || !coordSystem || !year || !layerProcessValue) {
            	CMM.sweetAlert.error('Please fill in all required fields');
                return false;
            }
            if (!/^\d{4}$/.test(year) || year < 1900 || year > 2100) {
            	CMM.sweetAlert.error('Year must be a 4-digit number between 1900 and 2100');
                return false;
            }
            
            return true;
        },

        submitForm() {
            const formData = new FormData(UPLOAD.elements.form);
            formData.append('mapType', UPLOAD.elements.mapType.value);
            formData.append('coord', UPLOAD.elements.coordSystem.value);
            formData.append('year', UPLOAD.elements.year.value);
            formData.append('layerProcess', document.querySelector('input[name="layerProcess"]:checked').value);
            
            CMM.sweetAlert.loading('Preparing files for upload');
            this.uploadFiles(formData);
        },

        uploadFiles(formData) {
            fetch('./layer/uploadShpData.do', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                CMM.sweetAlert.close();
                UPLOAD.uiManager.showStep('popupDiProgress');
                UPLOAD.progressManager.monitorProgress(data.prgrs_id);
            })
            .catch(error => {
                CMM.sweetAlert.close();
                CMM.sweetAlert.error(error.message);
            });
        }
    },
    
    // Progress Manager
    progressManager: {
    	monitorProgress(prgrsId) {
            fetch("./layer/progress.do", {
                method: 'GET',
                headers: { 'X-Progress-ID': prgrsId }
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                this.updateProgressUI(data);
                if (data.cmptn_yn === "N" && data.stts !== "ERROR") {
                    setTimeout(() => this.monitorProgress(prgrsId), 500);
                }
            })
            .catch(error => {
                UPLOAD.uiManager.showError(error.message);
            });
        },

        updateProgressUI(data) {
            if (!data) return;

            if (!this.loadingInterval) {
                this.startLoadingAnimation();
            }

            const progress = data.prgrs || 0;
            UPLOAD.uiManager.updateProgressBar(progress);
            UPLOAD.uiManager.updateProgressText(data);

            if (data.stts === "ERROR") {
                this.stopLoadingAnimation();
                CMM.sweetAlert.error(data.err || "An error occurred during upload").then(() => {
                    UPLOAD.uiManager.showStep('popupDiUpload');
                });
                return;
            }

            if (data.cmptn_yn === "Y") {
                this.stopLoadingAnimation();
                UPLOAD.uiManager.handleCompletion(data);
            }
        },
        
        startLoadingAnimation() {
            if (this.loadingInterval) {
                clearInterval(this.loadingInterval);
            }
            
            const dotsElement = document.querySelector('.loading-dots');
            let dots = 0;
            
            this.loadingInterval = setInterval(() => {
                dots = (dots + 1) % 4;
                if (dotsElement) {
                    dotsElement.textContent = '.'.repeat(dots);
                }
            }, 500);
        },

        stopLoadingAnimation() {
            if (this.loadingInterval) {
                clearInterval(this.loadingInterval);
                this.loadingInterval = null;
            }
        },
    },
    
    // UI Manager
    uiManager: {
    	statusText: {
    		'INITIALIZING': 'Initializing files',
    	    'PARSING': 'Analyzing files',
    	    'PROCESSING': 'Processing your data',
    	    'COMPLETED': 'Upload complete',
    	    'ERROR': 'An error occurred during upload'
        },
        
        showStep(stepId) {
            document.querySelectorAll('.step-container').forEach(container => {
                container.classList.remove('active');
            });
            document.getElementById(stepId).classList.add('active');
        },
        
        updateProgressBar(progress) {
            UPLOAD.elements.progressBar.style.width = `${progress}%`;
            UPLOAD.elements.progressBar.style.backgroundColor = this.getProgressColor(progress);
            UPLOAD.elements.progressBar.style.boxShadow = `0 0 10px rgba(0, 150, 255, ${Math.min(0.8, Math.max(0.3, progress / 100))})`;
        },

        updateProgressText(data) {
            UPLOAD.elements.progressPercentage.textContent = `${data.prgrs || 0}%`;
            UPLOAD.elements.processedRecords.textContent = data.cmptn_rcd || 0;
            UPLOAD.elements.totalRecords.textContent = data.tnocs_rcd || 0;
            
            if (data.stts) {
                const loadingText = UPLOAD.elements.loadingText;
                
                loadingText.classList.remove('INITIALIZING', 'PARSING', 'PROCESSING', 'COMPLETED', 'ERROR');
                
                loadingText.textContent = this.statusText[data.stts] || data.stts;
                loadingText.classList.add(data.stts);
            }
        },

        handleCompletion(data) {
            UPLOAD.elements.finalRecords.textContent = data.tnocs_rcd;
            this.showStep('popupDiComplete');
            UPLOAD.elements.progressBar.style.backgroundColor = '#48BB78';
        },

        getProgressColor(progress) {
            const hue = 200 - (progress * 0.55);
            const saturation = 75 + (progress * 0.15);
            const lightness = 50 + (progress * 0.1);
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        },

        resetUpload() {
            UPLOAD.elements.fileInput.value = '';
            UPLOAD.elements.fileList.innerHTML = '';
            UPLOAD.elements.uploadArea.style.pointerEvents = '';
            UPLOAD.elements.uploadArea.style.opacity = '';
            
            UPLOAD.elements.progressBar.style.width = '0%';
            UPLOAD.elements.progressBar.style.backgroundColor = '';
            UPLOAD.elements.progressBar.style.boxShadow = '';
            UPLOAD.elements.progressPercentage.textContent = '0%';
            UPLOAD.elements.processedRecords.textContent = '0';
            UPLOAD.elements.totalRecords.textContent = '0';
            UPLOAD.elements.loadingText.textContent = 'Uploading files';
            
            this.showStep('popupDiUpload');
        },
        
        resetSettingsForm() {
        	UPLOAD.detectedCoord = null;
            UPLOAD.elements.mapType.value = '';
            UPLOAD.elements.coordSystem.value = '';
            UPLOAD.elements.year.value = new Date().getFullYear();
            const radioInputs = document.querySelectorAll('input[name="layerProcess"]');
            radioInputs.forEach(input => input.checked = false);
        }
    }
}

UPLOAD.init();