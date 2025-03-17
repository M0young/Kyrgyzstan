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
    let reconnectAttempts = 0;
    let reconnectDelay = 1000;
    let isRememberMeActive = false;
    
    const MAX_RECONNECT_ATTEMPTS = 5;
    
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
            // Remember-me 상태 먼저 확인하고 이벤트 소스 초기화
            checkRememberMeStatus()
                .then(status => {
                    isRememberMeActive = status;
                    initEventSource();
                })
                .catch(() => {
                    isRememberMeActive = false;
                    initEventSource();
                });
        } catch (error) {
            scheduleReconnect();
        }
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
            
            // 이벤트 리스너 등록
            eventSource.addEventListener('connection', handleConnectionEvent);
            eventSource.addEventListener('notification', handleNotificationEvent);
            eventSource.addEventListener('keepalive', function() {
                // keepalive 이벤트 처리 (빈 함수)
            });
            
            eventSource.onmessage = handleDefaultMessage;
            eventSource.onerror = handleConnectionError;
            
        } catch (error) {
            scheduleReconnect();
        }
    }
    
    /**
     * 연결 이벤트 처리
     */
    function handleConnectionEvent(event) {
        reconnectAttempts = 0;
        reconnectDelay = 1000;
        
        try {
            JSON.parse(event.data);
        } catch (e) {
            // 파싱 오류 무시
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
                    // 기타 알림 유형 처리
                    if (notification.message) {
                        _GL.COMMON.showToast(notification.message, notification.severity || 'info');
                    }
                    break;
            }
        } catch (e) {
            // 파싱 오류 무시
        }
    }
    
    /**
     * 기본 메시지 처리
     */
    function handleDefaultMessage(event) {
        try {
            const data = JSON.parse(event.data);
            
            if (data.message) {
                _GL.COMMON.showToast(data.message, 'info');
            }
        } catch (e) {
            // 파싱 오류 무시
        }
    }
    
    /**
     * 연결 오류 처리
     */
    function handleConnectionError() {
        scheduleReconnect();
    }
    
    /**
     * 재연결 예약
     */
    function scheduleReconnect() {
        reconnectAttempts++;
        
        if (reconnectAttempts <= MAX_RECONNECT_ATTEMPTS) {
            reconnectTimer = setTimeout(function() {
                initializeConnection();
            }, reconnectDelay);
            
            // 다음 재시도에는 대기 시간을 2배로 늘림 (최대 30초까지)
            reconnectDelay = Math.min(reconnectDelay * 2, 30000);
        } else {
            // 기존 연결 정리
            disconnect();
            
            // 사용자에게 알림
            _GL.COMMON.showAlertModal({
                type: 'error',
                title: '연결 오류',
                message: '알림 서비스에 연결할 수 없습니다. 페이지를 새로고침하세요.',
                staticBackdrop: true,
                keyboard: false, 
                btn1: {
                    text: '새로고침',
                    callback: function() {
                        window.location.reload();
                    }
                }
            });
        }
    }
    
    /**
     * Remember-me 상태 확인
     */
    function checkRememberMeStatus() {
        // CSRF 토큰 확인
        if (!_GL.csrf || !_GL.csrf.token) {
            return Promise.reject(new Error('CSRF 토큰이 없습니다.'));
        }
        
        return fetch('/klums/api/notifications/check-remember-me', {
            method: 'GET',
            headers: {
                'X-CSRF-TOKEN': _GL.csrf.token,
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('서버 응답 오류: ' + response.status);
            }
            return response.json();
        })
        .then(result => {
            if (!result.success) {
                throw new Error(result.message || '상태 확인 실패');
            }
            return result.data;
        })
        .catch(() => false);
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
        
        // 세션 만료 경고 모달 생성
        createSessionExpiryModal({
            title: '세션 만료 경고',
            message: (notification && notification.message) ? notification.message : '세션이 곧 만료됩니다. 작업을 계속하려면 세션을 연장하세요.',
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
        const title = options.title || '세션 만료 경고';
        const message = options.message || '세션이 곧 만료됩니다.';
        const primaryBtnText = '세션 연장';
        const secondaryBtnText = '로그아웃';
        
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
        
        // 카운트다운 시작
        startSessionCountdown(secondsRemaining, countdownElement, progressBar, bsModal);
        
        return bsModal;
    }
    
    /**
     * 세션 카운트다운 시작
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
        
        let remainingSeconds = seconds;
        const totalSeconds = seconds;
        
        sessionTimerInterval = setInterval(function() {
            remainingSeconds--;
            
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
                
                if (modal) {
                    modal.hide();
                }
                
                // 세션 만료 처리
                setTimeout(function() {
                    handleSessionExpired({ 
                        message: isRememberMeActive 
                            ? '세션이 만료되었습니다. 페이지를 새로고침하여 계속하세요.'
                            : '세션이 만료되었습니다. 다시 로그인해주세요.'
                    });
                }, 300);
            }
        }, 1000);
    }
    
    /**
     * 세션 연장
     */
    function extendSession() {
        // CSRF 토큰 확인
        if (!_GL.csrf || !_GL.csrf.token) {
            // 토큰이 없으면 조용히 페이지 새로고침
            window.location.reload();
            return;
        }
        
        fetch('/klums/api/notifications/extend-session', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': _GL.csrf.token,
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('세션 연장 실패');
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
                }
                
                // 성공 메시지 표시
                _GL.COMMON.showToast('세션이 성공적으로 연장되었습니다.', 'success');
            } else {
                throw new Error(data.message || '세션 연장 실패');
            }
        })
        .catch(() => {
            // 세션 문제 발생 시 페이지 새로고침
            _GL.COMMON.showAlertModal({
                type: 'error',
                title: '세션 오류',
                message: '세션을 연장할 수 없습니다. 페이지를 새로고침합니다.',
                staticBackdrop: true,
                keyboard: false, 
                btn1: {
                    text: '새로고침',
                    callback: function() {
                        window.location.reload();
                    }
                }
            });
        });
    }
    
    /**
     * 세션 만료 처리
     */
    function handleSessionExpired(notification) {
        // 세션 만료 경고 모달 닫기
        const warningModal = document.getElementById('sessionExpiryModal');
        if (warningModal) {
            const instance = bootstrap.Modal.getInstance(warningModal);
            if (instance) {
                instance.hide();
            }
        }
        
        // 타이머 정리
        if (sessionTimerInterval) {
            clearInterval(sessionTimerInterval);
        }
        
        // 세션 만료 알림 표시
        _GL.COMMON.showAlertModal({
            type: isRememberMeActive ? 'info' : 'error',
            title: '세션 만료',
            message: notification && notification.message ? notification.message : '세션이 만료되었습니다.',
            staticBackdrop: true,
            keyboard: false, 
            btn1: {
                text: isRememberMeActive ? '새로고침' : '로그인',
                callback: function() {
                    if (isRememberMeActive) {
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
        if (eventSource) {
            eventSource.close();
            eventSource = null;
        }
        
        // 타이머 정리
        if (sessionTimerInterval) {
            clearInterval(sessionTimerInterval);
        }
        
        if (reconnectTimer) {
            clearTimeout(reconnectTimer);
        }
    }
    
    // 페이지 언로드 시 연결 종료
    window.addEventListener('beforeunload', disconnect);
    
    // public API
    return {
        init: function() {
            if (!initialized) {
                initializeConnection();
                initialized = true;
            }
            return this;
        },
        disconnect: disconnect
    };
})();

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    if (window._GL && window._GL.user) {
        _GL.NOTIFICATION.init();
    }
});