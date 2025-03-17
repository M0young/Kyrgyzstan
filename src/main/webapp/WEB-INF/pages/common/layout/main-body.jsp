<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<div class="container language-selector">
	<div class="navbar navbar-nav flex-row justify-content-end">
		<div class="nav-item dropdown">
	       	<a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">
	           	<span class="avatar avatar-xs me-2 current-flag"></span>
	           	<span class="nav-link-title">Language</span>
	        </a>
			<div class="dropdown-menu dropdown-menu-end">
				<a href="#" class="dropdown-item" data-lang="ru">
					<span class="avatar avatar-xs me-2" style="background-image: url(${path}/resources/images/flag-ru.svg)"></span>Русский
					<span class="ms-auto lang-check" id="check-ru"><img src="${path}/resources/images/circle-check.svg"></span>
				</a>
				<a href="#" class="dropdown-item" data-lang="ky">
					<span class="avatar avatar-xs me-2" style="background-image: url(${path}/resources/images/flag-kg.svg)"></span>Кыргызча
					<span class="ms-auto lang-check" id="check-ky"><img src="${path}/resources/images/circle-check.svg"></span>
				</a>
				<a href="#" class="dropdown-item" data-lang="en">
					<span class="avatar avatar-xs me-2" style="background-image: url(${path}/resources/images/flag-us.svg)"></span>English
					<span class="ms-auto lang-check" id="check-en"><img src="${path}/resources/images/circle-check.svg"></span>
				</a>
			</div>
		</div>
	</div>
</div>
