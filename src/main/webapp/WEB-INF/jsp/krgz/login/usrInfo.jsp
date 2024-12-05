<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<div class="popup sign-box user-information">
    <button type="button" class="sign-close">Close</button>
    <h1 class="sign-title">User Information</h1>
    <form class="userInfo-con">
        <ol>
            <!-- user ID -->
            <li class="usID-fld">
                <label class="tit-lbel">ID</label>
                <div class="wrap-iput"><input type="text" id="usrIpIdInfo" value="${usrInfo.sessUsrId}" readonly disabled></div>
            </li>
            <!-- user Name -->
            <li class="name-fld">
                <label class="tit-lbel">User Name<span class="po"></span></label>
                <div class="wrap-iput"><input type="text" id="usrIpNmInfo" value="${usrInfo.sessUsrNm}" readonly disabled></div>
            </li>
            <!-- user Auth -->
            <li class="name-fld">
                <label class="tit-lbel">Authority<span class="po"></span></label>
                <div class="wrap-iput"><input type="text" id="usrIpGrpInfo" value="${usrInfo.sessGrpNm}" readonly disabled></div>
            </li>
            <!-- user Email -->                    
            <li class="email-fld">
                <label class="tit-lbel">User Email<span class="po"></span></label>
                <div class="wrap-iput"><input type="email" id="usrIpEmlInfo" value="${usrInfo.sessEml}" name="eml" placeholder="Email" autocomplete="email" readonly disabled></div>
                <button class="chg-Btn" type="button">Change Email</button>
                <!-- display none 상태 버튼 -->
                <button class="Cancel-Btn" type="button">Cancel</button>
                <button class="Send-Btn" type="button">Send</button>
            </li>
            <!-- Email Numb check : display none -->
            <li class="Authentication-Box" style="display: none;">
                <div class="Authentication-Box-tit">
                    <label>Authentication<span class="po"></span>
                    </label>                        
                    <mark class="time-Box">
                        <small id="">3</small>:<small id="">00</small>
                    </mark>
                </div>
                <div class="Num-iputBox">
                    <input type="text" id="" name="" placeholder="Authentication Number">
                    <button type="button" id="">Verify</button>
                </div>
            </li>
            <!-- warning msg attr hide-->
            <li>
                <p class="sign-warning hide"><i></i>Please re-enter it.</p>
            </li>
            <!-- current password -->
            <li class="user-pw">
                <label class="tit-lbel">Current Password<span class="po"></span></label>
                <div class="wrap-iput"><input type="password" maxlength="15" autocomplete="current-password"></div>
                <button class="Change-Btn" type="button">Change Password</button>
                <button class="Cancel-Btn" type="button">Cancel</button>
            </li>
            <!-- Password check : display none -->
            <li class="Authentication-Box chag-psw" style="display: none;">
                <div class="Authentication-Box-tit">
                    <label>New Password<span class="po"></span></label>
                </div>
                <div class="Num-iputBox">
                    <input type="text" id="" name="" placeholder="New Password">
                    <input type="text" id="" name="" placeholder="New Password to check">
                </div>
                
            </li>
            <!-- user phone -->
            <li class="user-phone">
                <label class="tit-lbel">Phone<span class="po"></span></label>
                <div class="wrap-iput"><input type="text" value="${usrInfo.sessTelno}" placeholder="Phone" maxlength="11" autocomplete="tel"></div>
            </li>
            <!-- warning msg attr hide-->                    
            <li>
                <p class="sign-warning hide"><i></i>Please re-enter it.</p>
            </li>
            <!-- user institution -->
            <li class="user-instit">
                <label class="tit-lbel">Institution<span class="po"></span></label>
                <select>
                    <option value="">select</option>
                    <option value="EGIS" ${usrInfo.sessInst == 'EGIS' ? 'selected' : ''}>EGIS</option>
   					<option value="NEWLAYER" ${usrInfo.sessInst == 'NEWLAYER' ? 'selected' : ''}>NEWLAYER</option>
                </select>
            </li>
            <!-- warning msg attr hide-->
            <li>
                <p class="sign-warning hide"><i></i>Please re-enter it.</p>
            </li>
            <!-- user department -->
            <li class="user-departm">
                <label class="tit-lbel">Department<span class="po"></span></label>
                <select>
                    <option value="">select</option>
                    <option value="Solution" ${usrInfo.sessDept == 'Solution' ? 'selected' : ''}>Solution</option>
   					<option value="DMAP" ${usrInfo.sessDept == 'DMAP' ? 'selected' : ''}>DMAP</option>
                </select>
            </li>
            <!-- warning msg attr hide-->
            <li>
                <p class="sign-warning hide"><i></i>Please re-enter it.</p>
            </li>
        </ol>                
    </form>
    <div class="description-area d-fl fl-c">
        <div class="btn-Box">
            <button class="save-Btn">Save</button>
            <button class="Withdrawal-btn">Membership Withdrawal</button>
        </div>
    </div>
</div>