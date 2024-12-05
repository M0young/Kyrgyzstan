/**
 * Subject : 레이어
 * Author : egis
 * Date : 2024. 3. 15.
 * COMMENT : 레이어 js파일
 */

var LAYER = {
    cachedData: null,

    init: function() {
        LAYER.getExistDataColumnList();
    },
    //속성정보가 존재하는 카테고리목록 조회
    getExistDataColumnList: function() {
        $.ajax({
            url: './layer/selectExistColumn.do',
            method: 'GET',
            data: { action: 'nonnull-columns' },
            success: function(res) {
                LAYER.cachedData = res;
                
                $('.layertr-tit.LastDepth input[type="checkbox"]').each(function() {
                    var checkboxValue = $(this).val();
                    var parentDiv = $(this).closest('.layertr-tit');
                    
                    if (res.includes(checkboxValue)) {
                        parentDiv.css('display', 'flex');
                    } else {
                        parentDiv.css('display', 'none');
                    }
                });
            }
        });
    },
    //체크된 카테고리 목록 저장
    updateCachedData: function() {
        var selectedValues = $('.layertr-tit input[type="checkbox"]:checked').map(function() {
            return $(this).val();
        }).get();
        
        LAYER.cachedData = selectedValues;

        LAYER.loadLayers();
    },
    //체크된 카테고리 목록 가시화
    loadLayers: function() {
        var existingLayerIds = map.getLayers().getArray()
            .filter(layer => layer.get('id') && layer.get('id').startsWith('krgz_'))
            .map(layer => layer.get('id'));

        var requiredLayerIds = LAYER.cachedData.map(item => 'krgz_' + item);

        existingLayerIds.forEach(function(layerId) {
            if (!requiredLayerIds.includes(layerId)) {
                var layerToRemove = map.getLayers().getArray().find(layer => layer.get('id') === layerId);
                if (layerToRemove) {
                    map.removeLayer(layerToRemove);
                }
            }
        });

        LAYER.cachedData.forEach(function(item) {
            var layerId = 'krgz_' + item;

            var existingLayer = map.getLayers().getArray().find(layer => layer.get('id') === layerId);

            if (!existingLayer) {
                var cqlFilter = item + " IS NOT NULL";

                var newLayer = new ol.layer.Tile({
                    id: layerId,
                    source: new ol.source.TileWMS({
                        url: geoserverUrl + '/wms',
                        params: {
                            'FORMAT': 'image/png',
                            'VERSION': '1.1.1',
//                            'STYLES': 'krgz:krgz_' + item,
                            'LAYERS': 'krgz:issyk_ata',
                            'CQL_FILTER': cqlFilter
                        }
                    })
                });

                map.addLayer(newLayer);
                LAYER.getLayerInfo(layerId);
            }
        });
    },
    //레이어 정보 조회
    getLayerInfo: function(layerId) {
        map.on('click', function(evt) {
            $("#mapPopup").removeClass("active");
            $('.land-inform-detail').removeClass('active');
            var coordinate = evt.coordinate;
            mapPopup.setPosition(coordinate);

            var layer = map.getLayers().getArray().find(layer => layer.get('id') == layerId);

            if (layer && layer.getVisible()) {
                var view = map.getView();
                var viewResolution = view.getResolution();
                var source = layer.getSource();

                if (source) {
                    var url = source.getFeatureInfoUrl(
                        coordinate, viewResolution, view.getProjection(), {
                            'INFO_FORMAT': 'application/json',
                            'FEATURE_COUNT': 1
                        }
                    );

                    if (url) {
                        fetch(url)
                            .then(function(response) {
                                return response.text();
                            })
                            .then(function(json) {
                                var data = JSON.parse(json);
                                if (data.features.length > 0) {
                                    var features = data.features[0];
                                    var properties = features.properties;

                                    $("#mapPopup").addClass("active");

                                    var content = $("#mapInfo")[0];
                                    $("#mapInfo").empty();

                                    var html = 
                                        '<li>' +
                                            '<p>행정구역</p>' +
                                            '<div>'+properties.coate_aa+'</div>' +
                                        '</li>' +
                                        '<li>' +
                                            '<p>구분</p>' +
                                            '<div>'+properties.coate_raio+'</div>' +
                                        '</li>' +
                                        '<li>' +
                                            '<p>면적<small>㎡</small></p>' +
                                            '<div>'+properties.shape_area+'</div>' +
                                        '</li>' +
                                        '<li>' +
                                            '<p>비율<small>(%)</small></p>' +
                                            '<div>'+ +'</div>' +
                                        '</li>' +
                                        '<li>' +
                                            '<p>비고</p>' +
                                            '<div>'+ +'</div>' +
                                        '</li>';

                                    content.innerHTML = html;
                                }
                          });
                    }
                }
            }
        });
    },
};


//상위 체크박스 상태 변경 시 상위 체크박스 상태 업데이트
$('.layertr-tit:not(.LastDepth) input[type="checkbox"]').on('change', function() {
    var isChecked = $(this).is(':checked');
    var parentDiv = $(this).closest('.layertr-tit:not(.LastDepth)');
    var siblingCheckboxes = parentDiv.nextUntil('.layertr-tit').find('input[type="checkbox"]').filter(function() {
        return $(this).closest('.layertr-tit').css('display') === 'flex';
    });

    siblingCheckboxes.prop('checked', isChecked);
    
    LAYER.updateCachedData();
});

// 하위 체크박스 상태 변경 시 상위 체크박스 상태 업데이트
$('.layertr-det .layertr-tit.LastDepth input[type="checkbox"]').on('change', function() {
    var parentDiv = $(this).closest('.layertr-det');
    var topLevelCheckbox = parentDiv.prev('.layertr-tit').find('input[type="checkbox"]');
    var childCheckboxes = parentDiv.find('input[type="checkbox"]').filter(function() {
        return $(this).closest('.layertr-tit').css('display') === 'flex';
    });
    
    var allChecked = childCheckboxes.length === childCheckboxes.filter(':checked').length;
    var anyChecked = childCheckboxes.filter(':checked').length > 0;
    
    if (allChecked) {
        topLevelCheckbox.prop('checked', true);
        topLevelCheckbox.prop('indeterminate', false);
    } else if (anyChecked) {
        topLevelCheckbox.prop('indeterminate', true);
        topLevelCheckbox.prop('checked', false);
    } else {
        topLevelCheckbox.prop('checked', false);
        topLevelCheckbox.prop('indeterminate', false);
    }
    
    LAYER.updateCachedData();
});

//토지정보팝업 닫기
$(document).on('click', '.land-inform>.Popclose-Btn', function() {
    $('.land-inform').removeClass('active');
});
//토지상세정보팝업 열기
$(document).on('click', '.land-inform .btn-Box .LearnMore-Btn', function() {
	$('.land-inform').removeClass('active');
    $('.land-inform-detail').addClass('active');
});
//토지상세정보팝업 닫기
$(document).on('click', '.land-inform-detail>.Popclose-Btn', function() {
    $('.land-inform-detail').removeClass('active');
});