<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8" isELIgnored="false"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
    <title>Кыргызская Республика Land use map utilization system</title>
    <script src='lib/jquery/jquery-3.6.1.min.js'></script>
    <script src="https://code.jquery.com/jquery-latest.min.js"></script>
    <script src="https://code.jquery.com/jquery.min.js"></script>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>    
    <link rel="stylesheet" type="text/css" href="lib/dataTables/datatables.min.css">
    <link rel="icon" type="Images/favicon.png" href="Images/favicon_ico.png" sizes="48x48">
    <link rel="stylesheet" type="text/css" href="lib/openLayers/v7.1.0-package/ol.css">
	<link rel="stylesheet" type="text/css" href="lib/openLayers/sidebyside/index.css">
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    <link rel="stylesheet" href="css/import.css">
</head>
<body>
    <div class="body-wrap">
        <div class="popup-Bg"></div>         
        <!-- loading bar -->
        <div class="loading">
            <img src="./Images/loading-bar-ico.svg" alt="loading">
            <span>Loading</span>
        </div>
        
        <!-- 관리자 -->
        <c:import url="./../adm/list.jsp"></c:import>
        
        <!-- 사용자 -->
        <!-- Signin popup -->
        <c:import url="./../login/signIn.jsp"></c:import>
        <!-- Signup popup -->
        <c:import url="./../login/signUp.jsp"></c:import>
        <!-- Signup popup -->
        <c:import url="./../login/usrInfo.jsp"></c:import>
        
        <!-- 팝업 -->
        <!-- Upload Pop -->
        <c:import url="./../popup/upload.jsp"></c:import>
        <!-- chart Pop -->
        <c:import url="./../popup/chart.jsp"></c:import>
        <!-- Layer Pop -->
        <c:import url="./../popup/layer.jsp"></c:import>
        
        <!-- 데이터 편집 -->
        <!-- map Edit -->
        <c:import url="./../edit/edit_obj.jsp"></c:import>
        <!-- style Edit popup -->
        <c:import url="./../edit/edit_style.jsp"></c:import>
        <!-- attr Edit popup -->
        <c:import url="./../edit/edit_attr.jsp"></c:import>
        
        <!-- 우측메뉴 팝업 -->
        <div class="popup-container">
        	<!-- Data Management popup -->
            <c:import url="./../layer/list.jsp"></c:import>
            <!-- Statistics popup -->
            <c:import url="./../stat/list.jsp"></c:import>                    
            <!-- Search popup -->
            <c:import url="./../search/list.jsp"></c:import>
        </div>
        
        <!-- 상단 메뉴 리스트 -->
        <header>
        	<c:import url="./../cmm/list.jsp"></c:import>
        </header>
        <section>
            <c:import url="./../map/list.jsp"></c:import>
        </section>
        
		<div id="map" style="width: 100%; height: 500px;"></div>
   	</div>    
   	
   	<!-- alert -->
    <c:import url="./../cmm/alert.jsp"></c:import>

	<script src="lib/bootstrap/bootstrap.bundle.min.js"></script>	
	<script src="lib/openLayers/v7.1.0-package/dist/ol.js"></script>
	<script src='lib/proj4/proj4.js'></script>
	<script src='lib/jquery/flatpickr.js'></script>
	<script src="lib/dataTables/datatables.min.js"></script>
	<script src="lib/sha512/sha512.min.js"></script>
	<script src="lib/html2canvas/html2canvas.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
	<script type="module" src="lib/openLayers/sidebyside/js/index.js"></script>
	
	<script src="js/cmm/map.js"></script>
	<script src="js/cmm/ui_ctrl.js"></script>
	<script src="js/cmm/cmm.js"></script>
	<script src="js/adm/adm_usr.js"></script>
	<script src="js/adm/adm_grp.js"></script>
	<script src="js/usr/usr.js"></script>
	<script src="js/log/log.js"></script>
	<script src="js/search/search.js"></script>
	<script src="js/layer/layer.js"></script>
	<script src="js/js.js"></script>
	<Script>
		var timerRemainId = null;
		var timer = null;
		
		$(document).ready(function(){
			USR.usrId = "${usrInfo.sessUsrId}";
			if(USR.usrId != ""){
				USR.TIMEOUT.setTimeOffsetBetweenServerAndClient();
	   			USR.TIMEOUT.checkSessionTimeout();
			}
			MAP.init();
			/* LAYER.init(); */
		});
	</Script>
</body>
</html>