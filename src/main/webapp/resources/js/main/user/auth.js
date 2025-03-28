/*========================================================
    DATE: 2024. 01
    AUTHOR: MOYOUNG
    DESC: Authentication Module
========================================================*/
_GL.AUTH = (function() {
    'use strict';
    
    let initialized = false;
    
    /**
     * DOM 요소 가져오기
     */
    function getElements(type) {
        switch(type) {
            case 'login':
                return {
                    password: document.getElementById('loginPassword'),
                    togglePassword: document.getElementById('togglePassword')
                };
            case 'signUp':
                return {
                    form: document.getElementById('signUpForm'),
                    name: document.getElementById('signUpName'),
                    email: document.getElementById('signUpEmail'),
                    sendCodeButton: document.getElementById('sendVerificationCode'),
                    verificationCodeContainer: document.getElementById('verificationCodeContainer'),
                    verificationCode: document.getElementById('verificationCode'),
                    password: document.getElementById('signUpPassword'),
                    button: document.getElementById('signUpButton'),
                    togglePassword: document.getElementById('toggleSignUpPassword'),
                    termsCheck: document.getElementById('termsCheck'),
                    termsAgreeButton: document.getElementById('termsAgreeButton')
                };
            case 'forgotPassword':
                return {
                    form: document.getElementById('forgotPasswordForm'),
                    email: document.getElementById('forgotPasswordEmail'),
                    button: document.getElementById('forgotPasswordButton')
                };
        }
    }
    
    /**
     * 비밀번호 토글 설정
     */
    function setupPasswordToggle(inputEl, toggleEl) {
        if (!inputEl || !toggleEl) return;
        
        toggleEl.style.display = 'none';
        
        const eyeOpenSVG = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-eye">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
            </svg>`;

        const eyeOffSVG = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-eye-off">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" />
        	    <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" />
                <path d="M3 3l18 18" />
            </svg>`;
          
        toggleEl.innerHTML = eyeOffSVG;
        
        function handleInput() {
            toggleEl.style.display = inputEl.value.length > 0 ? 'block' : 'none';
        }
        
        function handleToggle() {
        	inputEl.type = inputEl.type === 'password' ? 'text' : 'password';
            toggleEl.innerHTML = inputEl.type === 'password' ? eyeOffSVG : eyeOpenSVG;
        }
        
        inputEl.addEventListener('input', handleInput);
        toggleEl.addEventListener('click', handleToggle);
    }

    /**
     * 이메일 유효성 검사
     */
    function validateEmail(email, elementId) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	    if (!email || !email.trim() || !emailRegex.test(email)) {
	        _GL.COMMON.showAlert(elementId, _GL.messages.AUTH['email.required'], 'error');
	        return false;
	    }

	    return true;
    }

    /**
     * 회원가입 폼 유효성 검사
     */
    function validateSignUpForm() {
        const elements = getElements('signUp');
        
        if (!elements.name.value.trim()) {
            _GL.COMMON.showAlert('signUpAlert', _GL.messages.AUTH['name.required'], 'error');
            return false;
        }
        if (!elements.verificationCode.value) {
            _GL.COMMON.showAlert('signUpAlert', _GL.messages.AUTH['verification.required'], 'error');
            return false;
        }
        if (!elements.password.value) {
            _GL.COMMON.showAlert('signUpAlert', _GL.messages.AUTH['password.required'], 'error');
            return false;
        }
        if (!elements.termsCheck.checked) {
            _GL.COMMON.showAlert('signUpAlert', _GL.messages.AUTH['terms.required'], 'error');
            return false;
        }
        
        return true;
    }

    /**
     * 로딩 상태 설정
     */
    function setLoading(button, isLoading, text) {
        if (!button) return;
        button.disabled = isLoading;
        button.innerHTML = isLoading
            ? '<span class="spinner-border spinner-border-sm me-2"></span>' + text
            : text;
    }

/* =====================================================
    Main Contents
======================================================*/
    /**
     * 인증 코드 전송
     */
    function sendVerificationCode() {
        const elements = getElements('signUp');
        if (!validateEmail(elements.email.value, 'signUpAlert')) return;
        
        setLoading(elements.sendCodeButton, true, 'Sending...');
        
        fetch('/klums/api/auth/send-verification', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': _GL.csrf.token
            },
            body: JSON.stringify({ eml: elements.email.value })
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.success) {
            	elements.verificationCodeContainer.classList.remove('d-none');
                setLoading(elements.sendCodeButton, false, 'Resend code');
                _GL.COMMON.showToast(data.message, 'success');
            } else {
                setLoading(elements.sendCodeButton, false, 'Send code');
                _GL.COMMON.showAlert('signUpAlert', data.message, 'error');
            }
        })
        .catch(function() {
            setLoading(elements.sendCodeButton, false, 'Send code');
            _GL.COMMON.showAlert('signUpAlert', _GL.messages.AUTH['verification.failed'], 'error');
        });
    }

    /**
     * 회원가입 처리
     */
    function signUp() {
        if (!validateSignUpForm()) return;
        
        const elements = getElements('signUp');
        setLoading(elements.button, true, 'Creating account...');

        const formData = new URLSearchParams({
            user_nm: elements.name.value,
            eml: elements.email.value,
            pwd: elements.password.value,
            verificationCode: elements.verificationCode.value
        });
        
        fetch('/klums/api/auth/signUp', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRF-TOKEN': _GL.csrf.token
            },
            body: formData.toString()
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.success) {
            	_GL.COMMON.showToast(data.message, 'success');
                setTimeout(function() {
                    window.location.href = '/klums/auth/login';
                }, 1500);
            } else {
            	_GL.COMMON.showAlert('signUpAlert', data.message, 'error');
            }
        })
        .catch(function() {
        	_GL.COMMON.showAlert('signUpAlert', _GL.messages.AUTH['signup.failed'], 'error');
        })
        .finally(function() {
            setLoading(elements.button, false, 'Create new account');
        });
    }

    /**
     * 임시 비밀번호 요청
     */
    function requestTempPassword() {
        const elements = getElements('forgotPassword');
        if (!validateEmail(elements.email.value, 'forgetPasswordAlert')) return;
        
        setLoading(elements.button, true, 'Sending...');
        
        fetch('/klums/api/auth/send-password', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': _GL.csrf.token
            },
            body: JSON.stringify({ eml: elements.email.value })
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.success) {
            	_GL.COMMON.showToast(data.message, 'success');
                setTimeout(function() {
                    window.location.href = '/klums/auth/login';
                }, 1500);
            } else {
            	_GL.COMMON.showAlert('forgetPasswordAlert', data.message, 'error');
            }
        })
        .catch(function() {
        	_GL.COMMON.showAlert('forgetPasswordAlert', _GL.messages.AUTH['verification.failed'], 'error');
        })
        .finally(function() {
            const buttonText = '<img src="/klums/resources/images/mail.svg" class="icon" width="24" height="24"> Send me new password';
            setLoading(elements.button, false, buttonText);
        });
    }

/* =====================================================
    Event Listeners
======================================================*/
    function initializeEventListeners() {
        const loginElements = getElements('login');
        const signUpElements = getElements('signUp');
        const forgotElements = getElements('forgotPassword');
        
        // 패스워드 토글 설정
        setupPasswordToggle(loginElements.password, loginElements.togglePassword);
        setupPasswordToggle(signUpElements.password, signUpElements.togglePassword);
        
        // 인증코드 버튼
        if (signUpElements.sendCodeButton) {
            signUpElements.sendCodeButton.addEventListener('click', sendVerificationCode);
        }
        
        // 약관 동의 버튼
        if (signUpElements.termsAgreeButton) {
            signUpElements.termsAgreeButton.addEventListener('click', function() {
                signUpElements.termsCheck.checked = true;
            });
        }
        
        // 회원가입 폼 제출
        if (signUpElements.form) {
            signUpElements.form.addEventListener('submit', function(e) {
                e.preventDefault();
                signUp();
            });
        }
        
        // 임시비밀번호 발급 폼 제출
        if (forgotElements.form) {
            forgotElements.form.addEventListener('submit', function(e) {
                e.preventDefault();
                requestTempPassword();
            });
        }
    }

    // public API
    return {
        version: '1.0',
        moduleName: 'AUTH',
        
        init: function() {
            if (initialized) return;
            initializeEventListeners();
            initialized = true;
        }
    };
})();

//DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    _GL.AUTH.init();
});