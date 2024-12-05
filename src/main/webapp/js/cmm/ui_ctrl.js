// 최상단 오른쪽 아이콘 메뉴 효과 & 창 연결
/*$('.icon-nav div').click(function () {

    $(this).toggleClass('active').siblings().removeClass('active');
	$('section.iconNav-content-area').children('div').css('display','none');
    
    if($(this).hasClass('active')) {
    	// 커튼뷰
        if(this.className.includes("spl-scr")) {       	
			$("#cmmDiSide").show();
			if(!MAP.SIDE.openFlag){
				MAP.SIDE.sdsOpen();
			}
		// 배경지도
		} else if(this.className.includes("bsmp")) {
			$("#cmmDiBasemap").show();
	    } else if(this.className.includes("siin")) {
			$("#cmmDiUsr").show();
		}
    } else {
    	// 커튼뷰
		if(this.className.includes("spl-scr")) {
			if(MAP.SIDE.openFlag){
				MAP.SIDE.sds.remove();
				MAP.SIDE.openFlag = false;
				$("#cmmDiSide").hide();
			}
		// 배경지도
		} else if(this.className.includes("bsmp")) {
			$("#cmmDiBasemap").hide();
		} else if(this.className.includes("siin")) {
			$("#cmmDiUsr").hide();
		}
    }
});*/

// 커튼뷰 > 배경지도 설정
$('.lnb-curtain input:radio[name="sidebyside"]').change(function(e){
	MAP.SIDE.setBasemap(this.value);
});

// 배경지도 설정
$('.lnb-basemap input:radio[name="BaseMapsett"]').change(function(e){
	MAP.setBasemap(this.value);
});

// 우측 아이콘 이벤트
$('.mapTool li').click(function() {	
	let navId = this.dataset.id;
	if(navId == null){
		return;
	}
	
	if(navId.includes("nav1") || navId.includes("nav2") || navId.includes("nav3")) {
		MAP.MEASURE.clear();	// 측정 초기화
	}
	
	// 초기 위치로 이동
	if(navId.includes("nav1")) {
		MAP.moveDefaultLocation();
	// 현재 위치로 이동
	} else if(navId.includes("nav2")) {
		MAP.moveMyLocation();
	// 초기화
	} else if(navId.includes("nav3")) {
		$(this).siblings().removeClass('active');
		MAP.MEASURE.clear();
    // 거리 측정
	} else if(navId.includes("nav4")) {
		$(this).toggleClass('active').siblings().removeClass('active');
		
		if($(this).hasClass("active")){
			MAP.MEASURE.drawlayerance(true);
		} else {
			MAP.MEASURE.removeMouseOverlay();
		}
	// 면적 측정
	} else if(navId.includes("nav5")) {
		$(this).toggleClass('active').siblings().removeClass('active');
		
		if($(this).hasClass("active")){
			MAP.MEASURE.drawArea(true);
		} else {
			MAP.MEASURE.removeMouseOverlay();
		}
	}
});

//대시보드
$('.gnb-btn4').click(function() {
	window.open('./dashboard.do', '_blank');
});
