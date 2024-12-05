<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!-- Signup popup -->
<div class="popup sign-box signUp-pop">
	<div class="loading">
        <img src="./Images/loading-bar-ico.svg" alt="loading">
        <span>Loading</span>
    </div>
    <button type="button" class="sign-close">Close</button>
    <h1 class="sign-title">Sign up</h1>
    <form class="signOut-con">
        <ol>
            <!-- user ID -->
            <li class="usID-fld">
                <label class="tit-lbel">ID<span class="po"></span></label>
                <div class="wrap-iput"><input type="text" id="usrIpSiId" name="usrId" placeholder="ID" maxlength="12" required></div>
            </li>
            <li>
                <p class="sign-warning hide"><i></i>Please re-enter it.</p>
            </li>
            <!-- user Name -->
            <li class="name-fld">
                <label class="tit-lbel">User Name<span class="po"></span></label>
                <div class="wrap-iput"><input type="text" id="usrIpSiFn" name="usrFn" placeholder="First Name" required></div>
                <div class="wrap-iput"><input type="text" id="usrIpSiLn" name="usrLn" placeholder="Last Name" required></div>
            </li>
            <li>
                <p class="sign-warning hide"><i></i>Please re-enter it.</p>
            </li>
            <!-- user Email -->                    
            <li class="email-fld">
                <label class="tit-lbel">User Email<span class="po"></span></label>
                <div class="wrap-iput"><input type="email" id="usrIpSiEml" name="eml" placeholder="Email" autocomplete="email"></div>
                <button type="button" id="usrBtChkEml">Send</button>
            </li>
            <li>
                <p class="sign-warning hide"><i></i>Please re-enter it.</p>
            </li>
            <!-- Email Numb check : display none -->
            <li class="Authentication-Box" style="display: none;">
                <div class="Authentication-Box-tit">
                    <label>Authentication<span class="po"></span>
                    </label>                        
                    <mark class="time-Box">
                        <small id="usrSpChkMin">3</small>:<small id="usrSpChkSec">00</small>
                    </mark>
                </div>
                <div class="Num-iputBox">
                    <input type="text" id="usrIpSiChkEml" name="chkEml" placeholder="Authentication Number">
                    <button type="button" id="usrBtCmpChk">Verify</button>
                </div>
            </li>
            <li>
                <p class="sign-warning"><i></i>Please re-enter it.</p>
            </li>
            <!-- user phone -->
            <li class="user-phone">
                <label class="tit-lbel">Phone<span class="po"></span></label>
                <div class="wrap-iput"><input type="text" id="usrIpSiTelno" name="telno" placeholder="Phone" maxlength="11" autocomplete="tel"></div>
            </li>
            <!-- warning msg attr hide-->
            <li>
                <p class="sign-warning hide"><i></i>Please re-enter it.</p>
            </li>
            <!-- user password -->
            <li class="user-pw">
                <label class="tit-lbel">Password<span class="po"></span></label>
                <div class="wrap-iput"><input type="password" id="usrIpSiPwd" name="pwd" placeholder="Password" maxlength="15" autocomplete="new-password"></div>
            </li>
            <!-- warning msg attr hide-->                    
            <li>
                <p class="sign-warning hide"><i></i>Please re-enter it.</p>
            </li>
            <!-- user password check -->
            <li class="user-pwcheck">
                <label class="tit-lbel">Password to check<span class="po"></span></label>
                <div class="wrap-iput"><input type="password" id="usrIpSiPwdCfm" name="pwdCfm" placeholder="Password" maxlength="15" autocomplete="new-password"></div>
            </li>
            <!-- warning msg attr hide-->
            <li>
                <p class="sign-warning hide"><i></i>Please re-enter it.</p>
            </li>
            <!-- user institution -->
            <li class="user-instit">
                <label class="tit-lbel">Institution<span class="po"></span></label>
                <select id="usrIpSiInst" name="inst">
                    <option value="">select</option>
                    <option value="EGIS">EGIS</option>
                    <option value="NEWLAYER">NEWLAYER</option>
                </select>
            </li>
            <!-- warning msg attr hide-->
            <li>
                <p class="sign-warning hide"><i></i>Please re-enter it.</p>
            </li>
            <!-- user department -->
            <li class="user-departm">
                <label class="tit-lbel">Department<span class="po"></span></label>
                <select id="usrIpSiDept" name="dept">
                    <option value="">select</option>
                    <option value="Solution">Solution</option>
                    <option value="DMAP">DMAP</option>
                </select>
            </li>
            <!-- warning msg attr hide-->
            <li>
                <p class="sign-warning hide"><i></i>Please re-enter it.</p>
            </li>
        </ol>                
    </form>
    <div class="description-area d-fl fl-c">
        <div class="sign-textarea d-fl">
            <div class="checkCustomdkrd15">
                <input type="checkbox" id="usrCkInfoAgr" name="infoAgr">
                <span class="checked-sts"></span>
            </div>
            <div class="check-textarea">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ligula sapien, rutrum sed vestibulum eget, rhoncus ac erat. Aliquam erat volutpat. Sed convallis scelerisque enim at fermentum. Aliquam consectetur, est ac auctor iaculis, odio mi bibendum leo, in congue neque velit vel enim. Nullam vitae justo at mauris sodales feugiat. Praesent pellentesque ipsum eget tellus imperdiet ultrices. Sed ultricies nisi nec diam sodales fringilla. Quisque adipiscing cursus porta. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam bibendum scelerisque elit, eu pharetra dui pulvinar eget. Nam mollis mauris id tellus ultricies at porttitor neque vulputate. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
            </div>
        </div>
        <div class="w-60 ma-t30">
            <button class="signUp-btn" id="usrBtSiup" value=" Create Account">Creating an Account</button>
        </div>
    </div>
</div>