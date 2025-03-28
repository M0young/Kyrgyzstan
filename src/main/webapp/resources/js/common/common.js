/*========================================================
   DATE: 2024. 01
   AUTHOR: MOYOUNG
   DESC: Common Module
========================================================*/
_GL.COMMON = (function() {
	'use strict';
	
	let initialized = false;
	
/* =====================================================
    Common Main
======================================================*/
	/**
     * 네비게이션 링크 활성화 상태 업데이트
     */
    function updateNavigationState() {
        const currentPath = window.location.pathname;
        
    	document.querySelectorAll('.nav-link').forEach(function(link) {
            if (link.getAttribute('href') === currentPath || 
                currentPath.includes(link.getAttribute('href').replace('./', ''))) {
                link.classList.add('active');
            }
        });
    }
    
    /**
     * 헤더 도구 이벤트 핸들러
     */
    function handleHeaderAction(action, button) {
    	const isMapPage = window.location.pathname.includes('/map');
    	
        switch(action) {
            case 'export': handleExport(); break;
            case 'screenshot':
            	if (isMapPage) {
                    captureUtil.captureMap(handleCaptureCallback);
                } else {
                    captureUtil.captureScreen(handleCaptureCallback);
                }
                break;
            case 'print':
                if (isMapPage) {
                    captureUtil.captureMap(handlePrintCallback);
                } else {
                    captureUtil.captureScreen(handlePrintCallback);
                }
                break;
            case 'language': toggleHeaderMenu(button, 'languageMenu'); break;
            case 'contact': toggleHeaderMenu(button, 'contactMenu'); break;
            case 'user': toggleHeaderMenu(button, 'userMenu'); break;
        }
    }
    
    /**
     * 캡처 콜백 처리
     */
    function handleCaptureCallback(error, dataUrl) {
        if (error) return;
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'screenshot_' + new Date().getTime() + '.png';
        link.click();
        _GL.COMMON.showToast('Screenshot saved successfully', 'success');
    }

    /**
     * 프린트 콜백 처리
     */
    function handlePrintCallback(error, dataUrl) {
        if (error) {
            _GL.COMMON.showToast('Print failed', 'error');
            return;
        }

        const printFrame = document.createElement('iframe');
        printFrame.style.position = 'fixed';
        printFrame.style.left = '-9999px';
        document.body.appendChild(printFrame);

        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
                    body { display: flex; justify-content: center; align-items: center; }
                    .print-container { max-width: 100%; max-height: 100%; }
                    .print-image { max-width: 100%; max-height: 100%; object-fit: contain; }
                    @media print {
                        @page { margin: 1cm; }
                        html, body { height: 100%; }
                        body { min-height: 100%; }
                        .print-container { page-break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                <div class="print-container">
                    <img src="${dataUrl}" class="print-image">
                </div>
            </body>
            </html>
        `;

        const frameDoc = printFrame.contentWindow.document;
        frameDoc.open();
        frameDoc.write(printContent);
        frameDoc.close();

        printFrame.onload = function() {
            if (printFrame.contentWindow.printed) return;
            
            const printButton = document.querySelector('[data-action="print"]');
            if (printButton) {
                const tooltip = bootstrap.Tooltip.getInstance(printButton);
                if (tooltip) tooltip.hide();
            }
            
            printFrame.contentWindow.printed = true;
            printFrame.contentWindow.focus();
            printFrame.contentWindow.print();

            setTimeout(function() {
                document.body.removeChild(printFrame);
            }, 1000);
        };
    }
    
    /**
     * 헤더 도구 토글
     */
    function toggleHeaderMenu(button, menuId) {
        const dropdownMenu = document.getElementById(menuId);
        dropdownMenu.classList.toggle('show');

        // 외부 클릭 시 닫기
        if (menuId !== 'contactMenu') {
	        document.addEventListener('click', function closeToolbarMenu(e) {
	            if (!dropdownMenu.contains(e.target) && !button.contains(e.target)) {
	                dropdownMenu.classList.remove('show');
	                document.removeEventListener('click', closeToolbarMenu);
	            }
	        });
        }
    }
    
	/**
	 * 현재 선택된 언어 가져오기
	 */
	function getCurrentLanguage() {
		const cookies = document.cookie.split('; ');
		const languageCookie = cookies.find(function(row) {
			return row.startsWith('language=');
		});
		return languageCookie ? languageCookie.split('=')[1] : 'ru';
	}

	/**
	 * 언어 체크마크 업데이트
	 */
	function updateLanguageChecks(currentLang) {
		document.querySelectorAll('.lang-check').forEach(function(check) {
			if (check && check.id) {
				check.classList.toggle('d-none', check.id !== 'check-' + currentLang);
			}
		});
	}

	/**
	 * 언어 플래그 업데이트
	 */
	function updateLanguageFlag(currentLang) {
		const currentLangElement = document.querySelector('[data-lang="' + currentLang + '"] .avatar');
		const currentFlag = document.querySelector('.current-flag');
		if (currentLangElement && currentFlag) {
			const currentFlagUrl = currentLangElement.style.backgroundImage;
			if (currentFlagUrl) {
				currentFlag.style.backgroundImage = currentFlagUrl;
			}
		}
	}

	/**
	 * 언어 변경
	 */
	function changeLanguage(lang) {
		fetch('/klums/change-language', {
			method : 'POST',
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded',
				'X-CSRF-TOKEN' : _GL.csrf.token
			},
			body : 'lang=' + lang
		}).then(function(response) {
			if (response.ok) {
				location.reload();
			}
		});
	}

	/**
	* 현재 날짜와 시간 포맷팅
	* @returns {string} 'YYYY.MM.DD HH:mm' 형식의 날짜/시간 문자열
	*/
	function formatCurrentDateTime() {
	   const now = new Date();
	   const year = now.getFullYear();
	   const month = String(now.getMonth() + 1).padStart(2, '0');
	   const day = String(now.getDate()).padStart(2, '0');
	   const hours = String(now.getHours()).padStart(2, '0');
	   const minutes = String(now.getMinutes()).padStart(2, '0');
	   
	   return `${year}.${month}.${day} ${hours}:${minutes}`;
	}
	
	/**
	 * 연락 드롭다운 메뉴 닫기
	 */
	function closeContactMenu() {
		const contactMenu = document.getElementById('contactMenu');
	    if (contactMenu) {
	        contactMenu.classList.remove('show');
	    }
	}
	
	/**
	 * 알림 모달 표시
	 * @param {Object} options - 모달 옵션
	 * @param {string} options.type - 모달 타입 (success, error, warning, info)
	 * @param {string} options.title - 모달 제목  
	 * @param {string} options.message - 모달 메시지
	 * @param {Object} [options.btn1] - 첫번째 버튼 옵션 (기본값: Confirm)
	 * @param {string} [options.btn1.text] - 첫번째 버튼 텍스트
	 * @param {Function} [options.btn1.callback] - 첫번째 버튼 클릭시 실행할 함수
	 * @param {Object} [options.btn2] - 두번째 버튼 옵션 (선택사항)
	 * @param {string} [options.btn2.text] - 두번째 버튼 텍스트 (기본값: Cancel)
	 * @param {Function} [options.btn2.callback] - 두번째 버튼 클릭시 실행할 함수
	 * @param {boolean} [options.staticBackdrop] - 모달 외부 클릭 시 닫히지 않도록 설정 (기본값: false)
	 * @param {boolean} [options.keyboard] - ESC 키로 모달을 닫을 수 있는지 설정 (기본값: true)
	 */
	function showAlertModal(options) {
	    const modal = document.getElementById('alertModal');
	    if (!modal) return;
	    
	    var typeSettings = {
	        success: {
	            status: 'bg-success',
	            btnClass: 'btn-success',
	            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon mb-2 text-green icon-lg"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path><path d="M9 12l2 2l4 -4"></path></svg>'
	        },
	        error: {
	            status: 'bg-danger',
	            btnClass: 'btn-danger',
	            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon mb-2 text-danger icon-lg"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 9v4" /><path d="M12 16v.01" /></svg>'
	        },
	        warning: {
	            status: 'bg-warning',
	            btnClass: 'btn-warning',
	            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon mb-2 text-warning icon-lg"><path d="M12 9v4"></path><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z"></path><path d="M12 16h.01"></path></svg>'
	        },
	        info: {
	            status: 'bg-info',
	            btnClass: 'btn-info',
	            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon mb-2 text-info icon-lg"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>'
	        }
	    };
	    
	    var setting = typeSettings[options.type || 'success'];
	    
	    modal.querySelector('.modal-status').className = 'modal-status ' + setting.status;
	    modal.querySelector('.modal-icon').innerHTML = setting.icon;
	    modal.querySelector('.modal-title').textContent = options.title || '';
	    modal.querySelector('.modal-message').textContent = options.message || '';
	    
	    var btn1 = modal.querySelector('[data-btn="btn1"]');
	    btn1.textContent = options.btn1 ? options.btn1.text : 'Confirm';
	    btn1.className = 'btn ' + setting.btnClass + ' w-100';
	    
	    var newBtn1 = btn1.cloneNode(true);
	    if (options.btn1 && options.btn1.callback) {
	        newBtn1.addEventListener('click', function(e) {
	            e.preventDefault();
	            options.btn1.callback();
	            bootstrap.Modal.getInstance(modal).hide();
	        });
	    }
	    btn1.parentNode.replaceChild(newBtn1, btn1);
	    
	    var btn2Wrapper = modal.querySelector('[data-wrapper="btn2"]');
	    var btn2 = modal.querySelector('[data-btn="btn2"]');
	    
	    if (options.btn2) {
	        btn2Wrapper.style.display = '';
	        btn2.textContent = options.btn2.text || 'Cancel';
	        btn2.className = 'btn w-100';
	        
	        var newBtn2 = btn2.cloneNode(true);
	        if (options.btn2.callback) {
	            newBtn2.addEventListener('click', function(e) {
	                e.preventDefault();
	                options.btn2.callback();
	                bootstrap.Modal.getInstance(modal).hide();
	            });
	        }
	        btn2.parentNode.replaceChild(newBtn2, btn2);
	    } else {
	        btn2Wrapper.style.display = 'none';
	    }
	    
	    // 모달 설정 옵션
	    var modalOptions = {
	        backdrop: options.staticBackdrop === true ? 'static' : true,
	        keyboard: options.keyboard !== false
	    };
	    
	    // 기존 모달 인스턴스가 있다면 제거
	    var existingModal = bootstrap.Modal.getInstance(modal);
	    if (existingModal) {
	        existingModal.dispose();
	    }
	    
	    // 새 모달 인스턴스 생성 및 표시
	    var bsModal = new bootstrap.Modal(modal, modalOptions);
	    bsModal.show();
	}
	
	/**
	 * 알림 메시지 표시
	 */
	function showAlert(elementId, message, type) {
	    // 이전 alert 제거
	    const existingAlert = document.getElementById(elementId);
	    if (existingAlert) {
	        existingAlert.remove();
	    }

	    // 새로운 alert 생성
	    const alertHTML = 
	        '<div id="' + elementId + '" class="alert alert-' + (type === 'error' ? 'danger' : 'success') + ' alert-dismissible" role="alert">' +
	            '<div class="d-flex">' +
	                '<div>' + message + '</div>' +
	            '</div>' +
	            '<a class="btn-close" data-bs-dismiss="alert" aria-label="close"></a>' +
	        '</div>';

	    // alert를 원하는 위치에 삽입
	    const container = document.querySelector('#' + elementId + 'Container');
	    if (container) {
	        container.innerHTML = alertHTML;
	    }
	}
	
	/**
	 * 토스트 메시지 표시
	 */
	function showToast(message, type) {
	    const toast = document.getElementById('alertToast');
	    if (!toast) return;
	    
	    const toastBody = toast.querySelector('.toast-body');
	    const toastHeader = toast.querySelector('.toast-header strong');
	    
	    // 타입별 설정
	    const settings = {
	        success: {
	            classes: ['bg-success', 'text-white'],
	            title: 'Success'
	        },
	        error: {
	            classes: ['bg-danger', 'text-white'],
	            title: 'Error'
	        },
	        warning: {
	            classes: ['bg-warning', 'text-white'],
	            title: 'Warning'
	        },
	        info: {
	            classes: ['bg-info', 'text-white'],
	            title: 'Information'
	        }
	    };
	    
	    // 모든 스타일 클래스 제거
	    const allClasses = Object.values(settings)
	        .flatMap(setting => setting.classes);
	    toast.classList.remove(...allClasses);
	    
	    // 새로운 스타일 적용
	    const setting = settings[type];
	    if (setting) {
	        toast.classList.add(...setting.classes);
	        toastHeader.textContent = setting.title;
	    }
	    
	    toastBody.textContent = message;
	    
	    const bsToast = new bootstrap.Toast(toast, {
	        autohide: true,
	        delay: 3000
	    });
	    
	    bsToast.show();
	}
/* =====================================================
    Common Utils
======================================================*/
	/**
     * 캡처/프린트 유틸리티
     */
    const captureUtil = {
		// 모든 툴팁 숨기기
		hideAllTooltips: function() {
	        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
	        return Array.from(tooltipTriggerList).map(triggerEl => {
	            const tooltip = bootstrap.Tooltip.getInstance(triggerEl);
	            if (tooltip) {
	                tooltip.hide();
	            }
	            return tooltip;
	        });
	    },
	    // 툴팁 다시 표시
	    restoreTooltips: function(tooltips) {
	        tooltips.forEach(tooltip => {
	            if (tooltip && !tooltip._isEnabled) {
	                tooltip.enable();
	            }
	        });
	    },
	    // 일반 화면 캡쳐
	    captureScreen: function(callback) {
	        const tooltips = this.hideAllTooltips();
	        
	        html2canvas(document.body).then(canvas => {
	            callback(null, canvas.toDataURL());
	        }).catch(error => {
	            callback(error);
	            _GL.COMMON.showToast('Screenshot failed', 'error');
	        }).finally(() => {
	            this.restoreTooltips(tooltips);
	        });
	    },
	    // 지도 캡처 인터페이스 (map.js에서 구현)
        captureMap: function(callback) {
            callback(new Error('Map capture not initialized'));
        }
    };
    
	/**
     * 속성값 포맷팅
     */
    function formatValue(value) {
        if (value === null || value === undefined || value === '') {
            return '<span class="text-muted text-center">-</span>';
        }
        if (typeof value === 'number') {
            return value.toLocaleString();
        }
        return String(value);
    }
	
/* =====================================================
    Event Listeners
======================================================*/
	function initializeEventListeners() {
		// 네이게이션 상태 업데이트 이벤트
		updateNavigationState();
		
		// 헤더 도구 클릭 이벤트
        document.querySelectorAll('.nav-link[data-action]').forEach(function(button) {
            button.addEventListener('click', function() {
                handleHeaderAction(this.getAttribute('data-action'), this);
            });
        });
        
		// 언어 변경 이벤트
        document.querySelectorAll('[data-lang]').forEach(function(item) {
			if (item) {
				item.addEventListener('click', function(e) {
					e.preventDefault();
					const lang = item.getAttribute('data-lang');
					if (lang) {
						changeLanguage(lang);
					}
				});
			}
		});

		// 초기 언어 설정
		const currentLang = getCurrentLanguage();
		updateLanguageChecks(currentLang);
		updateLanguageFlag(currentLang);
		
		// 연락 메시지 글자 수 카운터
		document.addEventListener('input', function(e) {
			if (e.target.matches('#contactForm textarea')) {
				const length = document.querySelector('#contactForm textarea').value.length;
				document.querySelector('#charCount').textContent = length + "/500";
			}
		});
		
		// 연락 메뉴 시간 업데이트
		const contactButton = document.querySelector('[data-action="contact"]');
	    if (contactButton) {
	        contactButton.addEventListener('click', function() {
	            const timeDisplay = document.querySelector('#contactMenu .card-footer small');
	            if (timeDisplay) {
	                timeDisplay.textContent = formatCurrentDateTime();
	            }
	        });
	    }
	    
		// 연락 드롭다운 메뉴 닫기 이벤트
	    document.querySelectorAll('#contactMenu .btn-close, #contactForm .btn-secondary').forEach(button => {
	        button.addEventListener('click', closeContactMenu);
	    });
	}

	// public API
	return {
		init : function() {
			if (initialized)
				return;
			initializeEventListeners();
			initialized = true;
		},
		getCurrentLanguage : getCurrentLanguage,
		changeLanguage : changeLanguage,
		showAlertModal : showAlertModal,
		showAlert : showAlert,
		showToast : showToast,
		captureUtil : captureUtil,
		formatValue : formatValue
	};
})();

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
	_GL.COMMON.init();
});