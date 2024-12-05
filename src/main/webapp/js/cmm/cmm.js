/**
 * Subject : 공통
 * Author : egis
 * Date : 2024. 3. 15.
 * COMMENT : 공통기능 js파일
 */

var CMM = {
	// 팝업
	alert: function(str,type,func){
		document.activeElement.blur();
		// 팝업 유형 설정
		switch(type){
	      case "warning":
	    	  $('.warn-art').addClass('on');
	    	  $('.warn-art > div > small').text(str);
	    	  break;
	      case "delete":
	    	  $('.delete-art').addClass('on');
	    	  $('.delete-art > div > small').text(str);
	      break;
	      case "confirm":
	    	  $('.confirm-art').addClass('on');
	    	  $('.confirm-art > div > small').text(str);
	      break;
	      case "caution":
	    	  $('.caution-art').addClass('on');
	    	  $('.caution-art > div > small').text(str);
	      break;
	      case "info":
	    	  $('.inform-art').addClass('on');
	    	  $('.inform-art > div > small').text(str);
	      break;
	      default:
	      break;
		}				
		// 콜백함수 실행	  	  
		$('.popup-alert > div > .confirm-Btn').unbind();
		if(func) {
			$('.popup-alert > div >  .confirm-Btn').click(function(){
				func();
			});
		}
		// 팝업 종료
		$('.popup-alert > div > button, .popup-alert .close-bk').click(function(){
			$(this).parents('.popup-alert').removeClass('on');
		});
	},
	// sweetAlert
	sweetAlert: {
	    warning: function(message, callback) {
	        Swal.fire({
	            title: 'Warning',
	            html: message,
	            icon: 'warning',
	            showCancelButton: true,
	            confirmButtonColor: '#3085d6',
	            cancelButtonColor: '#6c757d',
	            confirmButtonText: 'Proceed',
	            cancelButtonText: 'Cancel'
	        }).then((result) => {
	            if (callback) callback(result.isConfirmed);
	        });
	    },

	    error: function(message) {
	    	return Swal.fire({
	            title: 'Error',
	            text: message,
	            icon: 'error',
	            confirmButtonColor: '#6c757d'
	        });
	    },

	    info: function(message) {
	        Swal.fire({
	            title: 'Information',
	            text: message,
	            icon: 'info',
	            confirmButtonColor: '#3085d6'
	        });
	    },

	    loading: function(message = 'Please wait...') {
	        Swal.fire({
	            title: message,
	            allowOutsideClick: false,
	            didOpen: () => {
	                Swal.showLoading();
	            }
	        });
	    },

	    close: function() {
	        Swal.close();
	    }
	},
	// 전체화면 로딩바
	blockUIdiv: function(id,txt){
		
		$("#"+id).block({
		      message: "<div class=\"sk-wave sk-primary mx-auto\"><div class=\"sk-wave-rect\"></div><div class=\"sk-wave-rect\"></div><div class=\"sk-wave-rect\"></div><div class=\"sk-wave-rect\"></div><div class=\"sk-wave-rect\"></div></div><span class=\"text-white ts-11 mt-2 pt-2\" id=\"prgTextInfo\">"+txt+"</span>",
		      css: {
		        backgroundColor: 'transparent',
		        border: '0'
		      },
		      overlayCSS:  {
		        backgroundColor: "#22252B",
		        opacity: 0.8
		      }
		 });
	},
	// 전체화면 로딩바 제거
	unblockUIdiv: function(id){
		$("#"+id).unblock();
	},
	// 로딩바 on/off
	loadingBar: function(_selector, flag, _text) {
    	// 로딩바
    	var loading = $('.loading', _selector);
    	// 로딩바 문구
    	var loadingTxt = loading.find('span');
    	
    	// 로딩바 문구 별도 설정 시
    	if(_text) {
        	loadingTxt.text(_text);
    	} else {
    		loadingTxt.text("Loading");
    	}
		
    	if(flag && !loading.hasClass('active')){
    		loading.addClass('active');
    	} else if (!flag && loading.hasClass('active')) {
            loading.removeClass('active');
    	}
	},
	// 공백체크
	isEmpty: function(value){
		if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
			return true; 
		}else{
			return false; 
		}	
	},
	// 페이징
	paging: function(pageInfo, pageId, func){
		$('#'+pageId).empty();
		var html='';
		
		if(pageInfo.totalRecordCount != 0){
			if(pageInfo.totalPageCount >= 0){
				html += '<button type="button" class="icon sz20px" onclick="javascript:'+func+'(1)"><i class="glb-ico sz20px icobg20 pagent"></i></button>';
				if(pageInfo.currentPageNo == 1) {
					html += '<button type="button" onclick="javascript:void(0)">Prev</button>';
				} else {
					html += '<button type="button" onclick="javascript:'+func+'('+ (pageInfo.currentPageNo-1) +')">Prev</button>';
				}
				html += '<input type="text" id="'+pageId+'_num" value="'+pageInfo.currentPageNo+'" onkeypress="if(event.keyCode == 13 && CMM.isPage(this.id, this.value,'+pageInfo.totalPageCount+'))'+func+'(this.value);" oninput="CMM.maxLengthCheck(this)" maxlength="4">'
					+ '<small>of</small>'
					+ '<input type="text" value="'+pageInfo.totalPageCount+'" readonly>'

				if(pageInfo.currentPageNo == pageInfo.totalPageCount) {
	                html += '<button type="button" onclick="javascript:void(0)">Next</button>';
	            } else {
	                html += '<button type="button" onclick="javascript:'+func+'('+ (pageInfo.currentPageNo+1) +')">Prev</button>';
	            }
	            html += '<button type="button" class="icon sz20px" onclick="javascript:'+func+'('+ (pageInfo.totalPageCount)+')"><i class="glb-ico sz20px icobg20 pagent nxt"></i></button>';
				
				$('#'+pageId).append(html);
			}
		}else{
			$('#'+pageId).empty();
		}
	},
	// 페이지 입력값 검증
	isPage: function(pageId, page, totalPage) {
		if(isNaN(page) || page < 1 || page > totalPage) {
			$('#'+pageId).val('');
			return false;
		} else {
			return true;
		}
	},
	// 숫자 입력값 길이 검증
	maxLengthCheck: function(object){
	    if (object.value.length > object.maxLength){
	        object.value = object.value.slice(0, object.maxLength);
	    }    
	}
};