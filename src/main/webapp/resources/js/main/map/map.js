/*========================================================
    DATE: 2024. 01
    AUTHOR: MOYOUNG
    DESC: Map Module
========================================================*/
_GL.MAP = (function() {
    'use strict';

    let initialized = false;
    let instance = null;
    let sideControl = null;
    let activeToolbarButton = null;
    let currentLang = 'ru';
    
    const sources = {
        vector: null,
        markers: {
            location: null,
            search: null,
            feature: null
        }
    };
    
    const layers = {
        base: {},
        curtain: {},
        admin: {},
        image: {},
        landuse: null,
    };
    
    const measure = {
        sketch: null,
        draw: null,
        helpTooltipElement: null,
        helpTooltip: null,
        measureTooltipElement: null,
        measureTooltip: null
    };
    
    // 필드 
    const labelCache = {};
    const typeCache = {};
    // 코드명
    const codeCache = {
        type: {},
        symbol: {},
        lclsf: {},
        sclsf: {}
    };
    
    /**
     * DOM 요소 가져오기
     */
    function getElements(type, subType) {
        switch(type) {
            case 'map':
                return {
                    map: document.getElementById('map'),
                    mapPopup: document.getElementById('mapPopup')
                };
            case 'sidebar':
                return {
                    sidebar: document.getElementById('sidebar'),
                    toggleBtn: document.getElementById('sidebarToggle')
                };
            case 'sliders':
                return {
                    basemap: document.getElementById('basemapSlider'),
                    aerial: document.getElementById('aerialSlider'),
                    satellite: document.getElementById('satelliteSlider'),
                    province: document.getElementById('provinceSlider'),
                    district: document.getElementById('districtSlider'),
                    community: document.getElementById('communitySlider'),
                    landuse: document.getElementById('landuseSlider'),
                };
            case 'landuse':
                return {
            		accordion: document.getElementById('landuseAccordion'),
                	classType: document.getElementsByName('classType'),
                    checkedClassType: document.querySelector('input[name="classType"]:checked'),
                    expandAllBtn: document.getElementById('expandAllBtn'),
                    selectAllBtn: document.getElementById('selectAllBtn')
                };
        }
    }

/* =====================================================
    Map Main
======================================================*/
    /**
     * 기본 소스 초기화
     */
    function initializeSources() {
        sources.vector = new ol.source.Vector();
        sources.markers.location = new ol.source.Vector();
        sources.markers.search = new ol.source.Vector();
        sources.markers.feature = new ol.source.Vector();
    }

    /**
     * 배경지도 레이어 생성
     */
    function createBaseLayer(url, id, visible) {
        return new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: url,
                crossOrigin: 'anonymous'
            }),
            visible: visible || false,
            id: id
        });
    }

    /**
     * WMS 레이어 생성
     */
    function createWMSLayer(url, params, id) {
    	currentLang = _GL.COMMON.getCurrentLanguage();
    	
        return new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: url,
                params: Object.assign({
                    'FORMAT': 'image/png',
                    'VERSION': '1.1.1',
                    'ENV': `lang=${currentLang}`
                }, params)
            }),
            visible: false,
            id: id
        });
    }

    /**
     * 벡터 레이어 생성
     */
    function createVectorLayer() {
        return new ol.layer.Vector({
            source: sources.vector,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255,255,255,0.2)'
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
            id: 'vector',
            zIndex: 1000
        });
    }
    
    /**
     * 벡터 소스 내 요소 삭제
     */
    function clearVectorSource() {
        if (sources.vector) {
            sources.vector.clear();
        }
    }
    
    /**
     * 마커 레이어 생성
     */
    function createMarkerLayers() {
    	return [
            new ol.layer.Vector({
                source: sources.markers.location,
                id: 'location-marker',
                zIndex: 1001
            }),
            new ol.layer.Vector({
                source: sources.markers.search,
                id: 'search-marker',
                zIndex: 1002
            }),
            new ol.layer.Vector({
                source: sources.markers.feature,
                id: 'feature-marker',
                zIndex: 1003
            })
        ];
    }
    
    /**
     * 마커 생성 (타입별)
     */
    function createMarker(xpos, ypos, text, markerType) {
        const markerStyle = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 0.9],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: `data:image/svg+xml;utf8,${encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="#ffffff" fill="${getMarkerColor(markerType)}">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" />
                    </svg>
                `)}`,
                scale: 1.5
            }),
            text: new ol.style.Text({
                text: text || '',
                offsetY: -45,
                font: '14px "Inter Var", -apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
                fill: new ol.style.Fill({color: getMarkerColor(markerType)}),
                stroke: new ol.style.Stroke({color: '#fff', width: 3}),
                textAlign: 'center',
                textBaseline: 'middle'
            })
        });

        const feature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([xpos, ypos]))
        });
        feature.setStyle(markerStyle);

        sources.markers[markerType].clear();
        sources.markers[markerType].addFeature(feature);
        
        return feature;
    }

    /**
     * 마커 색상 가져오기
     */
    function getMarkerColor(markerType) {
        switch(markerType) {
            case 'location':
                return '#2ecc71';
            case 'feature':
                return '#e74c3c';
            case 'search':
            default:
                return '#066fd1';
        }
    }
    
    /**
     * 특정 타입의 마커 제거
     */
    function clearMarker(markerType) {
        if (markerType) {
            if (sources.markers[markerType]) {
                sources.markers[markerType].clear();
            }
        } else {
            // 타입 지정 없으면 모든 마커 제거
            Object.values(sources.markers).forEach(source => {
                if (source) source.clear();
            });
        }
    }
    
    /**
     * 맵 인스턴스 생성
     */
    function createMapInstance() {
        const elements = getElements('map');
        
        instance = new ol.Map({
            target: elements.map,
            layers: getAllLayers(),
            view: new ol.View({
                center: ol.proj.fromLonLat(_GL.MAP_CONFIG.DEFAULT.CENTER),
                zoom: _GL.MAP_CONFIG.DEFAULT.ZOOM,
            }),
            controls: [
                new ol.control.ScaleLine({ units: 'metric' })
            ]
        });

        return instance;
    }
    
    /**
     * 모든 레이어 초기화 및 생성
     */
    function initializeLayers() {
        // 배경지도 레이어
        layers.base = {
            googleRoad: createBaseLayer(_GL.MAP_CONFIG.URLS.BASE_MAPS.GOOGLE.ROAD, 'google_road'),
            googleHybrid: createBaseLayer(_GL.MAP_CONFIG.URLS.BASE_MAPS.GOOGLE.HYBRID, 'google_hybrid'),
            googleSatellite: createBaseLayer(_GL.MAP_CONFIG.URLS.BASE_MAPS.GOOGLE.SATELLITE, 'google_satellite'),
            osmStandard: createBaseLayer(_GL.MAP_CONFIG.URLS.BASE_MAPS.OSM.STANDARD, 'osm_standard', true),
            osmStandard2: createBaseLayer(_GL.MAP_CONFIG.URLS.BASE_MAPS.OSM.STANDARD2, 'osm_standard2'),
            GIS2: createBaseLayer(_GL.MAP_CONFIG.URLS.BASE_MAPS.OSM.GIS2, '2gis'),
            geology: createBaseLayer(_GL.MAP_CONFIG.URLS.BASE_MAPS.OSM.GEOLOGY, 'geology')
        };

        // 커튼뷰 레이어
        layers.curtain = {
    		googleRoad: createBaseLayer(_GL.MAP_CONFIG.URLS.BASE_MAPS.GOOGLE.ROAD, 'right_google_road'),
            googleHybrid: createBaseLayer(_GL.MAP_CONFIG.URLS.BASE_MAPS.GOOGLE.HYBRID, 'right_google_hybrid'),
            googleSatellite: createBaseLayer(_GL.MAP_CONFIG.URLS.BASE_MAPS.GOOGLE.SATELLITE, 'right_google_satellite'),
            osmStandard: createBaseLayer(_GL.MAP_CONFIG.URLS.BASE_MAPS.OSM.STANDARD, 'right_osm_standard'),
            osmStandard2: createBaseLayer(_GL.MAP_CONFIG.URLS.BASE_MAPS.OSM.STANDARD2, 'right_osm_standard2'),
            GIS2: createBaseLayer(_GL.MAP_CONFIG.URLS.BASE_MAPS.OSM.GIS2, 'right_2gis'),
            geology: createBaseLayer(_GL.MAP_CONFIG.URLS.BASE_MAPS.OSM.GEOLOGY, 'right_geology')	
        }
        
        // 행정구역 레이어
        layers.admin = {
            province: createWMSLayer(_GL.MAP_CONFIG.URLS.WMS, {
                "LAYERS": _GL.MAP_CONFIG.URLS.LAYERS.PROVINCE,
            }, 'province'),
            district: createWMSLayer(_GL.MAP_CONFIG.URLS.WMS, {
                "LAYERS": _GL.MAP_CONFIG.URLS.LAYERS.DISTRICT
            }, 'district'),
            community: createWMSLayer(_GL.MAP_CONFIG.URLS.WMS, {
                "LAYERS": _GL.MAP_CONFIG.URLS.LAYERS.COMMUNITY
            }, 'community')
        };

        // 영상 레이어
        layers.image = {
    		aerial: createWMSLayer(_GL.MAP_CONFIG.URLS.WMS, {
                "LAYERS": _GL.MAP_CONFIG.URLS.LAYERS.AERIAL
            }, 'aerial'),
            satellite: createWMSLayer(_GL.MAP_CONFIG.URLS.WMS, {
            	"LAYERS": _GL.MAP_CONFIG.URLS.LAYERS.SATELLITE
            }, 'satellite')
        };
        
        // 토지이용도 레이어
        layers.landuse = 
        	createWMSLayer(_GL.MAP_CONFIG.URLS.WMS, {
	            "LAYERS": _GL.MAP_CONFIG.URLS.LAYERS.LANDUSE
	        }, 'landuse');
    }

    /**
     * 모든 레이어 가져오기
     */
    function getAllLayers() {
        return [].concat(
            Object.values(layers.base),
            Object.values(layers.curtain),
            Object.values(layers.admin),
            Object.values(layers.image),
            [layers.landuse],
            [createVectorLayer()],
            createMarkerLayers()
        );
    }
    
    /**
     * ID로 레이어 찾기
     */
    function findLayerById(id) {
        return instance.getLayers().getArray().find(layer => layer.get('id') === id);
    }
    
    /**
     * 레이어 가시성 설정
     */
    function setLayerVisibility(id, isVisible) {
        const layer = findLayerById(id);
        if (layer) layer.setVisible(isVisible);
    }
    
    /**
     * 지도 캡쳐 초기화
     */
    function initializeMapCapture() {
        _GL.COMMON.captureUtil.captureMap = function(callback) {
        	instance.once('rendercomplete', function() {
                try {
                    const mapCanvas = document.createElement('canvas');
                    const size = instance.getSize();
                    mapCanvas.width = size[0];
                    mapCanvas.height = size[1];
                    const mapContext = mapCanvas.getContext('2d');

                    Array.prototype.forEach.call(document.querySelectorAll('.ol-layer canvas'), function(canvas) {
                        if (canvas.width > 0) {
                            const opacity = canvas.parentNode.style.opacity;
                            mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
                            const transform = canvas.style.transform;
                            
                            const matrix = transform
                                .match(/^matrix\(([^\(]*)\)$/)[1]
                                .split(',')
                                .map(Number);
                                
                            CanvasRenderingContext2D.prototype.setTransform.apply(
                                mapContext,
                                matrix
                            );
                            mapContext.drawImage(canvas, 0, 0);
                        }
                    });

                    callback(null, mapCanvas.toDataURL());
                } catch (error) {
                    callback(error);
                    _GL.COMMON.showToast('Screenshot failed', 'error');
                }
            });
            instance.renderSync();
        };
    }
    
    /**
     * UI 컴포넌트 초기화
     */
    function initializeUIComponents() {
        const elements = getElements('map');
        
        setupCanvasReadFrequently();
        
        // 데이터 로딩 시작
        instance.on(['loadstart', 'loading'], function() {
            instance.getTargetElement().classList.add('spinner');
        });
        
        // 데이터 로딩 종료
        instance.on(['loadend', 'loaded'], function() {
            instance.getTargetElement().classList.remove('spinner');
        });
        
        // 캐시 데이터 로드
        initCacheData();
    }

    /**
     * Canvas 렌더러에 willReadFrequently 속성 설정
     */
    function setupCanvasReadFrequently() {
        // 원본 getContext 메서드 저장
        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        
        // getContext 메서드 오버라이드
        HTMLCanvasElement.prototype.getContext = function(type, attributes) {
            if (type === '2d') {
                // 속성이 없으면 생성
                attributes = attributes || {};
                // willReadFrequently 속성 추가
                attributes.willReadFrequently = true;
            }
            // 원본 메서드 호출
            return originalGetContext.call(this, type, attributes);
        };
    }
    
    /**
     * 사이드바 토글 초기화
     */
    function initializeSidebarToggle() {
    	const elements = getElements('sidebar');
        
    	if (elements.toggleBtn && elements.sidebar) {
            elements.toggleBtn.addEventListener('click', function() {
                elements.sidebar.classList.toggle('collapsed');
            });
        }
    }

/* =====================================================
    Map Popup
======================================================*/
    /**
     * 초기화 시 모든 캐시 데이터 로드
     */
    function initCacheData() {
        // 모든 필요한 캐시 데이터 로드
        return Promise.all([
            // 필드 레이블 로드
            fetch(`/klums/api/layer/field-labels?lang=${currentLang}`, {
                method: 'GET',
                headers: { 'X-CSRF-TOKEN': _GL.csrf.token }
            }),
            
            // 코드 데이터 로드
            fetch(`/klums/api/layer/codes/type?lang=${currentLang}`, {
                method: 'GET',
                headers: { 'X-CSRF-TOKEN': _GL.csrf.token }
            }),
            fetch(`/klums/api/layer/codes/symbol?lang=${currentLang}`, {
                method: 'GET',
                headers: { 'X-CSRF-TOKEN': _GL.csrf.token }
            }),
            fetch(`/klums/api/layer/codes/lclsf?lang=${currentLang}`, {
                method: 'GET',
                headers: { 'X-CSRF-TOKEN': _GL.csrf.token }
            }),
            fetch(`/klums/api/layer/codes/sclsf?lang=${currentLang}`, {
                method: 'GET',
                headers: { 'X-CSRF-TOKEN': _GL.csrf.token }
            })
        ])
        .then(responses => Promise.all(responses.map(r => r.json())))
        .then(([labels, types, symbols, lclsfs, sclsfs]) => {
        	// 필드 레이블 캐시에 저장
        	if (labels.success && labels.data) {
        		labels.data.forEach(field => {
        	        const langField = `fld_label_${currentLang}`;
        	        const cacheKey = `${field.fld_nm}`;
        	        labelCache[cacheKey] = field[langField];
        	        typeCache[cacheKey] = field.fld_type;
        	    });
        	}

        	// 타입 코드 캐시에 저장
        	if (types.success && types.data) {
        	    types.data.forEach(item => {
        	        const langField = `type_nm_${currentLang}`;
        	        codeCache.type[item.type_cd] = item[langField];
        	    });
        	}

        	// 심볼 코드 캐시에 저장
        	if (symbols.success && symbols.data) {
        	    symbols.data.forEach(item => {
        	        const langField = `symbol_nm_${currentLang}`;
        	        codeCache.symbol[item.symbol_cd] = item[langField];
        	    });
        	}

        	// 대분류 코드 캐시에 저장
        	if (lclsfs.success && lclsfs.data) {
        	    lclsfs.data.forEach(item => {
        	        const langField = `lclsf_nm_${currentLang}`;
        	        codeCache.lclsf[item.lclsf_cd] = item[langField];
        	    });
        	}

        	// 소분류 코드 캐시에 저장
        	if (sclsfs.success && sclsfs.data) {
        	    sclsfs.data.forEach(item => {
        	        const langField = `sclsf_nm_${currentLang}`;
        	        codeCache.sclsf[item.sclsf_cd] = item[langField];
        	    });
        	    
        	    codeCache.sclsfByLclsf = {};
        	    sclsfs.data.forEach(item => {
        	        const lclsfCd = item.lclsf_cd;
        	        if (!codeCache.sclsfByLclsf[lclsfCd]) {
        	            codeCache.sclsfByLclsf[lclsfCd] = {};
        	        }
        	        const langField = `sclsf_nm_${currentLang}`;
        	        codeCache.sclsfByLclsf[lclsfCd][item.sclsf_cd] = item[langField];
        	    });
        	}
        })
    }

    /**
     * 필드 레이블 가져오기 (캐시 사용)
     */
    function getFieldLabel(field) {
        const cacheKey = `${field}`;
        return labelCache[cacheKey] || field;
    }

    /**
     * 코드값 명칭 가져오기 (캐시 사용)
     */
    function getCodeName(type, code) {
        return (codeCache[type] && codeCache[type][code]) || code;
    }
    
    /**
     * 레이어 속성정보 조회 기능 초기화
     */
    function initializeFeatureInfo() {
        instance.on('singleclick', function(evt) {
        	const clickedOnPopup = evt.originalEvent.target.closest('.map-popup');
            if (clickedOnPopup) {
                return;
            }
            
            const coordinate = evt.coordinate;
            const landuseLayer = findLayerById('landuse');
            
            if (!landuseLayer || !landuseLayer.getVisible()) {
                clearMarker();
                closeFeatureInfo();
                return;
            }
            
            const source = landuseLayer.getSource();
            const view = instance.getView();
            const viewResolution = view.getResolution();
            const projection = view.getProjection();
            
            const url = source.getFeatureInfoUrl(
                coordinate, 
                viewResolution, 
                projection,
                {
                    'INFO_FORMAT': 'application/json',
                    'FEATURE_COUNT': 1,
                    'QUERY_LAYERS': _GL.MAP_CONFIG.URLS.LAYERS.LANDUSE
                }
            );
            
            if (url) {
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        if (data.features && data.features.length > 0) {
                        	if(!_GL.MAP_EDIT.isEditingActive()) {
                        		displayFeatureInfo(data.features, coordinate);
                        	}
                        } else {
                            clearMarker('feature');
                            closeFeatureInfo();
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching feature info:', error);
                        clearMarker('feature');
                        closeFeatureInfo();
                    });
            }
        });
    }

    /**
     * 속성정보 팝업 표시
     */
    function displayFeatureInfo(features, coordinate) {
        const elements = getElements('map');
        
        const isPopupVisible = elements.mapPopup.style.display === 'block';
        
        // 비동기 함수를 호출하고 결과를 기다림
        createFeatureTable(features[0].properties, currentLang, function(tableContent) {
            if (!isPopupVisible) {
                // 팝업 내용 생성
                let content = `
                    <div class="card h-100">
                        <div class="map-popup-header d-flex justify-content-between border-bottom p-3">
                            <h4 class="m-0">Land Use Information</h4>
                            <button type="button" class="btn-close" aria-label="Close"></button>
                        </div>
                        <div class="map-popup-content px-3 my-3">
                            ${tableContent}
                        </div>
                    </div>
                `;
                
                elements.mapPopup.innerHTML = content;
                
                // 드래그 기능 초기화
                setupPopupDragging(elements.mapPopup, '.map-popup-header');
                
                // 닫기 버튼 이벤트
                const closeButton = elements.mapPopup.querySelector('.btn-close');
                if (closeButton) {
                    closeButton.addEventListener('click', closeFeatureInfo);
                }
                
                elements.mapPopup.style.display = 'block';
            } else {
                // 이미 표시된 팝업의 내용만 업데이트
                const contentContainer = elements.mapPopup.querySelector('.map-popup-content');
                if (contentContainer) {
                    contentContainer.innerHTML = tableContent;
                }
            }
            
            // 클릭한 위치에 마커 표시
            createMarker(
                ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326')[0], 
                ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326')[1], 
                "", 'feature'
            );
        });
    }

    /**
     * 속성정보 테이블 생성
     */
    function createFeatureTable(properties, lang, callback) {
        let tableHtml = `
            <div class="table-responsive">
                <table class="table">
                    <tbody>`;
        
        // 테이블 행 생성
        Object.entries(properties).forEach(([key, value]) => {
            if (!key.startsWith('_') && !['geometry', 'bbox'].includes(key)) {
                // 필드 레이블 조회 (캐시 사용)
                const displayLabel = getFieldLabel(key);
                
                // 코드값 변환 (캐시 사용)
                let displayValue = value;
                if (key === 'kategoria_') {
                    displayValue = getCodeName('type', value) || value;
                } else if (key === 'uslcode') {
                    displayValue = getCodeName('symbol', value) || value;
                } else if (key === 'lclsf_cd') {
                    displayValue = getCodeName('lclsf', value) || value;
                } else if (key === 'sclsf_cd') {
                    displayValue = getCodeName('sclsf', value) || value;
                } else {
                    displayValue = _GL.COMMON.formatValue(value);
                }
                
                tableHtml += `
                    <tr>
                        <th class="text-nowrap">${displayLabel}</th>
                        <td>${displayValue}</td>
                    </tr>
                `;
            }
        });
        
        tableHtml += `</tbody></table></div>`;

        // 콜백이 함수인 경우에만 호출, 아니면 HTML 반환
        if (typeof callback === 'function') {
            callback(tableHtml);
        } else {
            return tableHtml;
        }
    }
    
    /**
     * 팝업 드래그 기능 설정
     */
    function setupPopupDragging(popupElement, popupHeader) {
    	const header = popupElement.querySelector(popupHeader);
        if (!header) return;
        
        let isDragging = false;
        let startX, startY;
        let originalLeft, originalTop;
        
        header.addEventListener('mousedown', function(e) {
            // 닫기 버튼 클릭은 무시
            if (e.target.closest('.btn-close')) return;
            
            e.preventDefault();
            
            // 현재 팝업 위치 저장
            const style = window.getComputedStyle(popupElement);
            originalLeft = parseInt(style.left, 10) || 0;
            originalTop = parseInt(style.top, 10) || 0;
            
            // 마우스 시작 위치 저장
            startX = e.clientX;
            startY = e.clientY;
            
            isDragging = true;
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            // 마우스 이동 거리 계산
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            // 새로운 위치 계산
            const newLeft = originalLeft + deltaX;
            const newTop = originalTop + deltaY;
            
            // 맵 영역 가져오기
            const mapElement = document.getElementById('map');
            const mapRect = mapElement.getBoundingClientRect();
            const popupRect = popupElement.getBoundingClientRect();
            
            const maxLeft = mapRect.width - popupRect.width;
            const maxTop = mapRect.height - popupRect.height;
            
            const constrainedLeft = Math.max(0, Math.min(newLeft, maxLeft));
            const constrainedTop = Math.max(0, Math.min(newTop, maxTop));
            
            // 위치 적용
            popupElement.style.left = `${constrainedLeft}px`;
            popupElement.style.top = `${constrainedTop}px`;
            popupElement.style.right = 'auto';
            popupElement.style.bottom = 'auto';
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
        
        // 드래그 중 문서 밖으로 마우스가 나가도 드래그 종료
        document.addEventListener('mouseleave', function() {
            isDragging = false;
        });
    }

    /**
     * 속성정보 팝업 닫기
     */
    function closeFeatureInfo() {
        const elements = getElements('map');
        elements.mapPopup.style.display = 'none';
        
        clearMarker('feature');
    }

/* =====================================================
    Land Use Map
======================================================*/
    /**
     * 토지이용 분류 데이터 로드
     */
    function loadLanduseClassifications() {
        const elements = getElements('landuse');
        
        fetch(`/klums/api/layer/classifications?lang=${currentLang}&classType=${elements.checkedClassType.value}`, {
            method: 'GET',
            headers: {
                'X-CSRF-TOKEN': _GL.csrf.token
            }
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                updateLanduseAccordion(result.data, elements.checkedClassType.value === 'type');
            } else {
                throw new Error(result.message);
            }
        })
        .catch(error => {
            console.error('Error fetching classifications:', error);
            _GL.COMMON.showToast(error, 'error');
        });
    }

    /**
     * 토지이용 아코디언 메뉴 업데이트
     */
    function updateLanduseAccordion(data, isLandType) {
        const elements = getElements('landuse');
        elements.accordion.innerHTML = '';
        let undefinedLabel = null;
       
        if (isLandType) {
            // LAND TYPE 단순 리스트 생성
            const listGroup = document.createElement('div');
            listGroup.className = 'px-4 pb-3';
            
            data.forEach(item => {
                const label = document.createElement('label');
                label.className = 'form-check';
                label.innerHTML = `
                    <input type="checkbox" class="form-check-input child-checkbox" value="${item.type_cd}">
                    <span class='form-check-label'>${item[`type_nm_${currentLang}`]}</span>
                `;
                
                if (item.type_cd === 0) {
                	undefinedLabel = label;
                } else {
                    listGroup.appendChild(label);
                }
                
                listGroup.appendChild(label);
            });
            
            if (undefinedLabel) {
                listGroup.appendChild(undefinedLabel);
            }
           
            elements.accordion.appendChild(listGroup);
        } else {
            // LAND USE 아코디언 생성
            const accordionContainer = document.createElement('div');
            accordionContainer.className = 'accordion pb-3';
            
            // 대분류별로 그룹화
            const groupedData = data.reduce((acc, item) => {
                const largeClasses = item[`lclsf_nm_${currentLang}`];
                if (!acc[largeClasses]) {
                    acc[largeClasses] = {
                        code: item.lclsf_cd,
                        items: []
                    };
                }
                acc[largeClasses].items.push({
                    name: item[`sclsf_nm_${currentLang}`],
                    code: item.sclsf_cd
                });
                return acc;
            }, {});
           
            Object.entries(groupedData).forEach(([largeClasses, largeClassData], index) => {
                const accordionItem = document.createElement('div');
                accordionItem.className = 'accordion-item border-0';
                
                const header = document.createElement('h2');
                header.className = 'accordion-header position-relative';
                header.innerHTML = `
                    <button class="accordion-button py-2 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_${index}">
                        <span>${largeClasses}</span>
                    </button>
                    <input type="checkbox" class="form-check-input parent-checkbox position-absolute ms-4">
                `;
                
                const listGroup = document.createElement('div');
                listGroup.className = 'px-3 ms-2';
                
                largeClassData.items.forEach(small => {
                    const label = document.createElement('label');
                    label.className = 'form-check';
                    label.innerHTML = `
                        <input type="checkbox" class="form-check-input child-checkbox" value="${small.code}">
                        <span class="form-check-label">${small.name}</span>
                    `;
                    listGroup.appendChild(label);
                });
                
                const accordionBody = document.createElement('div');
                accordionBody.className = 'accordion-body py-0';
                accordionBody.appendChild(listGroup);
                
                const accordionCollapse = document.createElement('div');
                accordionCollapse.id = `collapse_${index}`;
                accordionCollapse.className = 'accordion-collapse collapse';
                accordionCollapse.appendChild(accordionBody);
                
                accordionItem.appendChild(header);
                accordionItem.appendChild(accordionCollapse);
                accordionContainer.appendChild(accordionItem);
                
                if (largeClassData.code === 0) {
                	undefinedLabel = accordionItem;
                } else {
                    accordionContainer.appendChild(accordionItem);
                }
            });
            
            if (undefinedLabel) {
                accordionContainer.appendChild(undefinedLabel);
            }
            
            elements.accordion.appendChild(accordionContainer);
        }
    }
    
    /**
     * 체크박스 컨트롤 초기화
     */
    function initializeCheckboxControls(card) {
        if (!card) return;

        // 부모 체크박스 상태 업데이트 함수
        function updateParentState(childCheckbox) {
            const container = childCheckbox.closest('.accordion-body');
            if (container) {
                const childCheckboxes = container.querySelectorAll('.child-checkbox');
                const parentCheckbox = container.closest('.accordion-item')
                                              .querySelector('.parent-checkbox');

                if (parentCheckbox) {
                    const allChecked = Array.from(childCheckboxes).every(checkbox => checkbox.checked);
                    const someChecked = Array.from(childCheckboxes).some(checkbox => checkbox.checked);
                    
                    parentCheckbox.checked = allChecked;
                    parentCheckbox.indeterminate = !allChecked && someChecked;
                }
            }
        }

        // 체크박스 이벤트 위임
        card.addEventListener('change', function(e) {
            const target = e.target;
            
            if (target.matches('.parent-checkbox')) {
                const accordionItem = target.closest('.accordion-item');
                const childCheckboxes = accordionItem.querySelector('.accordion-body').querySelectorAll('.child-checkbox');
                childCheckboxes.forEach(checkbox => {
                    checkbox.checked = target.checked;
                });
                updateLayerVisibility();
            }
            
            if (target.matches('.child-checkbox')) {
                updateParentState(target);
                updateLayerVisibility();
            }
        });
    }
    
    /**
     * Land Use 레이어 가시성 업데이트
     */
    function updateLayerVisibility() {
        const elements = getElements('landuse');
        const checkedBoxes = elements.accordion.querySelectorAll('.child-checkbox:checked');
        const selectedCodes = Array.from(checkedBoxes).map(checkbox => checkbox.value);
        const classType = elements.checkedClassType.value;
        
        const landuseLayer = findLayerById('landuse');
        
        if (landuseLayer) {
            if (selectedCodes.length > 0) {
                const source = landuseLayer.getSource();
                const params = source.getParams();
                
                if (classType === 'type') {
                    params.STYLES = 'klums:type';
                    params.CQL_FILTER = `kategoria_ IN (${selectedCodes.join(',')})`;
                } else {
                    params.STYLES = 'klums:symbol';
                    params.CQL_FILTER = `sclsf_cd IN (${selectedCodes.join(',')})`;
                }
                
                source.updateParams(params);
                landuseLayer.setVisible(true);
            } else {
                landuseLayer.setVisible(false);
            }
        }
    }
    
    /**
     * WMS 레이어 새로고침
     */
    function refreshLanduseLayer() {
    	const landuseLayer = findLayerById('landuse');
        if (landuseLayer) {
            // 타임스탬프 추가하여 캐시 무효화
            const source = landuseLayer.getSource();
            const params = source.getParams();
            params.t = new Date().getTime();
            source.updateParams(params);
            
            // 레이어 다시 렌더링
            landuseLayer.changed();
        }
    }
    
    /**
     * classType 변경 시 레이어 가시성 초기화
     */
    function resetLanduseState() {
        const elements = getElements('landuse');
        
        // 레이어 가시성 초기화
        const landuseLayer = findLayerById('landuse');
        landuseLayer.setVisible(false);

        // 체크박스 초기화
        elements.accordion.querySelectorAll('.form-check-input').forEach(checkbox => {
            checkbox.checked = false;
        });

        // 버튼 상태 초기화
        elements.expandAllBtn.classList.remove('active');
        elements.selectAllBtn.classList.remove('active');
    }
    
/* =====================================================
    Toolbar
======================================================*/
    /**
     * 툴바 이벤트 핸들러
     */
    function handleToolbarAction(action, button) {
        switch(action) {
	        case 'fullscreen': toggleFullscreen(); break;
	        case 'zoomIn': zoomIn(); break;
	        case 'zoomOut': zoomOut(); break;
	        case 'defaultLocation': moveToDefault(); break;
	        case 'myLocation': moveToMyLocation(); break;
	        case 'refresh': clearMapElements(); break;
	        case 'distanceMeasurement': toggleMeasurementTool(button, 'LineString'); break;
	        case 'areaMeasurement': toggleMeasurementTool(button, 'Polygon'); break;
	        case 'curtainView': toggleToolbarMenu(button, 'curtainMenu'); break;
        }
    }

    /**
     * 전체화면 토글
     */
    function toggleFullscreen() {
        const elements = getElements('map');
        
        if (!document.fullscreenElement) {
        	elements.map.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    
    /**
     * 줌 확대
     */
    function zoomIn() {
        instance.getView().setZoom(instance.getView().getZoom() + 1);
    }

    /**
     * 줌 축소
     */
    function zoomOut() {
        instance.getView().setZoom(instance.getView().getZoom() - 1);
    }

    /**
     * 초기 위치로 이동
     */
    function moveToDefault() {
        instance.getView().animate({
            center: ol.proj.fromLonLat(_GL.MAP_CONFIG.DEFAULT.CENTER),
            zoom: _GL.MAP_CONFIG.DEFAULT.ZOOM,
            duration: 1000
        });
    }

    /**
     * 현재 위치로 이동
     */
    function moveToMyLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                function(info) {
                    const coords = [info.coords.longitude, info.coords.latitude];
                    instance.getView().animate({
                        center: ol.proj.fromLonLat(coords),
                        zoom: 12,
                        duration: 1000
                    });
                    createMarker(coords[0], coords[1], "My Location", 'location');
                },
                function() {
                    _GL.COMMON.showToast('Location information not available.', 'error');
                }
            );
        } else {
            _GL.COMMON.showToast('This browser does not support location information.', 'error');
        }
    }

    /**
     * 측정 도구 토글
     */
    function toggleMeasurementTool(button, type) {
        if (activeToolbarButton && activeToolbarButton !== button) {
            activeToolbarButton.classList.remove('active');
            if (measure.draw) {
                instance.removeInteraction(measure.draw);
            }
        }

        button.classList.toggle('active');
        if (button.classList.contains('active')) {
            activeToolbarButton = button;
            addMeasureInteraction(type);
        } else {
            activeToolbarButton = null;
            if (measure.draw) {
                instance.removeInteraction(measure.draw);
            }
        }
    }
    
    /**
     * 측정 값 툴팁 생성
     */
    function createMeasureTooltip() {
        if (measure.measureTooltipElement) {
            measure.measureTooltipElement.parentNode.removeChild(measure.measureTooltipElement);
        }
        measure.measureTooltipElement = document.createElement('div');
        measure.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
        measure.measureTooltip = new ol.Overlay({
            element: measure.measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center',
            stopEvent: false,
            insertFirst: false,
            id: "MeasureTooltip"
        });
        instance.addOverlay(measure.measureTooltip);
    }

    /**
     * 측정 도움말 툴팁 생성
     */
    function createHelpTooltip() {
        if (measure.helpTooltipElement) {
            measure.helpTooltipElement.parentNode.removeChild(measure.helpTooltipElement);
        }
        measure.helpTooltipElement = document.createElement('div');
        measure.helpTooltipElement.className = 'ol-tooltip hidden';
        measure.helpTooltip = new ol.Overlay({
            element: measure.helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left',
            id: "HelpTooltip"
        });
        instance.addOverlay(measure.helpTooltip);
    }

    /**
     * 측정 도구 상호작용 추가
     */
    function addMeasureInteraction(type) {
        measure.draw = new ol.interaction.Draw({
            source: sources.vector,
            type: type,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.5)',
                    lineDash: [10, 10],
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 0, 0.7)'
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    })
                })
            })
        });

        instance.addInteraction(measure.draw);
        createMeasureTooltip();
        createHelpTooltip();

        let listener;
        measure.draw.on('drawstart', function(evt) {
            measure.sketch = evt.feature;
            let tooltipCoord = evt.coordinate;

            listener = measure.sketch.getGeometry().on('change', function(evt) {
                const geom = evt.target;
                let output;
                if (geom instanceof ol.geom.Polygon) {
                    const area = ol.sphere.getArea(geom);
                    output = area > 10000 ? 
                        (Math.round((area / 1000000) * 100) / 100 + ' km<sup>2</sup>') : 
                        (Math.round(area * 100) / 100 + ' m<sup>2</sup>');
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof ol.geom.LineString) {
                    const length = ol.sphere.getLength(geom);
                    output = length > 100 ? 
                        (Math.round((length / 1000) * 100) / 100 + ' km') : 
                        (Math.round(length * 100) / 100 + ' m');
                    tooltipCoord = geom.getLastCoordinate();
                }
                measure.measureTooltipElement.innerHTML = output;
                measure.measureTooltip.setPosition(tooltipCoord);
            });
        });

        measure.draw.on('drawend', function() {
            measure.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
            measure.measureTooltip.setOffset([0, -7]);
            measure.sketch = null;
            measure.measureTooltipElement = null;
            createMeasureTooltip();
            ol.Observable.unByKey(listener);
        });
    }

    /**
     * 측정 데이터 및 마커 삭제
     */
    function clearMapElements() {
        // 측정 도구 관련 요소 삭제
        if (measure.draw) {
            instance.removeInteraction(measure.draw);
        }
        
        // 관련 오버레이 삭제
        instance.getOverlays().getArray().slice(0).forEach(function(overlay) {
            if (overlay.getId() === "MeasureTooltip" || overlay.getId() === "HelpTooltip") {
                instance.removeOverlay(overlay);
            }
        });
        
        clearVectorSource();
        clearMarker();
        
        // 측정 변수 초기화
        measure.sketch = null;
        measure.draw = null;
        measure.measureTooltipElement = null;
        measure.helpTooltipElement = null;
        activeToolbarButton.classList.remove('active');
    }
    
    /**
     * 툴바 메뉴 토글
     */
    function toggleToolbarMenu(button, menuId) {
        const dropdownMenu = document.getElementById(menuId);
        dropdownMenu.classList.toggle('show');

        // 외부 클릭 시 닫기
        document.addEventListener('click', function closeToolbarMenu(e) {
            if (!dropdownMenu.contains(e.target) && !button.contains(e.target)) {
                dropdownMenu.classList.remove('show');
                document.removeEventListener('click', closeToolbarMenu);
            }
        });
    }
    
    /**
     * 배경지도 설정
     */
    function setBasemap(id) {
    	const elements = getElements('sliders');
        const baseMapIds = ['osm_standard', 'osm_standard2', 'google_hybrid',
                            'google_satellite', 'google_road', '2gis', 'geology'];
        
        const opacity = elements.basemap && elements.basemap.noUiSlider ? 
    				elements.basemap.noUiSlider.get() / 100 : 1;

        instance.getLayers().getArray().forEach(function(layer) {
            const layerId = layer.get('id');
            if (baseMapIds.includes(layerId)) {
                layer.setVisible(layerId === id);
                if (layerId === id) {
                    layer.setOpacity(opacity);
                }
            }
        });
    }
    
    /**
     * 커튼뷰 설정
     */
    function toggleCurtainView(enabled) {
        if (enabled) {
            if (!sideControl) {
                sideControl = new ol.control.Swipe();
                instance.addControl(sideControl);
            }
            
            const selectedLayer = document.querySelector('input[name="curtainView"]:checked');
            if (selectedLayer) {
                setRightLayer(selectedLayer.value);
            }
        } else {
        	if (sideControl) {
        		instance.removeControl(sideControl);
        		sideControl = null;
        		
	        	instance.getLayers().getArray().forEach(function(layer) {
	                const layerId = layer.get('id');
	                if (layerId.startsWith('right_')) {
	                    layer.setVisible(false);
	                }
	            });
        	}
        }
    }

    /**
     * 우측 배경지도 설정
     */
    function setRightLayer(id) {
        if (!sideControl) return;
        
        const rightLayerIds = ['right_osm_standard', 'right_osm_standard2', 
                              'right_google_hybrid', 'right_google_satellite', 
                              'right_google_road', 'right_2gis', 'right_geology'];
        
        instance.getLayers().getArray().forEach(function(layer) {
            const layerId = layer.get('id');
            if (rightLayerIds.includes(layerId)) {
                layer.setVisible(layerId === id);
            }
        });
        
        const rightLayer = findLayerById(id);
        
        if (rightLayer) {
            sideControl.addLayer(rightLayer, true);
        }
    }

/* =====================================================
    Event Listeners
======================================================*/
    function initializeEventListeners() {
    	initializeSidebarToggle();    // 사이드바 이벤트
    	initializeLayerEvents();      // Layers 관련 이벤트
        initializeLanduseEvents();    // Land Use 관련 이벤트
        initializeFeatureInfo();      // 속성 정보  팝업 이벤트
        initializeToolbarEvents();    // 툴바 관련 이벤트
    }

    /**
     * Layers 관련 이벤트
     */
    function initializeLayerEvents() {
    	const elements = getElements('sliders');

    	// 배경지도 변경 이벤트
    	document.querySelectorAll('#basemap .form-check-input').forEach(checkbox => {
    	    checkbox.addEventListener('change', () => {
    	        setBasemap(checkbox.value);
    	    });
    	});
    	
        // 래스터 레이어 이벤트
    	document.querySelectorAll('#rasters .form-check-input').forEach(checkbox => {
    	    checkbox.addEventListener('change', () => {
    	        setLayerVisibility(checkbox.value, checkbox.checked);
    	    });
    	});

        // 행정구역 레이어 이벤트
    	document.querySelectorAll('#borders .form-check-input').forEach(checkbox => {
    	    checkbox.addEventListener('change', () => {
    	        setLayerVisibility(checkbox.value, checkbox.checked);
    	    });
    	});

        // 레이어 투명도 슬라이더 초기화 이벤트
        Object.entries(elements).forEach(([key, element]) => {
            if (element && window.noUiSlider) {
                try {
                    noUiSlider.create(element, {
                        start: 100,
                        connect: [true, false],
                        step: 1,
                        range: {
                            min: 0,
                            max: 100
                        }
                    });
                    element.noUiSlider.on('update', function(values) {
                        const opacity = values[0] / 100;
                        
                        if (key === 'basemap') {
                            const basemapIds = ['osm_standard', 'osm_standard2', 'google_hybrid',
                                              'google_satellite', 'google_road', '2gis', 'geology'];
                            
                            instance.getLayers().getArray()
                                .filter(layer => basemapIds.includes(layer.get('id')) && layer.getVisible())
                                .forEach(layer => layer.setOpacity(opacity));
                        } else {
                            const layer = findLayerById(key);
                            if (layer) {
                                layer.setOpacity(opacity);
                            }
                        }
                    });
                } catch (error) {
                    console.error(`Failed to initialize slider for ${key}:`, error);
                }
            }
        });
    }

    /**
     * Land Use 관련 이벤트
     */
    function initializeLanduseEvents() {
        const elements = getElements('landuse');
        
        // 체크박스 이벤트 
        initializeCheckboxControls(elements.accordion);
        
        // Expand All 버튼 이벤트
        elements.expandAllBtn.addEventListener('click', function() {
           const collapseElements = elements.accordion.querySelectorAll('.accordion-collapse');
           this.classList.toggle('active');
           
           collapseElements.forEach(element => {
               const bsCollapse = new bootstrap.Collapse(element, {
                   toggle: false
               });
               this.classList.contains('active') ? bsCollapse.show() : bsCollapse.hide();
           });
        });

        // Select All 버튼 이벤트
        elements.selectAllBtn.addEventListener('click', function() {
           const allCheckboxes = elements.accordion.querySelectorAll('.form-check-input');
           this.classList.toggle('active');
           
           allCheckboxes.forEach(checkbox => {
               checkbox.checked = this.classList.contains('active');
           });
           
           updateLayerVisibility();
        });

        // classType 변경 이벤트
        elements.classType.forEach(radio => {
        	radio.addEventListener('change', function() {
        		closeFeatureInfo();
        		resetLanduseState();
            	loadLanduseClassifications();
        	});
        });
        
        // 초기 데이터 로드
        loadLanduseClassifications();
    }
    		
    /**
     * 툴바 관련 이벤트
     */
    function initializeToolbarEvents() {
        // 툴바 버튼 클릭 이벤트
        document.querySelectorAll('.btn[data-action]').forEach(button => {
            button.addEventListener('click', function() {
                handleToolbarAction(this.getAttribute('data-action'), this);
            });
        });

        // 전체화면 변경 감지 이벤트
        document.addEventListener('fullscreenchange', function() {
            const fullscreenBtn = document.querySelector('[data-action="fullscreen"]');
            if (fullscreenBtn) {
                fullscreenBtn.classList.toggle('active', document.fullscreenElement !== null);
            }
        });
        
        // 커튼뷰 활성화/비활성화 이벤트
        document.getElementById('curtainSwitch').addEventListener('change', function() {
            toggleCurtainView(this.checked);
        });
        
        // 커튼뷰 우측 배경지도 변경 이벤트
        document.querySelectorAll('input[name="curtainView"]').forEach(radio => {
            radio.addEventListener('change', function(e) {
                const curtainSwitch = document.getElementById('curtainSwitch');
                if (!curtainSwitch || !curtainSwitch.checked) {
                    _GL.COMMON.showToast('Please turn on Curtain View first', 'warning');
                    return;
                }
                
                if (sideControl && this.checked) {
                    setRightLayer(this.value);
                }
            });
        });
    }

    // public API
    return {
        init: function() {
            if (initialized) return;
            initializeSources();
            initializeLayers();
            createMapInstance();
            initializeMapCapture();
            initializeUIComponents();
            initializeEventListeners();
            initialized = true;
        },
        getInstance: function() {
            return instance;
        },
        labelCache: labelCache,
        typeCache: typeCache,
        codeCache: codeCache,
        findLayerById: findLayerById,
        setLayerVisibility: setLayerVisibility,
        refreshLanduseLayer: refreshLanduseLayer,
        setupPopupDragging: setupPopupDragging,
        createMarker: createMarker
    };
})();

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    _GL.MAP.init();
});