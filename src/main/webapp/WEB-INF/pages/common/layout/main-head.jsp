<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<!DOCTYPE html>
<html lang="en">
<head>
	<c:set var="path" value="${pageContext.request.contextPath}"/>
	<c:if test="${not empty pageContext.request.userPrincipal}">
	    <c:set var="userInfo">
	        {
	        	"no": "<sec:authentication property="principal.userNo"/>",
	            "name": "<sec:authentication property="principal.realName"/>",
	            "email": "<c:out value="${pageContext.request.userPrincipal.name}"/>"
	        }
	    </c:set>
	</c:if>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
    <title>
        <c:choose>
            <c:when test="${pageType eq 'admin'}">
                KyrGeo | Admin
            </c:when>
            <c:otherwise>
                KyrGeo
            </c:otherwise>
        </c:choose>
    </title>
    <link rel="shortcut icon" href="${path}/resources/images/favicon.ico">
    <!-- libs files -->
    <link href="${path}/resources/libs/openLayers/v6.15.1-dist/ol.css" rel="stylesheet"/>
	<link href="${path}/resources/libs/openLayers/ol-ext-v4.0.24/ol-ext.min.css" rel="stylesheet"/>
	<link href="${path}/resources/libs/nouislider-v.15.7.1/dist/nouislider.min.css" rel="stylesheet"/>
    <!-- CSS files -->
    <link href="${path}/resources/css/common/tabler.min.css" rel="stylesheet"/>
    <link href="${path}/resources/css/common/tabler-vendors.min.css" rel="stylesheet"/>
    <link href="${path}/resources/css/common/demo.min.css" rel="stylesheet"/>
    <link href="${path}/resources/css/layout/header.css" rel="stylesheet"/>
    <c:if test="${not empty pageCss}">
        <link href="${path}/resources/css/main/${pageFolder}/${pageCss}.css" rel="stylesheet"/>
    </c:if>
    <style>
    @import url('https://rsms.me/inter/inter.css');
	:root {
		--tblr-font-sans-serif: 'Inter Var', -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif;
	}
	body {
		font-feature-settings: "cv03", "cv04", "cv11";
	}
    </style>
</head>
<script>
	window._GL = {
        version: '1.0',
        contextPath: '<c:out value="${pageContext.request.contextPath}"/>',
        csrf: {
            token: '<c:out value="${_csrf.token}" />',
            headerName: '<c:out value="${_csrf.headerName}"/>'
        },
        user: <c:out value="${userInfo}" default="null" escapeXml="false"/>,
        messages: {}
	};
</script>
<script src="${path}/resources/libs/html2canvas-v.1.4.1/html2canvas.min.js"></script>
<script src="${path}/resources/libs/nouislider-v.15.7.1/dist/nouislider.min.js"></script>
<script src="${path}/resources/libs/chart.js-v2.9.4/Chart.js"></script>
<script src="${path}/resources/libs/list.js/dist/list.min.js"></script>
<script src="${path}/resources/js/common/common.js"></script>
<script src="${path}/resources/js/common/notification.js"></script>
<%@ include file="/WEB-INF/pages/common/alert/alert-modal.jsp"%>
<%@ include file="/WEB-INF/pages/common/alert/alert-toast.jsp"%>
<%@ include file="/WEB-INF/pages/common/messages/messages.jsp"%>