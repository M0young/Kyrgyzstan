/**
 * Subject : 검색
 * Author : egis
 * Date : 2024. 3. 15.
 * COMMENT : 검색기능 js파일
 */

var SEARCH = {
	markerVectorSource: null,
	init: function() {
	},
	// 행정구역 검색결과 목록
	admdstList: function(pageIndex){
		// 마커 삭제
		if(this.markerVectorSource != null) {
			this.markerVectorSource.clear();
		}
		
		var search = $("#cmmIpSearch").val();
	
//		if(search.length < 2) {
//			// 2글자 이상 입력해주세요.
//			CMM.alert('Please enter at least 2 letters.', 'warning');
//			return;
//		}

		// 행정구역 목록 검색
		$.ajax({
			url: "./search/selectProvinceList.do",
			type : "POST",
			data:{"pageIndex": pageIndex,
				  "search": search
				 },
			success: function(res) {
				
				var data = JSON.parse(res);
				var cnt = data.count;
    			var resultList = $(".search-result-body");
    			
    			resultList.empty();
				
				$("#admdstCnt").val(cnt);
				$(".search-pop-list-result-box").text(cnt);
				
				var html = "";
				var pageInfo = data.paginationInfo;
				
				CMM.paging(pageInfo, 'searchDiAdmdstPage', 'SEARCH.admdstList');
				
				if(cnt > 0){					
					$.each(data.list, function(k,v) {
						if(v.item3 == null) {
							html += '<tr>'
								+ '<td class="txt-center">'+v.rownum+'</td>'
								+ '<td class="txt-center"><img src="./Images/detail-location-ico.svg" alt="location" onclick="SEARCH.move('+v.xpos+', '+v.ypos+', '+ "'" +v.item2+ "'" +')"></td>'
								+ '<td>'+v.item1+' > '+v.item2+'</td>';
						} else {
							html += '<tr>'
								+ '<td class="txt-center">'+v.rownum+'</td>'
								+ '<td class="txt-center"><img src="./Images/detail-location-ico.svg" alt="location" onclick="SEARCH.move('+v.xpos+', '+v.ypos+', '+ "'" +v.item3+ "'" +')"></i></td>'
								+ '<td>'+v.item1+' &gt; '+v.item2+' &gt; '+v.item3+'</td>';
						}
					});
					
				  	resultList.append(html);
				} else {
					html += '<tr>'
						+ '<td colspan="3" class="txt-center">There is no result</td>';
					
					resultList.append(html);
				}
			}
		});
	},
	calculateCentroidX:function(geometry) {
        const rings = geometry[0];
        let xSum = 0;
        rings.forEach(coordinate => {
            xSum += coordinate[0];
        });
        const xCentroid = xSum / rings.length;
        return xCentroid;
    },
    calculateCentroidY:function(geometry) {
        const rings = geometry[0];
        let ySum = 0;
        rings.forEach(coordinate => {
            ySum += coordinate[1];
        });
        const yCentroid = ySum / rings.length;
        return yCentroid;
    },
	// 위치 이동
	move: function(xpos, ypos, val) {
		map.getView().animate({
            center: ol.proj.fromLonLat([xpos, ypos]),
            zoom: 10,
            duration: 1000
        });
		this.setMarker(xpos, ypos, val);
	},
	// 마커 설정
	setMarker: function(xpos, ypos, val) {
		// 마커 아이콘 스타일
		var iconStyle = new ol.style.Style({
			image: new ol.style.Icon({
				anchor: [0.5, 20],
				anchorXUnits: 'fraction',
				anchorYUnits: 'pixels',
				src: './Images/map-point-ico.png',
			})
		});
		// 마커 라벨 스타일
		var labelStyle = new ol.style.Style({
			text: new ol.style.Text({
				font: '12px Calibri,sans-serif',
				overflow: true,
				fill: new ol.style.Fill({
					color: '#000'
				}),
				stroke: new ol.style.Stroke({
					color: '#fff',
					width: 3
				}),
				offsetY: -30
			})
		});
		// 마커 스타일
		var markerStyle = [iconStyle, labelStyle];
		
		var iconFeature = new ol.Feature({
		  geometry: new ol.geom.Point(ol.proj.fromLonLat([xpos, ypos])),
		  population: 4000,
		  rainfall: 500,
		});
		
		this.markerVectorSource = new ol.source.Vector({
			features: [iconFeature]
		});	
		
		labelStyle.getText().setText(val);

		var custemStyleFunction = function(feature, resolution){
			labelStyle.getText().setText(val);
			return markerStyle;
		}	
		
		iconFeature.setStyle(custemStyleFunction);
//		this.markerVectorSource.addFeature(iconFeature);
		markerVectorLayer.setSource(this.markerVectorSource);
	},
	// 초기화
	clear: function(){
		// 마커 삭제
		if(this.markerVectorSource != null) {
			this.markerVectorSource.clear();
		}		
		// district 레이어 체크 해제
		if($(".Layerpop [name=basemap-sl]").eq(1).is(":checked")) {
			$(".Layerpop [name=basemap-sl]").eq(1).click();
		}
		// 재배지역 레이어 체크 해제
		if($(".Layerpop [name=basemap-sl]").eq(2).is(":checked")) {
			$(".Layerpop [name=basemap-sl]").eq(2).click();
		}
		// 검색창 초기화
		$("#cmmIpSearch").val("");
	}
};

// 검색창 엔터 이벤트
document.getElementById('cmmIpSearch').addEventListener("keypress", function(event) {
	if(document.activeElement === this && event.key === "Enter") {
		event.preventDefault();
        // 검색 초기실행 함수
		SEARCH.admdstList(1);
	}
});
