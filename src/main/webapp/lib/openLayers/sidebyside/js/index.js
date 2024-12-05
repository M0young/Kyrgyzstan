import Map from '../../v7.1.0-package/Map.js';
import TileLayer from '../../v7.1.0-package/Tile.js'
import OSM from '../../v7.1.0-package/source/OSM.js';
import XYZ from '../../v7.1.0-package/source/XYZ.js'
import View from '../../v7.1.0-package/View.js';
import SDSControl from '../index.js';

//import '../../v7.1.0-package/ol.css';




MAP.SIDE.sds = new SDSControl();

/*map = new ol.Map({
    layers: [osmStandardLayer, googleRoadLayer, googleSatelliteLayer, googleHybridLayer
		//거리, 면적
		//, vector
    	, side_osmStandardLayer
		, side_googleRoadLayer
		, side_googleHybridLayer
		, side_googleSatelliteLayer
    ],
    target: 'map',
	view: new ol.View({
		center: ol.proj.fromLonLat([107.605137, -6.867844]),
		//projection: 'EPSG:4326',
		zoom: 10,
		//maxZoom: 18,
		constrainOnlyCenter: true,
	}),
	controls: new ol.control.defaults.defaults(
			{
				zoom: false
			}
		).extend([
			MAP.SIDE.sds
			//new ol.control.ScaleLine({units: 'degrees',}),			   
			//overviewMap
			//,mousePositionCtrl
		])
		    
    //controls:[
    //    sds,
    //]
    
});*/

//sds.open();
//sds.setLeftLayer(layer2);
//sds.setRightLayer(layer1);
//sds.setLeftLayer(osmStandardLayer);
//sds.setRightLayer(googleRoadLayer);

//googleRoadLayer.setVisible(true);

//sds.remove();

/*var popup = new ol.Overlay({
	element: document.getElementById('map-popup'),
	id: "popup"
});
map.addOverlay(popup);

//console.log(data);
const element = popup.getElement();
let popover = "";

//클릭
map.on('singleclick', (e) => {
});

var selectpopup = new ol.Overlay({
	element: document.getElementById('select-map-popup'),
	id: "selectpopup"
});
map.addOverlay(selectpopup);

const selectelement = selectpopup.getElement();

let selectpopover = "";

var select = null;


function selectStyle(feature, resolution) {
	
	var style = new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'rgba(0, 0, 0, 1.0)',
			width: 4
		}),
		fill: new ol.style.Fill({
			color: 'rgba(128,128,128,0.7)'
		}),
		text: new ol.style.Text({
			font: '12px Verdana',
			scale: 1,
			text: getparcelLabelText(feature),
			fill: new ol.style.Fill({ color: 'red' }),
			stroke: new ol.style.Stroke({ color: 'yellow', width: 3 }),
			overflow: true
		})	  
	});
	return style;
}

// 단순 클릭 이벤트
var selectSingleClick = new ol.interaction.Select();

// 클릭 이벤트 속성 부여
var selectClick = new ol.interaction.Select({
	conditioin: ol.events.condition.click,
	multi: true,
	style : selectStyle
});

//var selectElement = document.getElementById('type');

select = selectClick;

map.addInteraction(select);

select.on('select', function(e) {
});

map.on('loadstart', function () {
	map.getTargetElement().classList.add('spinner');
});
map.on('loadend', function () {
	map.getTargetElement().classList.remove('spinner');
});

function onMoveEnd(evt) {

}

map.on('moveend', onMoveEnd);

function onMoveStart(evt){
	
}

map.on('movestart', onMoveStart);

map.on('pointermove', (e) => map.getViewport().style.cursor = map.hasFeatureAtPixel(e.pixel) ? 'pointer' : '');*/