/**
 * Subject : 관리자
 * Author : 오영진
 * Date : 2024. 4. 2.
 * COMMENT : 관리자기능 js파일
 */

var ADM_USR = {
		table: null,
		cnt: 0,
		selectUsrList:function(pg){
			var type = $("#admUsrSearchTy").val();
			var search = "";
			var grp_search = null;
			if(type == "3"){
				grp_search = $("#admUsrSearchGrp").val();
			} else {
				search = $("#admUsrSearch").val();
			}
			
			$.ajax({
			    url : './adm/selectUsrList.do',
			    type : "POST",
			    data : {"pageIndex": pg, 
				    	"type": type,
			    		"search": search, 
			    		"grp_search": grp_search
    			},
			    dataType : 'json',
			    success : function(result){
			    	ADM_USR.cnt = result.count;
			        var resultList = $("#admDiUsrList");
			        resultList.empty();
			        
			        $("#admSpCnt").text(ADM_USR.cnt);
			        
			        var html = "";
			        var pageInfo = result.paginationInfo;
			        
			        if (result.list != null && result.list.length > 0) {
				        html +=  '<table id="admTbUsrList">'						
				        	+ '		<thead>'
				        	+ '    		<tr>'
				        	+ '        		<th>No</th>'
				        	+ '        		<th>ID</span></th>'
				        	+ '        		<th>Name</th>'
				        	+ '     		<th>Institution</th>'
				        	+ '		        <th>Department</th>'
				        	+ '     		<th>Authority</th>'
				        	+ '		        <th>Registered On</th>'
				        	+ '        		<th>Last Access</th>'
				        	+ '    		</tr>'
				        	+ '		</thead>'
				        	+ '		<tbody>';
				        
						$.each(result.list, function(k,v) {
							v.last_login = v.last_login || '-';
							html +=   '<tr onclick="javascript:ADM_USR.selectUsr(\''+v.usr_id+'\');">'
									+ '    <td>'+(ADM_USR.cnt-k)+'</td>'
									+ '    <td>'+v.usr_id+'</td>'
									+ '    <td>'+v.usr_nm+'</td>'
									+ '    <td>'+v.inst+'</td>'
									+ '    <td>'+v.dept+'</td>'
									+ '    <td>'+v.grp_nm+'</td>'
									+ '    <td>'+v.reg_date.split(" ")[0]+'</td>'
									+ '    <td>'+v.last_login+'</td>';
						});
					} else {
						html +=  '<table style="margin-top: 5px;">'
							+ '	<colgroup>'
							+ '	    <col style="width: 5%;">'
							+ '	    <col style="width: 13%;">'
							+ '	    <col style="width: 16%;">'
							+ '	    <col style="width: 12%;">'
							+ '	    <col style="width: 12%;">'
							+ '	    <col style="width: 12%;">'
							+ '	    <col style="width: 15%;">'
							+ '	    <col style="width: 15%;">'
							+ '	</colgroup>'
				        	+ '		<thead>'
				        	+ '    		<tr>'
				        	+ '        		<th>No</th>'
				        	+ '        		<th>ID</span></th>'
				        	+ '        		<th>Name</th>'
				        	+ '     		<th>Institution</th>'
				        	+ '		        <th>Department</th>'
				        	+ '     		<th>Authority</th>'
				        	+ '		        <th>Registered On</th>'
				        	+ '        		<th>Last Access</th>'
				        	+ '    		</tr>'
				        	+ '		</thead>'
				        	+ '		<tbody>';
						html +=   '<tr>'
						    + '    	 <td colspan="8">There is no result.</td>'
					}
					resultList.append(html);
					
					ADM_USR.table = $("#admTbUsrList").DataTable({
						scrollx: true,
				        columnDefs: [
				            { width: "5%", targets: [0], orderable: false },
				            { width: "13%", targets: [1] },
				            { width: "16%", targets: [2] },
				            { width: "12%", targets: [3] },
				            { width: "12%", targets: [4] },
				            { width: "12%", targets: [5] },
				            { width: "15%", targets: [6] },
				            { width: "15%", targets: [7] },
				        ],
				        order: [],
			        	pageLength: 15,
					    lengthChange: false,
					    searching: false,
					    info: false,
					    destory: true
					});
					$("#admTbUsrList").on('order.dt', function () {
						$("#admDiUsrListPage_num").val("1");
					});
					
					ADM_USR.paging('admDiUsrListPage');
			    }
		    });
		},
		setAuthSelect:function(){
			$.ajax({
			    url : './adm/selectGrpList.do',
			    type : "POST",
			    data : {"pageIndex": 1},
			    dataType : 'json',
			    success : function(result){
			    	var authSearchList = $("#admUsrSearchGrp");
			        var authUsrInfoList = $("#admUsrInfoGrp");
			        authSearchList.empty();
			        authUsrInfoList.empty();
			        
			        var html = "";
			        
			        $.each(result.list, function(k,v) {
			        	html +=  '<option value='+v.grp_id+'>'+v.grp_nm+'</option>'						
			        });
			        
			        authSearchList.append(html);
			        authUsrInfoList.append(html);
			        authUsrInfoList.val("");
			    }
		    });
		},
		// 사용자 조회
		selectUsr: function(usrId) {
			this.selectUsrInfo(usrId);
			this.selectUsrLogList(usrId);
			// 사용자의 지도 이력 조회
			this.selectUsrMapHist(usrId);
		},
		selectUsrInfo:function(usrId){
			$.ajax({
				url : './usr/selectUsrInfo.do',
			    type : "POST",
			    data : {"usrId": usrId},
				dataType : 'json',
			    success : function(result){
			    	var usrInfo = result.rs;
			    	if(usrInfo != null) {
			    		$("#admUsrInfoId").val(usrInfo.usr_id);
			    		$("#admUsrInfoNm").val(usrInfo.usr_nm);
			    		$("#admUsrInfoEml").val(usrInfo.eml);
			    		$("#admUsrInfoTelno").val(usrInfo.telno);
		    			$("#admUsrInfoGrp").val(usrInfo.grp_id);
		    			$("#admUsrInfoInst").val(usrInfo.inst);
			    		$("#admUsrInfoDept").val(usrInfo.dept);
			    	}
			    }
			});
		},
		selectUsrLogList:function(usrId){
			$.ajax({
				url : './adm/selectUsrLogList.do',
			    type : "POST",
			    data : {"usrId": usrId},
				dataType : 'json',
			    success : function(result){
			        var resultList = $("#admTbUsrLogListBody");
			        resultList.empty();
			        var html = "";
			        
			        if (result.list != null && result.list.length > 0) {
						$.each(result.list, function(k,v) {
							html +=   '<tr>'
									+ '    <td><span>'+(result.list.length-k)+'</span></td>'
									+ '    <td><span>'+v.message+'</span></td>'
									+ '    <td><span>'+v.ip+'</span></td>'
									+ '    <td><span>'+v.reg_date+'</span></td>';
						});
					} else {
						html +=   '<tr>'
						    + '    	 <td colspan="4"><span>There is no result.</span></td>';
					}
			        
					resultList.append(html);
			    }
			});
		},
		// 사용자의 지도 이력 조회
		selectUsrMapHist: function(usrId){
			// 날짜 형식 변환
			function formatDate(inputDate) {
				if(inputDate) {
					var year = inputDate.slice(0, 4);
				    var month = inputDate.slice(4, 6);
				    var day = inputDate.slice(6, 8);
				    var formattedDate = year + '-' + month + '-' + day;

				    return formattedDate;
				}
			}
			
			$.ajax({
				url : './adm/selectUsrMapHist.do',
			    type : "POST",
			    data : {"usrId": usrId},
				dataType : 'json',
			    success : function(result){
			        var resultList = $("#admTbUsrMapHistBody");
			        resultList.empty();
			        var html = "";
			        
			        if (result.list != null && result.list.length > 0) {
						$.each(result.list, function(k,v) {
							html +=   '<tr>'
									+ '    <td><span>'+ (result.list.length-k) +'</span></td>'
									+ '    <td><span style="text-align: left;">' + v.map_nm + '</span></td>';
							
							if(v.map_ty == '' || v.map_ty == undefined) {
								html += '    <td><span>-</span></td>';
							} else {
								html += '    <td><span>' + v.map_ty + '</span></td>';
							
							}	
							html += '    <td><span>' + formatDate(v.acqs_date) + '</span></td>';
							
							if(v.del_date == '' || v.del_date == undefined) {
								html += '    <td><span>' + formatDate(v.reg_date) + '</span></td>'
										+ '  <td><span>-</span></td>';
							} else {
								html += '    <td><span>-</span></td>'
										+ '  <td><span>' + formatDate(v.del_date) + '</span></td>';
							}
						});
					} else {
						html +=   '<tr>'
						    + '    	 <td colspan="6"><span>There is no result.</span></td>';
					}
			        
					resultList.append(html);
			    }
			});
		},
		updateUsrInfo:function(){
			var usrId = $("#admUsrInfoId").val();
			var eml = $("#admUsrInfoEml").val();
			var telno = $("#admUsrInfoTelno").val();
			var grpId = $("#admUsrInfoGrp").val();
			var inst = $("#admUsrInfoInst").val();
			var dept = $("#admUsrInfoDept").val();
			var mdfr = USR.usrId;
			
			var param={
				"usrId": usrId,
				"eml": eml,
				"telno": telno,
				"grpId": grpId,
				"inst": inst,
				"dept": dept,
				"mdfr": mdfr,
			}
			
			$.ajax({
				url : './adm/updateAdmUsrInfo.do',
				type : 'POST',
				data : param,
				dataType : 'json',
				success : function(result) {
					if(result.rs == "FAIL") {
						CMM.alert('회원정보 변경에 실패했습니다.','warning');
						return;
					} else if(result.rs == "SAME") {
						CMM.alert('변경된 정보가 없습니다.','info');
						return;
					} else if(result.rs == "DONE") {
						
						CMM.alert('회원정보가 변경되었습니다.','info',ADM_USR.updateRefresh(usrId));
						return;
					} else {
						CMM.alert('회원정보가 없습니다.','warning');
					}
				}
			});
		},
		updateRefresh:function(usrId){
			ADM_USR.selectUsrInfo(usrId);
			ADM_USR.selectUsrList(1);
		},
		deleteUsrInfo:function(){
			var usrId = $("#admUsrInfoId").val();
			$.ajax({
				url:"./adm/deleteAdmUsrInfo.do",
				type : "POST",
				data : {"usrId": usrId},
				dataType:'json',
				success:function(result){
					if(result.rs=="ERROR"){
						CMM.alert('회원정보 삭제를 실패했습니다.','warning');
						return false;
					}
					if(result.rs=="DONE"){
						CMM.alert('회원정보 삭제가 완료되었습니다.','info',ADM_USR.selectUsrList(1));
						ADM_USR.resetAdmUsr();
					}
				}
			})
		},
		resetAdmUsr:function(){
			$("#admUsrSearch").val("");
			$("#admUsrInfoId").val("-");
			$("#admUsrInfoNm").val("-");
			$("#admUsrInfoEml").val("-");
			$("#admUsrInfoTelno").val("-");
			$("#admUsrInfoGrp").val("");
			$("#admUsrInfoInst").val("");
			$("#admUsrInfoDept").val("");
			var html='';
			var resultList = $("#admTbUsrLogListBody");
		    resultList.empty();
		    html +=   '<tr>'
			    + '    	 <td colspan="4"><span>-</span></td>';
		    resultList.append(html);
		},
		// 페이징
		paging:function(pageId){
			var pageInfo = ADM_USR.table.page.info();
			$('#'+pageId).empty();
			var html='';
			if(pageInfo != null){
				if(pageInfo.recordsTotal != 0){
					if(pageInfo.pages >= 0){
						html += '<button type="button" onclick="javascript:ADM_USR.table.page(0).draw(\'page\');ADM_USR.insertCurrPageNum(\'' + pageId + '\');"><i class="ico"></i></button>'
						+ '<a href="javascript:ADM_USR.table.page(\'previous\').draw(\'page\');ADM_USR.insertCurrPageNum(\'' + pageId + '\');">Prev</a>'
						+ '<label>'
						+ '<input type="text" style="display: none;">'
						+ '<input type="number" id="'+pageId+'_num" value="'+(ADM_USR.table.page()+1)+'" onkeypress="if(event.keyCode == 13 && CMM.isPage(this.id, this.value,'+pageInfo.pages+'))ADM_USR.table.page(this.value-1).draw(\'page\');" oninput="CMM.maxLengthCheck(this)" maxlength="4"></label>'
						+ '<em>of</em>'
						+ '<label>'					
						+ '<input type="text" value="'+pageInfo.pages+'" readonly>'
						+ '</label>';
						
						html += '<a href="javascript:ADM_USR.table.page(\'next\').draw(\'page\');ADM_USR.insertCurrPageNum(\'' + pageId + '\');">Next</a>';
						html += '<button type="button" onclick="javascript:ADM_USR.table.page('+ (pageInfo.pages-1) +').draw(\'page\');ADM_USR.insertCurrPageNum(\'' + pageId + '\');"><i class="ico"></i></button>';
						
						$('#'+pageId).append(html);
					}
				} else {
					$('#'+pageId).empty();
				}
			}
		},
		insertCurrPageNum:function(pageId) {
			var currPageNum = ADM_USR.table.page()+1;
			$('#'+pageId+'_num').val(currPageNum);
		}
};

$('#cmmLiAdm').click(function() {
	$(".Adminpop .L-container .tab-container ol li").eq(0).trigger("click");
});

$('#admUsrMng').click(function() {
	$("#admSpCnt").text(ADM_USR.cnt);
	$('#admUsrMng').addClass("active");
	$('#admGrpMng').removeClass("active");
	ADM_USR.resetAdmUsr();
	ADM_USR.setAuthSelect();
	ADM_USR.selectUsrList(1);
	$(".Adminpop .L-container .tab-detail-container .tab-Box").eq(0).addClass("active")
	$(".R-container .tab-detail-container .tab-Box").eq(0).addClass("active");
	$(".Adminpop .L-container .tab-detail-container .tab-Box").eq(1).removeClass("active");
	$(".R-container .tab-detail-container .tab-Box").eq(1).removeClass("active");
});

$('#admUsrSearchTy').change(function() {
	var type = $("#admUsrSearchTy").val();
	if(type == "3") {
		$("#admDiSearch").removeClass("active");
		$("#admDiSearchGrp").addClass("active");
	} else {
		$("#admDiSearch").addClass("active");
		$("#admDiSearchGrp").removeClass("active");
	}
});

// 검색 버튼
$('.sort-container input[type="button"]').click(function() {
	ADM_USR.selectUsrList(1);
});

// 검색 엔터키
//document.getElementById('admUsrSearch').addEventListener('keypress', function(event) {
//    if (event.keyCode === 13) {
//        event.preventDefault(); // 기본 동작 방지
//        ADM_USR.selectUsrList(1);
//    }
//});

// 사용자 편집 버튼
$('#admBtUsrEdit').click(function() {
	if($("#admUsrInfoId").val() == "-") {
		CMM.alert("선택된 사용자가 없습니다.",'info')
	} else {
		CMM.alert('회원정보를 수정하시겠습니까?','confirm',ADM_USR.updateUsrInfo);
	}
});

//사용자 삭제 버튼
$('#admBtUsrDelete').click(function() {
	if($("#admUsrInfoId").val() == "-") {
		CMM.alert("선택된 사용자가 없습니다.",'info')
	} else {
		CMM.alert('회원정보를 삭제하시겠습니까?','delete',ADM_USR.deleteUsrInfo);
	}
});
