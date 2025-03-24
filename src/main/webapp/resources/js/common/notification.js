/*========================================================
   DATE: 2025. 03
   AUTHOR: MOYOUNG
   DESC: Notification Module with SSE
========================================================*/
_GL.NOTIFICATION = (function() {
    'use strict';
    
    // 모듈 상태
    let initialized = false;
    let eventSource = null;
    let sessionTimerInterval = null;
    let reconnectTimer = null;
    
    // 세션 타이머 관련 변수
    let sessionExpiryTime = 0;
    let sessionModalActive = false;
    
    // 재배열 관련 변수
    let reconnectAttemptCount = 0;
    const maxReconnectAttemps = 5;
    
    /**
     * SSE 연결 초기화
     */
    function initializeConnection() {
        if (eventSource) {
            eventSource.close();
            eventSource = null;
        }
        
        if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
        }
        
        try {
            // 이벤트 소스 초기화
            initEventSource();
            
            // 서버에서 현재 세션 상태 확인
            checkSessionStatus();
            
            document.addEventListener('visibilitychange', handleVisibilityChange);
        } catch (error) {
            console.error('연결 초기화 오류:', error);
            scheduleReconnect();
        }
    }
    
    /**
     * 페이지 가시성 변경 처리
     */
    function handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            // 탭이 활성화되면 서버에서 현재 세션 상태 확인
            checkSessionStatus();
        }
    }
    
    /**
     * 서버에서 세션 상태 확인
     */
    function checkSessionStatus() {
        if (!_GL.csrf || !_GL.csrf.token) {
        	return;
        }
        
        return fetch('/klums/api/notifications/check-session-status', {
            method: 'GET',
            headers: {
                'X-CSRF-TOKEN': _GL.csrf.token
            },
            credentials: 'same-origin'
        })
        .then(response => {
            if (response.status === 401 || response.status === 403) {
            	// 인증 오류 시 로그인 페이지로 리다이렉트
            	window.location.href = '/klums/auth/login';
                throw new Error('세션이 만료되었습니다.');
            }
            
            if (!response.ok) {
                throw new Error('서버 응답 오류: ' + response.status);
            }
            return response.json();
        })
        .then(result => {
            if (!result.success) {
                throw new Error('상태 확인 실패');
            }
            
            const data = result.data;
            
            // 세션 상태에 따른 처리
            switch(data.status) {
	            case 'EXPIRING':
	                // 모달이 이미 열려 있지 않은 경우에만 표시
	                if (!sessionModalActive) {
	                    handleSessionExpiring({
	                        data: {
	                            secondsRemaining: data.secondsRemaining || 300,
	                            message: data.message
	                        }
	                    });
	                }
	                break;
	            case 'EXPIRED':
	                handleSessionExpired({
	                    action: data.action,
	                    message: data.message
	                });
	                break;
                case 'ACTIVE':
                    break;
            }
            
            return data;
        })
        .catch(error => {
            console.error('세션 상태 확인 오류:', error);
            return null;
        });
    }
    
    /**
     * EventSource 초기화 및 이벤트 리스너 등록
     */
    function initEventSource() {
        try {
            // 이전 연결이 있으면 정리
            if (eventSource) {
                eventSource.close();
                eventSource = null;
            }
            
            // EventSource 생성
            eventSource = new EventSource('/klums/api/notifications/subscribe');
            
            eventSource.onopen = function() {
            	reconnectAttemptCount = 0;
            };
            
            // 이벤트 리스너 등록
            eventSource.addEventListener('notification', handleNotificationEvent);
            eventSource.addEventListener('keepalive', function() {
            	reconnectAttemptCount = 0;
            });
            
            eventSource.onerror = function(event) {
                if (eventSource) {
                    eventSource.close();
                    eventSource = null;
                }
                
                reconnectAttemptCount++;
                if (reconnectAttemptCount >= maxReconnectAttemps) {
                	disconnect();
                    return;
                }
                
                let reconnectDelay = Math.min(1000 * Math.pow(2, reconnectAttemptCount - 1), 30000);
                
                setTimeout(function() {
                    initEventSource();
                }, reconnectDelay);
            };
            
        } catch (error) {
            scheduleReconnect();
        }
    }
    
    /**
     * 알림 이벤트 처리
     */
    function handleNotificationEvent(event) {
        try {
            const notification = JSON.parse(event.data);
            
            switch(notification.type) {
                case 'SESSION_EXPIRING':
                    handleSessionExpiring(notification);
                    break;
                case 'SESSION_EXPIRED':
                    handleSessionExpired(notification);
                    break;
                default:
                    break;
            }
        } catch (e) {
            // 파싱 오류 무시
        }
    }
    
    /**
     * 재연결 예약
     */
    function scheduleReconnect() {
        reconnectAttempts++;
        
        if (reconnectAttempts <= maxReconnectAttemps) {
        	let reconnectDelay = Math.min(1000 * Math.pow(2, reconnectAttemptCount - 1), 30000);
            
            reconnectTimer = setTimeout(function() {
                initializeConnection();
            }, reconnectDelay);
        } else {
            // 기존 연결 정리
            disconnect();
        }
    }
    
    /**
     * 시간 형식화 (MM:SS)
     */
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) {
            seconds = 0;
        }
        
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    
    /**
     * 세션 만료 경고 처리
     */
    function handleSessionExpiring(notification) {
        // 데이터 추출 (기본값: 5분)
        let secondsRemaining = 300;
        const title = notification.data.title;
        const message = notification.data.message;
        const action = notification.data.action;
        	
        if (notification && notification.data) {
            if (typeof notification.data.secondsRemaining === 'number') {
                secondsRemaining = notification.data.secondsRemaining;
            } else if (typeof notification.data.minutesRemaining === 'number') {
                secondsRemaining = notification.data.minutesRemaining * 60;
            }
        }
        
        // 유효성 검사
        if (secondsRemaining <= 0) {
            secondsRemaining = 300; // 기본값으로 재설정
        }
        
        // 이미 세션 만료 모달이 열려있는 경우 업데이트만 함
        if (sessionModalActive) {
            const countdownElement = document.getElementById('sessionCountdown');
            const progressBar = document.getElementById('sessionProgressBar');
            const modal = document.getElementById('sessionExpiryModal');
            
            if (countdownElement && progressBar && modal) {
                const bsModal = bootstrap.Modal.getInstance(modal);
                
                // 타이머 업데이트
                if (sessionTimerInterval) {
                    clearInterval(sessionTimerInterval);
                }
                
                startSessionCountdown(secondsRemaining, countdownElement, progressBar, bsModal);
            }
            return;
        }
        
        // 세션 만료 경고 모달 생성
        createSessionExpiryModal({
            title: title,
            message: message,
            action: action,
            secondsRemaining: secondsRemaining
        });
    }
    
    /**
     * 세션 만료 경고 모달 생성
     */
    function createSessionExpiryModal(options) {
        const existingModal = document.getElementById('sessionExpiryModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        if (sessionTimerInterval) {
            clearInterval(sessionTimerInterval);
        }
        
        // 옵션 설정
        const secondsRemaining = options.secondsRemaining || 300;
        const title = options.title;
        const message = options.message;
        const primaryBtnText = options.action;
        const secondaryBtnText = 'Logout';
        
        // 모달 HTML 생성
        const modalHTML = `
            <div class="modal modal-blur fade" id="sessionExpiryModal" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-status bg-warning"></div>
                        <div class="modal-body text-center py-4">
                            <div class="modal-icon mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon mb-2 text-warning icon-lg">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="6" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                            </div>
                            <h3 class="modal-title">${title}</h3>
                            <div class="text-secondary">${message}</div>
                            <div class="mt-3">
                                <p class="lead"><strong>남은 시간: <span id="sessionCountdown">${formatTime(secondsRemaining)}</span></strong></p>
                                <div class="progress mb-3">
                                    <div id="sessionProgressBar" class="progress-bar bg-warning" role="progressbar" style="width: 100%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <div class="w-100">
                                <div class="row">
                                    <div class="col">
                                        <a href="#" id="logoutBtn" class="btn w-100">${secondaryBtnText}</a>
                                    </div>
                                    <div class="col">
                                        <a href="#" id="primaryBtn" class="btn btn-warning w-100">${primaryBtnText}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 모달을 DOM에 추가
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // DOM 요소 가져오기
        const modalElement = document.getElementById('sessionExpiryModal');
        const countdownElement = document.getElementById('sessionCountdown');
        const progressBar = document.getElementById('sessionProgressBar');
        const primaryBtn = document.getElementById('primaryBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        
        // 버튼 이벤트 리스너
        primaryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            extendSession();
        });
        
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 로그아웃 폼이 있는지 확인
            const logoutForm = document.getElementById('logout-form');
            if (logoutForm) {
                logoutForm.submit();
            } else {
                // 폼이 없으면 로그인 페이지로 이동
                window.location.href = '/klums/auth/login';
            }
        });
        
        // 모달 표시
        const bsModal = new bootstrap.Modal(modalElement, {
            backdrop: 'static',
            keyboard: false
        });
        bsModal.show();
        sessionModalActive = true;
        
        // 카운트다운 시작
        startSessionCountdown(secondsRemaining, countdownElement, progressBar, bsModal);
        
        return bsModal;
    }
    
    /**
     * 세션 카운트다운 시작 (절대 시간 기반)
     */
    function startSessionCountdown(seconds, countdownElement, progressBar, modal) {
        // 기존 타이머 정리
        if (sessionTimerInterval) {
            clearInterval(sessionTimerInterval);
        }
        
        // 입력값 유효성 확인
        if (isNaN(seconds) || seconds <= 0) {
            seconds = 300; // 기본값
        }
        
        // 절대 시간 기준으로 만료 시점 설정 (Date.now() 사용)
        sessionExpiryTime = Date.now() + (seconds * 1000);
        const totalSeconds = seconds;
        
        sessionTimerInterval = setInterval(function() {
            const now = Date.now();
            const remainingMs = sessionExpiryTime - now;
            const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));
            
            // 카운트다운 표시 업데이트
            if (countdownElement) {
                countdownElement.textContent = formatTime(remainingSeconds);
            }
            
            // 프로그레스 바 업데이트
            if (progressBar) {
                const percentage = (remainingSeconds / totalSeconds) * 100;
                progressBar.style.width = `${percentage}%`;
                
                // 30초 미만이면 색상 변경
                if (remainingSeconds < 30) {
                    progressBar.classList.remove('bg-warning');
                    progressBar.classList.add('bg-danger');
                }
            }
            
            if (remainingSeconds <= 0) {
                clearInterval(sessionTimerInterval);
                sessionTimerInterval = null;
                sessionModalActive = false;
                
                if (modal) {
                    modal.hide();
                }
                
                // 세션 만료 처리
                setTimeout(function() {
                    handleSessionExpired();
                }, 300);
            }
        }, 1000);
    }
    
    /**
     * 세션 연장
     */
    function extendSession() {
        if (!_GL.csrf || !_GL.csrf.token) {
            window.location.reload();
            return;
        }
        
        fetch('/klums/api/notifications/extend-session', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': _GL.csrf.token
            },
            credentials: 'same-origin'
        })
        .then(response => {
            if (response.status === 401 || response.status === 403) {
                window.location.reload();
                return;
            }
            
            if (!response.ok) {
            	return;
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // 모달 닫기
                const modal = document.getElementById('sessionExpiryModal');
                if (modal) {
                    const bsModal = bootstrap.Modal.getInstance(modal);
                    if (bsModal) {
                        bsModal.hide();
                    }
                }
                
                // 타이머 정리
                if (sessionTimerInterval) {
                    clearInterval(sessionTimerInterval);
                    sessionTimerInterval = null;
                }
                
                // 모달 상태 초기화
                sessionModalActive = false;
            } else {
                window.location.reload();
            }
        })
        .catch(() => {
            window.location.reload();
        });
    }
    
    /**
     * 세션 만료 처리
     */
    function handleSessionExpired(notification) {
    	const title = notification.data.title;
        const message = notification.data.message;
        const action = notification.data.action;
        const isRememberMe = notification.data.isRememberMe;
        
        // 세션 만료 경고 모달 닫기
        const warningModal = document.getElementById('sessionExpiryModal');
        if (warningModal) {
            const instance = bootstrap.Modal.getInstance(warningModal);
            if (instance) {
                instance.hide();
            }
        }
        
        // 모든 연결 및 타이머 정리
        disconnect();
        
        // 초기화 상태 리셋 (재연결 방지)
        initialized = false;
        
        // 세션 만료 알림 표시
        _GL.COMMON.showAlertModal({
            type: isRememberMe ? 'info' : 'error',
            title: title,
            message: message,
            staticBackdrop: true,
            keyboard: false, 
            btn1: {
                text: action,
                callback: function() {
                    if (isRememberMe) {
                        window.location.reload();
                    } else {
                        window.location.href = '/klums/auth/login';
                    }
                }
            }
        });
    }
    
    /**
     * 연결 종료
     */
    function disconnect() {
        // Page Visibility API 리스너 제거
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        
        if (eventSource) {
            eventSource.close();
            eventSource = null;
        }
        
        // 타이머 정리
        if (sessionTimerInterval) {
            clearInterval(sessionTimerInterval);
            sessionTimerInterval = null;
        }
        
        if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
        }
        
        // 모달 상태 초기화
        sessionModalActive = false;
    }
    
    // 페이지 언로드 시 연결 종료
    window.addEventListener('beforeunload', disconnect);
    
/* =====================================================
    Public API
======================================================*/
    return {
        init: function() {
            if (!initialized) {
                initializeConnection();
                initialized = true;
            }
            return this;
        }
    };
})();

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    if (window._GL && window._GL.user) {
        _GL.NOTIFICATION.init();
    }
});