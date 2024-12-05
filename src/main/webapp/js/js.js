$(document).ready(function(){

    // LNB toggleSlide
    LnbToslide('.Lnb-Menu>ol>li','.Lnb-Menu-Box'); 
    //main search popup
    mainSearchPop('.main-search','.search-pop-list','.search-pop-list .Popclose-Btn');
    mainSearchPop('.main-search','.search-Box','.search-Box .Sub-close');
    //gnb Popup
    GnbToslide('.gnbmenu-1','.Data-manage-pop','.Data-manage-pop .Popclose-Btn');
    GnbToslide('.gnbmenu-2','.Statistics-pop','.Statistics-pop>.Popclose-Btn');    
    // Inner Popup
    innerPopup('.setting-Box .add-Btn','.tableTradd','.tableTradd>.Popclose-Btn');
    innerPopup('.edit-delete-Btn','.deletePop','.deletePop>.Popclose-Btn');
    basicPop('.Statistics-pop .table-container table tr','.Statistics-Sub','.Statistics-Sub>.Popclose-Btn');
    // Sub popup
    // basicPop('.maptool-Layer','.maptool-Layer-Pop','.maptool-Layer-Pop .Popclose-Btn','.popup-Bg'); //지도맵툴 레이어팝업
    uploadPop('.Upload-Btn','.Upload-Pop','.Upload-Pop .Popclose-Btn','.popup-Bg'); //업로드파일팝업
    basicPop('.Statistics-pop .btn-wrap .LChart-Btn','.Chart-Pop','.Chart-Pop>.Popclose-Btn',''); //차트팝업
    basicPop('.Signin-Btn','.signIn-pop','.signIn-pop .sign-close','.popup-Bg'); //로그인
    basicPop('.Signup-Btn','.signUp-pop','.signUp-pop .sign-close','.popup-Bg'); //회원가입
    basicPop('.userinfo-Btn','.user-information','.user-information .sign-close','.popup-Bg');//회원정보
    basicPop('.signIn-pop .login-bt .register-i','.signUp-pop','.signUp-pop .sign-close','.popup-Bg');//로그인창에서 가입창
    basicPop('.land-inform .btn-Box .LearnMore-Btn','.land-inform-detail','.land-inform-detail>.Popclose-Btn');//상세조회
    basicPop('.admminsys-Btn','.adminSystem-pop','.adminSystem-pop>.closetxt-Btn');//사용자권한관리팝업 2024-07-22


    // 속성편집팝업
    EditPop('.AttrEdit-Btn','.Attrinfor-edit','.Data-manage-pop','.Attrinfor-edit>.Popclose-Btn');
    EditPop('.styleEdit-Btn','.style-edit','.Data-manage-pop','.style-edit>.Popclose-Btn');
    // 탭
    datamFstTab('.tab-title-Box .tab-tit>li','.tab-content-Box>div');
    datamFstTab('.tab-content-Box .tab-detail:nth-child(1)>.depth2tab-tit>li','.tab-content-Box .tab-detail:nth-child(1)>.depth2tab-content-Box>div');
    datamFstTab('.tab-content-Box .tab-detail:nth-child(2)>.depth2tab-tit>li','.tab-content-Box .tab-detail:nth-child(2)>.depth2tab-content-Box>div');
    datamFstTab('.tab-content-Box .tab-detail:nth-child(3)>.depth2tab-tit>li','.tab-content-Box .tab-detail:nth-child(3)>.depth2tab-content-Box>div');
    datamFstTab('.Statistics-pop .popup-wrap .tab-container .tab-tit>li','.Statistics-pop .popup-wrap .tab-container .tab-detail-Box>div');//gnb statistics tab
    datamFstTab('.style-edit .popup-wrap .tab-container>ol.tab-tit>li','.style-edit .popup-wrap .tab-container .tab-detail-Box>div');// 스타일편집
    datamFstTab('.Upload-Pop .tab-tit>li','.tab-container>div'); //File Upload Popup
    datamFstTab('.land-inform-detail .tab-container .tab-tit>li','.land-inform-detail .tab-content-Box>div');
    datamFstTab('.adminSystem-pop .popup-wrap>.tab-container>.tab-tit>li','.adminSystem-pop .popup-wrap>.tab-container>.tab-content-Box>div'); //사용자관리권한관리탭
    datamFstTab('.table-detail-inform .content-wrap .tab-container>.tab-tit>li','.table-detail-inform .content-wrap .tab-container>.tab-content-Box>div'); //사용자관리이너탭

    // 슬라이드 토글
    slideTog('.layertr-tit .lytr-edit-Btn','.layertr-tit .lytr-editPop');
    //단순토글
    JustToggle('.symbolBox>ol>li');
    JustToggle('.Map-edit .popup-wrap ul>.mapEdit-tool');
    JustToggle('.favorite-btn');
    //너비조절 - 접기
    shrkWidth('.Attrinfor-edit>.width-Btn','.Attrinfor-edit','wdth');    

    // ---------------------임시
    // 업로드 내 임시 delete All
    DeleteHtml('.Upload-Pop .btn-wrap .btn-Box>div .dlt-AllBtn','.Upload-Pop .upload-List','.uploadBefore');
    // 업로드 내 임시 delete
    DeleteContent('.Upload-Pop .upload-inform .readOnly-inform>ol>li .delete-btn','.Upload-Pop .upload-inform .readOnly-inform>ol>li');


    //임시 차트
    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Graph visible (bar, circle)'
        },
        subtitle: {
            text: 'Source: <a href="https://stat.gov.kg/ru/statistics/informacionno-kommunikacionnye-tehnologii/" target="_blank">Kyrgyz National Statistics Committee website</a>'
        },
        xAxis: {
            type: 'category',
            labels: {
                autoRotation: [-45, -90],
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Province land use status'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'land use status of 2023: <b>{point.y:.1f} tons</b>'
        },
        series: [{
            name: 'Population',
            colors: [
                '#9b20d9', '#9215ac', '#861ec9', '#7a17e6', '#7010f9', '#691af3',
                '#6225ed', '#5b30e7', '#533be1', '#4c46db', '#4551d5', '#3e5ccf',
                '#3667c9', '#2f72c3', '#277dbd', '#1f88b7', '#1693b1', '#0a9eaa',
                '#03c69b',  '#00f194'
            ],
            colorByPoint: true,
            groupPadding: 0,
            data: [
                ['Бишке́к', 37.33],
                ['Баткенская область', 31.18],
                ['Чуйская область', 27.79],
                ['Джалал-Абадская область', 22.23],
                ['Нарын область', 21.91],
                ['Ошская область', 21.74],
                ['Таласская область', 21.32],
                ['Иссык-Кульская область', 20.89],
                ['Ош', 20.67],
                ['Бишке́к', 19.11],
                ['Баткенская область', 16.45],
                ['Чуйская область', 16.38],
                ['Джалал-Абадская область', 15.41],
                ['Нарын область', 15.25],
                ['Ошская область', 14.974],
                ['Таласская область', 14.970],
                ['Иссык-Кульская область', 14.86],
                ['Ош', 14.16],
                ['Бишке́к', 13.79],
                ['Баткенская область', 13.64]
            ],
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                inside: true,
                verticalAlign: 'top',
                format: '{point.y:.1f}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    });
});
// main Search
function mainSearchPop(searchWord,searchResult,SearchClose){
        $(searchWord).on('keyup', function (event) {
            if (event.key === 'Enter') {
                $(searchResult).addClass('active').siblings('.gnb-pop').removeClass('active');
                $('.popup').removeClass('active');
            }
        });
        $(SearchClose).on('click', function(){
            $(this).parents(searchResult).removeClass('active');
        });
}
// shrink/Fold
function shrkWidth(shrkBtn,shrkPop,shrkCommd){
    $(shrkBtn).on('click', function(){
        $(this).toggleClass('active');
        $(shrkPop).toggleClass(shrkCommd);
    });
}
//simple toggle
function JustToggle(TogBtn){
    $(TogBtn).on('click', function(){
        $(this).toggleClass('active').siblings().removeClass('active');
    });
}
function slideTog(slideTogTit,slideTogPop){    
    //slide edit popup
    $(slideTogTit).on('click' , function(e){
        var SlidePop = $(this).next('ol');
        $(this).addClass('active');
        $(slideTogTit).not(this).removeClass('active');
        $(this).next(slideTogPop).slideToggle();
        $(slideTogPop).not(SlidePop).slideUp();        
        e.stopPropagation();
    });

    $('.layertr-tit:not(.LastDepth)').on('click', function(){
        $(this).toggleClass('active');
        $(this).next('.layertr-det').slideToggle('active');

    });

    $('.LastDepth').on('click', function(){        
        $(this).toggleClass('active');   
        $(this).children('strong').toggleClass('active');
        if($(this).hasClass('active')){
            $(this).children("input[type='checkbox']").prop( "checked", true );
            // $(this).find("input[type='checkbox']").prop( "checked", true );
        } else {
            $(this).children("input[type='checkbox']").prop( "checked", false );
            $(this).children('strong').removeClass('active');
            // $(this).find("input[type='checkbox']").prop( "checked", false );
        }
    });   
    
    // 모두 열고 닫기
    /*var allClosed = true;
    $('.layertr-det').each(function() {
      if ($(this).is(':visible')) {
        allClosed = false;
        return false; // 하나라도 열려있으면 반복문 종료
      }
    });

    // 모든 .layertr-det 요소의 상태에 따라 toggle
    if (allClosed) {
      $('.layertr-det').slideDown();
    } else {
      $('.layertr-det').slideUp();
    }*/
}
// edit popop
function EditPop(editBtn,editPop,shortpop,editClose){
        // 속성편집 팝업
        $(editBtn).on('click', function(e){
            $(editPop).addClass('active').siblings('.popup.editpop').removeClass('active');
            $(shortpop).addClass('short');
            e.stopPropagation();
        });
        $(editClose).on('click', function(){
            $(editPop).removeClass('active');
            $(shortpop).removeClass('short');            
        });
}
//팝업 내 토글 팝업
function innerPopup(inpopBtn,inPop,inpopClose){
    $(inpopBtn).on('click', function(){
        $(inPop).toggleClass('active').siblings('.innerPop').removeClass('active');
    });
    $(inpopClose).on('click', function(){
        $(this).parents(inPop).removeClass('active');
    });
}
// upload 임시 Alldelete btn
function DeleteHtml(dltBtn,dltContent,showContent){
    $(dltBtn).on('click', function(){
        $(dltContent).remove();
        $(showContent).removeClass('hide');
    });
}
// 개별리스트 삭제
function DeleteContent(DelBtn,DelCon){
    var indx = $(DelCon).index();

    $(DelBtn).on('click', function(){
        $(this).eq(indx).parents(DelCon).remove();
    });
}
// LNB
function LnbToslide(LnbBtn, LnbPop) {    
    $(LnbBtn).not(':lt(2)').on('click', function(event) {
        var $currentPop = $(this).children(LnbPop);
        
        if ($(event.target).closest(LnbPop).length > 0) {
            event.stopPropagation();
            return;
        }

        $(this).toggleClass('active').siblings().removeClass('active');
        $(this).children(LnbPop).slideDown();
        $(LnbPop).not($currentPop).slideUp();
        
        if ($(this).hasClass('active')) {
            $currentPop.slideDown();
            if(this.className.includes("lnb-curtain")) {
    			if(!MAP.SIDE.openFlag){
    				MAP.SIDE.sdsOpen();
    			}
    		 }
        } else {
            $currentPop.slideUp();
            if(this.className.includes("lnb-curtain")) {
    			if(MAP.SIDE.openFlag){
    				MAP.SIDE.sds.remove();
    				MAP.SIDE.openFlag = false;
    			}
    		 }
        }
    });
    $('.lnb-pmapview').click(function() {
    	window.print();
    });

    $('.lnb-mapimg').click(function() {
    	html2canvas(document.body).then(function(canvas) {
            var link = document.createElement('a');
            link.download = 'screenshot.png';
            link.href = canvas.toDataURL();
            link.click();
        }).catch(function(error) {
            console.error('Error capturing screenshot:', error);
        });
    });
}
// GNB
function GnbToslide(gnbBtn,gnbPop,gnbCloseBtn){
    $(gnbBtn).on('click', function(){
        $(this).toggleClass('active').siblings().removeClass('active');
        $(gnbPop).toggleClass('active');
        $('.gnb-pop').not(gnbPop).removeClass('active');
        $(gnbPop).children('.innerPop').removeClass('active');
        $('.subPop').removeClass('active');
        $('.editpop').removeClass('active');
        $('.editpop').removeClass('wdth');
        $('.gnb-pop').removeClass('short');
    });
    $(gnbCloseBtn).on('click', function(){
        $(gnbBtn).removeClass('active');
        $(gnbPop).removeClass('active');
        $('.subPop').removeClass('active');
        $('.gnb-pop').removeClass('short');
        $('.editpop').removeClass('wdth');
    });
}
// basic popup
function basicPop(BpopBtn,Bpop,BpopClose,BpopBg){

    $(BpopBtn).on('click', function(){
        $(this).toggleClass('active');
        $(Bpop).toggleClass('active').siblings('.sign-box').removeClass('active');
        $(BpopBg).addClass('active');
        if($('.signIn-pop').hasClass('active')) {
        	USR.clearSignIn();
        }
        if($('.signUp-pop').hasClass('active')) {
        	USR.clearSignUp();
        }
    });
    $(BpopClose).on('click', function(){
        $(BpopBtn).removeClass('active');
        $(Bpop).removeClass('active');
        $(BpopBg).removeClass('active');
    });  

}
function uploadPop(uploadBtn, popup, closeBtn, popupBg) {
    // 기본 팝업 기능 설정
    basicPop(uploadBtn, popup, closeBtn, popupBg);
    
    // Shape 업로드 추가 기능
    $(uploadBtn).on('click', function(){
        const currentStep = document.querySelector('.step-container.active');
        const stepId = currentStep ? currentStep.id : '';
        
        if (stepId !== 'popupDiProgress' && stepId !== 'popupDiComplete') {
            UPLOAD.uiManager.resetUpload();
            UPLOAD.uiManager.resetSettingsForm();
            UPLOAD.uiManager.showStep('popupDiUpload');
        }
    });
}
// data-management 1depth tab
function datamFstTab(datatabTit,datatabDetail){
    var uploadIdx = $('.upload-Pop .tab-tit>li').index();
    var uploadTab = $('.upload-Pop .tab-container>div').eq(uploadIdx).toggleClass('active');
    var uploadTabPrvBTN = $('.upload-Pop .btn-wrap>.nav-Btn');
    var uploadTabBTN = $('.Upload-Pop .btn-wrap .btn-Box>div');

    $(datatabTit).eq(0).addClass('active');
    $(datatabDetail).eq(0).addClass('active');
    $(uploadTabBTN).eq(0).addClass('active');

    $(datatabTit).on('click', function(){
        var idx = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        $(datatabDetail).eq(idx).addClass('active').siblings().removeClass('active');
        $(uploadTabBTN).eq(idx).addClass('active').siblings().removeClass('active');
    });
}



