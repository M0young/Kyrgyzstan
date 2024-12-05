/**
 * Subject : 사용자
 * Author : 오영진
 * Date : 2024. 4. 1.
 * COMMENT : 로그인/회원가입/사용자정보 기능 js파일
 */

var USR={
		isValidUsrId: false,
		isValidPwd: false,
		isValidEml: false,
		isValidTelno: false,
		checkNum: false,
		code: null,
		finalCheck: false,
		checkItv: 0,
		chgEmlFlag: false,
		chgPwdFlag: false,
		usrId: "",
		eml: "",
		logout:function(){
			$.ajax({
				url:"./usr/logout.do",
				dataType:'json',
				success:function(result){
					if(result.rs == "DONE"){
						USR.reload();
					}
				}
			})
		},
		login: function() {
		    const usrId = $("#usrIpId").val();
		    const pwd = hex_sha512($("#usrIpPwd").val()).toString();
		    const param = { usrId: usrId, pwd: pwd };
		    let loginResult = false;

		    $.ajax({
		        url: './usr/checkLogin.do',
		        type: 'POST',
		        data: param,
		        dataType: 'json',
		        async: false,
		        success: function(result) {
		            if (!result.usr_info) {
		                LOG.write("11", "1", "아이디 오류:{ID:" + usrId + "}");
		                CMM.alert('아이디 또는 비밀번호가 일치하지 않습니다.', 'warning');
		                return;
		            }

		            const loginCount = result.usr_info.login_count;

		            if (loginCount >= 5) {
		                LOG.write("12", "2", "로그인 5회 실패로 인한 비밀번호 초기화:{ID:" + usrId + "}");
		                $(".signErr").addClass("active");
		                return;
		            }

		            if (result.usr_info === "NONE") {
		                if (result.pwd === "INCORRECT") {
		                    LOG.write("11", "1", "패스워드 오류:{ID:" + usrId + "}");
		                    CMM.alert('아이디 또는 비밀번호가 일치하지 않습니다.', 'warning');
		                } else {
		                    LOG.write("11", "1", "아이디 오류:{ID:" + usrId + "}");
		                    CMM.alert('아이디 또는 비밀번호가 일치하지 않습니다.', 'warning');
		                }
		                return;
		            }

		            loginResult = result.usr_info.usr_id;
		        }
		    });

		    if (loginResult) {
		        USR.checkCookie();
		        USR.loginSession();
		    }
		},
		loginSession: function() {
		    const usrId = $("#usrIpId").val();
		    const pwd = hex_sha512($("#usrIpPwd").val()).toString();
		    const param = { usrId: usrId, pwd: pwd };
		    
		    $.ajax({
		        url: './usr/loginSession.do',    
		        type: 'POST',
		        data: param,    
		        dataType: 'json',
		        success: function(result) {
		            if (result.usr_info === "ERROR") {
		                CMM.alert("이미 다른 장치에서 로그인 중입니다. 다른 장치에서 로그아웃하고 다시 시도해주세요.", "warning");
		                return;
		            }
		            
		            LOG.write("10", '1', "로그인 성공");
		            location.reload();
		        },
		        error: function(xhr, status, error) {
		            console.error('로그인 세션 생성 중 오류 발생:', error);
		            CMM.alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.", "warning");
		        }
		    });
		},
		checkCookie: function() {
		    const usrId = $("#usrIpId").val();
		    const isChecked = $("#usrCkCookie").is(":checked");
		    
		    if (isChecked) { 
		        USR.setCookie("usrId", usrId, 60); 
		        USR.setCookie("checkCookie", "Y", 60);
		    } else {
		        USR.deleteCookie("usrId");
		        USR.deleteCookie("checkCookie");
		    }
		},
		setCookie: function(cookieName, value, exdays) {
		    const d = new Date();
		    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		    const expires = "expires=" + d.toUTCString();
		    document.cookie = `${cookieName}=${encodeURIComponent(value)};${expires};path=/`;
		},
		deleteCookie: function(cookieName) {
		    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
		},
		getCookie: function(cookieName) {
		    const name = cookieName + "=";
		    const decodedCookie = decodeURIComponent(document.cookie);
		    const ca = decodedCookie.split(';');
		    for(let i = 0; i < ca.length; i++) {
		        let c = ca[i];
		        while (c.charAt(0) == ' ') {
		            c = c.substring(1);
		        }
		        if (c.indexOf(name) == 0) {
		            return c.substring(name.length, c.length);
		        }
		    }
		    return "";
		},
		insertUsrInfo: function() {
		    const userData = {
		        usrId: $("#usrIpSiId").val(),
		        usrNm: $("#usrIpSiFn").val() + " " + $("#usrIpSiLn").val(),
		        eml: $("#usrIpSiEml").val(),
		        telno: $("#usrIpSiTelno").val(),
		        pwd: hex_sha512($("#usrIpSiPwd").val()).toString(),
		        inst: $("#usrIpSiInst").val(),
		        dept: $("#usrIpSiDept").val(),
		        infoAgr: "Y"
		    };

		    if (!this.validateUserInput(userData)) return;

		    this.registerUser(userData)
		        .then(() => {
		            CMM.alert('회원가입이 완료되었습니다.', 'info', USR.reload);
		        })
		        .catch((error) => {
		            CMM.alert(error, 'warning');
		        });
		},
		validateUserInput: function(userData) {
		    const validations = [
		        { condition: !userData.usrId, message: '아이디를 입력해주세요.' },
		        { condition: !userData.usrNm.trim(), message: '이름을 입력해주세요.' },
		        { condition: !userData.eml, message: '이메일을 입력해주세요.' },
		        { condition: !userData.telno, message: '전화번호를 입력해주세요.' },
		        { condition: !$("#usrIpSiPwd").val(), message: '비밀번호를 입력해주세요.' },
		        { condition: !$("#usrIpSiPwdCfm").val(), message: '비밀번호 확인을 입력해주세요.' },
		        { condition: $("#usrIpSiPwdCfm").val() !== $("#usrIpSiPwd").val(), message: '비밀번호 확인이 올바르지않습니다.' },
		        { condition: !userData.inst, message: '기관을 선택해주세요.' },
		        { condition: !userData.dept, message: '부서를 선택해주세요.' },
		        { condition: !$("#usrCkInfoAgr").is(":checked"), message: '개인정보 수집 및 이용에 동의해주세요.' },
		        { condition: $("#usrLiChkEml").is(":hidden"), message: 'Send버튼을 클릭해 이메일을 인증해주세요.' },
		        { condition: !USR.isValidUsrId, message: "아이디를 확인해주세요." },
		        { condition: !USR.isValidPwd, message: "비밀번호를 확인해주세요." },
		        { condition: !USR.isValidEml, message: "이메일을 확인해주세요." },
		        { condition: !USR.isValidTelno, message: "전화번호를 확인해주세요." },
		        { condition: !USR.checkNum, message: "인증번호를 확인해주세요." }
		    ];

		    for (let validation of validations) {
		        if (validation.condition) {
		            CMM.alert(validation.message, 'warning');
		            return false;
		        }
		    }
		    return true;
		},
		registerUser: function(userData) {
		    return new Promise((resolve, reject) => {
		        $.ajax({
		            url: './usr/insertUsrInfo.do',
		            type: 'POST',
		            data: userData,
		            dataType: 'json',
		            success: function(result) {
		                if (result.rs === "DONE") {
		                    resolve();
		                } else {
		                    reject('회원가입 중 오류가 발생했습니다.');
		                }
		            },
		            error: function() {
		                reject('회원가입 중 오류가 발생했습니다.');
		            }
		        });
		    });
		},
		startTimer: function(timerElementIds, callback) {
		    clearInterval(USR.checkItv);
		    
		    const [minElementId, secElementId, completeBtnId] = timerElementIds;
		    const remainingMin = document.getElementById(minElementId);
		    const remainingSec = document.getElementById(secElementId);
		    const completeBtn = document.getElementById(completeBtnId);
		    
		    let time = 180; // 타이머 시작 시간 (초)
		    
		    USR.checkItv = setInterval(function () {
		        if (time > 0) {
		            time -= 1;
		            let min = Math.floor(time / 60);
		            let sec = String(time % 60).padStart(2, "0");
		            remainingMin.innerText = min;
		            remainingSec.innerText = sec;
		        } else {
		            USR.code = null;
		            clearInterval(USR.checkItv);
		            callback(); // 만료 시 콜백 호출
		        }
		    }, 1000);
		},
		startLimitTime: function() {
		    startTimer(["usrSpChkMin", "usrSpChkSec", "usrBtCmpChk"], function() {
		        CMM.alert('인증번호 유효시간이 만료되었습니다.', 'warning');
		    });
		},
		startLimitTimeInfo: function() {
		    startTimer(["usrChkMinInfo", "usrChkSecInfo", "usrBtCmpChkInfo"], function() {
		        CMM.alert('인증번호 유효시간이 만료되었습니다.', 'warning');
		    });
		},
		findId:function(){
			var usrNm = $("#usrIpFiidFn").val() +" "+ $("#usrIpFiidLn").val();
			var eml = $("#usrIpFiidEml").val();
			
			if($("#usrIpFiidFn").val() == "" || $("#usrIpFiidLn").val() == "") {
				CMM.alert('이름을 입력해주세요.', 'warning');
				return false;
			}
			
			if($("#usrIpFiidEml").val() == "") {
				CMM.alert('이메일을 입력해주세요.', 'warning');
				return false;
			}
			
			$.ajax({
				url : './usr/selectFindUsrId.do',
			    type : "POST",
			    data : {"usrNm": usrNm, "eml": eml},
				dataType : 'json',
			    success : function(result){
			        if (result.rs != "NONE") {
			        	var resultId = USR.maskUserID(result.rs);
			        	$("#usrDiFiidNtc").html('<i class="ico sub-ico tabproc-LB-ico"></i> 아이디를 성공적으로 찾았습니다.');
			        	$("#usrDiFiidNtc").css("color", "var(--c-LB7)");
			        	$("#usrIpRsId").val(resultId);
			        } else {
			        	$("#usrDiFiidNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 필수항목을 입력해주세요.');
						$("#usrDiFiidNtc").css("color", "var(--c-R1)");
						$("#usrIpRsId").val("");
			        	CMM.alert('입력한 정보와 일치하는 회원이 없습니다.', 'warning');
			        }
			    }
			});
		},
		maskUserID:function(userId){
			var idLength = userId.length;
		    
		    var maskLength = 0;
		    if (idLength >= 4 && idLength <= 6) {
		        maskLength = 2;
		    } else if (idLength >= 7 && idLength <= 9) {
		        maskLength = 3;
		    } else if (idLength >= 10 && idLength <= 12) {
		        maskLength = 4;
		    }
		    
		    var maskedPart = userId.slice(0, -maskLength);
		    var unmaskedPart = userId.slice(-maskLength);
		    
		    return maskedPart + "*".repeat(maskLength);
		},
		findPwd:function(){
			var usrId = $("#usrIpFipwId").val();
			var usrNm = $("#usrIpFipwFn").val() +" "+ $("#usrIpFipwLn").val();
			var eml = $("#usrIpFipwEml").val();
			
			if($("#usrIpFipwId").val() == "") {
				CMM.alert('아이디를 입력해주세요.', 'warning');
				return false;
			}
			
			if($("#usrIpFipwFn").val() == "" || $("#usrIpFipwLn").val() == "") {
				CMM.alert('이름을 입력해주세요.', 'warning');
				return false;
			}
			
			if($("#usrIpFipwEml").val() == "") {
				CMM.alert('이메일을 입력해주세요.', 'warning');
				return false;
			}
			
			$('.Pwpop .loading').addClass('active');
			
			$.ajax({
				url : './usr/selectFindPwd.do',
			    type : "POST",
			    data : {"usrId": usrId, "usrNm": usrNm, "eml": eml},
				dataType : 'json',
			    success : function(result){
			    	$('.Pwpop .loading').removeClass('active');
			        if (result.rs == "DONE") {
			        	CMM.alert('입력하신 이메일 주소로 임시 비밀번호가 전송되었습니다.','info',USR.reload);
			        } else if(result.rs == "NULL") {
			        	CMM.alert('인증번호가 동일한 이메일 주소로 3회 이상 발송되었습니다. 입력하신 이메일 주소를 확인 후 5분 뒤에 다시 시도해 주시기 바랍니다.', 'warning');
			        } else {
			        	$("#usrDiFipwNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 입력한 정보와 일치하는 회원이 없습니다.');
						$("#usrDiFipwNtc").css("color", "var(--c-R1)");
			        	CMM.alert('입력한 정보와 일치하는 회원이 없습니다.', 'warning');
			        }
			    }
			});
		},
		selectUsrInfo:function(){
			usrId = $("#usrIpIdInfo").val();
			$.ajax({
				url : './usr/selectUsrInfo.do',
			    type : "POST",
			    data : {"usrId": usrId},
				dataType : 'json',
			    success : function(result){
			    	usrInfo = result.rs;
			    	USR.eml = usrInfo.eml;
			    	
			    	if(usrInfo != null) {
			    		$("#usrIpInstInfo").val(usrInfo.inst);
			    		$("#usrIpDeptInfo").val(usrInfo.dept);
			    	}
			    }
			});
		},
		updateUsrInfo:function(){
			var usrId = $("#usrIpIdInfo").val();
			var usrNm = $("#usrIpNmInfo").val();
			var eml = $("#usrIpEmlInfo").val();
			var pwd = hex_sha512($("#usrIpPwdInfo").val()).toString();
			var pwdChg = hex_sha512($("#usrIpPwdChg").val()).toString();
			if(USR.chgPwdFlag != true) {
				pwdChg = "";
			}
			var telno = $("#usrIpTelInfo").val();
			var inst = $("#usrIpInstInfo").val();
			var dept = $("#usrIpDeptInfo").val();
			
			if($("#usrIpEmlInfo").val() == "") {
				CMM.alert('이메일을 입력해주세요.', 'warning');
				return false;
			}
			if($("#usrIpPwdInfo").val() == "") {
				CMM.alert('현재 비밀번호를 입력해주세요.', 'warning');
				return false;
			}
			if($("#usrIpTelInfo").val() == "") {
				CMM.alert('전화번호를 입력해주세요.', 'warning');
				return false;
			}
			if(USR.chgEmlFlag == true) {
				if (!USR.isValidEml) {CMM.alert("이메일을 확인해주세요.", 'warning');return;}
				if (!USR.checkNum) {CMM.alert("인증번호를 확인해주세요.", 'warning');return;}
			}
		  	if(USR.chgPwdFlag == true) {
		  		if($("#usrIpPwdChg").val() == "") {
		  			CMM.alert('변경할 비밀번호를 입력해주세요.', 'warning');
		  			return false;
		  		}
		  		if($("#usrIpPwdChgCfm").val() == "") {
		  			CMM.alert('비밀번호 확인을 입력해주세요.', 'warning');
		  			return false;
		  		}
		  		if (!USR.isValidPwd) {CMM.alert("비밀번호를 확인해주세요.", 'warning');return;}
		  		if ($("#usrIpPwdChg").val() != $("#usrIpPwdChgCfm").val()) {
		  			CMM.alert("비밀번호 확인란이 틀립니다", 'warning');return;
		  		}
		  	}
		  	if (!USR.isValidTelno) {CMM.alert("전화번호를 확인해주세요.", 'warning');return;}
		  	
			var param={
				"usrId": usrId,
				"usrNm": usrNm,
				"eml": eml,
				"pwd": pwd,
				"pwdChg": pwdChg,
				"telno": telno,
				"inst": inst,
				"dept": dept,
			}
			
			$.ajax({
				url : './usr/updateUsrInfo.do',
				type : 'POST',
				data : param,
				dataType : 'json',
				success : function(result) {
					if(result.rs == "FAIL") {
						CMM.alert('비밀번호가 일치하지 않습니다.', 'warning');
						return;
					} else if(result.rs == "SAME") {
						CMM.alert('변경된 정보가 없습니다.','info');
						return;
					}  else if(result.rs == "PWSAME") {
						CMM.alert('현재 비밀번호와 새 비밀번호는 동일할 수 없습니다.', 'warning');
						return;
					} else if(result.rs == "DONE") {
						CMM.alert('회원정보가 저장되었습니다.','info',USR.reload);
						return;
					} else if(result.rs == "PWDONE") {
						CMM.alert('회원정보가 저장되었습니다. 변경된 비밀번호로 다시 로그인해주세요.','info',USR.logout);
						return;
					} else {
						CMM.alert('회원정보 저장에 실패했습니다.', 'warning');
					}
				}
			});
		},
		deleteUsrInfo:function(){
			var pwd = hex_sha512($("#usrIpPwdInfo").val()).toString();
			if($("#usrIpPwdInfo").val() == "") {
				CMM.alert('현재 비밀번호를 입력해주세요.', 'warning');
				return false;
			}
			$.ajax({
				url:"./usr/deleteUsrInfo.do",
				type : "POST",
				data : {"pwd": pwd},
				dataType:'json',
				success:function(result){
					if(result.rs=="FAIL"){
						CMM.alert('비밀번호가 일치하지 않습니다.','warning');
						return false;
					}
					if(result.rs=="DONE"){
						CMM.alert('회원정보 삭제가 완료되었습니다.','info',USR.reload);
					}
				}
			})
		},
		reload:function(){
			location.reload();
		},
		clearSignIn:function(){
			var usrId = USR.getCookie("usrId");
        	var checkCookie = USR.getCookie("checkCookie");
        	$("#usrIpPwd").val("");
        	
        	if(checkCookie == 'Y') {
        	    $("#usrCkCookie").prop("checked", true);
        		$("#usrIpId").val(usrId);
        		$("#usrIpPwd").focus();
        	}else {
        	    $("#usrCkCookie").prop("checked", false);
        	    $("#usrIpId").val("");
        	    $("#usrIpId").focus();
        	}
		},
		clearSignUp:function(){
			clearInterval(USR.checkItv);
			USR.isValidUsrId = false;
			USR.isValidPwd = false;
			USR.isValidEml = false;
			USR.isValidTelno = false;
			USR.checkNum = false;
			USR.code = null;
			$("#usrSpChkMin").text("3");
			$("#usrSpChkSec").text("00");
			$("#usrBtChkEml").text("Send");
			$("#usrIpSiEml").attr('disabled',false);
			$("#usrBtChkEml").attr('disabled',false);
			$("#usrIpSiChkEml").attr('disabled',false);
			$("#usrBtCmpChk").attr('disabled',false);
			$(".Authentication-Box").css("display", "none");
			
			$("#usrIpSiId").val("");
			$("#usrIpSiFn").val("");
			$("#usrIpSiLn").val("");
			$("#usrIpSiEml").val("");
			$("#usrIpSiChkEml").val("");
			$("#usrIpSiTelno").val("");
			$("#usrIpSiPwd").val("");
			$("#usrIpSiPwdCfm").val("");
			$("#usrIpSiInst").val("");
			$("#usrIpSiDept").val("");
			$("#usrCkInfoAgr").prop('checked', false);
			
			$("#usrLbId").text("");
			$("#usrLbNm").text("");
			$("#usrLbEml").text("");
			$("#usrLbChkEml").text("");
			$("#usrLbTelno").text("");
			$("#usrLbPwd").text("");
			$("#usrLbPwdCfm").text("");
			$("#usrLbInst").text("");
			$("#usrLbDept").text("");
			
			$(".sign-warning").addClass("hide");
			$("#usrIpSiId").focus();
		},
		TIMEOUT:{
			// 클라이언트와 서버 간의 시간 차이 계산
			setTimeOffsetBetweenServerAndClient:function(){
				var latestTouch;
				 
				$.ajax({
					 url : './usr/sessionCheck.do',
					 type : 'POST',
					 async: false,
					 success : function(result) {
						 var result =  JSON.parse(result);
						 latestTouch = result.latestTouch;
					 }
				});
					
				latestTouch = latestTouch==null ? null : Math.abs(latestTouch);
				var clientTime = (new Date()).getTime();
				var clientTimeOffset = clientTime - latestTouch;
				setCookie('clientTimeOffset', clientTimeOffset);
				 
			},
			// 세션 만료 여부 확인
			isSessionExpired:function(offset){
				var sessionExpiry;
				 
				$.ajax({
					 url : './usr/sessionCheck.do',
					 type : 'POST',
					 async: false,
					 success : function(result) {
						var result =  JSON.parse(result);
						 sessionExpiry = result.sessionExpiry;
					 }
				});
//				if(sessionExpiry == null) {
//					clearTimeout(timerRemainId);
//					clearTimeout(timer);
//					LOG.write('19','1','중복 로그인:{ID:'+USR.usrId+'}');
//					CMM.alert("다른 기기에서 로그인되어 현재 로그인이 종료되었습니다.","warning",USR.reload);
//					$('.popup-alert > div > button, .popup-alert .close-Wt-Btn').click(function(){
//						$(this).parents('.popup-alert').removeClass('active');
//						USR.reload();
//					});
//					return;
//				}
				var timeOffset = Math.abs(getCookie('clientTimeOffset'));
				var localTime = (new Date()).getTime();
				var accessedTime = sessionExpiry - (localTime - timeOffset);
				setCookie('remainTime',accessedTime);
				var minutes = new Date(accessedTime).getMinutes()+"";
				var seconds = new Date(accessedTime).getSeconds()+"";
				seconds = (minutes * 60) + (seconds * 1);
				if(minutes.length == 1) minutes = "0"+minutes;
				if(seconds.length == 1) seconds = "0"+seconds;
				//$("#remainTime").text(minutes+":"+seconds);
				document.getElementById('eg-remainTime').innerText = seconds;
		
				if(accessedTime <= 0){
					document.getElementById('eg-remainTime').innerText = 0;
					clearTimeout(timerRemainId);
					clearTimeout(timer);
					USR.TIMEOUT.checkSessionExpired();
				}
				
				return localTime - timeOffset > (sessionExpiry-(offset||0));

			},
			// 세션 만료 시 실행
			checkSessionExpired:function(){
				LOG.write('17','1','세션 만료:{ID:'+USR.usrId+'}');
				clearTimeout(timer);
				$('.timer-art').removeClass('on');
				$.ajax({
					url:"./usr/logout.do",
					dataType:'json',
					success:function(result){
						CMM.alert("오랜시간 동안 사용하지 않아  접속이 종료 되었습니다. 다시 로그인해주십시오.","warning",USR.reload);
						$('.warn-art').addClass('on');
						$('.warn-art').removeClass('active');
					}
				});
				
			},
			// 세션 만료까지 남은 시간 표시
			checkSessionRemainTime:function(){
				var seconds = parseInt(document.getElementById('eg-remainTime').innerText);
				seconds = seconds - 1;
		
				document.getElementById('eg-remainTime').innerText = seconds;
				if(seconds > 0) timerRemainId = setTimeout('USR.TIMEOUT.checkSessionRemainTime()', 1000);
				else {
					clearTimeout(timerRemainId);
					USR.TIMEOUT.checkSessionExpired();
				}
			},
			// 세션 만료 시간 주기적으로 확인
			checkSessionTimeout:function(){
				var isTimeout = USR.TIMEOUT.isSessionExpired(60*1000);  //세션만료예정시간을 60초 앞당겨서 검사
				if(isTimeout === true){	
					$('.backBg').addClass('on');
					$('.timer-art').addClass('on');
					USR.TIMEOUT.checkSessionRemainTime();
					timer = setInterval(function(){
						if(!USR.TIMEOUT.isSessionExpired(60*1000)){
							USR.TIMEOUT.onClickTimeExtension();
						}
					},10000); 	
			    } else {
					setTimeout('USR.TIMEOUT.checkSessionTimeout()', 10*1000);
			    }
			},
			// 세션 만료 시간 연장
			onClickTimeExtension:function(){
				$.ajax({
					url : './usr/sessionRefresh.do',
					type : 'POST',
					success : function(result) {
						$('.backBg').removeClass('on');
						$('.timer-art').removeClass('on');
						clearInterval(timer);
						clearTimeout(timerRemainId);
						USR.TIMEOUT.checkSessionTimeout();
					}
				});
			}
		}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 로그인-아이디
$("#usrIpId").on("keyup", function(e) {
    if (e.key === "Enter") {
        const id = $("#usrIpId").val().trim();
        const pwd = $("#usrIpPwd").val().trim();
        const warning = $('.sign-id').find('.sign-warning');

        if (id.length === 0) {
            warning.removeClass("hide");
        } else {
            warning.addClass("hide");
            if (pwd.length === 0) {
                $("#usrIpPwd").focus();
            } else {
                USR.login();
            }
        }
    }
});

// 로그인-비밀번호
$("#usrIpPwd").on("keyup", function(e) {
    if (e.key === "Enter") {
        const pwd = $(this).val().trim();
        const warning = $(this).closest('.signIn-btw').find('.sign-warning');

        if (pwd.length === 0) {
            warning.removeClass("hide");
        } else {
            warning.addClass("hide");
            USR.login();
        }
    }
});

$('#usrBtSiin').click(function () {
	USR.login();
});

// 아이디 찾기
$('#usrBtFiId').click(function () {
	USR.findId();
});

// 아이디 찾기 초기화
$('.IDfind-btn').click(function () {
	$("#usrIpRsId").val("");
	$("#usrIpFiidFn").val("");
	$("#usrIpFiidLn").val("");
	$("#usrIpFiidEml").val("");
	
	$("#usrDiFiidNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 필수항목을 입력해주세요.');
	$("#usrDiFiidNtc").css("color", "var(--c-R1)");
});

// 아이디 찾기-이메일
$("#usrIpFiidEml").on("propertychange change paste input blur", function(){
	let eml = $("#usrIpFiidEml").val();
	var regExp = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
	if (eml != "") {
		if (!regExp.test(eml)) {
			$("#usrDiFiidNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 이메일 주소가 올바르지 않습니다.');
			$("#usrDiFiidNtc").css("color", "var(--c-R1)");
			USR.isValidEml = false;
			return;
		} else {
			$("#usrDiFiidNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 필수항목을 입력해주세요.');
			$("#usrDiFiidNtc").css("color", "var(--c-R1)");
			USR.isValidEml = true;
			return;
		}
	} else {
		$("#usrDiFiidNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 필수항목을 입력해주세요.');
		$("#usrDiFiidNtc").css("color", "var(--c-R1)");
		USR.isValidEml = false;
		return;
	}
});

// 비밀번호 찾기
$('#usrBtFiPw').click(function () {
	USR.findPwd();
});

// 비밀번호 찾기 초기화
$('.PWfind-btn').click(function () {
	$("#usrIpFipwId").val("");
	$("#usrIpFipwFn").val("");
	$("#usrIpFipwLn").val("");
	$("#usrIpFipwEml").val("");
	
	$("#usrDiFipwNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 필수항목을 입력해주세요.');
	$("#usrDiFipwNtc").css("color", "var(--c-R1)");
});

// 비밀번호 찾기-이메일
$("#usrIpFipwEml").on("propertychange change paste input blur", function(){
	let eml = $("#usrIpFipwEml").val();
	var regExp = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
	if (eml != "") {
		if (!regExp.test(eml)) {
			$("#usrDiFipwNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 이메일 주소가 올바르지 않습니다.');
			$("#usrDiFipwNtc").css("color", "var(--c-R1)");
			USR.isValidEml = false;
			return;
		} else {
			$("#usrDiFiidNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 필수항목을 입력해주세요.');
			$("#usrDiFiidNtc").css("color", "var(--c-R1)");
			USR.isValidEml = true;
			return;
		}
	} else {
		$("#usrDiFipwNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 필수항목을 입력해주세요.');
		$("#usrDiFipwNtc").css("color", "var(--c-R1)");
		USR.isValidEml = false;
		return;
	}
});

// 로그아웃
$('#cmmLiLogout').click(function () {
	USR.logout();
});

// 회원가입-아이디
$("#usrIpSiId").on("propertychange change paste input blur", function() {
    const usrId = $("#usrIpSiId").val().trim();
    const regExp = /^[0-9a-zA-Z]{4,12}$/;
    const warning = $('.usID-fld').next('li').find('.sign-warning');

    if (usrId.length === 0) {
        warning.html('<i></i>아이디는 필수입력 정보입니다.');
        warning.removeClass("hide");
        USR.isValidUsrId = false;
        return;
    }

    if (!regExp.test(usrId)) {
        warning.html('<i></i>아이디는 영문+숫자 4~12자입니다.');
        warning.removeClass("hide");
        USR.isValidUsrId = false;
        return;
    }

    $.ajax({
        url: './usr/selectUsrId.do',
        type: 'POST',
        data: { usrId: usrId },
        dataType: 'json',
        success: function(result) {
            if (result.rs === 0) {
                warning.addClass("hide");
                USR.isValidUsrId = true;
            } else {
                warning.html('<i></i>사용중인 아이디입니다.');
                warning.removeClass("hide");
                USR.isValidUsrId = false;
            }
        }
    });
});

//회원가입-이름
$("#usrIpSiFn, #usrIpSiLn").on("propertychange change paste input blur", function() {
    const usrFn = $("#usrIpSiFn").val().trim();
    const usrLn = $("#usrIpSiLn").val().trim();
    const warning = $('.name-fld').next('li').find('.sign-warning');

    if (usrFn.length !== 0 && usrLn.length !== 0) {
        warning.addClass("hide");
    } else {
        warning.html('<i></i>이름은 필수입력 정보입니다.');
        warning.removeClass("hide");
    }
});

// 회원가입-이메일
$("#usrIpSiEml").on("propertychange change paste input blur", function() {
    const eml = $("#usrIpSiEml").val().trim();
    const regExp = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    const warning = $('.email-fld').next('li').find('.sign-warning');

    if (eml.length === 0) {
        warning.html('<i></i>이메일은 필수입력 정보입니다.');
        warning.removeClass("hide");
        USR.isValidEml = false;
        return;
    }

    if (!regExp.test(eml)) {
        warning.html('<i></i>이메일 주소가 올바르지 않습니다.');
        warning.removeClass("hide");
        USR.isValidEml = false;
        return;
    }

    $.ajax({
        url: './usr/selectEml.do',
        type: "POST",
        data: { "eml": eml },
        dataType: 'json',
        success: function(result) {
            if (result.rs === 0) {
                warning.addClass("hide");
                USR.isValidEml = true;
            } else {
                warning.html('<i></i>사용중인 이메일 주소 입니다.');
                warning.removeClass("hide");
                USR.isValidEml = false;
            }
        }
    });
});
	
// 회원가입-인증번호발송
$("#usrBtChkEml").click(function() {
    const email = $("#usrIpSiEml").val();
    
    if (!USR.isValidEml) {
        CMM.alert('이메일 정보를 확인해주세요.', 'warning');
        return;
    }

    $(".Authentication-Box").css("display", "block");
    $('.sign-box .loading').addClass('active');
    
    $.ajax({
        url: './usr/checkMail.do',
        type: 'POST',
        data: { eml: email },
        dataType: 'json',
        success: function (result) {
            USR.code = result.rs;
            $('.sign-box .loading').removeClass('active');

            if (USR.code === null) {
                CMM.alert('인증번호가 동일한 이메일 주소로 3회 이상 발송되었습니다. 입력하신 이메일 주소를 확인 후 5분 뒤에 다시 시도해 주시기 바랍니다.', 'warning');
            } else {
                clearInterval(USR.checkItv);
                $("#usrSpChkMin").text("3");
                $("#usrSpChkSec").text("00");
                $("#usrBtChkEml").text("Resend");
                USR.startLimitTime();
                CMM.alert('인증번호가 전송되었습니다.', 'info');
            }
        },
        error: function(xhr, status, error) {
            $('.sign-box .loading').removeClass('active');
            CMM.alert('인증 이메일 전송 중 오류가 발생했습니다. 다시 시도해 주세요.', 'error');
            console.error('AJAX Error:', status, error);
        }
    });
});

// 회원가입-인증확인
$("#usrBtCmpChk").on("click", function() {
    const inputCode = $("#usrIpSiChkEml").val().trim();
    const warning = $('.Authentication-Box').next('li').find('.sign-warning');
    
    if (inputCode.length === 0 || inputCode !== USR.code) {
        warning.html('<i></i>인증번호를 정확하게 다시 입력해주세요.');
        warning.removeClass("hide");
        USR.checkNum = false;
    } else {
        warning.addClass("hide");
        $("#usrIpSiEml, #usrBtChkEml, #usrIpSiChkEml, #usrBtCmpChk").attr('disabled', true);
        USR.checkNum = true;
        clearInterval(USR.checkItv);
    }
});

// 회원가입-전화번호
$("#usrIpSiTelno").on("propertychange change paste input blur", function() {
    const telno = $(this).val().trim();
    const warning = $('.user-phone').next('li').find('.sign-warning');
    const regExp = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;

    if (telno.length === 0) {
        warning.html('<i></i>전화번호는 필수입력 정보입니다.');
        warning.removeClass("hide");
        USR.isValidTelno = false;
    } else if (!regExp.test(telno)) {
        warning.html('<i></i>(-)를 제외한 올바른 전화번호 11자리를 입력해 주세요.');
        warning.removeClass("hide");
        USR.isValidTelno = false;
    } else {
        warning.addClass("hide");
        USR.isValidTelno = true;
    }
});

// 회원가입-비밀번호
$("#usrIpSiPwd").on("propertychange change paste input blur", function() {
    let pass1 = $("#usrIpSiPwd").val().trim();
    let pass2 = $("#usrIpSiPwdCfm").val().trim();
    let regExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
    let warning = $('.user-pw').next('li').find('.sign-warning');
    let ckWarning = $('.user-pwcheck').next('li').find('.sign-warning');
    
    if (pass1.length === 0) {
        warning.html('<i></i>비밀번호는 필수입력 정보입니다.');
        warning.removeClass("hide");
        USR.isValidPwd = false;
        return;
    }

    if (!regExp.test(pass1)) {
        warning.html('<i></i>비밀번호는 영문,숫자,특수기호를 포함한 8~15자입니다.');
        warning.removeClass("hide");
        USR.isValidPwd = false;
        return;
    }

    if (pass1 !== pass2 && pass2.length !== 0) {
    	ckWarning.html('<i></i>비밀번호가 일치하지 않습니다.');
    	ckWarning.removeClass("hide");
        USR.isValidPwd = false;
        return;
    }

    warning.addClass("hide");
    USR.isValidPwd = true;
});

// 회원가입-비밀번호 확인
$("#usrIpSiPwdCfm").on("propertychange change paste input blur", function() {
    let pass1 = $("#usrIpSiPwd").val().trim();
    let pass2 = $("#usrIpSiPwdCfm").val().trim();
    let warning = $('.user-pwcheck').next('li').find('.sign-warning');

    if (pass2.length === 0) {
        warning.html('<i></i>비밀번호 확인는 필수입력 정보입니다.');
        warning.removeClass("hide");
        USR.isValidPwd = false;
        return;
    }

    if (pass1 === pass2) {
        warning.addClass("hide");
        USR.isValidPwd = true;
    } else {
        warning.html('<i></i>비밀번호가 일치하지 않습니다.');
        warning.removeClass("hide");
        USR.isValidPwd = false;
    }
});

$('#usrBtSiup').click(function () {
	USR.insertUsrInfo();
});

$('#usrIpErrBtn').click(function () {
	$(".signErr").removeClass("active");
});

// 사용자정보-초기화
$('#cmmLiUsrInfo, .signInformation .close-BL').click(function () {
	$("#usrIpEmlInfo").attr("readonly", true);
	$("#usrIpEmlInfo").attr("disabled", true);
	$('#usrIpPwdInfo').val("");
	$("#usrBtEmlChg").show();
	$("#usrBtEmlSend").hide();
	$("#usrBtEmlCancel").hide();
	$("#usrLiChkEmlInfo").hide();
	$("#usrBtPwdChg").show();
	$(".usrLiPwdChg").hide();
	$("#usrBtPwdChgCancel").hide();
	$("#usrDiInfoNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 회원정보를 수정하려면 비밀번호를 입력해주세요.');
	$("#usrDiInfoNtc").css("color", "var(--c-R1)");
	USR.isValidEml = true;
	USR.isValidTelno = true;
	USR.checkNum = false;
	USR.isValidPwd = false;
	USR.code = null;
	USR.selectUsrInfo();
});

// 사용자정보-이메일 변경 버튼
$('#usrBtEmlChg').click(function () {
	$("#usrIpEmlInfo").attr("readonly", false);
	$("#usrIpEmlInfo").attr("disabled", false);
	$("#usrBtEmlChg").hide();
	$("#usrBtEmlSend").show();
	$("#usrBtEmlCancel").show();
	$("#usrLiChkEmlInfo").show();
	USR.chgEmlFlag = true;
	
	$("#usrDiInfoNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 변경할 이메일을 인증해주세요.');
	$("#usrDiInfoNtc").css("color", "var(--c-R1)");
});

// 사용자정보-이메일 변경취소 버튼
$('#usrBtEmlCancel').click(function () {
	clearInterval(USR.checkItv);
	$('#usrIpChkEmlInfo').val("");
	$("#usrChkMinInfo").text("3");
	$("#usrChkSecInfo").text("00");
	$("#usrBtEmlSend").attr('disabled',false);
	$("#usrBtCmpChkInfo").attr('disabled',false);
	$("#usrIpChkEmlInfo").attr('disabled',false);
	$("#usrIpEmlInfo").attr("readonly", true);
	$("#usrIpEmlInfo").attr("disabled", true);
	$("#usrIpEmlInfo").val(USR.eml);
	$("#usrBtEmlChg").show();
	$("#usrBtEmlSend").hide();
	$("#usrBtEmlCancel").hide();
	$("#usrLiChkEmlInfo").hide();
	USR.code = null;
	USR.chgEmlFlag = false;
});

// 사용자정보-비밀번호 변경 버튼
$('#usrBtPwdChg').click(function () {
	$("#usrBtPwdChg").hide();
	$(".usrLiPwdChg").show();
	$("#usrBtPwdChgCancel").show();
	USR.chgPwdFlag = true;
	
	$("#usrDiInfoNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 변경할 비밀번호를 입력해주세요.');
	$("#usrDiInfoNtc").css("color", "var(--c-R1)");
});

// 사용자정보-비밀번호 변경취소 버튼
$('#usrBtPwdChgCancel').click(function () {
	$("#usrIpPwdChg").val("");
	$("#usrIpPwdChgCfm").val("");
	$("#usrBtPwdChg").show();
	$(".usrLiPwdChg").hide();
	$("#usrBtPwdChgCancel").hide();
	USR.chgPwdFlag = false;
});

// 사용자정보-이메일
$('#usrIpEmlInfo').on("propertychange change paste input", function () {
	let eml = $("#usrIpEmlInfo").val();
	var regExp = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9_\.\-]+\.[A-Za-z0-9_\.\-]+$/;
	if (eml != "") {
		if (!regExp.test(eml)) {
			$("#usrDiInfoNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 이메일 주소가 올바르지 않습니다.');
			$("#usrDiInfoNtc").css("color", "var(--c-R1)");
			USR.isValidEml = false;
			return;
		}
	} else {
		$("#usrDiInfoNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 이메일 주소를 입력해주세요.');
		$("#usrDiInfoNtc").css("color", "var(--c-R1)");
		USR.isValidEml = false;
	}
	$.ajax({
		url : './usr/selectEml.do',
		type : "POST",
		data : {"eml" : eml},
		dataType : 'json',
		success : function(result){
			if (result.rs == 0) {
				$("#usrDiInfoNtc").html('<i class="ico sub-ico tabproc-LB-ico"></i> 사용 가능한 이메일 주소입니다.');
				$("#usrDiInfoNtc").css("color", "var(--c-LB7)");
				USR.isValidEml = true;
				return;
			} else {
				$("#usrDiInfoNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 사용중인 이메일 주소입니다.');
				$("#usrDiInfoNtc").css("color", "var(--c-R1)");
				USR.isValidEml = false;
				return;
			}
		}
	});
});

// 사용자정보-인증번호발송
$("#usrBtEmlSend").click(function() {
	var eml = $("#usrIpEmlInfo").val();
	if(eml == USR.eml) {
		CMM.alert('현재 사용중인 이메일입니다.','warning');
		return;
	}
	if (USR.isValidEml === true) {
		$('.signInformation .loading').addClass('active');
		
		$.ajax({
			url : './usr/checkMail.do',
			type : 'POST',
			data : {"eml" : eml},
			dataType : 'json',
			success : function (result) {
				USR.code = result.rs;
				$('.signInformation .loading').removeClass('active');
				if(USR.code == null){
					CMM.alert('인증번호가 동일한 이메일 주소로 3회 이상 발송되었습니다. 입력하신 이메일 주소를 확인 후 5분 뒤에 다시 시도해 주시기 바랍니다.', 'warning');
				} else {
					clearInterval(USR.checkItv);
					$("#usrChkMinInfo").text("3");
					$("#usrChkSecInfo").text("00");
					$("#usrBtEmlSend").text("Resend");
					USR.startLimitTimeInfo();
					CMM.alert('인증번호가 전송되었습니다.','info');
				}
			}			
		});
	} else {
		CMM.alert('이메일을 확인해주세요.', 'warning');
		return;
	}
});

// 사용자정보-인증확인
$("#usrBtCmpChkInfo").on("click", function(){
	var inputCode = $("#usrIpChkEmlInfo").val();
	
	if(inputCode != "") {
		if(inputCode === USR.code){
			$("#usrDiInfoNtc").html('<i class="ico sub-ico tabproc-LB-ico"></i> 인증에 성공하였습니다.');
			$("#usrDiInfoNtc").css("color", "var(--c-LB7)");
			CMM.alert('인증번호가 일치합니다.','info');
			$("#usrBtEmlSend").attr('disabled',true);
			$("#usrBtCmpChkInfo").attr('disabled',true);
			$("#usrIpEmlInfo").attr('disabled',true);
			$("#usrIpChkEmlInfo").attr('disabled',true);
			USR.checkNum = true;
			clearInterval(USR.checkItv);
		} else {
			$("#usrDiInfoNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 인증번호를 다시 입력해주세요.');
			$("#usrDiInfoNtc").css("color", "var(--c-R1)");
			CMM.alert('인증번호가 불일치합니다.','warning');
			USR.checkNum = false;
		}
	} else {
		$("#usrDiInfoNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 인증번호를 입력해 주세요.');
		$("#usrDiInfoNtc").css("color", "var(--c-R1)");
		USR.checkNum = false;
	}
});

// 사용자정보-현재 비밀번호
$("#usrIpPwdInfo").on("propertychange change paste input", function(){
	let pass = $("#usrIpPwdInfo").val();
	if(pass == "") {
		$("#usrDiInfoNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 현재 비밀번호를 입력해주세요.');
		$("#usrDiInfoNtc").css("color", "var(--c-R1)");
	}
});

// 사용자정보-비밀번호 변경
$("#usrIpPwdChg").on("propertychange change paste input", function(){
	let pass = $("#usrIpPwdChg").val();
	let regExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/
	if (pass != "") {
		if (!regExp.test(pass)) {
			$("#usrDiInfoNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 비밀번호는 영문,숫자,특수기호를 포함한 8~15자입니다.');
			$("#usrDiInfoNtc").css("color", "var(--c-R1)");
			USR.isValidPwd = false;
			return;
		} else {
			USR.isValidPwd = true;
		}
	} 
});
// 사용자정보-비밀번호 변경
$("#usrIpPwdChg").on("propertychange change paste input", function(){
	let pass1 = $("#usrIpPwdChg").val();
	let pass2 = $("#usrIpPwdChgCfm").val();
	let regExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/
	if (pass1 != "") {
		if (!regExp.test(pass1)) {
			$("#usrDiInfoNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 비밀번호는 영문,숫자,특수기호를 포함한 8~15자입니다.');
			$("#usrDiInfoNtc").css("color", "var(--c-R1)");
			USR.isValidPwd = false;
			return;
		} else {
			$("#usrDiInfoNtc").html('<i class="ico sub-ico tabproc-LB-ico"></i> 사용 가능한 비밀번호 입니다.');
			$("#usrDiInfoNtc").css("color", "var(--c-LB7)");
		}
	} else {
		$("#usrDiInfoNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 비밀번호를 입력해 주세요.');
		$("#usrDiInfoNtc").css("color", "var(--c-R1)");
		USR.isValidPwd = false;
		return;
	}
	if (pass1 == pass2) {
		$("#usrDiInfoNtc").html('<i class="ico sub-ico tabproc-LB-ico"></i> 비밀번호가 일치합니다.');
		$("#usrDiInfoNtc").css("color", "var(--c-LB7)");
		USR.isValidPwd = true;
	} else {
		if(pass2 != ""){
			$("#usrDiInfoNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 비밀번호가 다릅니다.');
			$("#usrDiInfoNtc").css("color", "var(--c-R1)");
		}
		USR.isValidPwd = false;
	}
});

// 사용자정보-비밀번호 변경 확인
$("#usrIpPwdChgCfm").on("propertychange change paste input", function(){
	let pass1 = $("#usrIpPwdChg").val();
	let pass2 = $("#usrIpPwdChgCfm").val();
	let regExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
	if (pass1 != "") {
		if (!regExp.test(pass1)) {
			$("#usrDiInfoNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 비밀번호는 영문,숫자,특수기호를 포함한 8~15자입니다.');
			$("#usrDiInfoNtc").css("color", "var(--c-R1)");
			USR.isValidPwd = false;
			return;
		}
	} else {
		$("#usrDiInfoNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 비밀번호를 입력해 주세요.');
		$("#usrDiInfoNtc").css("color", "var(--c-R1)");
		USR.isValidPwd = false;
		return;
	}
	if (pass1 == pass2) {
		$("#usrDiInfoNtc").html('<i class="ico sub-ico tabproc-LB-ico"></i> 비밀번호가 일치합니다.');
		$("#usrDiInfoNtc").css("color", "var(--c-LB7)");
	    USR.isValidPwd = true;
	} else {
		if(pass2 != ""){
			$("#usrDiInfoNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 비밀번호가 다릅니다.');
			$("#usrDiInfoNtc").css("color", "var(--c-R1)");
			USR.isValidPwd = false;
			return;
		} else {
			$("#usrDiInfoNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 비밀번호 확인을 입력해 주세요.');
			$("#usrDiInfoNtc").css("color", "var(--c-R1)");
		}
	    USR.isValidPwd = false;
	}
});

// 사용자정보-전화번호
$("#usrIpTelInfo").on("propertychange change paste input", function(){
	let telno = $("#usrIpTelInfo").val();
	var regExp = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;
	if (!regExp.test(telno)) {
		$("#usrDiInfoNtc").html('<i class="ico sub-ico noti-rd-ico"></i> (-)를 제외한 올바른 전화번호 11자리를 입력해 주세요.');
		$("#usrDiInfoNtc").css("color", "var(--c-R1)");
	    USR.isValidTelno = false;
	    return;
	} else {
		$("#usrDiInfoNtc").html('<i class="ico sub-ico tabproc-LB-ico"></i> 올바른 전화번호입니다.');
		$("#usrDiInfoNtc").css("color", "var(--c-LB7)");
	    USR.isValidTelno = true;
	}
});

// 사용자정보-수정
$('#usrBtUpInfo').click(function () {
	USR.updateUsrInfo();
});

// 사용자정보-삭제
$('#usrBtDtInfo').click(function () {
	CMM.alert('회원정보를 삭제하시겠습니까?','delete',USR.deleteUsrInfo);
});

// 아이디 찾기
$("#usrIpFiidEml, #usrIpFiidFn, #usrIpFiidLn").on("propertychange change paste input blur", function(){
    if($("#usrIpFiidFn").val() != "" && $("#usrIpFiidLn").val() != "" && $("#usrIpFiidEml").val() != "" && USR.isValidEml === true) {
        $("#usrDiFiidNtc").html('<i class="ico sub-ico tabproc-LB-ico"></i> Submit버튼을 클릭해주세요.');
        $("#usrDiFiidNtc").css("color", "var(--c-LB7)");
    } else if($("#usrIpFiidFn").val() != "" && $("#usrIpFiidLn").val() != "" && $("#usrIpFiidEml").val() != "" && USR.isValidEml === false) {
    	$("#usrDiFiidNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 이메일 주소가 올바르지 않습니다.');
    	$("#usrDiFiidNtc").css("color", "var(--c-R1)");
    } else if($("#usrIpFiidFn").val() == "" || $("#usrIpFiidLn").val() == "") {
    	$("#usrDiFiidNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 필수항목을 입력해주세요.');
		$("#usrDiFiidNtc").css("color", "var(--c-R1)");
    }
});

// 비밀번호 찾기
$("#usrIpFipwEml, #usrIpFipwId, #usrIpFipwFn, #usrIpFipwLn").on("propertychange change paste input blur", function(){
    if($("#usrIpFipwId").val() != "" && $("#usrIpFipwFn").val() != "" && $("#usrIpFipwLn").val() != "" && $("#usrIpFipwEml").val() != "" && USR.isValidEml === true) {
        $("#usrDiFipwNtc").html('<i class="ico sub-ico tabproc-LB-ico"></i> Submit버튼을 클릭해주세요.');
        $("#usrDiFipwNtc").css("color", "var(--c-LB7)");
    } else if($("#usrIpFipwId").val() != "" && $("#usrIpFipwFn").val() != "" && $("#usrIpFipwLn").val() != "" && $("#usrIpFipwEml").val() != "" && USR.isValidEml === false) {
        $("#usrDiFipwNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 이메일 주소가 올바르지 않습니다.');
        $("#usrDiFipwNtc").css("color", "var(--c-R1)");
    } else if($("#usrIpFipwId").val() == "" || $("#usrIpFipwFn").val() == "" || $("#usrIpFipwLn").val() == "") {
    	$("#usrDiFipwNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 필수항목을 입력해주세요.');
		$("#usrDiFipwNtc").css("color", "var(--c-R1)");
    }
});

// 회원가입
$("#usrIpSiId, #usrIpSiFn, #usrIpSiLn, #usrIpSiEml, #usrIpSiChkEml, #usrIpSiTelno #usrIpSiPwd, #usrIpSiPwdCfm, #usrIpSiInst, #usrIpSiDept, #usrCkInfoAgr").on("propertychange change paste input blur", function(){
    if($("#usrIpSiFn").val() != "" && $("#usrIpSiLn").val() != "" && $("#usrIpSiInst").val() != "" && $("#usrIpSiDept").val() != "" && $("#usrCkInfoAgr").is(":checked") && $("#usrIpSiPwd").val() == $("#usrIpSiPwdCfm").val() && USR.isValidUsrId === true && USR.isValidEml === true && USR.checkNum === true && USR.isValidTelno === true && USR.isValidPwd === true) {
        $("#usrDiNtc").html('<i class="ico sub-ico tabproc-LB-ico"></i> Create Account버튼을 클릭해주세요.');
        $("#usrDiNtc").css("color", "var(--c-LB7)");
        USR.finalCheck = true;
        return;
    }
    if(USR.finalCheck === true) {
    	if($("#usrIpSiFn").val() == "" || $("#usrIpSiLn").val() == "" || $("#usrIpSiInst").val() == "" || $("#usrIpSiDept").val() == "" || !$("#usrCkInfoAgr").is(":checked")) {
    		$("#usrDiNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 필수항목을 입력해주세요.');
    		$("#usrDiNtc").css("color", "var(--c-R1)");
    		USR.finalCheck = false;
    		return;
    	}
    }
});

// 사용자정보 수정
$("#usrIpEmlInfo, #usrIpPwdInfo, #usrIpPwdChg, #usrIpPwdChgCfm, #usrIpTelInfo, #usrIpInstInfo, #usrIpDeptInfo").on("propertychange change paste input blur", function(){
    if(USR.chgEmlFlag === true && USR.chgPwdFlag === false && $("#usrIpPwdInfo").val() != "" && USR.isValidEml === true && USR.checkNum === true && USR.isValidTelno === true) {
        $("#usrDiInfoNtc").html('<i class="ico sub-ico tabproc-LB-ico"></i> Save버튼을 클릭해주세요.');
        $("#usrDiInfoNtc").css("color", "var(--c-LB7)");
        USR.finalCheck = true;
        return;
    }
    if(USR.chgPwdFlag === true && USR.chgEmlFlag === false && $("#usrIpPwdInfo").val() != "" && $("#usrIpPwdChg").val() != "" && $("#usrIpPwdChgCfm").val() != "" && USR.isValidPwd === true && USR.isValidTelno === true) {
        $("#usrDiInfoNtc").html('<i class="ico sub-ico tabproc-LB-ico"></i> Save버튼을 클릭해주세요.');
        $("#usrDiInfoNtc").css("color", "var(--c-LB7)");
        USR.finalCheck = true;
        return;
    }
    if(USR.chgPwdFlag === true && USR.chgEmlFlag === true && $("#usrIpPwdInfo").val() != "" && $("#usrIpPwdChg").val() != "" && $("#usrIpPwdChgCfm").val() != "" && USR.isValidEml === true && USR.checkNum === true && USR.isValidPwd === true && USR.isValidTelno === true) {
        $("#usrDiInfoNtc").html('<i class="ico sub-ico tabproc-LB-ico"></i> Save버튼을 클릭해주세요.');
        $("#usrDiInfoNtc").css("color", "var(--c-LB7)");
        USR.finalCheck = true;
        return;
    }
    if(USR.chgPwdFlag === false && USR.chgEmlFlag === false && $("#usrIpPwdInfo").val() != "" && USR.isValidTelno === true) {
        $("#usrDiInfoNtc").html('<i class="ico sub-ico tabproc-LB-ico"></i> Save버튼을 클릭해주세요.');
        $("#usrDiInfoNtc").css("color", "var(--c-LB7)");
        USR.finalCheck = true;
        return;
    }
    if(USR.finalCheck === true) {
    	let pass = $("#usrIpPwdInfo").val();
    	if(pass == "") {
    		$("#usrDiInfoNtc").html('<i class="ico sub-ico noti-rd-ico"></i> 현재 비밀번호를 입력해주세요.');
    		$("#usrDiInfoNtc").css("color", "var(--c-R1)");
    	}
    }
});
