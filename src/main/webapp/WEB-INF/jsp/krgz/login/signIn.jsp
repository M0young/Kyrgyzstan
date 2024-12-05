<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!-- Signin popup -->
<div class="popup sign-box signIn-pop">
    <button type="button" class="sign-close">Close</button>
    <h1 class="sign-title">Sign in</h1>
    <form class="signIn-con">
        <div class="sign-id d-fl">
            <label for="id" class="sign-label d-fl">User name<span>*</span></label>
            <div class="input-i-area">
                <input type="text" id="usrIpId" class="sign-input">
                <i class="input-icon input-i-id"><span></span></i>
            </div>
            <p class="sign-warning d-fl hide"><i></i>Please re-enter it.</p>
        </div>
        <div class="signIn-btw d-fl">
            <label for="password" class="sign-label d-fl">password<span>*</span></label>
            <div class="input-i-area">
                <input type="password" id="usrIpPwd" class="sign-input">
                <i class="input-icon input-i-pass"><span></span></i>
            </div>
            <p class="sign-warning d-fl hide"><i></i>Please re-enter it.</p>
        </div>                
        <div class="login-btn-area">
            <div class="w-60 fl-c">
                <input type="button" class="login-btn" id="usrBtSiin" value="Login">
                <div class="fl-btw d-fl ">
                    <div class="d-fl check-re">
                        <div class="checkCustomdkrd15">
                            <input type="checkbox" id="usrCkCookie">
                            <span class="checked-sts"></span>
                        </div>
                        <p>REMEMBER ME</p>
                    </div>
                    <div class="forgot">Forgot<span>ID/PW?!</span></div>
                </div>
            </div>
        </div>
    </form>
    <div class="login-bt d-fl">
        <p>Don't have an Account?!</p>
        <p class="register-i"><span></span>Register Now!</p>
    </div>
</div>