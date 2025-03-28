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
    let tempIdCounter = 1;
    const tempFeatures = [];
    // 삭제된 피처
    const deletedFeatures = new Set();
    
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
            // 즉시 ID 할당
            const newId = 'temp_' + (tempIdCounter++);
            event.feature.setId(newId);
            
            // 기본 스키마 속성 적용
            applyDefaultSchemaToFeature(event.feature);
            
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
                    promptDeleteFeature(selectedFeature);
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
                    // 이미 존재하는 피처 확인
                    const sourceFeature = editSource.getFeatureById(id);
                    // 이미 소스에 있는 피처를 수정하고 있는 것이 맞는지 확인
                    if (sourceFeature !== feature) {
                        // 기존 피처 제거 후 새 피처 추가 대신, 기존 피처의 지오메트리만 업데이트
                        if (sourceFeature) {
                            sourceFeature.setGeometry(feature.getGeometry().clone());
                        }
                    }
                    
                    addToHistory('update', feature, originalGeometries[id]);
                    delete originalGeometries[id];
                } else {
                    addToHistory('update', feature, feature.getGeometry().clone());
                }
            });
        };
        modifyInteraction.on('modifyend', function(event) {
            event.features.forEach(feature => {
                const id = feature.getId();
                
                // 현재 geometry가 MultiPolygon인지 확인
                const geom = feature.getGeometry();
                
                // geometry가 비정상적인 경우 정규화
                if (geom && geom.getType() === 'MultiPolygon') {
                    // 첫 번째 polygon만 사용하거나, 적절히 정규화
                    const polygons = geom.getPolygons();
                    if (polygons.length > 0) {
                        // 첫 번째 polygon만 사용
                        feature.setGeometry(polygons[0]);
                    }
                }
                
                if (id && originalGeometries[id]) {
                    addToHistory('update', feature, originalGeometries[id]);
                    delete originalGeometries[id];
                } else {
                    addToHistory('update', feature, feature.getGeometry().clone());
                }
            });
        });
        
        // 도구 추가 및 비활성화
        [drawInteraction, selectInteraction, modifyInteraction].forEach(interaction => {
            instance.addInteraction(interaction);
            interaction.setActive(false);
        });
    }
    
    /**
     * 지오메트리 정규화
     */
    function normalizeGeometry(feature) {
        const geom = feature.getGeometry();
        if (!geom) return feature;
        
        if (geom.getType() === 'MultiPolygon') {
            const polygons = geom.getPolygons();
            if (polygons.length === 1) {
                // MultiPolygon에 폴리곤이 하나만 있는 경우 Polygon으로 변환
                feature.setGeometry(polygons[0]);
            } else if (polygons.length > 1) {
                // 여러 개의 폴리곤이 있는 경우 처리 로직
                // 일반적으로는 첫 번째 폴리곤만 사용하거나, 적절히 병합
                // 여기서는 간단히 첫 번째 폴리곤만 사용
                feature.setGeometry(polygons[0]);
            }
        }
        
        return feature;
    }
    
    /**
     * 피처 삭제 확인 모달 표시
     */
    function promptDeleteFeature(feature) {
        if (!feature) return;
        
        _GL.COMMON.showAlertModal({
            title: '피처 삭제',
            message: '선택한 피처를 삭제하시겠습니까?',
            type: 'error',
            btn1: {
                text: 'Delete',
                callback: function() {
                    const featureId = feature.getId();
                    
                    // 보다 완전한 복제본 생성
                    const clonedFeature = feature.clone();
                    clonedFeature.setId(featureId);
                    
                    // 스타일 복제
                    if (feature.getStyle()) {
                        clonedFeature.setStyle(feature.getStyle());
                    } else if (editLayer.getStyle()) {
                        clonedFeature.setStyle(editLayer.getStyle());
                    }
                    
                    // 히스토리에 삭제 작업 추가
                    addToHistory('delete', clonedFeature);
                    
                    // 소스에서 피처 완전히 제거 (강제 삭제)
                    try {
                        // 먼저 소스에서 직접 해당 ID로 피처를 찾음
                        const sourceFeature = editSource.getFeatureById(featureId);
                        if (sourceFeature) {
                            editSource.removeFeature(sourceFeature);
                            
                            // 임시 피처인 경우 tempFeatures 배열에서도 제거
                            if (featureId.toString().startsWith('temp_')) {
                                const index = tempFeatures.findIndex(f => f.getId() === featureId);
                                if (index !== -1) {
                                    tempFeatures.splice(index, 1);
                                }
                            }
                        }
                        
                        // 단순한 제거로 끝나지 않고, 내부적으로 "삭제된 피처" 목록을 유지
                        // 이 목록은 맵 이동 시 피처 로드 시 필터링에 사용됨
                        if (!deletedFeatures) {
                            deletedFeatures = new Set();
                        }
                        deletedFeatures.add(featureId);
                        
                        // 소스 변경 이벤트 명시적 호출
                        editSource.dispatchEvent('changefeature');
                        instance.render(); // 맵 렌더링 강제 갱신
                        
                        _GL.COMMON.showToast('피처가 삭제되었습니다.', 'info');
                    } catch (error) {
                        _GL.COMMON.showToast('피처 삭제 중 오류가 발생했습니다.', 'error');
                    }
                    
                    // 선택 상태 초기화
                    if (selectInteraction) {
                        selectInteraction.getFeatures().clear();
                    }
                    
                    // UI 상태 업데이트
                    updateUIState();
                    
                    // 속성 테이블이 열려있는 경우 업데이트
                    if (attributeTable.popup && attributeTable.popup.style.display === 'block') {
                        if (attributeTable.isFullTableMode) {
                            updateAttributeTable();
                        } else {
                            // 단일 피처 모드에서는 전체 테이블로 전환
                            attributeTable.isFullTableMode = true;
                            updateAttributeTable();
                        }
                    }
                }
            },
            btn2: {}
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
     * 피처 저장 전 필수 속성 검증 함수
     */
    function validateFeatures() {
        // 필수 필드 목록
        const requiredFields = ['ink', 'uslcode', 'kategoria_', 'lclsf_cd', 'sclsf_cd'];
        const invalidFeatures = [];
        
        // 현재 변경사항 가져오기
        const currentChanges = history.changes.slice(0, history.position + 1);
        
        // 피처 ID별로 마지막 변경사항만 처리하도록 수정
        const latestChangeByFeatureId = new Map();
        
        // 각 피처 ID별 마지막 변경사항 찾기
        for (let i = 0; i < currentChanges.length; i++) {
            const change = currentChanges[i];
            
            if (!change || !change.feature) {
                continue;
            }
            
            const featureId = change.feature.getId();
            if (!featureId) {
                continue;
            }
            
            // 마지막 변경사항 업데이트 (덮어쓰기)
            latestChangeByFeatureId.set(featureId, change);
        }
        
        // 각 피처 검증
        for (const [featureId, change] of latestChangeByFeatureId.entries()) {
            // 삭제된 피처는 검증 필요 없음
            if (change.type === 'delete') {
                continue;
            }
            
            const feature = change.feature;
            const properties = feature.getProperties();
            
            // 필수 필드 확인
            for (const field of requiredFields) {
                const value = properties[field];
                
                // 값이 없거나 빈 문자열인 경우 유효하지 않음
                if (value === null || value === undefined || value === '') {
                    invalidFeatures.push({
                        id: featureId,
                        missingField: field
                    });
                    break; // 하나라도 누락되면 이 피처는 유효하지 않음
                }
            }
        }
        
        return invalidFeatures;
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
                
                // 삭제된 피처 필터링을 위한 Set (없으면 생성)
                if (!deletedFeatures) {
                    deletedFeatures = new Set();
                }
                
                // 삭제 히스토리에서 삭제된 피처 ID 수집
                if (history && history.changes) {
                    for (let i = 0; i <= history.position; i++) {
                        const change = history.changes[i];
                        if (change && change.type === 'delete' && change.feature) {
                            const delFeatureId = change.feature.getId();
                            if (delFeatureId) {
                                deletedFeatures.add(delFeatureId);
                            }
                        }
                    }
                }
                
                // 삭제된 피처를 필터링하여 새 피처만 추가
                features.forEach(feature => {
                    const featureId = feature.getId();
                    if (!featureId) return;
                    
                    // 임시 피처이거나 삭제된 피처면 건너뜀
                    if (tempFeatureIds.includes(featureId) || deletedFeatures.has(featureId)) {
                        return;
                    }
                    
                    editSource.addFeature(feature);
                });
                
                // 임시 피처 다시 추가
                tempFeaturesInSource.forEach(feature => {
                    editSource.addFeature(feature);
                });
                
                editLayer.setVisible(true);
                
                const effectiveFeatureCount = features.length - deletedFeatures.size;
                
                if (features.length === 1000) {
                    _GL.COMMON.showToast('현재 화면에 표시할 수 있는 최대 피처 수만 로드되었습니다. 확대하면 더 상세하게 볼 수 있습니다.', 'info');
                } else {
                    _GL.COMMON.showToast(`현재 화면에 ${effectiveFeatureCount}개 피처가 로드되었습니다.`, 'info');
                }
                
                return effectiveFeatureCount;
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
                _GL.COMMON.showToast('수정모드에서는 화면변화에 따른 피처로드를 하지 않습니다.', 'info');
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
                
                // 피처 ID별로 마지막 변경사항만 처리하도록 수정
                const latestChangeByFeatureId = new Map();
                
                // 각 피처 ID별 최종 변경 유형 추적
                const finalChangeTypeByFeatureId = new Map();
                
                // 각 피처 ID별 마지막 변경사항 찾기
                for (let i = 0; i < currentChanges.length; i++) {
                    const change = currentChanges[i];
                    
                    if (!change || !change.feature) {
                        continue;
                    }
                    
                    const featureId = change.feature.getId();
                    if (!featureId) {
                        continue;
                    }
                    
                    // 마지막 변경사항 업데이트 (덮어쓰기)
                    latestChangeByFeatureId.set(featureId, change);
                    
                    // 최종 변경 유형 추적 (delete가 가장 우선순위가 높음)
                    if (change.type === 'delete' || !finalChangeTypeByFeatureId.has(featureId)) {
                        finalChangeTypeByFeatureId.set(featureId, change.type);
                    } else if (change.type === 'insert' && finalChangeTypeByFeatureId.get(featureId) === 'update') {
                        // insert 다음에 update가 발생한 경우 최종 유형은 insert로 유지
                        finalChangeTypeByFeatureId.set(featureId, 'insert');
                    }
                }
                
                // 피처별 필수 속성 검증
                const requiredFields = ['ink', 'uslcode', 'kategoria_', 'lclsf_cd', 'sclsf_cd'];
                
                // 최종 변경사항만 적용
                for (const [featureId, change] of latestChangeByFeatureId.entries()) {
                    // 삭제인 경우 추가 검증 없이 처리
                    if (change.type === 'delete') {
                        const feature = new ol.Feature();
                        feature.setId(featureId);
                        toDelete.push(feature);
                        continue;
                    }
                    
                    const feature = new ol.Feature();
                    
                    const originalGeom = change.feature.getGeometry();
                    if (originalGeom) {
                        feature.setGeometry(originalGeom.clone());
                    }
                    
                    normalizeGeometry(feature);
                    
                    const props = change.feature.getProperties();
                    let hasAllRequiredFields = true;
                    
                    // 필수 필드 검증
                    for (const key of requiredFields) {
                        let value = props[key];
                        
                        if (value === null || value === undefined || value === '') {
                            hasAllRequiredFields = false;
                            break;
                        }
                        
                        // 피처에 값 설정
                        feature.set(key, value);
                    }
                    
                    // 필수 필드가 누락된 경우 이 피처는 건너뜀
                    if (!hasAllRequiredFields) {
                        console.warn(`피처 ${featureId}에 필수 필드가 누락되어 저장하지 않습니다.`);
                        continue;
                    }
                    
                    // 나머지 일반 필드 설정
                    for (const key in props) {
                        if (key !== 'geometry' && key !== 'geom' && !requiredFields.includes(key)) {
                            let value = props[key];
                            if (value === null || value === undefined) {
                                feature.set(key, null);
                            } else {
                                feature.set(key, value);
                            }
                        }
                    }
                    
                    const isTemp = featureId.toString().startsWith('temp_');
                    const finalChangeType = finalChangeTypeByFeatureId.get(featureId);
                    
                    if (isTemp) {
                        if (finalChangeType !== 'delete') {
                            // 임시 피처는 ID를 null로 설정하여 서버에서 새 ID 할당
                            feature.setId(null);
                            toInsert.push(feature);
                        }
                    } else {
                        // 기존 피처 처리
                        if (finalChangeType === 'insert') {
                            feature.setId(null); // 새 ID 할당
                            toInsert.push(feature);
                        } else if (finalChangeType === 'update') {
                            feature.setId(featureId);
                            toUpdate.push(feature);
                        }
                        // delete는 위에서 이미 처리
                    }
                }
                
                // 트랜잭션에 포함될 피처가 없으면 오류
                if (toInsert.length === 0 && toUpdate.length === 0 && toDelete.length === 0) {
                    reject(new Error('저장할 유효한 피처가 없습니다. 필수 속성을 입력해주세요.'));
                    return;
                }
                
                // 트랜잭션 XML 생성 및 전송
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
                
                // 디버깅용 로그
                console.log(`트랜잭션 요약: 추가=${toInsert.length}, 수정=${toUpdate.length}, 삭제=${toDelete.length}`);
                
                fetch(_GL.MAP_CONFIG.URLS.WFS, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/xml',
                        'X-CSRF-TOKEN': _GL.csrf.token
                    },
                    body: serializedXml
                })
                .then(response => {
				    // 먼저 응답이 성공적인지 확인
				    if (!response.ok) {
				        throw new Error(`HTTP error! status: ${response.status}`);
				    }
				    // 텍스트로 변환하기 전에 컨텐츠 타입 확인
				    const contentType = response.headers.get('content-type');
				    if (contentType && contentType.includes('text/xml')) {
				        return response.text();
				    } else if (contentType && contentType.includes('application/json')) {
				        return response.json().then(json => JSON.stringify(json));
				    } else {
				        // 기본적으로 텍스트로 시도
				        return response.text();
				    }
				})
				.then(responseData => {
				    // 문자열 여부 확인
				    const responseText = typeof responseData === 'string' 
				        ? responseData 
				        : JSON.stringify(responseData);
				    
				    if (responseText.includes('Exception') || responseText.includes('Error')) {
				        throw new Error(`WFS Transaction failed: Response: ${responseText}`);
				    }
				    
				 // 성공 응답 파싱
				    try {
				        const parser = new DOMParser();
				        const xmlDoc = parser.parseFromString(responseText, "text/xml");
				        
				        // 예외 확인
				        const exceptionElements = xmlDoc.getElementsByTagName('ExceptionReport');
				        const serviceExceptionElements = xmlDoc.getElementsByTagName('ServiceExceptionReport');
				        
				        if (exceptionElements.length > 0 || serviceExceptionElements.length > 0) {
				            throw new Error('서버에서 오류가 보고되었습니다');
				        }
				        
				        // 새로 할당된 피처 ID 추출
				        const newFeatureMap = new Map(); // 임시ID -> 새ID 매핑
				        
				        // wfs:InsertResults 및 하위 요소 검색
				        const insertResultsElements = xmlDoc.getElementsByTagName('wfs:InsertResults');
				        if (insertResultsElements.length > 0) {
				            const featureElements = insertResultsElements[0].getElementsByTagName('wfs:Feature');
				            
				            for (let i = 0; i < featureElements.length; i++) {
				                const featureElement = featureElements[i];
				                const featureIdElements = featureElement.getElementsByTagName('ogc:FeatureId');
				                
				                if (featureIdElements.length > 0) {
				                    const newFid = featureIdElements[0].getAttribute('fid');
				                    if (newFid) {
				                        // 임시 ID 매핑 (실제 데이터에 맞게 조정 필요)
				                        newFeatureMap.set(`temp_${i+1}`, newFid);
				                    }
				                }
				            }
				        }
				        
				        // 삽입/수정/삭제 건수 확인
				        let totalInserted = 0;
				        let totalUpdated = 0;
				        let totalDeleted = 0;
				        
				        // wfs:TransactionSummary 요소 찾기
				        const summaryElements = xmlDoc.getElementsByTagName('wfs:TransactionSummary');
				        
				        if (summaryElements.length > 0) {
				            const summaryElement = summaryElements[0];
				            
				            // 네임스페이스가 있는 요소 검색
				            const insertedElements = summaryElement.getElementsByTagName('wfs:totalInserted');
				            if (insertedElements.length > 0) {
				                totalInserted = parseInt(insertedElements[0].textContent || '0');
				            }
				            
				            const updatedElements = summaryElement.getElementsByTagName('wfs:totalUpdated');
				            if (updatedElements.length > 0) {
				                totalUpdated = parseInt(updatedElements[0].textContent || '0');
				            }
				            
				            const deletedElements = summaryElement.getElementsByTagName('wfs:totalDeleted');
				            if (deletedElements.length > 0) {
				                totalDeleted = parseInt(deletedElements[0].textContent || '0');
				            }
				        }
				        
				        console.log('Transaction response XML:', responseText);
				        console.log('Result counts:', { inserted: totalInserted, updated: totalUpdated, deleted: totalDeleted });
				        
				        const totalChanges = totalInserted + totalUpdated + totalDeleted;
				        
				        if (totalChanges === 0) {
				            throw new Error('변경사항이 저장되지 않았습니다 (0개 적용)');
				        }
				        
				        return {
				            success: true,
				            totalChanges: totalChanges,
				            newFeatureMap: newFeatureMap,
				            details: {
				                inserted: totalInserted,
				                updated: totalUpdated,
				                deleted: totalDeleted
				            }
				        };
				    } catch (parseError) {
				        console.error('XML 파싱 오류:', parseError);
				        console.log('원본 응답:', responseText);
				        
				        // 서버 응답에서 성공 여부 판단
				        if (responseText.includes('<wfs:totalInserted>') || 
				            responseText.includes('<wfs:totalUpdated>') || 
				            responseText.includes('<wfs:totalDeleted>')) {
				            
				            // 텍스트에서 직접 값 추출 (임시 방법)
				            const insertMatch = responseText.match(/<wfs:totalInserted>(\d+)<\/wfs:totalInserted>/);
				            const updateMatch = responseText.match(/<wfs:totalUpdated>(\d+)<\/wfs:totalUpdated>/);
				            const deleteMatch = responseText.match(/<wfs:totalDeleted>(\d+)<\/wfs:totalDeleted>/);
				            
				            const inserted = insertMatch ? parseInt(insertMatch[1]) : 0;
				            const updated = updateMatch ? parseInt(updateMatch[1]) : 0;
				            const deleted = deleteMatch ? parseInt(deleteMatch[1]) : 0;
				            
				            const totalChanges = inserted + updated + deleted;
				            
				            return {
				                success: true,
				                totalChanges: totalChanges,
				                newFeatureMap: new Map(),
				                details: {
				                    inserted: inserted,
				                    updated: updated,
				                    deleted: deleted
				                }
				            };
				        }
				        
				        throw parseError; // 파싱 실패 및 성공 텍스트도 없으면 에러 발생
				    }
                })
                .then(result => resolve(result))
                .catch(error => reject(error));
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
    function addToHistory(type, feature, originalGeometry = null, originalFeature = null) {
        let featureId = feature.getId();
        
        if (!featureId) {
            featureId = 'temp_' + Date.now();
            feature.setId(featureId);
        }
        
        const clonedFeature = feature.clone();
        clonedFeature.setId(featureId);
        
        const change = {
            type: type,
            feature: clonedFeature,
            timestamp: Date.now(),
            originalGeometry: originalGeometry || feature.getGeometry().clone(),
            originalFeature: originalFeature ? originalFeature.clone() : null
        };

        // 히스토리 위치 이후의 변경 사항을 제거 (redo 기록 제거)
        if (history.position < history.changes.length - 1) {
            history.changes = history.changes.slice(0, history.position + 1);
        }

        // 임시 피처 ID인지 확인
        const isTempFeature = featureId.toString().startsWith('temp_');

        if (type === 'update') {
            // 이전에 insert 기록이 있고 동일한 피처에 대한 것인지 확인
            const insertIndex = history.changes.findIndex(c => 
                c.type === 'insert' && c.feature && c.feature.getId() === featureId
            );
            
            if (insertIndex >= 0 && isTempFeature) {
                // 임시 피처의 insert 기록 업데이트 (기하 형태 포함)
                const insertChange = history.changes[insertIndex];
                insertChange.feature.setGeometry(clonedFeature.getGeometry().clone());
                
                // 속성 업데이트
                const props = clonedFeature.getProperties();
                for (const key in props) {
                    if (key !== 'geometry' && key !== 'geom') {
                        insertChange.feature.set(key, props[key]);
                    }
                }
                
                // 기존 update 기록 추가
                history.changes.push(change);
                history.position++;
            } else {
                // 기존 피처거나 insert 기록이 없는 경우 일반 update 처리
                history.changes.push(change);
                history.position++;
            }
        } else if (type === 'insert') {
            // 기존 insert 기록이 있으면 업데이트, 없으면 추가
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
            // 그 외 타입(delete 등)은 항상 새 히스토리 항목으로 추가
            history.changes.push(change);
            history.position++;
        }
        
        updateUIState();
    }
    
    /**
     * 피처 변경 적용
     */
    /**
     * 피처 변경 적용
     */
    function applyFeatureChange(change, isUndo = false) {
        const featureId = change.feature.getId();
        if (!featureId) {
            return;
        }

        // 현재 소스에서 해당 ID를 가진 모든 피처 찾기
        const existingFeatures = editSource.getFeatures().filter(f => f.getId() === featureId);
        
        // 임시 피처인지 확인
        const isTempFeature = featureId.toString().startsWith('temp_');

        switch(change.type) {
            case 'insert':
                if (isUndo) {
                    // 모든 중복 피처 제거
                    existingFeatures.forEach(f => {
                        editSource.removeFeature(f);
                    });
                    
                    // 임시 피처 배열에서도 제거
                    if (isTempFeature) {
                        const index = tempFeatures.findIndex(f => f.getId() === featureId);
                        if (index !== -1) {
                            tempFeatures.splice(index, 1);
                        }
                    }
                } else {
                    // 중복 방지: 모든 기존 피처 제거 후 새 피처 추가
                    existingFeatures.forEach(f => {
                        editSource.removeFeature(f);
                    });
                    
                    const newFeature = change.feature.clone();
                    newFeature.setId(featureId);
                    editSource.addFeature(newFeature);
                    
                    // 임시 피처 배열 업데이트
                    if (isTempFeature) {
                        const index = tempFeatures.findIndex(f => f.getId() === featureId);
                        if (index !== -1) {
                            tempFeatures[index] = newFeature.clone();
                        } else {
                            tempFeatures.push(newFeature.clone());
                        }
                    }
                }
                break;
            case 'update':
                if (existingFeatures.length > 0) {
                    // 첫 번째 피처만 업데이트하고 나머지 제거
                    const feature = existingFeatures[0];
                    
                    if (isUndo) {
                        // 원본 상태로 복원
                        feature.setGeometry(change.originalGeometry.clone());
                        
                        if (change.originalFeature) {
                            const originalProps = change.originalFeature.getProperties();
                            for (const key in originalProps) {
                                if (key !== 'geometry' && key !== 'geom') {
                                    feature.set(key, originalProps[key]);
                                }
                            }
                        }
                    } else {
                        // 변경 상태 적용
                        feature.setGeometry(change.feature.getGeometry().clone());
                        
                        // 속성 업데이트
                        const updatedProps = change.feature.getProperties();
                        for (const key in updatedProps) {
                            if (key !== 'geometry' && key !== 'geom') {
                                feature.set(key, updatedProps[key]);
                            }
                        }
                    }
                    
                    // 첫 번째 피처 외 중복 피처 제거
                    for (let i = 1; i < existingFeatures.length; i++) {
                        editSource.removeFeature(existingFeatures[i]);
                    }
                    
                    // 변경 사항을 소스에 알림
                    editSource.dispatchEvent('changefeature');
                    
                    // 임시 피처 배열 업데이트 - 임시 피처의 경우 insert 히스토리도 동기화
                    if (isTempFeature) {
                        const index = tempFeatures.findIndex(f => f.getId() === featureId);
                        if (index !== -1) {
                            const updatedTempFeature = feature.clone();
                            tempFeatures[index] = updatedTempFeature;
                            
                            // insert 히스토리 찾기
                            const insertIndex = history.changes.findIndex(c => 
                                c.type === 'insert' && c.feature && c.feature.getId() === featureId
                            );
                            
                            // insert 히스토리가 있으면 geometry 동기화
                            if (insertIndex >= 0) {
                                history.changes[insertIndex].feature.setGeometry(
                                    feature.getGeometry().clone()
                                );
                                
                                // 속성도 동기화
                                const props = feature.getProperties();
                                for (const key in props) {
                                    if (key !== 'geometry' && key !== 'geom') {
                                        history.changes[insertIndex].feature.set(key, props[key]);
                                    }
                                }
                            }
                        }
                    }
                }
                break;
            case 'delete':
                if (isUndo) {
                    // 삭제 취소: 피처 복원
                    const restoredFeature = change.feature.clone();
                    restoredFeature.setId(featureId);
                    
                    // 기본 스타일 적용 (하이라이트 방지)
                    if (editLayer && editLayer.getStyle()) {
                        restoredFeature.setStyle(editLayer.getStyle());
                    }
                    
                    editSource.addFeature(restoredFeature);
                    
                    if (isTempFeature) {
                        const exists = tempFeatures.some(f => f.getId() === featureId);
                        if (!exists) {
                            tempFeatures.push(restoredFeature.clone());
                        }
                    }
                    
                    // 삭제된 피처 목록에서 제거
                    if (deletedFeatures && deletedFeatures.has(featureId)) {
                        deletedFeatures.delete(featureId);
                    }
                } else {
                    // 삭제 작업: 피처 삭제
                    
                    // 1. 선택 상태 초기화 (하이라이트 방지)
                    if (selectInteraction) {
                        selectInteraction.getFeatures().clear();
                    }
                    
                    // 2. 피처 스타일 복원 (하이라이트 제거)
                    existingFeatures.forEach(feature => {
                        if (editLayer && editLayer.getStyle()) {
                            feature.setStyle(editLayer.getStyle());
                        }
                    });
                    
                    // 잠시 렌더링 시간 확보
                    setTimeout(() => {
                        // 3. 피처 제거
                        existingFeatures.forEach(feature => {
                            editSource.removeFeature(feature);
                        });
                        
                        if (isTempFeature) {
                            const index = tempFeatures.findIndex(f => f.getId() === featureId);
                            if (index !== -1) {
                                tempFeatures.splice(index, 1);
                            }
                        }
                        
                        // 4. 삭제된 피처 목록에 추가
                        if (!deletedFeatures) {
                            deletedFeatures = new Set();
                        }
                        deletedFeatures.add(featureId);
                        
                        // 5. 소스 변경 알림
                        editSource.dispatchEvent('changefeature');
                        instance.render();
                    }, 50);
                }
                break;
        }
        
        const updatedFeature = editSource.getFeatureById(featureId);
        
        instance.render();
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
            const isRequired = ['ink', 'uslcode', 'kategoria_', 'lclsf_cd', 'sclsf_cd'].includes(key);
            
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
                    <th class="text-center align-content-center w-33">
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
        
        // 삭제된 피처 필터링
        const filteredFeatures = features.filter(feature => {
            const featureId = feature.getId();
            return !(deletedFeatures && deletedFeatures.has(featureId));
        });
        
        // 만약 필터링 후 피처가 없다면
        if (filteredFeatures.length === 0) {
            grid.innerHTML = `
                <div class="p-3">
                    <div class="alert alert-info">
                        표시할 피처가 없습니다.
                    </div>
                </div>`;
                
            // 페이지네이션 정보 업데이트
            document.getElementById('startEntry').textContent = 0;
            document.getElementById('endEntry').textContent = 0;
            document.getElementById('totalFeatures').textContent = 0;
            
            // 페이지네이션 컨트롤 비활성화
            document.getElementById('prevPageItem').classList.add('disabled');
            document.getElementById('nextPageItem').classList.add('disabled');
            
            return;
        }
        
        // 페이지네이션 설정
        const totalFeatures = filteredFeatures.length;
        const totalPages = Math.ceil(totalFeatures / attributeTable.pageSize);
        const currentPage = Math.min(attributeTable.currentPage, totalPages || 1);
        attributeTable.currentPage = currentPage;
        
        // 현재 페이지의 피처들
        const startIndex = (currentPage - 1) * attributeTable.pageSize;
        const endIndex = Math.min(startIndex + attributeTable.pageSize, totalFeatures);
        const pageFeatures = filteredFeatures.slice(startIndex, endIndex);
        
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
                    <thead class="sticky-top">
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
        // 현재 편집 모드인지 확인
        if (!editingFeatures) {
            _GL.COMMON.showToast('편집 모드가 아닙니다. 먼저 편집 모드를 시작해주세요.', 'warning');
            return;
        }

        // 피처가 선택되어 있는지 확인
        if (!attributeTable.currentFeature) {
            _GL.COMMON.showToast('선택된 피처가 없습니다.', 'warning');
            return;
        }
        
        const feature = attributeTable.currentFeature;
        const featureId = feature.getId() || '';
        const isNewFeature = featureId.toString().startsWith('temp_');
        
        // 필수 필드 검증
        const requiredFields = ['ink', 'uslcode', 'kategoria_', 'lclsf_cd', 'sclsf_cd'];
        let missingRequiredFields = [];
        
        // 모든 필수 입력 요소(input과 select)를 통합하여 검증
        let hasEmptyRequiredFields = false;
        
        // 1. input[required] 검증
        const requiredInputs = document.querySelectorAll('#attributeGrid input[required]');
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                hasEmptyRequiredFields = true;
                const field = input.dataset.field;
                if (field && !missingRequiredFields.includes(field)) {
                    missingRequiredFields.push(field);
                }
            } else {
                input.classList.remove('is-invalid');
            }
        });
        
        // 2. requiredFields에 있는 select 검증
        requiredFields.forEach(field => {
            const select = document.querySelector(`#attributeGrid select[data-field="${field}"]`);
            if (select) {
                if (!select.value || select.value === '') {
                    select.classList.add('is-invalid');
                    hasEmptyRequiredFields = true;
                    if (!missingRequiredFields.includes(field)) {
                        missingRequiredFields.push(field);
                    }
                } else {
                    select.classList.remove('is-invalid');
                }
            }
        });
        
        if (hasEmptyRequiredFields) {
            _GL.COMMON.showToast(`다음 필수 필드를 입력/선택해주세요: ${missingRequiredFields.join(', ')}`, 'warning');
            return;
        }
        
        // 변경 전 피처의 완전한 복제본 생성
        const originalFeature = new ol.Feature();
        const originalGeom = feature.getGeometry() ? feature.getGeometry().clone() : null;
        originalFeature.setGeometry(originalGeom);
        originalFeature.setId(feature.getId());
        
        // 모든 속성 복사 (히스토리용)
        const props = feature.getProperties();
        for (const key in props) {
            if (key !== 'geometry' && key !== 'geom') {
                originalFeature.set(key, props[key]);
            }
        }
        
        // 기존 속성 저장 (변경 전)
        const originalProperties = {};
        for (const [key, value] of Object.entries(feature.getProperties())) {
            if (key !== 'geometry' && key !== 'geom') {
                originalProperties[key] = value;
            }
        }
        
        // 모든 필드 값을 수집
        const updatedProperties = {};
        let hasChanges = false; // 실제 변경된 속성이 있는지 확인
        
        const allInputs = document.querySelectorAll('#attributeGrid input, #attributeGrid select');
        
        allInputs.forEach(input => {
            const field = input.dataset.field;
            if (!field) return;
            
            let newValue;
            
            if (input.value.trim() === '') {
                newValue = null;
            } else {
                // 값이 있는 경우에만 변환 처리
                let value = input.value.trim();
                const fieldType = _GL.MAP.typeCache ? _GL.MAP.typeCache[field] : null;
                
                if (fieldType && fieldType.toLowerCase().includes('int')) {
                    newValue = parseInt(value) || null;
                } else if (fieldType && (fieldType.toLowerCase().includes('float') || 
                                        fieldType.toLowerCase().includes('numeric'))) {
                    newValue = parseFloat(value) || null;
                } else {
                    newValue = value; // 그 외의 경우 문자열 그대로
                }
            }
            
            updatedProperties[field] = newValue;
            
            // 변경이 있는지 확인 (엄격한 비교 대신 타입 변환 처리)
            const oldValue = originalProperties[field];
            
            // null과 undefined, 빈 문자열은 동등하게 처리
            const oldIsEmpty = oldValue === null || oldValue === undefined || oldValue === '';
            const newIsEmpty = newValue === null || newValue === undefined || newValue === '';
            
            if (oldIsEmpty && newIsEmpty) {
                // 둘 다 비어있으면 변경 없음
            } else if (oldIsEmpty !== newIsEmpty) {
                // 하나만 비어있으면 변경 있음
                hasChanges = true;
            } else if (String(oldValue) !== String(newValue)) {
                // 문자열 변환 후 비교해서 다르면 변경 있음
                hasChanges = true;
            }
        });
        
        // 변경사항이 있는 경우에만 진행 (신규 피처는 항상 변경으로 간주)
        if (!hasChanges && !isNewFeature) {
            _GL.COMMON.showToast('변경된 속성 정보가 없습니다.', 'info');
            return;
        }
        
        // 모든 속성을 한 번에 설정
        for (const [key, value] of Object.entries(updatedProperties)) {
            feature.set(key, value);
        }
        
        // 히스토리에 추가
        if (isNewFeature) {
            // 신규 피처인 경우 insert 히스토리 찾기
        	const insertIndex = history.changes.findIndex(
                change => change.type === 'insert' && change.feature.getId() === featureId
            );
            
            if (insertIndex >= 0) {
                // insert 히스토리가 있으면, 현재는 update로 처리
                addToHistory('update', feature, originalGeom, originalFeature);
                
                // insert 히스토리의 피처 속성도 업데이트 (동기화)
                const insertFeature = history.changes[insertIndex].feature;
                const updatedProps = feature.getProperties();
                for (const key in updatedProps) {
                    if (key !== 'geometry' && key !== 'geom') {
                        insertFeature.set(key, updatedProps[key]);
                    }
                }
            } else {
                // insert 히스토리가 없으면 새로 insert 히스토리 생성
                addToHistory('insert', feature);
            }
            
            // 임시 피처 배열 업데이트 - 기존 코드와 동일
            const index = tempFeatures.findIndex(f => f.getId() === featureId);
            if (index !== -1) {
                tempFeatures[index] = feature.clone();
            } else {
                tempFeatures.push(feature.clone());
            }
            
            _GL.COMMON.showToast('새로운 피처 속성이 저장되었습니다.', 'success');
        } else {
            // 기존 피처 업데이트 - 완전히 복제한 originalFeature 전달
            addToHistory('update', feature, originalGeom, originalFeature);
            _GL.COMMON.showToast('속성 정보가 업데이트되었습니다.', 'success');
        }
        
        // 전체 테이블 모드로 전환
        attributeTable.isFullTableMode = true;
        updateAttributeTable();
        document.querySelector('.map-popup-edit-footer').classList.remove('d-none');
        
        // 저장 후 추가한 피처를 테이블에서 강조
        setTimeout(() => {
            highlightFeatureInTable(featureId);
        }, 300);
        
        // UI 상태 업데이트
        updateUIState();
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
        if (!featureId || !attributeTable.isFullTableMode) {
        	return;
        }
        
        if (deletedFeatures && deletedFeatures.has(featureId)) {
            return;
        }
        
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
                    }, 100);
                }
            }
        }, 100);
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
     * 맵 클릭 이벤트 - 삭제 모드 이미 선택된 피처 처리
     */
    function initializeMapClickHandler() {
        // 기존 클릭 이벤트 제거 (중복 등록 방지)
        if (instance._mapClickHandler) {
            instance.un('click', instance._mapClickHandler);
        }

        // 새로운 맵 클릭 이벤트 핸들러 정의
        instance._mapClickHandler = function(event) {
            // 삭제 모드가 아니거나 편집 모드가 아니면 무시
            if (editMode !== 'delete' || !editingFeatures) return;
            
            const pixel = event.pixel;
            
            // 클릭한 위치에서 피처 찾기
            const feature = instance.forEachFeatureAtPixel(pixel, function(feature, layer) {
                if (layer === editLayer) return feature;
                return null;
            });
            
            if (!feature) return; // 피처가 없으면 무시
            
            const featureId = feature.getId();
            let selectedFeature = null;
            
            // 현재 선택된 피처 확인
            if (selectInteraction && selectInteraction.getFeatures().getLength() > 0) {
                selectedFeature = selectInteraction.getFeatures().item(0);
            }
            
            // 이미 선택된 피처를 다시 클릭한 경우
            if (selectedFeature && selectedFeature.getId() === featureId) {
                // 바로 삭제 확인 다이얼로그 표시
                promptDeleteFeature(feature);
                return;
            }
        };

        // 클릭 이벤트 등록
        instance.on('click', instance._mapClickHandler);
    }
    
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
                
                if (editMode === 'modify') {
                    return;
                }
                
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
        
        editingFeatures = false;
        
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
            // 변경사항 정보 저장
            const change = history.changes[history.position];
            const featureId = change.feature.getId();
            const isTempFeature = featureId.toString().startsWith('temp_');
            
            // 삭제 작업 취소인 경우 특별 처리
            if (change.type === 'delete') {
                // 선택 상태 초기화
                if (selectInteraction) {
                    selectInteraction.getFeatures().clear();
                }
                
                // 속성 테이블 현재 피처 초기화
                attributeTable.currentFeature = null;
                
                // 보존된 피처 복제
                const restoredFeature = change.feature.clone();
                restoredFeature.setId(featureId);
                
                // 기본 스타일 적용
                if (editLayer && editLayer.getStyle()) {
                    restoredFeature.setStyle(editLayer.getStyle());
                }
                
                // 피처 추가
                editSource.addFeature(restoredFeature);
                
                // 임시 피처인 경우 임시 피처 배열에도 추가
                if (isTempFeature) {
                    const exists = tempFeatures.some(f => f.getId() === featureId);
                    if (!exists) {
                        const tempFeature = restoredFeature.clone();
                        if (editLayer && editLayer.getStyle()) {
                            tempFeature.setStyle(editLayer.getStyle());
                        }
                        tempFeatures.push(tempFeature);
                    }
                }
                
                // 삭제된 피처 목록에서 제거
                if (deletedFeatures && deletedFeatures.has(featureId)) {
                    deletedFeatures.delete(featureId);
                }
                
                // 히스토리 위치 이동
                history.position--;
                
                // UI 상태 업데이트
                updateUIState();
                
                // 속성 테이블 업데이트 - 전체 테이블 모드로
                if (attributeTable.popup && attributeTable.popup.style.display === 'block') {
                    // 단일 피처 모드였다면 전체 테이블 모드로 전환
                    attributeTable.isFullTableMode = true;
                    updateAttributeTable();
                    
                    // 하이라이트된 행 없애기
                    setTimeout(() => {
                        document.querySelectorAll('.feature-row').forEach(row => {
                            row.classList.remove('table-primary');
                        });
                    }, 100);
                }
                
                // 렌더링 강제 갱신
                instance.render();
                
                return; // 여기서 함수 종료
            }
            
            // 임시 피처의 속성만 변경한 경우 특별 처리
            if (change.type === 'update' && isTempFeature) {
                // 이전 insert 기록 확인
                const insertIndex = history.changes.findIndex(c => 
                    c.type === 'insert' && c.feature && c.feature.getId() === featureId
                );
                
                // insert 기록이 있고, 현재 위치가 insert 이후인 경우에만 특별 처리
                if (insertIndex >= 0 && history.position > insertIndex) {
                    // 일반적인 변경사항 적용 (피처 삭제하지 않음)
                    applyFeatureChange(change, true);
                    history.position--;
                    
                    // UI 상태 업데이트
                    updateUIState();
                    
                    // 속성 테이블 업데이트
                    updateTableAfterUndo(featureId);
                    
                    return; // 여기서 함수 종료
                }
            }
            
            // 일반 실행 취소 처리
            applyFeatureChange(change, true);
            history.position--;
            
            // 선택 상태 초기화
            if (selectInteraction) {
                selectInteraction.getFeatures().clear();
            }
            
            // 속성 테이블 현재 피처 초기화
            attributeTable.currentFeature = null;
            
            // UI 상태 업데이트
            updateUIState();
            
            // 속성 테이블 업데이트 - 선택 없이
            if (attributeTable.popup && attributeTable.popup.style.display === 'block') {
                if (attributeTable.isFullTableMode) {
                    updateAttributeTable();
                    
                    // 하이라이트된 행 없애기
                    setTimeout(() => {
                        document.querySelectorAll('.feature-row').forEach(row => {
                            row.classList.remove('table-primary');
                        });
                    }, 100);
                } else {
                    // 단일 피처 모드였다면 전체 테이블 모드로 전환
                    attributeTable.isFullTableMode = true;
                    updateAttributeTable();
                }
            }
        }
    }

    /**
     * Undo 후 테이블 업데이트 처리
     */
    function updateTableAfterUndo(featureId) {
        // 강제로 테이블 업데이트 및 해당 행 하이라이트
        if (attributeTable.popup && attributeTable.popup.style.display === 'block') {
            // 전체 테이블인 경우 강제로 새로고침
            if (attributeTable.isFullTableMode) {
                const gridContent = document.getElementById('attributeGrid');
                if (gridContent) {
                    // 원래 테이블 내용만 로딩 표시로 대체
                    const tableElement = gridContent.querySelector('.table-responsive');
                    if (tableElement) {
                        tableElement.innerHTML = `
                            <div class="p-3 text-center">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        `;
                    }
                    
                    // 약간의 지연 후 테이블만 업데이트
                    setTimeout(() => {
                        updateAttributeTable();
                        
                        // 현재 선택된 피처 확인 및 하이라이트
                        if (selectInteraction && selectInteraction.getFeatures().getLength() > 0) {
                            const selectedFeature = selectInteraction.getFeatures().item(0);
                            if (selectedFeature) {
                                const selectedId = selectedFeature.getId();
                                highlightFeatureInTable(selectedId);
                            }
                        } else {
                            // 원래 피처 하이라이트 시도
                            const feature = editSource.getFeatureById(featureId);
                            if (feature) {
                                if (selectInteraction) {
                                    selectInteraction.getFeatures().clear();
                                    selectInteraction.getFeatures().push(feature);
                                }
                                highlightFeatureInTable(featureId);
                            }
                        }
                    }, 10);
                }
            } else {
                // 단일 피처 모드 처리
                const feature = editSource.getFeatureById(featureId);
                
                // 현재 편집 중인 피처가 있으면 에디터 업데이트
                if (feature) {
                    attributeTable.currentFeature = feature;
                    updateAttributeEditor(feature);
                } else {
                    // 피처가 삭제된 경우 (undo로 인해) 전체 테이블로 전환
                    attributeTable.isFullTableMode = true;
                    updateAttributeTable();
                }
            }
        }
    }

    /**
     * 다시 실행 처리
     */
    function handleRedo() {
        if (history.position < history.changes.length - 1) {
            // 다음 포지션으로 이동
            history.position++;
            
            // 해당 변경사항 가져오기
            const change = history.changes[history.position];
            const featureId = change.feature.getId();
            const isTempFeature = featureId.toString().startsWith('temp_');
            
            // 선택 상태 초기화
            if (selectInteraction) {
                selectInteraction.getFeatures().clear();
            }
            
            // 속성 테이블 현재 피처 초기화
            attributeTable.currentFeature = null;
            
            // 삭제 작업인 경우 특별 처리
            if (change.type === 'delete') {
                // 삭제된 피처 ID 목록에 추가
                if (!deletedFeatures) {
                    deletedFeatures = new Set();
                }
                deletedFeatures.add(featureId);
                
                // 피처 찾기
                const feature = editSource.getFeatureById(featureId);
                if (feature) {
                    // 선택 상태 초기화
                    if (selectInteraction) {
                        selectInteraction.getFeatures().clear();
                    }
                    
                    // 기본 스타일로 복원
                    if (editLayer && editLayer.getStyle()) {
                        feature.setStyle(editLayer.getStyle());
                    }
                    
                    // 피처 제거
                    editSource.removeFeature(feature);
                    
                    // 임시 피처인 경우 tempFeatures 배열에서도 제거
                    if (isTempFeature) {
                        const index = tempFeatures.findIndex(f => f.getId() === featureId);
                        if (index !== -1) {
                            tempFeatures.splice(index, 1);
                        }
                    }
                    
                    // 소스 변경 이벤트와 맵 렌더링 강제 갱신
                    editSource.dispatchEvent('changefeature');
                    instance.render();
                    
                    // UI 상태 업데이트
                    updateUIState();
                    
                    // 속성 테이블 업데이트
                    if (attributeTable.popup && attributeTable.popup.style.display === 'block') {
                        if (attributeTable.isFullTableMode) {
                            updateAttributeTable();
                        } else {
                            // 단일 피처 모드였다면 전체 테이블 모드로 전환
                            attributeTable.isFullTableMode = true;
                            updateAttributeTable();
                        }
                    }
                    
                    return; // 여기서 함수 종료
                }
            }
            
            // 임시 피처의 속성만 변경한 경우 특별 처리
            if (change.type === 'update' && isTempFeature) {
                // 이전 insert 기록 확인
                const insertIndex = history.changes.findIndex(c => 
                    c.type === 'insert' && c.feature && c.feature.getId() === featureId
                );
                
                // insert 기록이 있는 경우 특별 처리
                if (insertIndex >= 0) {
                    // 일반적인 변경사항 적용
                    applyFeatureChange(change, false);
                    
                    // insert 히스토리의 피처 속성도 업데이트 (동기화)
                    const updatedFeature = editSource.getFeatureById(featureId);
                    if (updatedFeature) {
                        const insertFeature = history.changes[insertIndex].feature;
                        const updatedProps = updatedFeature.getProperties();
                        
                        for (const key in updatedProps) {
                            if (key !== 'geometry' && key !== 'geom') {
                                insertFeature.set(key, updatedProps[key]);
                            }
                        }
                    }
                    
                    // UI 상태 업데이트
                    updateUIState();
                    
                    // 테이블 업데이트
                    updateTableAfterRedo(change, featureId);
                    
                    return; // 여기서 함수 종료
                }
            }
            
            // 일반적인 다시 실행 처리
            applyFeatureChange(change, false);
            
            // UI 상태 업데이트
            updateUIState();
            
            // 속성 테이블 업데이트
            if (attributeTable.popup && attributeTable.popup.style.display === 'block') {
                if (attributeTable.isFullTableMode) {
                    updateAttributeTable();
                } else {
                    // 단일 피처 모드에서 해당 피처가 있는지 확인
                    const feature = editSource.getFeatureById(featureId);
                    if (feature) {
                        updateAttributeEditor(feature);
                    } else {
                        // 피처가 없다면 전체 테이블 모드로 전환
                        attributeTable.isFullTableMode = true;
                        updateAttributeTable();
                    }
                }
            }
        }
    }

    /**
     * Redo 후 테이블 업데이트 처리
     */
    function updateTableAfterRedo(change, featureId) {
        // 강제로 테이블 업데이트 및 해당 행 하이라이트
        if (attributeTable.popup && attributeTable.popup.style.display === 'block') {
            // 전체 테이블인 경우 강제로 새로고침
            if (attributeTable.isFullTableMode) {
                const gridContent = document.getElementById('attributeGrid');
                if (gridContent) {
                    // 원래 테이블 내용만 로딩 표시로 대체
                    const tableElement = gridContent.querySelector('.table-responsive');
                    if (tableElement) {
                        tableElement.innerHTML = `
                            <div class="p-3 text-center">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        `;
                    }
                    
                    // 약간의 지연 후 테이블만 업데이트
                    setTimeout(() => {
                        updateAttributeTable();
                        
                        // 피처가 있으면 하이라이트
                        const feature = editSource.getFeatureById(featureId);
                        if (feature) {
                            // 선택 상태 업데이트
                            if (selectInteraction) {
                                selectInteraction.getFeatures().clear();
                                selectInteraction.getFeatures().push(feature);
                            }
                            attributeTable.currentFeature = feature;
                            
                            // 행 하이라이트 및 스크롤
                            highlightFeatureInTable(featureId);
                        }
                    }, 10);
                }
            } else {
                // 단일 피처 모드 처리
                const feature = editSource.getFeatureById(featureId);
                
                if (feature) {
                    attributeTable.currentFeature = feature;
                    updateAttributeEditor(feature);
                } else if (change.type === 'delete') {
                    // 삭제된 경우 전체 테이블로 전환
                    attributeTable.isFullTableMode = true;
                    updateAttributeTable();
                } else {
                    // 현재 피처가 없고 삭제가 아닌 경우 - 예외 상황
                    attributeTable.isFullTableMode = true;
                    updateAttributeTable();
                }
            }
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

        // 피처 ID 수정
        fixMissingFeatureIds();
        
        // 필수 속성 검증
        const invalidFeatures = validateFeatures();
        
        if (invalidFeatures.length > 0) {
            // 유효하지 않은 피처가 있는 경우 알림
            let message = '다음 피처에 필수 속성이 누락되었습니다:<br><ul>';
            
            const uniqueMessages = new Set();
            invalidFeatures.forEach(item => {
                const displayId = item.id.replace('temp_', '임시피처 #');
                const msg = `${displayId}: ${item.missingField} 필드 누락`;
                uniqueMessages.add(msg);
            });
            
            uniqueMessages.forEach(msg => {
                message += `<li>${msg}</li>`;
            });
            
            message += '</ul>저장하기 전에 필수 속성을 입력해 주세요.';
            
            _GL.COMMON.showAlertModal({
                title: '필수 속성 누락',
                message: message,
                type: 'warning',
                btn1: {
                    text: '확인',
                    callback: function() {
                        // 첫 번째 유효하지 않은 피처 선택하여 편집 모드로 이동
                        if (invalidFeatures.length > 0) {
                            const firstInvalidId = invalidFeatures[0].id;
                            const feature = editSource.getFeatureById(firstInvalidId);
                            
                            if (feature && selectInteraction) {
                                // 선택 상태 초기화 후 해당 피처 선택
                                selectInteraction.getFeatures().clear();
                                selectInteraction.getFeatures().push(feature);
                                
                                // 속성 편집기 표시
                                attributeTable.currentFeature = feature;
                                showAttributeEditor(feature);
                                
                                // 필드에 포커스
                                setTimeout(() => {
                                    const missingField = invalidFeatures[0].missingField;
                                    const fieldInput = document.querySelector(`[data-field="${missingField}"]`);
                                    if (fieldInput) {
                                        fieldInput.focus();
                                        fieldInput.classList.add('is-invalid');
                                    }
                                }, 300);
                            }
                        }
                    }
                }
            });
            return;
        }

        _GL.COMMON.showAlertModal({
            title: '변경사항 저장',
            message: '변경사항을 저장하시겠습니까?',
            type: 'success',
            btn1: {
                text: 'Save',
                callback: function() {
                    instance.getTargetElement().classList.add('spinner');

                    sendWFSTransaction()
	                    .then(result => {
	                        // 성공 메시지
	                        let message = '변경사항이 성공적으로 저장되었습니다';
	                        if (result.totalChanges > 0) {
	                            const details = result.details;
	                            message += ` (총 ${result.totalChanges}개: 추가 ${details.inserted}, 수정 ${details.updated}, 삭제 ${details.deleted})`;
	                        }
	                        
	                        _GL.COMMON.showToast(message, 'success');
	                        
	                        // 성공 시 처리
	                        tempFeatures.length = 0;
	                        editingFeatures = false;
	                        
	                        // 삭제된 피처 목록 초기화
	                        if (deletedFeatures) {
	                            deletedFeatures.clear();
	                        }
	                        
	                        try {
	                            _GL.MAP.refreshLanduseLayer();
	                        } catch (refreshError) {
	                            console.error('레이어 새로고침 오류:', refreshError);
	                            _GL.COMMON.showToast('변경사항이 저장되었으나 화면 갱신에 실패했습니다. 페이지를 새로고침하세요.', 'warning');
	                        }
	                        
	                        resetEditState();
	                    })
	                    .catch(error => {
	                        _GL.COMMON.showToast(`변경사항 저장 실패: ${error.message}`, 'error');
	                        console.error('저장 중 오류:', error);
	                    })
	                    .finally(() => {
	                        instance.getTargetElement().classList.remove('spinner');
	                    });
                }
            },
            btn2: {
                text: '취소'
            }
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
                        
                        if (deletedFeatures) {
                            deletedFeatures.clear();
                        }
                        
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
        
        initializeMapClickHandler();
        initializeMapMoveEndHandler();
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