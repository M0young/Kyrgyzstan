<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!-- alert type6 -->
<div class="popup-alert warn-art">
    <button class="icon sz20px Popclose-Btn"><i class="glb-ico sz20px icobg20 close-bk"></i>close</button>
    <div>
        <p>Warning!</p>
        <small>There were some minor errors!</small>
    </div>
    <div class="btn-Box">
        <button class="confirm-Btn">Confirm</button>
    </div> 
</div>
<div class="popup-alert delete-art">
    <button class="icon sz20px Popclose-Btn"><i class="glb-ico sz20px icobg20 close-bk"></i>close</button>
    <div>
        <p>Delete!</p>
        <small>Process fails due to a critical error!</small>
    </div>
    <div class="btn-Box">
        <button class="cancel-Btn">Cancel</button>
        <button class="confirm-Btn">Confirm</button>
    </div>        
</div>
<div class="popup-alert confirm-art">
    <button class="icon sz20px Popclose-Btn"><i class="glb-ico sz20px icobg20 close-bk"></i>close</button>
    <div>
        <p>Confirm</p>
        <small>Are you sure you want to delete your account?!
            This action cannot be undone and you will be
            unableto recover any data.
        </small>
    </div>
    <div class="btn-Box">
        <button class="cancel-Btn">Cancel</button>
        <button class="confirm-Btn">Confirm</button>
    </div>        
</div>
<div class="popup-alert caution-art">
    <button class="icon sz20px Popclose-Btn"><i class="glb-ico sz20px icobg20 close-bk"></i>close</button>
    <div>
        <p>Are you sure?</p>
        <small>Are you sure you want to delete your account?!
            This action cannot be undone and you will be
            unableto recover any data.
        </small>
    </div>
    <div class="btn-Box">
        <button class="cancel-Btn">Cancel</button>
        <button class="confirm-Btn">Confirm</button>
    </div>        
</div>
<div class="popup-alert inform-art">
    <button class="icon sz20px Popclose-Btn"><i class="glb-ico sz20px icobg20 close-bk"></i>close</button>
    <div>
        <p>Tip!</p>
        <small>Process fails due to a critical error!</small>
    </div>
    <div class="btn-Box">
        <button class="confirm-Btn">Confirm</button>
    </div>        
</div>
<div class="popup-alert timer-art">
    <button class="icon sz20px Popclose-Btn"><i class="glb-ico sz20px icobg20 close-bk"></i>close</button>
    <div>
        <img src="./Images/timer-ico.gif" alt="timer-icon">
        <p>자동 로그아웃 안내<em id="eg-remainTime">60</em></p>
        <small>회원님의 보안을 위해 로그인 후 약 60분 동안 서비스 이용이 없어 로그아웃 됩니다.
            로그인 시간을 연장하시겠습니까?</small>
    </div>
    <div class="btn-Box">
        <button class="cancel-Btn" onclick="USR.TIMEOUT.onClickTimeExtension()">Extend</button>
        <button class="confirm-Btn" onclick="JavaScript:USR.logout();">Logout</button>
    </div> 
</div>