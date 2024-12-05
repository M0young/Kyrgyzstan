/**
 * Subject : 지도
 * Author : egis
 * Date : 2024. 3. 11.
 * COMMENT : 지도 기능 js파일
 */
var map = null;
var geoserverUrl = "https://vndan-geo.egiscloud.com/krgz";
// google basic	
var googleRoad = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
		crossOrigin: 'anonymous'
	}),
	id: 'google_road',
	visible: false
});

// google hybrid
var googleHybrid = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
		crossOrigin: 'anonymous'
	}),
	id: 'google_hybrid',
	visible: false
});

// google satellite
var googleSatellite = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url: 'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}',
		crossOrigin: 'anonymous'
	}),
	id: 'google_satellite',
	visible: false
});

//osm
var osmStandard = new ol.layer.Tile({
	/*source: new ol.source.XYZ({
		url : 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		crossOrigin: 'anonymous'
	}),*/
	source: new ol.source.OSM,
	id: 'osm_standard',
	visible: true
});

//osm2
var osmStandard2 = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url : 'https://{a-c}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
		crossOrigin: 'anonymous'
	}),
	id: 'osm_standard2',
	visible: false
});

//stadia_alidadeSmooth
var stadia_alidadeSmooth = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url : 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}@2x.png?api_key=99425f3c-24bb-4e1e-94fc-c257d13c34a5',
		crossOrigin: 'anonymous'
	}),
	id: 'stadia_alidadeSmooth',
	visible: false
});

//2GIS
var GIS2 = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url : 'https://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}',
		crossOrigin: 'anonymous'
	}),
	id: '2gis',
	visible: false
});

//geology
var geology = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url : 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
		crossOrigin: 'anonymous'
	}),
	id: 'geology',
	visible: false
});

//커튼뷰 배경지도
//google basic
var side_googleRoadLayer = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
		crossOrigin: 'anonymous'
	}),
	id: 'right_google_road',
	visible: false
});

//google satellite
var side_googleSatelliteLayer = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url: 'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}',
		crossOrigin: 'anonymous'
	}),
	id: 'right_google_satellite',
	visible: false
});

//google hybrid
var side_googleHybridLayer = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
		crossOrigin: 'anonymous'
	}),
	id: 'right_google_hybrid',
	visible: false
});

//osm
var side_osmStandardLayer = new ol.layer.Tile({
	source: new ol.source.OSM,
	id: 'right_osm_standard',
	visible: false
});

//osm2
var side_osmStandard2 = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url : 'https://{a-c}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
		crossOrigin: 'anonymous'
	}),
	id: 'right_osm_standard2',
	visible: false
});

//stadia_alidadeSmooth
var side_stadia_alidadeSmooth = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url : 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}@2x.png?api_key=99425f3c-24bb-4e1e-94fc-c257d13c34a5',
		crossOrigin: 'anonymous'
	}),
	id: 'right_stadia_alidadeSmooth',
	visible: false
});

//2GIS
var side_GIS2 = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url : 'https://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}',
		crossOrigin: 'anonymous'
	}),
	id: 'right_2gis',
	visible: false
});

//geology
var side_geology = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url : 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
		crossOrigin: 'anonymous'
	}),
	id: 'right_geology',
	visible: false
});

////Province
//var Province = new ol.layer.Tile({
//	source: new ol.source.TileWMS({
//		url: 'http://map.darek.kg/qgis/qgis_mapserv.fcgi.exe?map=C:/OSGeo4W64/projects/%D0%93%D0%98%D0%A1%D0%90%D0%A0/%D0%93%D0%98%D0%A1%D0%90%D0%A0.qgz&LAYERS=Граница%20Кыргызстана,Граница%20области,Границы%20районов,Границы%20аймаков,Сектор%20(а%2Fо),Квартал%20(насел.%20пункт),Озера,Улицы,ГФСУ,Участки%20ЕНИ%20копия,Участки%20ЕНИ,Здания%20ЕНИ&OPACITIES=255,255,255,255,255,255,255,255,255,255,255,255&FORMAT=image%2Fpng&TRANSPARENT=TRUE&DPI=96&VERSION=1.3.0&EXCEPTIONS=INIMAGE&SERVICE=WMS&REQUEST=GetMap&STYLES=&CRS=EPSG%3A3857&BBOX=7291052.1778474,4512445.3389354,9338341.5431526,5575225.7800646&WIDTH=1674&HEIGHT=869',
//		crossOrigin: 'anonymous'
//	}),
//	id: 'province',
//	visible: false,
//});

//province 레이어 추가
var krgzProvince = new ol.layer.Tile({
	visible: false,
	id: 'province',
	source: new ol.source.TileWMS({
		url: geoserverUrl+'/wms',
		params: {
			'FORMAT': 'image/png',
			'VERSION': '1.1.1',
			tiled: true,
			"STYLES": 'krgz:polygon_krgz_province',
			"LAYERS": 'krgz:province',
	    }
	}),
});

//district 레이어 추가
var krgzDistrict = new ol.layer.Tile({
	visible: false,
	id: 'district',
	source: new ol.source.TileWMS({
		url: geoserverUrl+'/wms',
		params: {
			'FORMAT': 'image/png',
			'VERSION': '1.1.1',
			tiled: true,
			"STYLES": 'krgz:polygon_krgz_district',
			"LAYERS": 'krgz:district'
		}
	}),
});

//community 레이어 추가
var krgzCommunity = new ol.layer.Tile({
	visible: false,
	id: 'community',
	source: new ol.source.TileWMS({
		url: geoserverUrl+'/wms',
		params: {
			'FORMAT': 'image/png',
			'VERSION': '1.1.1',
			tiled: true,
			"STYLES": 'krgz:polygon_krgz_community',
			"LAYERS": 'krgz:community'
		}
	}),
});

// Aerial 레이어 추가
var krgzAerial = new ol.layer.Tile({
	visible: false,
	id: 'aerial',
	source: new ol.source.TileWMS({
		url: geoserverUrl+'/wms',
		params: {
			'FORMAT': 'image/png',
			'VERSION': '1.1.1',
			tiled: true,
			"LAYERS": 'krgz:aerial_issyk_ata'
		}
	}),
});

// Satellite 레이어 추가
var krgzSatellite = new ol.layer.Tile({
	visible: false,
	id: 'satellite',
	source: new ol.source.TileWMS({
		url: geoserverUrl+'/wms',
		params: {
			'FORMAT': 'image/png',
			'VERSION': '1.1.1',
			"LAYERS": 'krgz:satellite_issyk_ata'
		}
	}),
});

//IsskyAta 레이어 추가
var krgzIssykata = new ol.layer.Tile({
	visible: false,
	id: 'issykata',
	source: new ol.source.TileWMS({
		url: geoserverUrl+'/wms',
		params: {
			'FORMAT': 'image/png',
			'VERSION': '1.1.1',
			tiled: true,
			"LAYERS": 'krgz:land'
		}
	}),
});

//거리, 면적 측정
var vectorSource = new ol.source.Vector();
var vector = new ol.layer.Vector({
	id: 'vector',
	source: vectorSource,
	zIndex: 1000,
	style: new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'rgba(255,255,255,0.2)'
		}),
		stroke: new ol.style.Stroke({
			//color: 'rgba(0,0,255,1.0)',
			color: '#ffcc33',
			width: 2
		}),
		image: new ol.style.Circle({
			radius: 7,
			fill: new ol.style.Fill({
				color: '#ffcc33'
			})
		})
	})
});

//거리, 면적 측정
var vectorSource = new ol.source.Vector();
var vector = new ol.layer.Vector({
	id: 'vector',
	source: vectorSource,
	zIndex: 1000,
	style: new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'rgba(255,255,255,0.2)'
		}),
		stroke: new ol.style.Stroke({
			//color: 'rgba(0,0,255,1.0)',
			color: '#ffcc33',
			width: 2
		}),
		image: new ol.style.Circle({
			radius: 7,
			fill: new ol.style.Fill({
				color: '#ffcc33'
			})
		})
	})
});

var measureTooltip, measureTooltipElement, ElementhelpTooltip, helpTooltipElement;

//마커
var markerVectorLayer = new ol.layer.Vector({
	source: "",
	style: function(feature, resolution) {
		//iconStyle.getImage().setScale(1/Math.pow(resolution, 1/3));
		//labelStyle.getText().setText(feature.get('name'));
		return markerStyle;
	},
	zIndex: 500,
	//maxZoom: 12,
	minZoom: 4,
});

// Popup showing the position the user clicked
var mapPopup = new ol.Overlay({
	element: document.getElementById('mapPopup'),
	id: "mapPopup",
    offset: [0, -105],
});

var vectorLayer = new ol.layer.Vector({
    source: vectorSource
});

var MAP = {
	_zoom: 7,
	_coords: [74.766098, 41.20438],
	// 초기 실행함수
	init : function(){
		map = new ol.Map({
		    controls: ol.control.defaults.defaults({
		    	attribution: false,
		    	rotate: false,
		        zoom: false
		    }).extend([
		    	MAP.SIDE.sds // 사용자 정의 컨트롤 추가
	        ]),
		    target: 'map',
		    layers: [
		    	// 배경지도
		        googleRoad, googleHybrid, googleSatellite, osmStandard, osmStandard2, stadia_alidadeSmooth, GIS2, geology
		        // 커튼뷰 배경지도
		    	, side_osmStandardLayer, side_googleRoadLayer, side_googleHybridLayer, side_googleSatelliteLayer, side_osmStandard2, side_stadia_alidadeSmooth, side_GIS2, side_geology
		    	// 행정구역
		    	, krgzProvince, krgzDistrict, krgzCommunity, krgzAerial, krgzSatellite
		        // 측정
		    	, vector, vectorLayer
		    	// 마커
		 	    , markerVectorLayer
		    	// 레이어
		 	    , krgzIssykata
		    ],
		    view: new ol.View({
		        center: ol.proj.fromLonLat(this._coords),
		        zoom: this._zoom,
		        constrainOnlyCenter: true,
		    }),
		});
		
		// 측청(거리, 면적)
		map.on('pointermove', MAP.MEASURE.pointerMoveHandler.bind(MAP.MEASURE));
		map.getViewport().addEventListener('mouseout', function() {
			if (helpTooltipElement) {
				helpTooltipElement.classList.add('hidden');
			}
		});
		
		// 로딩바 설정
		map.on('loadstart', function () {
			map.getTargetElement().classList.add('spinner');
		});
		map.on('loadend', function () {
			map.getTargetElement().classList.remove('spinner');
		});
		
		// 축척 설정
		let scaleControl = new ol.control.ScaleLine({
		      units: 'metric',
		      /*bar: true,
		      steps: parseInt(5, 10),
		      text: true,
		      minWidth: 140,*/
		});
		map.addControl(scaleControl);
		
		// 지도상 팝업
		map.addOverlay(mapPopup);
	},
	// 지도 확대
	zoomIn: function(map){
		var zoom = map.getView().getZoom() + 1;
		map.getView().setZoom(zoom);
	},
	// 지도 축소
	zoomOut: function(map){
		const zoom = map.getView().getZoom() - 1;
		map.getView().setZoom(zoom);
	},
	// 초기 위치로 이동
	moveDefaultLocation: function() {
		/*map.getView().setCenter(ol.proj.fromLonLat(this._coords));
		map.getView().setZoom(this._zoom);*/
		
		map.getView().animate({
            center: ol.proj.fromLonLat(this._coords),
            zoom: this._zoom,
            duration: 1000
        });
	},
	// 현재 위치로 이동
	moveMyLocation: function() {
		if("geolocation" in navigator) {
		    navigator.geolocation.getCurrentPosition(function(info){
				var coords = [info.coords.longitude, info.coords.latitude];
				
				map.getView().animate({
		            center: ol.proj.fromLonLat(coords),
		            zoom: this._zoom,
		            duration: 1000
		        });
				
				SEARCH.setMarker(info.coords.longitude, info.coords.latitude, "Current Location");
				
			}, function(info){
				if(info.code == 1){
					// 위치 정보를 사용할 수 없습니다.
		   			CMM.alert('Location information not available.', 'warning');
				}
			});
		} else {
			// 이 브라우저는 위치 정보를 지원하지 않습니다.
			CMM.alert('This browser does not support location information.', 'warning');
		}
	},
	// 배경지도 변경
	setBasemap: function(id) {
		$.each(map.getLayers().getArray(), function(i, v) {
			if (id == v.get('id')) {
				v.setVisible(true);
			} else {
				if (v.get('id') == "google_hybrid" || v.get('id') == "google_satellite" || v.get('id') == "google_road" || v.get('id') == "osm_standard" || v.get('id') == "osm_standard2" || v.get('id') == "stadia_alidadeSmooth" || v.get('id') == "2gis" || v.get('id') == "geology") {
					v.setVisible(false);
				}
			}
		});
	},
	layerControl: function(id, active_yn) {
		var layertmp = map.getLayers().getArray().find(layer => layer.get('id') == id);
		if(layertmp) layertmp.setVisible(active_yn);
	},
	// 커튼뷰 (Side by Side)
	SIDE: {
		sds: null,
		openFlag: false,
		sdsOpen: function() {
			this.sds.open();
			this.openFlag = true;
			this.setBasemap($("input:radio[name='sidebyside']:checked").val());
		},
		// 배경지도 설정
		setBasemap: function(id){
			this.sds._rightLayers = [];
			
			if(id == "right_osm_standard"){
				this.sds.setRightLayer(side_osmStandardLayer);
			}else if(id == "right_google_road"){
				this.sds.setRightLayer(side_googleRoadLayer);
			}else if(id == "right_google_hybrid"){
				this.sds.setRightLayer(side_googleHybridLayer);
			}else if(id == "right_google_satellite"){
				this.sds.setRightLayer(side_googleSatelliteLayer);
			}else if(id == "right_osm_standard2"){
				this.sds.setRightLayer(side_osmStandard2);
			}else if(id == "right_stadia_alidadeSmooth"){
				this.sds.setRightLayer(side_stadia_alidadeSmooth);
			}else if(id == "right_2gis"){
				this.sds.setRightLayer(side_GIS2);
			}else if(id == "right_geology"){
				this.sds.setRightLayer(side_geology);
			}
			$.each(map.getLayers().getArray(), function(i, v) {
				
				if (id == v.get('id')) {
					v.setVisible(true);
				} else {
					if (v.get('id') == "right_osm_standard" || v.get('id') == "right_google_road" || v.get('id') == "right_google_hybrid" || v.get('id') == "right_google_satellite" || v.get('id') == "right_osm_standard2" || v.get('id') == "right_stadia_alidadeSmooth" || v.get('id') == "right_2gis" || v.get('id') == "right_geology") {
						v.setVisible(false);
					}
				}
			});
		}
	},
	// 거리, 면적측정
	MEASURE: {		
		sketch: null,
		draw: null,
		helpTooltipElement: null,
	    helpTooltip: null,
	    measureTooltipElement: null,
	    measureTooltip: null,
		pointerMoveHandler: function(evt) {
			if (evt.dragging) {
				return;
			}
			/** @type {string} */
			var helpMsg = 'Click to start drawing';

			if (this.sketch) {
				var geom = this.sketch.getGeometry();
				if (geom instanceof ol.geom.Polygon) {
					helpMsg = 'Click to continue drawing the polygon';
				} else if (geom instanceof ol.geom.LineString) {
					helpMsg = 'Click to continue drawing the line';
				}
			}

			if (this.helpTooltipElement) {
	            this.helpTooltipElement.innerHTML = helpMsg;
	            this.helpTooltip.setPosition(evt.coordinate);
	            this.helpTooltipElement.classList.remove('hidden');
	        }
		},
		addInteraction: function(typeval) {
			var type = typeval;
			this.draw = new ol.interaction.Draw({
				source: vectorSource,
				type: type,
				style: new ol.style.Style({
					fill: new ol.style.Fill({
						color: 'rgba(255, 255, 255, 0.2)',
					}),
					stroke: new ol.style.Stroke({
						color: 'rgba(0, 0, 0, 0.5)',
						lineDash: [10, 10],
						width: 2,
					}),
					image: new ol.style.Circle({
						radius: 5,
						stroke: new ol.style.Stroke({
							color: 'rgba(0, 0, 0, 0.7)',
						}),
						fill: new ol.style.Fill({
							color: 'rgba(255, 255, 255, 0.2)',
						}),
					}),
				}),
			});
			
			map.addInteraction(this.draw);
			
			this.createMeasureTooltip();
	        this.createHelpTooltip();
			
	        var listener;
	        this.draw.on('drawstart', function(evt) {
	            this.sketch = evt.feature;
	            var tooltipCoord = evt.coordinate;
	            listener = this.sketch.getGeometry().on('change', function(evt) {
	                var geom = evt.target;
	                var output;
	                if (geom instanceof ol.geom.Polygon) {
	                    var area = ol.sphere.getArea(geom);
	                    if (area > 10000) {
	                        output = Math.round((area / 1000000) * 100) / 100 + ' km<sup>2</sup>';
	                    } else {
	                        output = Math.round(area * 100) / 100 + ' m<sup>2</sup>';
	                    }
	                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
	                } else if (geom instanceof ol.geom.LineString) {
	                    var length = ol.sphere.getLength(geom);
	                    if (length > 100) {
	                        output = Math.round((length / 1000) * 100) / 100 + ' km';
	                    } else {
	                        output = Math.round(length * 100) / 100 + ' m';
	                    }
	                    tooltipCoord = geom.getLastCoordinate();
	                }
	                this.measureTooltipElement.innerHTML = output;
	                this.measureTooltip.setPosition(tooltipCoord);
	            }.bind(this));
	        }.bind(this));

	        this.draw.on('drawend', function() {
	            this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
	            this.measureTooltip.setOffset([0, -7]);
	            this.sketch = null;
	            this.measureTooltipElement = null;
	            this.createMeasureTooltip();
	            ol.Observable.unByKey(listener);
	        }.bind(this));
	    },
	    createHelpTooltip: function() {
	        if (this.helpTooltipElement) {
	            this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
	        }
	        this.helpTooltipElement = document.createElement('div');
	        this.helpTooltipElement.className = 'ol-tooltip hidden';
	        this.helpTooltip = new ol.Overlay({
	            element: this.helpTooltipElement,
	            offset: [15, 0],
	            positioning: 'center-left',
	            id: "HelpTooltip"
	        });
	        map.addOverlay(this.helpTooltip);
	    },
	    createMeasureTooltip: function() {
	        if (this.measureTooltipElement) {
	            this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
	        }
	        this.measureTooltipElement = document.createElement('div');
	        this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
	        this.measureTooltip = new ol.Overlay({
	            element: this.measureTooltipElement,
	            offset: [0, -15],
	            positioning: 'bottom-center',
	            stopEvent: false,
	            insertFirst: false,
	            id: "MeasureTooltip"
	        });
	        map.addOverlay(this.measureTooltip);
	    },
	    drawlayerance: function(chk) {
	        map.removeInteraction(this.draw);
	        if (chk) {
	            this.addInteraction("LineString");
	        }
	    },
	    drawArea: function(chk) {
	        map.removeInteraction(this.draw);
	        if (chk) {
	            this.addInteraction("Polygon");
	        }
	    },
	    removeMouseOverlay: function() {
	    	map.removeInteraction(this.draw);
	        map.getOverlays().getArray().slice(0).forEach(function(overlay) {
	            if (overlay.getId() === "HelpTooltip") {
	                map.removeOverlay(overlay);
	            }
	        });
	    },
	    removeOverlay: function() {
	        map.getOverlays().getArray().slice(0).forEach(function(overlay) {
	            if (overlay.getId() === "MeasureTooltip" || overlay.getId() === "HelpTooltip") {
	                map.removeOverlay(overlay);
	            }
	        });
	    },
	    clear: function() {
	        map.removeInteraction(this.draw);
	        this.removeOverlay();
	        if (vectorSource != null) {
	            vectorSource.clear();
	        }
	    }
	},
}

