/**
 * Subject : 관리자
 * Author : 오영진
 * Date : 2024. 4. 2.
 * COMMENT : 관리자기능 js파일
 */

var ADM_GRP = {
		grpId: "",
		srvcYn: "",
		table: null,
		selectGrpList:function(pg){
			$.ajax({
			    url : './adm/selectGrpList.do',
			    type : "POST",
			    data : {"pageIndex": pg},
			    dataType : 'json',
			    success : function(result){
			    	ADM_GRP.cnt = result.count;
			        var resultList = $("#admDiGrpList");
			        resultList.empty();
			        
			        $("#admSpCnt").text(ADM_GRP.cnt);
			        
			        var html = "";
			        var pageInfo = result.paginationInfo;
			        
			        if (result.list != null && result.list.length > 0) {
				        html +=  '<table id="admTbGrpList">'						
				        	+ '		 <thead>'
				        	+ '    		<tr>'
				        	+ '        		<th>No</th>'
				        	+ '        		<th>Group Name</span></th>'
				        	+ '     		<th>Register</th>'
				        	+ '     		<th>Registered on</th>'
				        	+ '     		<th>Modified on</th>'
				        	+ '		        <th>Service on&#47;off</th>'
				        	+ '		        <th>Delete</th>'
				        	+ '    		</tr>'
				        	+ '		  </thead>'
				        	+ '		<tbody>';
				        
						$.each(result.list, function(k,v) {
							html +=   '<tr onclick="javascript:ADM_GRP.selectGrpInfo(\''+v.grp_id+'\', \''+v.grp_nm+'\');ADM_GRP.setAuthCheckBox(\''+v.author_menu+'\');">'
									+ '    <td>'+(ADM_GRP.cnt-k)+'</td>'
									+ '    <td>'+v.grp_nm+'</td>'
									+ '    <td>'+v.rgtr+'</td>'
									+ '    <td>'+v.reg_date.split(" ")[0]+'</td>'
							if(v.mod_date != null) {
								html +=   '    <td>'+v.mod_date.split(" ")[0]+'</td>'
							} else {
								html +=   '    <td>-</td>'
							}
							if(v.srvc_yn == "Y") {
								html +=   '    <td onclick="javascript:event.stopPropagation();">'
										+ '        <label class="toggle-custom">'
										+ '            <input type="checkbox" name="A-group" onchange="javascript:ADM_GRP.updateGrpStat(\''+v.grp_id+'\', \''+v.grp_nm+'\', this);" checked>'
										+ '            <span class="toggle-Sder"></span>'
										+ '        </label>'
										+ '    </td>';
							} else {
								html +=   '    <td onclick="javascript:event.stopPropagation();">'
										+ '        <label class="toggle-custom">'
										+ '            <input type="checkbox" name="A-group" onchange="javascript:ADM_GRP.updateGrpStat(\''+v.grp_id+'\', \''+v.grp_nm+'\', this);">'
										+ '            <span class="toggle-Sder"></span>'
										+ '        </label>'
										+ '    </td>';
							}
								html += '    <td><button type="button" class="BL7-btn bgwt" style="padding: 0 13px; line-height: 20px;" onclick="CMM.alert(\'그룹을 삭제하시겠습니까?\', \'delete\', ADM_GRP.deleteGrpInfo);">Delete</button></td>';
							});
					} else {
						html +=  '<table style="margin-top: 5px;">'
							+ '	<colgroup>'
							+ '	    <col style="width: 5%;">'
							+ '	    <col style="width: 25%;">'
							+ '	    <col style="width: 15%;">'
							+ '	    <col style="width: 15%;">'
							+ '	    <col style="width: 15%;">'
							+ '	    <col style="width: 15%;">'
							+ '	    <col style="width: 10%;">'
							+ '	</colgroup>'
				        	+ '		<thead>'
				        	+ '    		<tr>'
				        	+ '        		<th>No</th>'
				        	+ '        		<th>Group Name</span></th>'
				        	+ '     		<th>Register</th>'
				        	+ '     		<th>Registered on</th>'
				        	+ '     		<th>Modified on</th>'
				        	+ '		        <th>Service on&#47;off</th>'
				        	+ '		        <th>Delete</th>'
				        	+ '    		</tr>'
				        	+ '		</thead>'
				        	+ '		<tbody>';
						html +=   '<tr>'
						    + '    	 <td colspan="7">There is no result.</td>'
					}
					resultList.append(html);
					
					ADM_GRP.table = $("#admTbGrpList").DataTable({
						scrollx: true,
				        columnDefs: [
				            { width: "5%", targets: [0], orderable: false },
				            { width: "25%", targets: [1] },
				            { width: "15%", targets: [2] },
				            { width: "15%", targets: [3] },
				            { width: "15%", targets: [4] },
				            { width: "15%", targets: [5], orderable: false },
				            { width: "10%", targets: [6], orderable: false },
				        ],
				        order: [],
			        	pageLength: 15,
					    lengthChange: false,
					    searching: false,
					    info: false,
					    destory: true
					});
					$("#admTbGrpList").on('order.dt', function () {
						$("#admDiGrpListPage_num").val("1");
					});
					
					ADM_GRP.paging('admDiGrpListPage');
			    }
		    });
		},
		selectGrpInfo:function(grpId, grpNm){
			ADM_GRP.grpId = grpId;
			$.ajax({
				url : './adm/selectGrpInfoUsrCount.do',
			    type : "POST",
			    data : {"grpId": grpId},
				dataType : 'json',
			    success : function(result){
			    	$("#admGrpInfoNm").val(grpNm);
			    	$("#admGrpInfoNm").attr("disabled", false);
			    	$("#admGrpInfoNm").attr("readonly", false);
		    		$("#admGrpInfoCount").val(result.count);
		    		$("#admGrpInsertId").text("Number of Users");
		    		$("#admGrpInfoCount").attr("disabled", true);
		    		$("#admGrpInfoCount").attr("readonly", true);
		    		$("#admBtGrpReg").css("display", "none");
		    		$("#admBtGrpEdit").css("display", "block");
			    	//$("#admBtGrpDel").css("display", "block");
			    }
			});
		},
		setAuthCheckBox:function(menuList) {
		    var authmenu = menuList.split(",");
		    $('#admAuthList .slide-tit').removeClass('active');
		    $('#admAuthList .slide-detail').hide();
		    $('#admAuthList input[type="checkbox"]').prop('checked', false);
		    authmenu.forEach(number => {
		    	var checkBox = $(`#admAuthList input[type="checkbox"][value="${number}"]`);
		    	if (checkBox.length > 0) {
		    		checkBox.prop('checked', true);
		    	}
		    });
		    var checkedItems = $('#admAuthList input[type="checkbox"]:checked');
		    
		    checkedItems.each(function() {
		    	if(this.defaultValue.slice(-2) === "01" || this.defaultValue.slice(-2) === "02"){
		    		return;
		    	}
		    	var parentSlideDetail = $(this).closest('.slide-detail');
		    	parentSlideDetail.prev('.slide-tit').addClass('active');
	    		parentSlideDetail.show();
		    });
		},
		insertGrpInfo:function(){
			var grpNm = $("#admGrpInfoNm").val();
			var grpId = $("#admGrpInfoCount").val();
			var rgtr = USR.usrId;
			var authorMenu = '';
			
			$('#admAuthList input[type="checkbox"]').each(function() {
			    var value = $(this).val();
			    if (value != "on" && $(this).is(':checked')) {
			    	authorMenu += value + ',';
			    }
			});
			authorMenu = authorMenu.slice(0, -1);
			
			var param={
				"grpId": grpId,
				"grpNm": grpNm,
				"rgtr": rgtr,
				"authorMenu": authorMenu,
			}
			
			$.ajax({
				url : './adm/insertGrpInfo.do',
				type : 'POST',
				data : param,
				dataType : 'json',
				success : function(result) {
					if(result.rs == "ERROR") {
						CMM.alert('새 그룹 추가에 실패했습니다.','warning');
						return;
					} else if(result.rs == "DN") {
						CMM.alert('중복된 그룹 명 입니다.','warning');
					} else if(result.rs == "DI") {
						CMM.alert('중복된 그룹 아이디 입니다.','warning');
					} else {
						CMM.alert('새 그룹이 추가되었습니다.','info',ADM_GRP.selectGrpList(1));
						ADM_GRP.resetAdmGrp();
					}
				}
			});
		},
		updateGrpStat:function(grpId, grpNm, checkbox){
			var srvcYn;
			ADM_GRP.grpId = grpId;
			$('input[type="checkbox"]').prop('disabled', true);
			if(checkbox.checked) {
				ADM_GRP.srvcYn = "Y";
				$('.popup-alert .btn-Box .gr9-btn').click(function() {
					checkbox.checked = false;
					$('input[type="checkbox"]').prop('disabled', false);

				});
				CMM.alert(grpNm + "의 서비스를 이용 제한을 해제하겠습니까?", "confirm", ADM_GRP.updateGrpStat2);
			} else {
				$('.popup-alert .btn-Box .gr9-btn').click(function() {
					checkbox.checked = true;
					$('input[type="checkbox"]').prop('disabled', false);
				});
				ADM_GRP.srvcYn = "N";
				CMM.alert(grpNm + "의 서비스를 이용을 제한하겠습니까?", "confirm", ADM_GRP.updateGrpStat2);
			}
		},
		updateGrpStat2:function(){
			var mdfr = USR.usrId;
			$.ajax({
				url : './adm/updateGrpStat.do',
				type : 'POST',
				data : {"grpId": ADM_GRP.grpId, "mdfr": mdfr, "srvcYn": ADM_GRP.srvcYn},
				dataType : 'json',
				success : function(result) {
					if(result.rs == "ERROR") {
						CMM.alert('서비스 사용여부 변경에 실패했습니다.','warning');
						return;
					} else{
						CMM.alert('서비스 사용여부가 변경되었습니다.','info');
					}
					$('input[type="checkbox"]').prop('disabled', false);
				}
			});
		},
		updateGrpInfo:function(){
			var grpId = ADM_GRP.grpId;
			var grpNm = $("#admGrpInfoNm").val();
			var mdfr = USR.usrId;
			var authorMenu = '';
			$('#admAuthList input[type="checkbox"]').each(function() {
			    var value = $(this).val();
			    if (value != "on" && $(this).is(':checked')) {
			    	authorMenu += value + ',';
			    }
			});
			authorMenu = authorMenu.slice(0, -1);
			
			var param={
				"grpId": grpId,
				"grpNm": grpNm,
				"mdfr": mdfr,
				"authorMenu": authorMenu,
			}
			
			$.ajax({
				url : './adm/updateGrpInfo.do',
				type : 'POST',
				data : param,
				dataType : 'json',
				success : function(result) {
					if(result.rs == "ERROR") {
						CMM.alert('그룹정보 변경에 실패했습니다.','warning');
						return;
					} else {
						CMM.alert('그룹정보가 변경되었습니다.','info',USR.reload);
					}
				}
			});
		},
		deleteGrpInfo:function(){
			if($("#admGrpInfoCount").val() == 0){
				$.ajax({
					url:"./adm/deleteGrpInfo.do",
					type : "POST",
					data : {"grpId": ADM_GRP.grpId},
					dataType:'json',
					success:function(result){
						if(result.rs=="ERROR"){
							CMM.alert('그룹 삭제를 실패했습니다.','warning');
							return false;
						}
						if(result.rs=="DONE"){
							CMM.alert('그룹 삭제가 완료되었습니다.','info',ADM_GRP.selectGrpList(1));
							ADM_GRP.resetAdmGrp();
						}
					}
				});
			} else {
				CMM.alert('해당그룹에 포함된 유저가 존재합니다.','warning');
			}
		},
		resetAdmGrp:function(){
			$("#admGrpInfoNm").val("");
			$("#admGrpInfoNm").attr("disabled", true);
			$("#admGrpInfoNm").attr("readonly", true);
			$("#admGrpInfoCount").val("");
			$('#admAuthList .slide-tit').removeClass('active');
			$('#admAuthList .slide-detail').hide();
			$('#admAuthList input[type="checkbox"]').prop('checked', false);
			$("#admSpCnt").text(ADM_GRP.cnt);
			$(".Adminpop .L-container .tab-detail-container .tab-Box").eq(0).removeClass("active")
			$(".R-container .tab-detail-container .tab-Box").eq(0).removeClass("active");
			$(".Adminpop .L-container .tab-detail-container .tab-Box").eq(1).addClass("active");
			$(".R-container .tab-detail-container .tab-Box").eq(1).addClass("active");
		},
		// 페이징
		paging:function(pageId){
			var pageInfo = ADM_GRP.table.page.info();
			$('#'+pageId).empty();
			var html='';
			if(pageInfo != null){
				if(pageInfo.recordsTotal != 0){
					if(pageInfo.pages >= 0){
						html += '<button type="button" onclick="javascript:ADM_GRP.table.page(0).draw(\'page\');ADM_GRP.insertCurrPageNum(\'' + pageId + '\');"><i class="ico"></i></button>'
						+ '<a href="javascript:ADM_GRP.table.page(\'previous\').draw(\'page\');ADM_GRP.insertCurrPageNum(\'' + pageId + '\');">Prev</a>'
						+ '<label>'
						+ '<input type="text" style="display: none;">'
						+ '<input type="number" id="'+pageId+'_num" value="'+(ADM_GRP.table.page()+1)+'" onkeypress="if(event.keyCode == 13 && CMM.isPage(this.id, this.value,'+pageInfo.pages+'))ADM_GRP.table.page(this.value-1).draw(\'page\');" oninput="CMM.maxLengthCheck(this)" maxlength="4"></label>'
						+ '<em>of</em>'
						+ '<label>'					
						+ '<input type="text" value="'+pageInfo.pages+'" readonly>'
						+ '</label>';
						
						html += '<a href="javascript:ADM_GRP.table.page(\'next\').draw(\'page\');ADM_GRP.insertCurrPageNum(\'' + pageId + '\');">Next</a>';
						html += '<button type="button" onclick="javascript:ADM_GRP.table.page('+ (pageInfo.pages-1) +').draw(\'page\');ADM_GRP.insertCurrPageNum(\'' + pageId + '\');"><i class="ico"></i></button>';
						
						$('#'+pageId).append(html);
					}
				} else {
					$('#'+pageId).empty();
				}
			}
		},
		insertCurrPageNum:function(pageId) {
			var currPageNum = ADM_GRP.table.page()+1;
			$('#'+pageId+'_num').val(currPageNum);
		}
};

$('#admGrpMng').click(function () {
	if(ADM_GRP.table == null) {
		ADM_GRP.selectGrpList(1);
	}
	$('#admGrpMng').addClass("active");
	$('#admUsrMng').removeClass("active");
	$("#admBtGrpReg").css("display", "none");
	ADM_GRP.resetAdmGrp();
});

// Search
$('#searchChkbox').change(function() {
    var isChecked = $(this).prop('checked');
    $('#admSearchDeatil input[type="checkbox"]').prop('checked', isChecked);
});

$('#admSearchDeatil input[type="checkbox"]').change(function() {
    $('#searchChkbox').prop('checked', $('#admSearchDeatil input[type="checkbox"]:checked').length > 0);
});

// Image Map
$('#imageMapChkbox').change(function() {
    var isChecked = $(this).prop('checked');
    $('#ImagesatChkbox, #imageDrnChkbox').prop('checked', isChecked);
});

$('#admImageMapDeatil input[type="checkbox"]').change(function() {
    $('#imageMapChkbox').prop('checked', $('#admImageMapDeatil input[type="checkbox"]:checked').length > 0);
});

$('#ImagesatChkbox').change(function() {
    var isChecked = $(this).prop('checked');
    if(isChecked === false) {
    	$('#admIMSatDeatil input[type="checkbox"]').prop('checked', isChecked)
    }
    $('#admIMSatDeatil input[type="checkbox"][value="020101"],#admIMSatDeatil input[type="checkbox"][value="020102"]').prop('checked', isChecked);
    $('#imageMapChkbox').prop('checked', $('#admImageMapDeatil input[type="checkbox"]:checked').length > 0);
});

$('#admIMSatDeatil input[type="checkbox"]').change(function() {
	var isChecked = $(this).prop('checked');
	if(isChecked === true) {
		$('#admIMSatDeatil input[type="checkbox"][value="020101"],#admIMSatDeatil input[type="checkbox"][value="020102"]').prop('checked', isChecked);
	}
    $('#ImagesatChkbox').prop('checked', $('#admIMSatDeatil input[type="checkbox"]:checked').length > 0);
    $('#imageMapChkbox').prop('checked', $('#admImageMapDeatil input[type="checkbox"]:checked').length > 0);
});

$('#imageDrnChkbox').change(function() {
    var isChecked = $(this).prop('checked');
    if(isChecked === false) {
    	$('#admIMDrnDeatil input[type="checkbox"]').prop('checked', isChecked)
    }
    $('#admIMDrnDeatil input[type="checkbox"][value="020201"],#admIMDrnDeatil input[type="checkbox"][value="020202"]').prop('checked', isChecked);
    $('#imageMapChkbox').prop('checked', $('#admImageMapDeatil input[type="checkbox"]:checked').length > 0);
});

$('#admIMDrnDeatil input[type="checkbox"]').change(function() {
	var isChecked = $(this).prop('checked');
	if(isChecked === true) {
		$('#admIMDrnDeatil input[type="checkbox"][value="020201"],#admIMDrnDeatil input[type="checkbox"][value="020202"]').prop('checked', isChecked);
	}
    $('#imageDrnChkbox').prop('checked', $('#admIMDrnDeatil input[type="checkbox"]:checked').length > 0);
    $('#imageMapChkbox').prop('checked', $('#admImageMapDeatil input[type="checkbox"]:checked').length > 0);
});

// Yield Prediction
$('#yieldChkbox').change(function() {
    var isChecked = $(this).prop('checked');
    $('#yieldSatChkbox, #yieldDrnChkbox').prop('checked', isChecked);
});

$('#admYieldDetail input[type="checkbox"]').change(function() {
    $('#yieldChkbox').prop('checked', $('#admYieldDetail input[type="checkbox"]:checked').length > 0);
});

$('#yieldSatChkbox').change(function() {
    var isChecked = $(this).prop('checked');
    if(isChecked === false) {
    	$('#admYldSatDetail input[type="checkbox"]').prop('checked', isChecked)
    }
    $('#admYldSatDetail input[type="checkbox"][value="030101"],#admYldSatDetail input[type="checkbox"][value="030102"]').prop('checked', isChecked);
    $('#yieldChkbox').prop('checked', $('#admYieldDetail input[type="checkbox"]:checked').length > 0);
});

$('#admYldSatDetail input[type="checkbox"]').change(function() {
	var isChecked = $(this).prop('checked');
	if(isChecked === true) {
		$('#admYldSatDetail input[type="checkbox"][value="030101"],#admYldSatDetail input[type="checkbox"][value="030102"]').prop('checked', isChecked);
	}
    $('#yieldSatChkbox').prop('checked', $('#admYldSatDetail input[type="checkbox"]:checked').length > 0);
    $('#yieldChkbox').prop('checked', $('#admYieldDetail input[type="checkbox"]:checked').length > 0);
});

$('#yieldDrnChkbox').change(function() {
    var isChecked = $(this).prop('checked');
    if(isChecked === false) {
    	$('#admYldDrnDetail input[type="checkbox"]').prop('checked', isChecked)
    }
    $('#admYldDrnDetail input[type="checkbox"][value="030201"],#admYldDrnDetail input[type="checkbox"][value="030202"]').prop('checked', isChecked);
    $('#yieldChkbox').prop('checked', $('#admYieldDetail input[type="checkbox"]:checked').length > 0);
});

$('#admYldDrnDetail input[type="checkbox"]').change(function() {
	var isChecked = $(this).prop('checked');
	if(isChecked === true) {
		$('#admYldDrnDetail input[type="checkbox"][value="030201"],#admYldDrnDetail input[type="checkbox"][value="030202"]').prop('checked', isChecked);
	}
    $('#yieldDrnChkbox').prop('checked', $('#admYldDrnDetail input[type="checkbox"]:checked').length > 0);
    $('#yieldChkbox').prop('checked', $('#admYieldDetail input[type="checkbox"]:checked').length > 0);
});

// User Information Management
$('#usrMngChkbox').change(function() {
    var isChecked = $(this).prop('checked');
    $('#admUsrMngDetail input[type="checkbox"]').prop('checked', isChecked);
});

$('#admUsrMngDetail input[type="checkbox"]').change(function() {
    $('#usrMngChkbox').prop('checked', $('#admUsrMngDetail input[type="checkbox"]:checked').length > 0);
});

$('#usrInfoChkbox').change(function() {
    var isChecked = $(this).prop('checked');
    $('#admUsrInfoDetail input[type="checkbox"]').prop('checked', isChecked);
    $('#usrMngChkbox').prop('checked', $('#admUsrMngDetail input[type="checkbox"]:checked').length > 0);
});

$('#admUsrInfoDetail input[type="checkbox"]').change(function() {
    $('#usrInfoChkbox').prop('checked', $('#admUsrInfoDetail input[type="checkbox"]:checked').length > 0);
    $('#usrMngChkbox').prop('checked', $('#admUsrMngDetail input[type="checkbox"]:checked').length > 0);
});

// 그룹생성버튼
$('#admBtGrpCreate').click(function () {
	ADM_GRP.resetAdmGrp();
	$("#admGrpInfoNm").attr("disabled", false);
	$("#admGrpInfoNm").attr("readonly", false);
	$("#admBtGrpReg").css("display", "block");
	$("#admBtGrpEdit").css("display", "none");
	//$("#admBtGrpDel").css("display", "none");
	
	$("#admGrpInsertId").text("Gruop ID");
	$("#admGrpInfoCount").attr("disabled", false);
	$("#admGrpInfoCount").attr("readonly", false);
});

// 생성버튼
$('#admBtGrpReg').click(function () {
	if($("#admGrpInfoNm").val() == "") {
		CMM.alert('그룹 명을 입력해주세요.','info');
		return;
	}
	if($("#admGrpInfoCount").val() == "") {
		CMM.alert('그룹 아이디를 입력해주세요.','info');
		return;
	}
	CMM.alert("그룹을 추가하시겠습니까?","confirm",ADM_GRP.insertGrpInfo);
});

// 편집버튼
$('#admBtGrpEdit').click(function () {
	if($("#admGrpInfoNm").val() == ""){
		CMM.alert("선택된 그룹이 없습니다.","info");
		return;
	}
	CMM.alert("그룹정보를 변경하시겠습니까? 그룹정보 변경시 페이지가 새로고침 됩니다.","confirm",ADM_GRP.updateGrpInfo);
});

// 삭제버튼
/*$('#admBtGrpDel').click(function () {
	CMM.alert("그룹을 삭제하시겠습니까?","delete",ADM_GRP.deleteGrpInfo);
});*/