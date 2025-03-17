<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<!DOCTYPE html>
<html lang="en">
<%@ include file="/WEB-INF/pages/common/layout/main-head.jsp"%>
<body class="d-flex flex-column">
    <script src="${path}/resources/js/common/tabler/demo-theme.min.js"></script>
	<div class="page page-center">
		<%@ include file="/WEB-INF/pages/common/layout/main-body.jsp"%>
		<div class="container container-tight py-4 mt-auto">
			<div class="text-center mb-4">
				<a href="${path}/" class="navbar-brand navbar-brand-autodark">
					<svg xmlns="http://www.w3.org/2000/svg" width="110" height="32" version="1.1" viewBox="0 0 110 32" class="navbar-brand-image"><path d="M12.7,1.1h-.2C1,2.1-.4,13.2,1.7,22.6c1.8,6.3,8.2,8.9,14.3,8.4,6.8.5,13.5-2.7,14.7-9.9C32.6,6.9,27.7-.3,12.7,1.1ZM15.4,22.8c0,.2-.2.3-.4.2l-5.2-2.8s0-.1,0-.2v-6c0-.2.2-.3.4-.2l5.2,2.8s.1.1.1.2v6ZM15.9,15.3l-5.5-2.9c-.2,0-.2-.3,0-.4l5.5-2.9h.2l5.5,2.9c.2,0,.2.3,0,.4l-5.5,2.9h-.2ZM22.3,19.9s0,.2,0,.2l-5.2,2.8c-.2,0-.4,0-.4-.2v-6s0-.2.1-.2l5.2-2.8c.2,0,.4,0,.4.2v6Z" fill="#066fd1" style="fill: var(--tblr-primary, #066fd1)"></path><path d="M53.1,21l-4.1-5.4,4-3.8c.2-.2.3-.5.3-.7s0-.5-.3-.7c-.2-.2-.4-.3-.7-.3s-.6.1-.9.4l-5.9,5.8v-5c0-.3,0-.6-.3-.8s-.5-.3-.8-.3-.6,0-.8.3c-.2.2-.3.5-.3.8v10.6c0,.3.1.6.3.8.2.2.5.3.8.3s.6,0,.8-.3.3-.5.3-.8v-2.9l1.7-1.7,4,5.3c0,.1.3.3.4.3.2,0,.1,0,.5,0s.6,0,.9-.3.4-.5.4-.8v-.4h-.1c0-.3-.2-.5-.2-.5Z" fill-rule="evenodd" clip-rule="evenodd" fill="#4a4a4a"></path><path d="M62.9,13.3c-.2-.2-.5-.3-.8-.3s-.6,0-.8.3-.3.5-.3.8v4.7c0,.7,0,1.2-.5,1.6-.4.4-.8.6-1.5.6s-1.2,0-1.5-.5-.5-.9-.5-1.7v-4.7c0-.3,0-.6-.3-.8s-.5-.3-.8-.3-.6,0-.8.3c-.2.2-.3.5-.3.8v5.4c0,.7.1,1.3.4,1.8.2.6.6,1,1.1,1.3.5.3.3.5,1.7.5s2.4-.4,3-1.2v.2c0,.9-.2,1.5-.6,1.9-.4.4-1,.6-1.9.6h-.7c-.3,0-.5-.2-.7-.2-.3-.2-.5-.2-.5-.2h-.3c-.2,0-.4,0-.6.2-.2,0-.4.3-.4.6h0v.3c0,.5.3.8.9,1.1.3,0,.6.2,1.1.3.5,0,0,0,1.3,0s2.5-.4,3.4-1.1,1.3-1.9,1.3-3.5v-7.8c0-.3,0-.6-.3-.8v-.3Z" fill-rule="evenodd" clip-rule="evenodd" fill="#4a4a4a"></path><path d="M71.7,13.4h0c-.2-.1-.3-.2-.9-.2s-1.2,0-1.7.4c-.5.3-.9.7-1.2,1.2v-.2c0-.3,0-.6-.3-.8s-.5-.3-.8-.3-.6,0-.8.3-.3.5-.3.8v7.6c0,.3.1.6.3.8.2.2.5.3.8.3s.6,0,.8-.3.3-.5.3-.8v-4.4c0-.5.1-1,.3-1.4.2-.4.4-.7.7-.9.3-.3.6-.3.9-.3h.6c.2,0,.3,0,.6,0s.5,0,.7-.3c.3-.2.3-.7.3-.9s0-.5-.4-.7Z" fill-rule="evenodd" clip-rule="evenodd" fill="#4a4a4a"></path><path d="M84.1,16.6c-.2-.2-.5-.3-.8-.3h-3c-.3,0-.6.1-.8.3-.2.2-.3.5-.3.8s0,.6.3.8.5.3.8.3h1.7v2.4c-.3,0-.6.2-1,.2h-1.1c-.8,0-1.5-.2-2.2-.6s-1.2-.9-1.6-1.6c-.4-.7-.6-1.4-.6-2.2s.2-1.5.6-2.2c.4-.7.9-1.2,1.6-1.6.7-.4,1.4-.6,2.2-.6s1.4.1,2.1.4c.2,0,.4,0,.6,0s.5,0,.7-.3.3-.5.3-.8,0-.3,0-.5-.2-.4-.4-.4c-.9-.5-2-.7-3.2-.7s-2.4.3-3.4.9-1.8,1.4-2.4,2.4c-.6,1-.9,2.1-.9,3.3s.3,2.3.9,3.3c.6,1,1.4,1.8,2.4,2.4,1.1.6,1.9.9,3.4.9s2.8-.4,4-1.1c.4-.2.6-.6.6-1v-3.9c0-.3,0-.6-.3-.8h0Z" fill-rule="evenodd" clip-rule="evenodd" fill="#4a4a4a"></path><path d="M93,13.9c-.7-.5-1.5-.7-2.3-.7s-1.6.2-2.3.6c-.7.4-1.3,1-1.7,1.8-.5.8-.7,1.9-.7,2.8s.2,1.7.6,2.5c.4.8,1,1.4,1.8,1.8.8.4,1.7.6,2.7.6s1.1,0,1.7-.3c.6-.2,1.1-.4,1.4-.7s.5-.7.5-.9-.1-.4-.3-.6c-.2-.3-.5-.3-.7-.3s-.4,0-.6.2c0,0,0,0-.3.2-.2,0-.4.3-.7.3-.3,0-.5,0-1.2,0s-1.3-.2-1.8-.6c-.5-.4-.9-1-1-1.7h6.1c.3,0,.6,0,.8-.3h0c.2-.1.3-.3.3-.6,0-.8-.2-1.7-.6-2.4-.4-.8-1-1.4-1.7-1.8ZM88.1,17.1h0c.2-1.4,1.1-2.1,2.5-2.1s1,.2,1.5.6c.5.4.8.9.8,1.5h-4.8Z" fill-rule="evenodd" clip-rule="evenodd" fill="#4a4a4a"></path><path d="M106,15.6c-.4-.8-1.1-1.3-1.8-1.8s-1.6-.7-2.5-.7-1.7.3-2.5.7c-.8.4-1.4,1-1.8,1.8-.5.7-.7,1.7-.7,2.6s.3,1.8.7,2.6c.4.8,1.1,1.4,1.8,1.8.7.4,1.6.6,2.5.6s1.7-.2,2.5-.6c.8-.4,1.4-1,1.8-1.8.5-.7.7-1.7.7-2.6s-.3-1.8-.7-2.6ZM104,19.8c-.2.5-.6.8-1,1.1-.4.3-.9.4-1.4.4s-1,0-1.4-.4c-.4-.3-.7-.6-1-1.1s-.4-1-.4-1.6.1-1.1.4-1.6c.2-.5.6-.8,1-1.1.4-.3.9-.4,1.4-.4s1,.1,1.4.4.7.6,1,1.1.4,1,.4,1.6-.1,1.1-.4,1.6Z" fill-rule="evenodd" clip-rule="evenodd" fill="#4a4a4a"></path></svg>
				</a>
			</div>
			<form id="signUpForm" class="card card-md" autocomplete="off" novalidate>
				<div class="card-body">
					<h2 class="card-title text-center mb-4">Create new account</h2>
					<div class="mb-3">
						<label class="form-label">Name</label>
						<input type="text" id="signUpName" name="user_nm" class="form-control" placeholder="Enter name">
					</div>
					<div class="mb-3">
						<label class="form-label">Email address</label>
						<div class="input-group">
							<input type="email" id="signUpEmail" name="eml" class="form-control" placeholder="Enter email">
							<button type="button" id="sendVerificationCode" class="btn btn-outline-primary">Send code</button>
						</div>
					</div>
					<div class="mb-3 d-none" id="verificationCodeContainer">
						<label class="form-label">Verification code</label>
						<input type="text" id="verificationCode" name="verification_code" class="form-control" placeholder="Enter verification code">
					</div>
					<div class="mb-3">
						<label class="form-label">Password</label>
						<div class="input-group input-group-flat">
							<input type="password" id="signUpPassword" name="pwd" class="form-control" placeholder="Password" autocomplete="off">
							<span class="input-group-text">
								<a href="#" class="link-secondary" id="toggleSignUpPassword" data-bs-toggle="tooltip" aria-label="Show password" data-bs-original-title="Show password">
									<img src="${path}/resources/images/eye-off.svg" height="18">
								</a>
							</span>
						</div>
					</div>
					<div class="mb-3">
						<label class="form-check"> <input type="checkbox" id="termsCheck" class="form-check-input">
							<span class="form-check-label">Agree the 
								<a href="#" tabindex="-1" data-bs-toggle="modal" data-bs-target="#terms-and-policy">
								terms of service</a>.
							</span>
						</label>
					</div>
					<div id="signUpAlertContainer"></div>
					<div class="form-footer">
						<button type="submit" id="signUpButton" class="btn btn-primary w-100">Create new account</button>
					</div>
				</div>
			</form>
			<div class="text-center text-secondary mt-3">Already have account?
				<a href="${path}/auth/login" tabindex="-1">Sign in</a>
			</div>
		</div>
		<div class="text-center mb-3 mt-auto">
	        <ul class="list-inline list-inline-dots">
	            <li class="list-inline-item text-muted">
	                Copyright © 2025 <a href="${path}/" class="link-secondary">Kyrgyzstan Land Use Management System</a>. All rights reserved.
	            </li>
	        </ul>
	    </div>
	</div>
	<%@ include file="/WEB-INF/pages/main/user/auth/terms.jsp"%>
	<script src="${path}/resources/js/main/user/auth.js"></script>
	<script src="${path}/resources/js/common/common.js"></script>
    <script src="${path}/resources/js/common/tabler/tabler.min.js" defer></script>
    <script src="${path}/resources/js/common/tabler/demo.min.js" defer></script>
</body>
</html>
