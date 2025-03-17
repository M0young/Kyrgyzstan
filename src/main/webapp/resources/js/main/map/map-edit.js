/*========================================================
    DATE: 2024. 02
    AUTHOR: MOYOUNG
    DESC: Map Edit Module
========================================================*/
_GL.MAP_EDIT = (function() {
    'use strict';

    // 모듈 상태 관리
    let initialized = false;
    let instance = null;
    let editMode = null;
    let editingFeatures = false;

    // OpenLayers 객체
    let editSource = null;
    let editLayer = null;
    let drawInteraction = null;
    let modifyInteraction = null;
    let selectInteraction = null;

    // 임시 피처 및 히스토리 관리
    const tempFeatures = [];
    let tempIdCounter = 1;
    
    // 이벤트 리스너와 히스토리 관리
    const eventListeners = { draw: null, select: null, modify: null };
    const history = {
        changes: [],  // 변경사항 기록
        position: -1  // 현재 위치
    };
    
    // 속성 테이블 상태 관리
    const attributeTable = {
	    popup: null,              // 팝업 요소 참조
	    currentFeature: null,     // 현재 선택된 피처
	    currentPage: 1,           // 현재 페이지 (페이지네이션)
	    pageSize: 10,             // 페이지당 표시할 피처 수
	    isFullTableMode: false,   // 전체 테이블/단일 피처 모드
	    columnOrder: null,        // 컬럼 순서 저장
	    mapMoveEndListener: null, // 맵 이동 이벤트 리스너
	    refreshTimeout: null,     // 리프레시 타임아웃 핸들
	    searchTerm: '',           // 검색어
	    filteredFeatures: []      // 검색 결과 피처 목록
	};

    /**
     * DOM 요소 가져오기
     */
    function getElements() {
        return {
            startBtn: document.getElementById('editStartBtn'),
            stopBtn: document.getElementById('editStopBtn'),
            undoBtn: document.getElementById('editUndoBtn'),
            redoBtn: document.getElementById('editRedoBtn'),
            editMode: document.querySelectorAll('input[name="editMode"]'),
            selectModeBtn: document.getElementById('selectModeBtn'),
            drawModeBtn: document.getElementById('drawModeBtn'),
            modifyModeBtn: document.getElementById('modifyModeBtn'),
            deleteModeBtn: document.getElementById('deleteModeBtn'),
            saveBtn: document.getElementById('editSaveBtn'),
            discardBtn: document.getElementById('editDiscardBtn'),
            popup: document.getElementById('mapPopupEdit')
        };
    }
    
    /**
     * UI 상태 초기화
     */
    function initializeUIState() {
        const elements = getElements();
        
        // 나머지 모든 컨트롤 비활성화
        elements.stopBtn.disabled = true;
        elements.undoBtn.disabled = true;
        elements.redoBtn.disabled = true;
        elements.selectModeBtn.disabled = true;
        elements.drawModeBtn.disabled = true;
        elements.modifyModeBtn.disabled = true;
        elements.deleteModeBtn.disabled = true;
        elements.saveBtn.disabled = true;
        elements.discardBtn.disabled = true;
        elements.editMode.forEach(radio => {
            radio.checked = false;
        });
    }
    
    /**
     * 편집 레이어 초기화
     */
    function initializeEditLayer() {
        editSource = new ol.source.Vector();
        editLayer = new ol.layer.Vector({
            source: editSource,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.4)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ffcc33'
                    })
                })
            }),
            id: 'editLayer',
            zIndex: 1100
        });
        instance.addLayer(editLayer);
    }

    /**
     * 편집 도구 초기화
     */
    function initializeInteractions() {
        removeInteractions();

        // Draw
        drawInteraction = new ol.interaction.Draw({
            source: editSource,
            type: 'MultiPolygon',
            geometryName: 'geom'
        });
        eventListeners.draw = event => {
        	console.log("Draw completed, feature:", event.feature);
            // 즉시 ID 할당
            const newId = 'temp_' + (tempIdCounter++);
            event.feature.setId(newId);
            
            console.log('새 피처 생성:', newId);
            
            // 기본 스키마 속성 적용
            applyDefaultSchemaToFeature(event.feature);
            
            console.log('기본 스키마 적용 후 속성:', event.feature.getProperties());
            
            // 임시 피처 배열에 복제하여 추가
            const clonedFeature = event.feature.clone();
            clonedFeature.setId(newId); // ID 명시적 설정 (클론 후에도)
            tempFeatures.push(clonedFeature);
            
            // 히스토리에 추가 - insert 기록
            addToHistory('insert', event.feature);
            
            // 현재 모드를 저장했다가 다시 설정
            const currentMode = attributeTable.isFullTableMode;
            attributeTable.isFullTableMode = false;
            
            // 피처 선택 동기화
            if (selectInteraction && selectInteraction.getActive()) {
                selectInteraction.getFeatures().clear();
                selectInteraction.getFeatures().push(event.feature);
            }
            
            // 단일 피처 편집 모드로 설정
            attributeTable.currentFeature = event.feature;
            showAttributeEditor(event.feature);
            console.log("Feature added to source successfully");
        };
        drawInteraction.on('drawend', eventListeners.draw);

        // Select
        selectInteraction = new ol.interaction.Select({
            layers: [editLayer],
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(33, 150, 243, 0.4)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#2196F3',
                    width: 3,
                }),
                zIndex: 100
            })
        });
        eventListeners.select = (event) => {
            if (event.selected.length > 0) {
                const selectedFeature = event.selected[0];
                const selectedId = selectedFeature.getId();
                
                syncSelectedFeature();
                
                // 속성 테이블이 열려있다면 해당 행에 선택 상태 표시
                if (attributeTable.popup && attributeTable.popup.style.display === 'block' && attributeTable.isFullTableMode) {
                    highlightFeatureInTable(selectedId);
                }
                
                if (editMode === 'delete') {
                    _GL.COMMON.showAlertModal({
                        title: '피처 삭제',
                        message: '선택한 피처를 삭제하시겠습니까?',
                        type: 'error',
                        btn1: {
                            text: 'Delete',
                            callback: function() {
                                const clonedFeature = selectedFeature.clone();
                                clonedFeature.setId(selectedFeature.getId());
                                clonedFeature.setStyle(editLayer.getStyle());
                                addToHistory('delete', clonedFeature);
                                editSource.removeFeature(selectedFeature);
                                updateUIState();
                            }
                        },
                        btn2: {}
                    });
                } else {
                    // 전체 테이블 모드에서는 단일 피처 편집으로 전환하지 않고 피처 선택만 유지
                    if (attributeTable.popup && 
                        attributeTable.popup.style.display === 'block' && 
                        attributeTable.isFullTableMode) {
                        attributeTable.currentFeature = selectedFeature; // 현재 피처 업데이트
                        // 단일 피처 편집으로는 전환하지 않음 (updateAttributeEditor 호출하지 않음)
                    } else {
                        // 속성 테이블이 닫혀있거나 이미 단일 피처 모드라면 에디터 표시
                        showAttributeEditor(selectedFeature);
                    }
                }
            }
        };
        selectInteraction.on('select', eventListeners.select);

        // Modify
        const originalGeometries = {};
        modifyInteraction = new ol.interaction.Modify({
            features: selectInteraction.getFeatures(),
            pixelTolerance: 10,
            geometryName: 'geom'
        });
        modifyInteraction.on('modifystart', event => {
            event.features.forEach(feature => {
                const id = feature.getId() || 'temp_' + Date.now();
                if (!feature.getId()) {
                    feature.setId(id);
                }
                // 수정 시작 시 원본 형상 저장
                originalGeometries[id] = feature.getGeometry().clone();
            });
        });
        eventListeners.modify = event => {
            event.features.forEach(feature => {
                const id = feature.getId();
                if (id && originalGeometries[id]) {
                    addToHistory('update', feature, originalGeometries[id]);
                    delete originalGeometries[id];
                } else {
                    addToHistory('update', feature, feature.getGeometry().clone());
                }
            });
        };
        modifyInteraction.on('modifyend', eventListeners.modify);
        
        // 도구 추가 및 비활성화
        [drawInteraction, selectInteraction, modifyInteraction].forEach(interaction => {
            instance.addInteraction(interaction);
            interaction.setActive(false);
        });
    }
    
/* =====================================================
    Feature Schema Management
======================================================*/
    /**
     * 데이터 타입별 기본값 반환
     */
    function getDefaultValueByType(fieldName, fieldType) {
        if (!fieldType) return '';
        
        // 타입별 기본값 설정
        switch(fieldType.toLowerCase()) {
            case 'int':
            case 'float8':
                return 0;
            case 'varchar':
            default:
                return '';
        }
    }
    
    /**
     * 기본 피처 스키마 생성
     */
    function createDefaultFeatureSchema() {
        const schema = {};
        
        for (const [fieldName, fieldType] of Object.entries(_GL.MAP.typeCache)) {
            schema[fieldName] = getDefaultValueByType(fieldName, fieldType);
        }
        
        return schema;
    }

    /**
     * 피처 값 정규화 - 타입에 맞게 변환
     */
    function normalizeFeatureValues(feature) {
        if (!feature || !_GL.MAP.typeCache) return feature;
        
        const properties = feature.getProperties();
        
        for (const [key, value] of Object.entries(properties)) {
            if (key === 'geometry' || key === 'geom') continue;
            
            const fieldType = _GL.MAP.typeCache[key];
            if (!fieldType) continue;
            
            if (value === null || value === undefined || value === '') {
                feature.set(key, getDefaultValueByType(key, fieldType));
                continue;
            }
            
            switch(fieldType.toLowerCase()) {
                case 'int':
                case 'integer':
                    feature.set(key, parseInt(value) || 0);
                    break;
                case 'float4':
                case 'float8':
                case 'numeric':
                case 'decimal':
                case 'double':
                    feature.set(key, parseFloat(value) || 0.0);
                    break;
            }
        }
        
        return feature;
    }

    /**
     * 피처에 기본 스키마 적용
     */
    function applyDefaultSchemaToFeature(feature) {
        const schema = {};
        
        // 모든 필드를 null로 초기화
        for (const key of Object.keys(_GL.MAP.typeCache)) {
            schema[key] = null;
        }
        
        // 스키마의 각 속성을 피처에 설정
        for (const [key, value] of Object.entries(schema)) {
            feature.set(key, value);
        }
        
        return feature;
    }
    
    /**
     * 편집 도구 제거
     */
    function removeInteractions() {
        if (drawInteraction) {
            if (eventListeners.draw) {
                drawInteraction.un('drawend', eventListeners.draw);
            }
            instance.removeInteraction(drawInteraction);
            drawInteraction = null;
        }
        
        if (selectInteraction) {
            if (eventListeners.select) {
                selectInteraction.un('select', eventListeners.select);
            }
            instance.removeInteraction(selectInteraction);
            selectInteraction = null;
        }
        
        if (modifyInteraction) {
            if (eventListeners.modify) {
                modifyInteraction.un('modifyend', eventListeners.modify);
            }
            instance.removeInteraction(modifyInteraction);
            modifyInteraction = null;
        }
    }
    
/* =====================================================
    Edit Main
======================================================*/
    /**
     * WFS 요청으로 피처 로드
     */
    function loadLayerFeatures() {
        instance.getTargetElement().classList.add('spinner');
        
        if (editingFeatures && history.position >= 0) {
            instance.getTargetElement().classList.remove('spinner');
            return Promise.resolve(editSource.getFeatures().length);
        }
        
        const currentTempFeatures = editSource.getFeatures()
            .filter(f => {
                const id = f.getId();
                return id && id.toString().startsWith('temp_');
            })
            .map(f => f.clone());
        
        if (currentTempFeatures.length > 0) {
            tempFeatures.splice(0, tempFeatures.length, ...currentTempFeatures);
        }
        
        const extent = instance.getView().calculateExtent(instance.getSize());
        const transformedExtent = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
        
        const wfsUrl = new URL(window.location.origin + _GL.MAP_CONFIG.URLS.WFS);
        wfsUrl.searchParams.append('service', 'WFS');
        wfsUrl.searchParams.append('version', '1.1.0');
        wfsUrl.searchParams.append('request', 'GetFeature');
        wfsUrl.searchParams.append('typeName', 'klums:land_use');
        wfsUrl.searchParams.append('outputFormat', 'application/json');
        wfsUrl.searchParams.append('srsName', 'EPSG:3857');
        wfsUrl.searchParams.append('bbox', transformedExtent.join(',') + ',EPSG:4326');
        wfsUrl.searchParams.append('maxFeatures', '1000');

        return fetch(wfsUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data.features) {
                    throw new Error('No features in response');
                }

                const features = new ol.format.GeoJSON().readFeatures(data, {
                    featureProjection: 'EPSG:3857'
                });

                const tempFeatureIds = tempFeatures.map(f => f.getId());
                
                const tempFeaturesInSource = editSource.getFeatures()
                    .filter(f => {
                        const id = f.getId();
                        return id && id.toString().startsWith('temp_');
                    });
                
                editSource.clear();
                
                features.forEach(feature => {
                    const featureId = feature.getId();
                    if (!featureId || !tempFeatureIds.includes(featureId)) {
                        editSource.addFeature(feature);
                    }
                });
                
                tempFeaturesInSource.forEach(feature => {
                    editSource.addFeature(feature);
                });
                
                editLayer.setVisible(true);
                
                if (features.length === 1000) {
                    _GL.COMMON.showToast('현재 화면에 표시할 수 있는 최대 피처 수만 로드되었습니다. 확대하면 더 상세하게 볼 수 있습니다.', 'info');
                } else {
                    _GL.COMMON.showToast(`현재 화면에 ${features.length}개 피처가 로드되었습니다.`, 'info');
                }
                
                return features.length;
            })
            .catch(error => {
                _GL.COMMON.showToast(`Failed to load features: ${error.message}`, 'error');
                throw error;
            })
            .finally(() => {
                instance.getTargetElement().classList.remove('spinner');
            });
    }
    
    /**
     * 편집 모드 설정
     */
    function setEditMode(mode) {
        [drawInteraction, selectInteraction, modifyInteraction].forEach(interaction => {
            if (interaction) interaction.setActive(false);
        });

        editMode = mode;
        
        switch(mode) {
	        case 'select':
	            selectInteraction.setActive(true);
	            break;
            case 'draw':
                drawInteraction.setActive(true);
                break;
            case 'modify':
                selectInteraction.setActive(true);
                modifyInteraction.setActive(true);
                break;
            case 'delete':
                selectInteraction.setActive(true);
                break;
        }
    }
    
    /**
     * UI 상태 업데이트
     */
    function updateUIState() {
        const elements = getElements();
        
        const hasActiveChanges = history.position >= 0;
        
        elements.undoBtn.disabled = history.position < 0;
        elements.redoBtn.disabled = history.position >= history.changes.length - 1;
        
        if (!elements.stopBtn.disabled) {
            elements.saveBtn.disabled = true;
            elements.discardBtn.disabled = true;
        } else {
            elements.saveBtn.disabled = !hasActiveChanges;
            elements.discardBtn.disabled = !hasActiveChanges;
        }
    }

    /**
     * 편집 상태 리셋
     */
    function resetEditState() {
        const elements = getElements();
        
        history.changes = [];
        history.position = -1;
        editSource.clear();
        
        elements.startBtn.disabled = false;
        elements.saveBtn.disabled = true;
        elements.discardBtn.disabled = true;
        
        if (attributeTable.popup) {
            attributeTable.popup.style.display = 'none';
        }

        if (editLayer) {
            editLayer.setVisible(false);
        }
        
        editingFeatures = false;
        
        updateUIState();
    }
    
    /**
     * WFS 트랜잭션 전송
     */
    function sendWFSTransaction() {
        fixMissingFeatureIds();
        
        const currentChanges = history.changes.slice(0, history.position + 1);
        
        if (!currentChanges || currentChanges.length === 0) {
            return Promise.reject(new Error('No changes to save'));
        }
        
        return new Promise((resolve, reject) => {
            try {
                const formatWFS = new ol.format.WFS();
                
                const transOptions = {
                    featureNS: 'http://klums',
                    featurePrefix: 'klums',
                    featureType: 'land_use',
                    srsName: 'EPSG:3857',
                    version: '1.1.0',
                    geometryName: 'geom'
                };
        
                const toInsert = [];
                const toUpdate = [];
                const toDelete = [];
                
                const processedIds = new Set();
                
                for (let i = 0; i < currentChanges.length; i++) {
                    const change = currentChanges[i];
                    
                    if (!change || !change.feature) {
                        continue;
                    }
                    
                    const featureId = change.feature.getId();
                    if (!featureId) {
                        continue;
                    }
                    
                    if (processedIds.has(featureId)) {
                        continue;
                    }
                    
                    processedIds.add(featureId);
                    
                    const feature = new ol.Feature();
                    
                    const originalGeom = change.feature.getGeometry();
                    if (originalGeom) {
                        feature.setGeometry(originalGeom.clone());
                    }
                    
                    const props = change.feature.getProperties();
                    for (const key in props) {
                        if (key !== 'geometry' && key !== 'geom') {
                            let value = props[key];
                            
                            if (value === null || value === undefined) {
                                feature.set(key, null);
                            } else {
                                feature.set(key, value);
                            }
                        }
                    }
                    
                    const isTemp = featureId.toString().startsWith('temp_');
                    
                    if (change.type === 'insert' || isTemp) {
                        feature.setId(null);
                        toInsert.push(feature);
                    } else if (change.type === 'update' && !isTemp) {
                        feature.setId(featureId);
                        toUpdate.push(feature);
                    } else if (change.type === 'delete' && !isTemp) {
                        feature.setId(featureId);
                        toDelete.push(feature);
                    }
                }
                
                if (toInsert.length === 0 && toUpdate.length === 0 && toDelete.length === 0) {
                    reject(new Error('No valid features to save'));
                    return;
                }
                
                const transactionXml = formatWFS.writeTransaction(
                    toInsert,
                    toUpdate,
                    toDelete,
                    transOptions
                );
                
                let serializedXml = new XMLSerializer().serializeToString(transactionXml);
                serializedXml = serializedXml.replace(/<geometry>/g, '<geom>');
                serializedXml = serializedXml.replace(/<\/geometry>/g, '</geom>');
                serializedXml = serializedXml.replace(/name="geometry"/g, 'name="geom"');
                serializedXml = serializedXml.replace(/<Name>geometry<\/Name>/g, '<Name>geom</Name>');
                
                fetch(_GL.MAP_CONFIG.URLS.WFS, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/xml',
                        'X-CSRF-TOKEN': _GL.csrf.token
                    },
                    body: serializedXml
                })
                .then(response => response.text())
                .then(text => {
                    if (text.includes('Exception') || text.includes('Error')) {
                        throw new Error(`WFS Transaction failed: Response: ${text}`);
                    }
                    resolve(text);
                })
                .catch(error => {
                    reject(error);
                });
            } catch (error) {
                reject(new Error(`Failed to create WFS transaction: ${error.message}`));
            }
        });
    }
    
    /**
     * 기존 변경 내역에서 ID가 없는 피처 수정
     */
    function fixMissingFeatureIds() {
        if (history.changes && history.changes.length > 0) {
            let fixedCount = 0;
            
            history.changes.forEach((change, index) => {
                if (change && change.feature) {
                    const featureId = change.feature.getId();
                    
                    if (!featureId) {
                        const newId = 'temp_fixed_' + Date.now() + '_' + index;
                        change.feature.setId(newId);
                        
                        fixedCount++;
                        
                        for (let i = 0; i < tempFeatures.length; i++) {
                            const tempFeature = tempFeatures[i];
                            if (!tempFeature.getId()) {
                                tempFeature.setId(newId);
                                break;
                            }
                        }
                    }
                }
            });
        }
    }
    
    /**
     * 히스토리에 변경사항 추가
     */
    function addToHistory(type, feature, originalGeometry = null) {
        let featureId = feature.getId();
        
        if (!featureId) {
            featureId = 'temp_' + Date.now();
            feature.setId(featureId);
        }
        
        const clonedFeature = feature.clone();
        clonedFeature.setId(featureId);
        
        console.log(`히스토리에 추가하기 전 원본 피처 속성:`, feature.getProperties());
        console.log(`히스토리에 추가할 복제된 피처 속성:`, clonedFeature.getProperties());
        const change = {
            type: type,
            feature: clonedFeature,
            timestamp: Date.now(),
            originalGeometry: originalGeometry || feature.getGeometry().clone()
        };

        if (history.position < history.changes.length - 1) {
            history.changes = history.changes.slice(0, history.position + 1);
        }

        if (type === 'insert') {
            const existingIndex = history.changes.findIndex(c => 
                c.type === 'insert' && c.feature && c.feature.getId() === featureId
            );
            
            if (existingIndex >= 0) {
                history.changes[existingIndex] = change;
            } else {
                history.changes.push(change);
                history.position++;
            }
        } else {
            history.changes.push(change);
            history.position++;
        }
        
        updateUIState();
    }
    
    /**
     * 피처 변경 적용
     */
    function applyFeatureChange(change, isUndo = false) {
        const featureId = change.feature.getId();
        if (!featureId) {
            return;
        }

        const feature = editSource.getFeatureById(featureId);
        if (!feature && change.type !== 'insert' && !(change.type === 'delete' && isUndo)) {
            return;
        }

        switch(change.type) {
            case 'insert':
                if (isUndo) {
                    if (feature) {
                        editSource.removeFeature(feature);
                        
                        if (featureId.toString().startsWith('temp_')) {
                            const index = tempFeatures.findIndex(f => f.getId() === featureId);
                            if (index !== -1) {
                                tempFeatures.splice(index, 1);
                            }
                        }
                    }
                } else {
                    const newFeature = change.feature.clone();
                    newFeature.setId(featureId);
                    editSource.addFeature(newFeature);
                    
                    if (featureId.toString().startsWith('temp_')) {
                        const exists = tempFeatures.some(f => f.getId() === featureId);
                        if (!exists) {
                            tempFeatures.push(newFeature.clone());
                        }
                    }
                }
                break;
                
            case 'update':
                if (feature) {
                    if (isUndo) {
                        feature.setGeometry(change.originalGeometry.clone());
                    } else {
                        feature.setGeometry(change.feature.getGeometry().clone());
                    }
                    editSource.dispatchEvent('changefeature');
                    
                    if (featureId.toString().startsWith('temp_')) {
                        const index = tempFeatures.findIndex(f => f.getId() === featureId);
                        if (index !== -1) {
                            const updatedFeature = feature.clone();
                            tempFeatures[index] = updatedFeature;
                        }
                    }
                }
                break;
                
            case 'delete':
                if (isUndo) {
                    const restoredFeature = change.feature.clone();
                    restoredFeature.setId(featureId);
                    editSource.addFeature(restoredFeature);
                    
                    if (featureId.toString().startsWith('temp_')) {
                        const exists = tempFeatures.some(f => f.getId() === featureId);
                        if (!exists) {
                            tempFeatures.push(restoredFeature.clone());
                        }
                    }
                } else {
                    if (feature) {
                        editSource.removeFeature(feature);
                        
                        if (featureId.toString().startsWith('temp_')) {
                            const index = tempFeatures.findIndex(f => f.getId() === featureId);
                            if (index !== -1) {
                                tempFeatures.splice(index, 1);
                            }
                        }
                    }
                }
                break;
        }
    }
    
/* =====================================================
    Attribute Table
======================================================*/
    /**
     * 전체 속성 테이블 표시
     */
    function showAttributeTable() {
        if (attributeTable.popup && attributeTable.popup.style.display === 'block') {
            updateAttributeTable();
            return;
        }
        
        if (!attributeTable.popup) {
            createAttributePopup();
        }
        
        if (editSource.getFeatures().length === 0) {
            _GL.COMMON.showToast('피처를 먼저 로드합니다...', 'info');
            loadLayerFeatures().then(() => {
                attributeTable.popup.style.display = 'block';
                updateAttributeTable();
            }).catch(error => {
                _GL.COMMON.showToast(`피처 로드 실패: ${error.message}`, 'error');
            });
            return;
        }
        
        attributeTable.popup.style.display = 'block';
        updateAttributeTable();
    }
    
    /**
     * 특정 피처의 속성 편집 표시
     */
    function showAttributeEditor(feature) {
        attributeTable.currentFeature = feature;
        
        syncSelectedFeature();
        
        // 이미 패널이 있다면 업데이트만
        if (attributeTable.popup && attributeTable.popup.style.display === 'block') {
            updateAttributeEditor(feature);
            return;
        }
        
        // 속성 편집 패널 생성 또는 표시
        if (!attributeTable.popup) {
            createAttributePopup();
        }
        
        attributeTable.popup.style.display = 'block';
        updateAttributeEditor(feature);
    }
    
    /**
     * 속성 팝업 생성
     */
    function createAttributePopup() {
        const elements = getElements();
        
        elements.popup.innerHTML = `
            <div class="card h-100">
                <div class="map-popup-edit-header d-flex justify-content-between align-items-center border-bottom p-3">
                    <h4 class="m-0">Land Use Information</h4>
                    <div class="ms-auto">
                        <button class="btn btn-sm btn-primary me-2" id="attrSaveBtn">Save</button>
                        <button class="btn btn-sm btn-info me-3" id="attrToggleBtn">Total Features</button>
                    </div>
                    <button type="button" class="btn-close" id="attrCloseBtn" aria-label="Close"></button>
                </div>
                <div class="border-bottom p-3">
                    <div class="d-flex">
                        <div class="text-secondary">
                            Show
                            <div class="mx-2 d-inline-block">
                                <input type="text" class="form-control form-control-sm" id="attributePageUnit" value="10" size="3">
                            </div>
                            entries
                        </div>
                        <div class="ms-auto text-secondary">
                            Search:
                            <div class="ms-2 d-inline-block">
                                <input type="text" class="form-control form-control-sm" id="attributeSearchTemp">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="map-popup-edit-content" id="attributeGrid"></div>
                <div class="map-popup-edit-footer card-footer d-flex align-items-center">
                    <p class="m-0 text-secondary">Showing <span id="startEntry">0</span> to <span id="endEntry">0</span> of <span id="totalFeatures">0</span> entries</p>
                    <ul class="pagination m-0 ms-auto" id="paginationControls">
                        <li class="page-item disabled" id="prevPageItem">
                            <a class="page-link" href="#" tabindex="-1" aria-disabled="true">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-1">
                                    <path d="M15 6l-6 6l6 6"></path>
                                </svg>
                                prev
                            </a>
                        </li>
                        <li class="page-item" id="nextPageItem">
                            <a class="page-link" href="#">
                                next
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-1">
                                    <path d="M9 6l6 6l-6 6"></path>
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        `;
        
        attributeTable.popup = elements.popup;
        
        // 상태 값 초기화
        attributeTable.currentPage = 1;
        attributeTable.pageSize = 10;
        attributeTable.isFullTableMode = false;
        
        // 이벤트 리스너 추가
        document.getElementById('attrSaveBtn').addEventListener('click', saveAttributeChanges);
        document.getElementById('attrToggleBtn').addEventListener('click', toggleAttributeTableMode);
        document.getElementById('attrCloseBtn').addEventListener('click', () => {
            attributeTable.popup.style.display = 'none';
            if (attributeTable.mapMoveEndListener) {
                instance.un('moveend', attributeTable.mapMoveEndListener);
                attributeTable.mapMoveEndListener = null;
            }
        });
        
        // 검색 리스너 추가
        document.getElementById('attributeSearchTemp').addEventListener('keyup', function(e) {
            searchFeatures();
        });

        // 페이지 단위 변경 이벤트 리스너
        document.getElementById('attributePageUnit').addEventListener('change', function() {
            const pageUnitValue = parseInt(this.value);
            if (!isNaN(pageUnitValue) && pageUnitValue > 0) {
                attributeTable.pageSize = pageUnitValue;
                attributeTable.currentPage = 1;
                updateAttributeTable();
            }
        });
        
        // 페이지네이션 이벤트
        document.getElementById('prevPageItem').addEventListener('click', function(e) {
            e.preventDefault();
            if (!this.classList.contains('disabled')) {
                navigateAttributePage(-1);
            }
        });
        
        document.getElementById('nextPageItem').addEventListener('click', function(e) {
            e.preventDefault();
            if (!this.classList.contains('disabled')) {
                navigateAttributePage(1);
            }
        });
        
        // 드래그 기능 추가
        _GL.MAP.setupPopupDragging(attributeTable.popup, '.map-popup-edit-header');
    }

    /**
     * 단일 피처 속성 편집기 표시
     */
    function updateAttributeEditor(feature) {
        attributeTable.isFullTableMode = false;
        document.getElementById('attrToggleBtn').innerText = 'Total Feature';
        
        // 페이징 및 검색 부분 숨기기
        const searchAndPagingSection = document.querySelector('.map-popup-edit-header + .border-bottom');
        if (searchAndPagingSection) {
            searchAndPagingSection.classList.add('d-none');
        }
        
        // 푸터(페이지네이션) 숨기기
        const footer = document.querySelector('.map-popup-edit-footer');
        if (footer) {
            footer.classList.add('d-none');
        }
        
        // 헤더 제목 변경 - 신규 피처인지 구분
        const featureId = feature.getId() || '';
        const isNewFeature = featureId.toString().startsWith('temp_');
        const headerTitle = document.querySelector('.map-popup-edit-header h4');
        if (headerTitle) {
            headerTitle.innerText = isNewFeature ? 'New Land Use Feature' : 'Land Use Information';
        }
        
        const grid = document.getElementById('attributeGrid');
        const properties = feature.getProperties();
        
        let tableHtml = `
            <div class="table-responsive">
                <table class="table">
                    <tbody>
        `;
        
        // 새로운 피처인 경우 안내 메시지 추가
        if (isNewFeature) {
            tableHtml += `
                <tr>
                    <td colspan="2" class="bg-light text-info">
                        <small>새로 생성된 피처입니다. 아래 속성 정보를 입력한 후 저장해주세요.</small>
                    </td>
                </tr>
            `;
        }
        
        // 속성별 입력 필드 생성 (타입에 맞는 입력 형식 제공)
        for (const [key, value] of Object.entries(properties)) {
            // geometry는 제외
            if (key === 'geometry' || key === 'geom') continue;
            
            // 필드 타입 확인
            const fieldType = _GL.MAP.typeCache ? _GL.MAP.typeCache[key] : null;
            
            // 필수 필드 표시
            const isRequired = ['uslcode', 'kategoria_', 'lclsf_cd', 'sclsf_cd'].includes(key);
            
            // 필드 타입에 맞는 입력 필드 생성
            let inputField = '';
            
            // 카테고리(type) 코드 필드
            if (key === 'kategoria_') {
                inputField = `
                    <select class="form-select form-select-sm" 
                           data-field="${key}" 
                           id="select_kategoria"
                           ${isRequired ? 'required' : ''}>
                        <option value="">-- 타입 선택 --</option>
                `;
                
                // _GL.MAP.codeCache.type 객체의 키-값 쌍을 순회하며 옵션 생성
                if (_GL.MAP.codeCache && _GL.MAP.codeCache.type) {
                    for (const [code, name] of Object.entries(_GL.MAP.codeCache.type)) {
                        const selected = value !== null && value !== undefined && String(value) === String(code) ? 'selected' : '';
                        inputField += `<option value="${code}" ${selected}>${code} - ${name}</option>`;
                    }
                }
                
                inputField += `</select>`;
            }
            // 심볼(symbol) 코드 필드
            else if (key === 'uslcode') {
                inputField = `
                    <select class="form-select form-select-sm" 
                           data-field="${key}" 
                           id="select_uslcode"
                           ${isRequired ? 'required' : ''}>
                        <option value="">-- 심볼 선택 --</option>
                `;
                
                // _GL.MAP.codeCache.symbol 객체의 키-값 쌍을 순회하며 옵션 생성
                if (_GL.MAP.codeCache && _GL.MAP.codeCache.symbol) {
                    for (const [code, name] of Object.entries(_GL.MAP.codeCache.symbol)) {
                        const selected = value !== null && value !== undefined && String(value) === String(code) ? 'selected' : '';
                        inputField += `<option value="${code}" ${selected}>${code} - ${name}</option>`;
                    }
                }
                
                inputField += `</select>`;
            }
            // 대분류 코드 필드
            else if (key === 'lclsf_cd') {
                inputField = `
                    <select class="form-select form-select-sm" 
                           data-field="${key}" 
                           id="select_lclsf_cd"
                           onchange="updateSclsfOptions(this.value)"
                           ${isRequired ? 'required' : ''}>
                        <option value="">-- 대분류 선택 --</option>
                `;
                
                // _GL.MAP.codeCache.lclsf 객체의 키-값 쌍을 순회하며 옵션 생성
                if (_GL.MAP.codeCache && _GL.MAP.codeCache.lclsf) {
                    for (const [code, name] of Object.entries(_GL.MAP.codeCache.lclsf)) {
                        const selected = value !== null && value !== undefined && String(value) === String(code) ? 'selected' : '';
                        inputField += `<option value="${code}" ${selected}>${code} - ${name}</option>`;
                    }
                }
                
                inputField += `</select>`;
            }
            // 소분류 코드 필드
            else if (key === 'sclsf_cd') {
                inputField = `
                    <select class="form-select form-select-sm" 
                           data-field="${key}" 
                           id="select_sclsf_cd"
                           ${isRequired ? 'required' : ''}>
                        <option value="">-- 소분류 선택 --</option>
                `;
                
                // 현재 선택된 대분류 값
                const lclsfValue = feature.get('lclsf_cd');
                
                // 대분류에 해당하는 소분류 옵션 생성
                if (_GL.MAP.codeCache && _GL.MAP.codeCache.sclsfByLclsf && lclsfValue && _GL.MAP.codeCache.sclsfByLclsf[lclsfValue]) {
                    for (const [code, name] of Object.entries(_GL.MAP.codeCache.sclsfByLclsf[lclsfValue])) {
                        const selected = value !== null && value !== undefined && String(value) === String(code) ? 'selected' : '';
                        inputField += `<option value="${code}" ${selected}>${code} - ${name}</option>`;
                    }
                }
                // 대분류가 선택되지 않았거나 해당 대분류에 소분류가 없는 경우
                else if (_GL.MAP.codeCache && _GL.MAP.codeCache.sclsf) {
                    for (const [code, name] of Object.entries(_GL.MAP.codeCache.sclsf)) {
                        const selected = value !== null && value !== undefined && String(value) === String(code) ? 'selected' : '';
                        inputField += `<option value="${code}" ${selected}>${code} - ${name}</option>`;
                    }
                }
                
                inputField += `</select>`;
            }
            else if (fieldType && (fieldType.toLowerCase().includes('int') || 
                                    fieldType.toLowerCase().includes('float') || 
                                    fieldType.toLowerCase().includes('numeric'))) {
                // 숫자 타입은 number 타입 입력 필드
                const displayValue = value !== null && value !== undefined ? value : '';
                inputField = `
                    <input type="number" class="form-control form-control-sm" 
                           data-field="${key}" 
                           value="${displayValue}" 
                           step="${fieldType.toLowerCase().includes('int') ? '1' : '0.01'}"
                           ${isRequired ? 'required' : ''} />
                `;
            } else {
                // 기본 텍스트 필드
                const displayValue = value !== null && value !== undefined ? value : '';
                inputField = `
                    <input type="text" class="form-control form-control-sm" 
                           data-field="${key}" 
                           value="${displayValue}" 
                           ${isRequired ? 'required' : ''} />
                `;
            }
            
            tableHtml += `
                <tr>
                    <th class="text-center align-content-center">
                        ${key} ${isRequired ? '<span class="text-danger">*</span>' : ''}
                        ${fieldType ? `<small class="text-muted">(${fieldType})</small>` : ''}
                    </th>
                    <td>${inputField}</td>
                </tr>
            `;
        }
        
        tableHtml += `</tbody></table></div>`;
        grid.innerHTML = tableHtml;
        
        // 푸터 숨기기
        document.querySelector('.map-popup-edit-footer').style.display = 'none';
        
        // 대분류 변경 시 소분류 업데이트
        document.getElementById('select_lclsf_cd').addEventListener('change', function() {
            updateSclsfOptions(this.value);
        });
    }


    /**
     * 대분류 변경 시 소분류 옵션 업데이트
     */
    function updateSclsfOptions(lclsfValue) {
        const sclsfSelect = document.getElementById('select_sclsf_cd');
        if (!sclsfSelect) return;
        
        let options = '<option value="">-- 소분류 선택 --</option>';
        
        // 대분류에 해당하는 소분류 옵션 생성
        if (_GL.MAP.codeCache && _GL.MAP.codeCache.sclsfByLclsf && lclsfValue && _GL.MAP.codeCache.sclsfByLclsf[lclsfValue]) {
            for (const [code, name] of Object.entries(_GL.MAP.codeCache.sclsfByLclsf[lclsfValue])) {
                options += `<option value="${code}">${code} - ${name}</option>`;
            }
        }
        // 대분류가 선택되지 않았을 경우 전체 소분류 표시 (선택 사항)
        else if (lclsfValue === '' && _GL.MAP.codeCache && _GL.MAP.codeCache.sclsf) {
            for (const [code, name] of Object.entries(_GL.MAP.codeCache.sclsf)) {
                options += `<option value="${code}">${code} - ${name}</option>`;
            }
        }
        
        sclsfSelect.innerHTML = options;
    }
    
    /**
     * 전체 속성 테이블 업데이트
     */
    function updateAttributeTable() {
        attributeTable.isFullTableMode = true;
        document.getElementById('attrToggleBtn').innerText = 'Selected Feature';
        
        // 검색어가 있으면 필터링된 피처를, 없으면 모든 피처를 사용
        const features = attributeTable.searchTerm && attributeTable.filteredFeatures.length > 0 
            ? attributeTable.filteredFeatures 
            : editSource.getFeatures();
        
        const grid = document.getElementById('attributeGrid');
        
        if (!features || features.length === 0) {
            grid.innerHTML = `
                <div class="p-3">
                    <div class="alert alert-info">
                        ${attributeTable.searchTerm ? '검색 결과가 없습니다.' : '현재 영역에 표시할 피처가 없습니다.'}
                    </div>
                </div>`;
                
            // 페이지네이션 정보 업데이트
            document.getElementById('startEntry').textContent = 0;
            document.getElementById('endEntry').textContent = 0;
            document.getElementById('totalFeatures').textContent = 0;
            
            // 페이지네이션 컨트롤 비활성화
            document.getElementById('prevPageItem').classList.add('disabled');
            document.getElementById('nextPageItem').classList.add('disabled');
            
            // 페이지 번호 제거
            const pageNumbers = document.querySelectorAll('#paginationControls .page-number');
            pageNumbers.forEach(item => item.remove());
            
            return;
        }
        
        // 페이지네이션 설정
        const totalFeatures = features.length;
        const totalPages = Math.ceil(totalFeatures / attributeTable.pageSize);
        const currentPage = Math.min(attributeTable.currentPage, totalPages || 1);
        attributeTable.currentPage = currentPage;
        
        // 현재 페이지의 피처들
        const startIndex = (currentPage - 1) * attributeTable.pageSize;
        const endIndex = Math.min(startIndex + attributeTable.pageSize, totalFeatures);
        const pageFeatures = features.slice(startIndex, endIndex);
        
        // 페이지네이션 정보 업데이트
        document.getElementById('startEntry').textContent = startIndex + 1;
        document.getElementById('endEntry').textContent = endIndex;
        document.getElementById('totalFeatures').textContent = totalFeatures;
        
        // 속성 키 순서 유지를 위한 처리
        if (!attributeTable.columnOrder) {
            attributeTable.columnOrder = [];
            
            let allKeysSet = new Set();
            
            pageFeatures.forEach(feature => {
                const properties = feature.getProperties();
                console.log("테이블에 표시할 피처 속성:", properties);
                Object.keys(properties).forEach(key => {
                    if (key !== 'geometry' && key !== 'geom') {
                        allKeysSet.add(key);
                    }
                });
            });
            
            if (pageFeatures.length > 0) {
                const firstFeature = pageFeatures[0];
                const properties = firstFeature.getProperties();
                
                Object.keys(properties).forEach(key => {
                    if (key !== 'geometry' && key !== 'geom' && allKeysSet.has(key)) {
                        attributeTable.columnOrder.push(key);
                        allKeysSet.delete(key);
                    }
                });
                
                allKeysSet.forEach(key => {
                    attributeTable.columnOrder.push(key);
                });
            } else {
                attributeTable.columnOrder = Array.from(allKeysSet);
            }
        }
        
        const allKeys = attributeTable.columnOrder;
        
        // 테이블 헤더
        let tableHtml = `
            <div class="table-responsive">
                <table class="table table-vcenter">
                    <thead>
                        <tr>
                            <th class="text-center">ID</th>
                            ${allKeys.map(key => `<th class="text-center">${key}</th>`).join('')}
                            <th class="text-center">EDIT</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // 피처별 행 생성
        pageFeatures.forEach(feature => {
            const properties = feature.getProperties();
            const featureId = feature.getId() || '';
            
            const cleanId = featureId.replace('land_use.', '');
            
            const isSelected = selectInteraction && 
                              selectInteraction.getFeatures().getLength() > 0 && 
                              selectInteraction.getFeatures().item(0).getId() === featureId;
                              
            tableHtml += `<tr data-feature-id="${featureId}" class="feature-row ${isSelected ? 'table-primary' : ''}" style="cursor: pointer;">`;
            tableHtml += `<td class="text-end">${cleanId}</td>`;
            
            allKeys.forEach(key => {
                const value = properties[key];
                
                let alignClass = '';
                if (value === null || value === undefined || value === '') {
                    alignClass = 'text-center';
                } else if (!isNaN(value) && value !== '') {
                    alignClass = 'text-end';
                } else {
                    alignClass = 'text-start';
                }
                
                tableHtml += `<td class="${alignClass}">${_GL.COMMON.formatValue(value)}</td>`;
            });
            
            tableHtml += `
                <td>
                    <button class="btn btn-sm btn-ghost-primary edit-feature-btn" data-feature-id="${featureId}">EDIT</button>
                </td>
            `;
            tableHtml += `</tr>`;
        });
        
        tableHtml += `</tbody></table></div>`;
        grid.innerHTML = tableHtml;
        
        // 페이지네이션 컨트롤 업데이트
        updatePaginationControls(currentPage, totalPages);
        
        // 피처 편집 버튼에 이벤트 리스너 추가
        document.querySelectorAll('.edit-feature-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const featureId = this.dataset.featureId;
                const feature = editSource.getFeatureById(featureId);
                if (feature) {
                    if (selectInteraction && selectInteraction.getActive()) {
                        selectInteraction.getFeatures().clear();
                        selectInteraction.getFeatures().push(feature);
                    }
                    
                    showAttributeEditor(feature);
                }
            });
        });
        
        // 피처 행 클릭 이벤트 리스너 추가
        document.querySelectorAll('.feature-row').forEach(row => {
            row.addEventListener('click', function(e) {
                if (e.target.classList.contains('edit-feature-btn')) {
                    return;
                }
                
                const featureId = this.dataset.featureId;
                const feature = editSource.getFeatureById(featureId);
                
                if (feature) {
                    if (selectInteraction && selectInteraction.getActive()) {
                        selectInteraction.getFeatures().clear();
                        selectInteraction.getFeatures().push(feature);
                        
                        syncSelectedFeature();
                        
                        const extent = feature.getGeometry().getExtent();
                        instance.getView().fit(extent, {
                            padding: [100, 100, 100, 100],
                            duration: 500,
                            maxZoom: 19
                        });
                        
                        document.querySelectorAll('.feature-row').forEach(r => {
                            r.classList.remove('table-primary');
                        });
                        this.classList.add('table-primary');
                    } else {
                        _GL.COMMON.showToast('피처 선택 모드가 비활성화되어 있습니다. 편집 모드를 변경해 주세요.', 'warning');
                    }
                }
            });
        });
    }
    
    /**
     * 테이블 행이 현재 뷰에 보이는지 확인
     */
    function isRowVisible(row) {
        const container = document.getElementById('attributeGrid');
        if (!container || !row) return false;
        
        const containerRect = container.getBoundingClientRect();
        const rowRect = row.getBoundingClientRect();
        
        return (
            rowRect.top >= containerRect.top &&
            rowRect.bottom <= containerRect.bottom
        );
    }
    
    /**
     * 속성 변경 저장
     */
    function saveAttributeChanges() {
        if (!attributeTable.currentFeature) return;
        
        const feature = attributeTable.currentFeature;
        const featureId = feature.getId() || '';
        const isNewFeature = featureId.toString().startsWith('temp_');
        
        // 필수 필드 검증
        const requiredFields = ['kategoria_', 'uslcode', 'lclsf_cd', 'sclsf_cd'];
        let missingRequiredFields = [];
        
        // 셀렉트박스 검증
        for (const field of requiredFields) {
            const select = document.querySelector(`#attributeGrid select[data-field="${field}"]`);
            if (select && (!select.value || select.value === '')) {
                select.classList.add('is-invalid');
                missingRequiredFields.push(field);
            } else if (select) {
                select.classList.remove('is-invalid');
            }
        }
        
        if (missingRequiredFields.length > 0) {
            _GL.COMMON.showToast(`다음 필수 필드를 선택해주세요: ${missingRequiredFields.join(', ')}`, 'warning');
            return;
        }
        
        
        // required 속성을 가진 필드가 비어 있는지 확인
        let hasEmptyRequiredFields = false;
        const requiredInputs = document.querySelectorAll('#attributeGrid input[required]');
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                hasEmptyRequiredFields = true;
            } else {
                input.classList.remove('is-invalid');
            }
        });
        
        if (hasEmptyRequiredFields) {
            _GL.COMMON.showToast('필수 입력 필드를 모두 채워주세요.', 'warning');
            return;
        }
        
        // 변경 전 피처 복제 (히스토리용)
        const originalFeature = feature.clone();
        
        // 모든 필드 값을 수집
        const updatedProperties = {};
        
        const allInputs = document.querySelectorAll('#attributeGrid input, #attributeGrid select');
        
        allInputs.forEach(input => {
        	const field = input.dataset.field;
            if (!field) return;
            
            if (input.value.trim() === '') {
                updatedProperties[field] = null;
            } else {
                // 값이 있는 경우에만 변환 처리
                let value = input.value.trim();
                const fieldType = _GL.MAP.typeCache ? _GL.MAP.typeCache[field] : null;
                
                if (fieldType && fieldType.toLowerCase().includes('int')) {
                    updatedProperties[field] = parseInt(value) || null;
                } else if (fieldType && (fieldType.toLowerCase().includes('float') || 
                                        fieldType.toLowerCase().includes('numeric'))) {
                    updatedProperties[field] = parseFloat(value) || null;
                } else {
                    updatedProperties[field] = value; // 그 외의 경우 문자열 그대로
                }
            }
        });
        
        // 모든 속성을 한 번에 설정
        for (const [key, value] of Object.entries(updatedProperties)) {
            feature.set(key, value);
        }
        
        // 히스토리에 추가
        if (isNewFeature) {
            const insertHistory = history.changes.find(
                change => change.type === 'insert' && change.feature.getId() === featureId
            );
            
            if (insertHistory) {
                insertHistory.feature = feature.clone();
            } else {
                addToHistory('insert', feature);
            }
            
            const index = tempFeatures.findIndex(f => f.getId() === featureId);
            if (index !== -1) {
                tempFeatures[index] = feature.clone();
            } else {
                tempFeatures.push(feature.clone());
            }
        } else {
            addToHistory('update', feature, originalFeature.getGeometry());
        }
        
        _GL.COMMON.showToast(isNewFeature ? '새로운 피처 속성이 저장되었습니다.' : '속성 정보가 업데이트되었습니다.', 'success');
        
        // 전체 테이블 모드로 전환
        attributeTable.isFullTableMode = true;
        updateAttributeTable();
        
        // 저장 후 추가한 피처를 테이블에서 강조
        setTimeout(() => {
            highlightFeatureInTable(featureId);
        }, 300);
    }

    
    /**
     * 단일/전체 테이블 모드 전환
     */
    function toggleAttributeTableMode() {
        const searchAndPagingSection = document.querySelector('.map-popup-edit-header + .border-bottom');
        const footer = document.querySelector('.map-popup-edit-footer');
        
        if (attributeTable.isFullTableMode) {
            // 단일 피처 모드로 전환
            if (attributeTable.currentFeature) {
                syncSelectedFeature();
                attributeTable.isFullTableMode = false;
                
                if (searchAndPagingSection) {
                    searchAndPagingSection.classList.add('d-none');
                }
                
                if (footer) {
                    footer.classList.add('d-none');
                }
                
                updateAttributeEditor(attributeTable.currentFeature);
            } else {
                _GL.COMMON.showToast('먼저 피처를 선택하세요.', 'warning');
                return;
            }
        } else {
            // 전체 테이블 모드로 전환
            attributeTable.isFullTableMode = true;
            
            if (searchAndPagingSection) {
                searchAndPagingSection.classList.remove('d-none');
            }
            
            if (footer) {
                footer.classList.remove('d-none');
            }
            
            updateAttributeTable();
            
            if (attributeTable.currentFeature) {
                const selectedId = attributeTable.currentFeature.getId();
                
                setTimeout(() => {
                    highlightFeatureInTable(selectedId);
                }, 200);
            }
        }
    }
    
    /**
     * 선택된 피처 ID에 해당하는 행을 찾아 하이라이트하고 페이지 이동
     */
    function highlightFeatureInTable(featureId) {
        if (!featureId || !attributeTable.isFullTableMode) return;
        
        const features = attributeTable.searchTerm && attributeTable.filteredFeatures.length > 0 
            ? attributeTable.filteredFeatures 
            : editSource.getFeatures();
        
        const featureIndex = features.findIndex(f => f.getId() === featureId);
        
        if (featureIndex === -1) {
            return;
        }
        
        const page = Math.floor(featureIndex / attributeTable.pageSize) + 1;
        if (page !== attributeTable.currentPage) {
            attributeTable.currentPage = page;
            updateAttributeTable();
        }
        
        setTimeout(() => {
            document.querySelectorAll('.feature-row').forEach(row => {
                row.classList.remove('table-primary');
            });
            
            const selectedRow = document.querySelector(`.feature-row[data-feature-id="${featureId}"]`);
            if (selectedRow) {
                selectedRow.classList.add('table-primary');
                
                const scrollContainer = document.getElementById('attributeGrid');
                if (!isRowVisible(selectedRow) && scrollContainer) {
                    setTimeout(() => {
                         selectedRow.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center',
                            inline: 'nearest'
                         });
                    }, 300);
                }
            }
        }, 200);
    }
    
    /**
     * 피처 검색 기능
     */
    function searchFeatures(updateTable = true) {
        const searchInput = document.getElementById('attributeSearchTemp');
        const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : attributeTable.searchTerm;
        
        attributeTable.searchTerm = searchTerm;
        
        if (!searchTerm) {
            attributeTable.filteredFeatures = [];
            
            if (updateTable) {
                attributeTable.currentPage = 1;
                updateAttributeTable();
            }
            return;
        }
        
        const allFeatures = editSource.getFeatures();
        const filteredFeatures = allFeatures.filter(feature => {
            const properties = feature.getProperties();
            
            const featureId = feature.getId() || '';
            const cleanId = featureId.toString().replace('land_use.', '');
            
            if (cleanId.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            for (const [key, value] of Object.entries(properties)) {
                if (key === 'geometry' || key === 'geom') continue;
                
                const strValue = value !== null && value !== undefined ? value.toString().toLowerCase() : '';
                
                if (strValue.includes(searchTerm)) {
                    return true;
                }
            }
            
            return false;
        });
        
        attributeTable.filteredFeatures = filteredFeatures;
        
        if (updateTable) {
            attributeTable.currentPage = 1;
            updateAttributeTable();
        }
    }
    
    /**
     * selectInteraction과 attributeTable.currentFeature 동기화 함수
     */
    function syncSelectedFeature() {
        if (selectInteraction && selectInteraction.getFeatures().getLength() > 0) {
            attributeTable.currentFeature = selectInteraction.getFeatures().item(0);
        } else if (attributeTable.currentFeature) {
            if (selectInteraction && selectInteraction.getActive()) {
                selectInteraction.getFeatures().clear();
                selectInteraction.getFeatures().push(attributeTable.currentFeature);
            }
        }
    }
    
    /**
     * 페이지네이션 컨트롤 업데이트
     */
    function updatePaginationControls(currentPage, totalPages) {
        const paginationControls = document.getElementById('paginationControls');
        const prevPageItem = document.getElementById('prevPageItem');
        const nextPageItem = document.getElementById('nextPageItem');
        
        prevPageItem.classList.toggle('disabled', currentPage <= 1);
        nextPageItem.classList.toggle('disabled', currentPage >= totalPages);
        
        const pageNumbers = document.querySelectorAll('#paginationControls .page-number');
        pageNumbers.forEach(item => item.remove());
        
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        if (endPage - startPage < 4 && startPage > 1) {
            startPage = Math.max(1, endPage - 4);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageItem = document.createElement('li');
            pageItem.className = `page-item page-number ${i === currentPage ? 'active' : ''}`;
            
            const pageLink = document.createElement('a');
            pageLink.className = 'page-link';
            pageLink.href = '#';
            pageLink.textContent = i;
            
            pageItem.appendChild(pageLink);
            
            pageItem.addEventListener('click', function(e) {
                e.preventDefault();
                if (attributeTable.currentPage !== i) {
                    attributeTable.currentPage = i;
                    updateAttributeTable();
                }
            });
            
            nextPageItem.parentNode.insertBefore(pageItem, nextPageItem);
        }
    }
    
    /**
     * 페이지 이동
     */
    function navigateAttributePage(direction) {
        const newPage = attributeTable.currentPage + direction;
        attributeTable.currentPage = newPage;
        updateAttributeTable();
    }
    
/* =====================================================
    Event Handlers
======================================================*/
    /**
     * 맵 이동 후 자동 새로고침 기능
     */
    function initializeMapMoveEndHandler() {
        let moveEndTimeout;
        
        instance.on('moveend', function() {
            if (moveEndTimeout) clearTimeout(moveEndTimeout);
            
            moveEndTimeout = setTimeout(function() {
                const elements = getElements();
                
                const isEditActive = !elements.stopBtn.disabled;
                const isAttributeTableVisible = attributeTable.popup && 
                                              attributeTable.popup.style.display === 'block' && 
                                              attributeTable.isFullTableMode;
                
                if (isEditActive || isAttributeTableVisible) {
                    let selectedFeatureId = null;
                    if (selectInteraction && selectInteraction.getFeatures().getLength() > 0) {
                        const selectedFeature = selectInteraction.getFeatures().item(0);
                        if (selectedFeature) {
                            selectedFeatureId = selectedFeature.getId();
                        }
                    }
                    
                    const currentSearchTerm = attributeTable.searchTerm;
                    const currentPage = attributeTable.currentPage;
                    
                    if (isAttributeTableVisible) {
                        const grid = document.getElementById('attributeGrid');
                        if (grid) {
                            grid.innerHTML = `
                                <div class="p-3 text-center">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            `;
                        }
                    }
                    
                    loadLayerFeatures()
                        .then(count => {
                            attributeTable.searchTerm = currentSearchTerm;
                            attributeTable.currentPage = currentPage;
                            
                            if (attributeTable.searchTerm) {
                                searchFeatures(false);
                            }
                            
                            if (selectedFeatureId && selectInteraction) {
                                const reloadedFeature = editSource.getFeatureById(selectedFeatureId);
                                if (reloadedFeature) {
                                    selectInteraction.getFeatures().clear();
                                    selectInteraction.getFeatures().push(reloadedFeature);
                                    syncSelectedFeature();
                                    
                                    if (attributeTable.popup && 
                                        attributeTable.popup.style.display === 'block') {
                                        if (attributeTable.isFullTableMode) {
                                            setTimeout(() => highlightFeatureInTable(selectedFeatureId), 300);
                                        } else {
                                            attributeTable.currentFeature = reloadedFeature;
                                            updateAttributeEditor(reloadedFeature);
                                        }
                                    }
                                }
                            }
                            
                            if (isAttributeTableVisible) {
                                updateAttributeTable();
                                
                                if (selectedFeatureId) {
                                    setTimeout(() => {
                                        highlightFeatureInTable(selectedFeatureId);
                                    }, 200);
                                }
                            }
                        })
                        .catch(error => {
                            if (isAttributeTableVisible) {
                                const grid = document.getElementById('attributeGrid');
                                if (grid) {
                                    grid.innerHTML = `
                                        <div class="p-3">
                                            <div class="alert alert-danger">
                                                  피처 로드 중 오류가 발생했습니다: ${error.message}
                                            </div>
                                        </div>
                                    `;
                                }
                            }
                        });
                }
            }, 300);
        });
    }
    
    /**
     * 편집 시작 처리
     */
    function handleEditStart() {
        const elements = getElements();

        elements.startBtn.disabled = true;
        instance.getTargetElement().classList.add('spinner');
        
        if (selectInteraction) {
            selectInteraction.getFeatures().clear();
        }
        attributeTable.currentFeature = null;
        
        editingFeatures = true;
        
        loadLayerFeatures()
            .then(() => {
                elements.stopBtn.disabled = false;
                elements.selectModeBtn.disabled = false;
                elements.drawModeBtn.disabled = false;
                elements.modifyModeBtn.disabled = false;
                elements.deleteModeBtn.disabled = false;
                
                elements.selectModeBtn.checked = true;
                setEditMode('select');
                
                if (!attributeTable.popup) {
                    createAttributePopup();
                } else {
                    attributeTable.popup.style.display = 'block';
                }
                
                showAttributeTable();
                updateUIState();
            })
            .catch(error => {
                elements.startBtn.disabled = false;
                _GL.COMMON.showToast(`편집 시작 실패: ${error.message}`, 'error');
            })
            .finally(() => {
                instance.getTargetElement().classList.remove('spinner');
            });
    }

    /**
     * 편집 중지 처리
     */
    function handleEditStop() {
        const elements = getElements();
        
        if (history.position >= 0) {
            elements.saveBtn.disabled = false;
            elements.discardBtn.disabled = false;
            elements.startBtn.disabled = false;
        } else {
            resetEditState();
        }

        elements.stopBtn.disabled = true;
        elements.selectModeBtn.disabled = true;
        elements.drawModeBtn.disabled = true;
        elements.modifyModeBtn.disabled = true;
        elements.deleteModeBtn.disabled = true;
        elements.undoBtn.disabled = true;
        elements.redoBtn.disabled = true;
        elements.editMode.forEach(radio => {
            radio.checked = false;
        });
        
        setEditMode(null);
    }

    /**
     * 실행 취소 처리
     */
    function handleUndo() {
        if (history.position >= 0) {
            const change = history.changes[history.position];
            applyFeatureChange(change, true);
            history.position--;
            updateUIState();
        }
    }

    /**
     * 다시 실행 처리
     */
    function handleRedo() {
        if (history.position < history.changes.length - 1) {
            history.position++;
            const change = history.changes[history.position];
            applyFeatureChange(change, false);
            updateUIState();
        }
    }

    /**
     * 변경사항 저장 처리
     */
    function handleSave() {
        if (!history.changes || history.changes.length === 0) {
            _GL.COMMON.showToast('저장할 변경사항이 없습니다', 'warning');
            return;
        }

        fixMissingFeatureIds();
        
        _GL.COMMON.showAlertModal({
            title: '변경사항 저장',
            message: '변경사항을 저장하시겠습니까?',
            type: 'success',
            btn1: {
                text: 'Save',
                callback: function() {
                    instance.getTargetElement().classList.add('spinner');

                    sendWFSTransaction()
                        .then(() => {
                            _GL.COMMON.showToast('변경사항이 성공적으로 저장되었습니다', 'success');
                            try {
                                tempFeatures.length = 0;
                                editingFeatures = false;
                                
                                _GL.MAP.refreshLanduseLayer();
                            } catch (refreshError) {
                                _GL.COMMON.showToast('변경사항이 저장되었으나 화면 갱신에 실패했습니다. 페이지를 새로고침하세요.', 'warning');
                            }
                            resetEditState();
                        })
                        .catch(error => {
                            _GL.COMMON.showToast(`변경사항 저장 실패: ${error.message}`, 'error');
                        })
                        .finally(() => {
                            instance.getTargetElement().classList.remove('spinner');
                        });
                }
            },
            btn2: {}
        });
    }
    
    /**
     * 변경사항 취소 처리
     */
    function handleDiscard() {
        _GL.COMMON.showAlertModal({
            title: '변경사항 취소',
            message: '정말로 모든 변경사항을 취소하시겠습니까?',
            type: 'error',
            btn1: {
            	text: 'Discard',
	            callback: function() {
                    try {
                        tempFeatures.length = 0;
                        editingFeatures = false;
                        
                    	resetEditState();
                        _GL.COMMON.showToast('변경사항이 취소되었습니다', 'info');
                    } catch (error) {
                        _GL.COMMON.showToast('변경사항 취소 중 오류 발생', 'error');
                    }
	            }
            },
            btn2: {}
        });
    }
    
    /**
     * 이벤트 리스너 초기화
     */
    function initializeEventListeners() {
        const elements = getElements();

        // 편집 시작/종료
        elements.startBtn.addEventListener('click', handleEditStart);
        elements.stopBtn.addEventListener('click', handleEditStop);
        
        // Undo/Redo
        elements.undoBtn.addEventListener('click', handleUndo);
        elements.redoBtn.addEventListener('click', handleRedo);

        // 편집 모드 변경
        elements.selectModeBtn.addEventListener('change', () => setEditMode('select'));
        elements.drawModeBtn.addEventListener('change', () => setEditMode('draw'));
        elements.modifyModeBtn.addEventListener('change', () => setEditMode('modify'));
        elements.deleteModeBtn.addEventListener('change', () => setEditMode('delete'));
        
        // 저장/취소
        elements.saveBtn.addEventListener('click', handleSave);
        elements.discardBtn.addEventListener('click', handleDiscard);
    }

/* =====================================================
    Public API
======================================================*/
    return {
        init: function() {
            if (initialized) return;
            instance = _GL.MAP.getInstance();
            initializeUIState();
            initializeEditLayer();
            initializeInteractions();
            initializeEventListeners();
            initializeMapMoveEndHandler();
            initialized = true;
        },
        isEditingActive: function() {
        	return editingFeatures;
        }
    };
})();

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    _GL.MAP_EDIT.init();
});