<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<!DOCTYPE html>
<html lang="en">
<c:set var="pageFolder" value="map" />
<c:set var="pageCss" value="map" />
<%@ include file="/WEB-INF/pages/common/layout/main-head.jsp"%>
<body class="d-flex flex-column">
	<script src="${path}/resources/js/common/tabler/demo-theme.min.js"></script>
	<div class="page">
		<%@ include file="/WEB-INF/pages/common/layout/main-header.jsp"%>
		<!-- Vertical Tab Navigation -->
		<div class="navbar-tabs-vertical">
			<ul class="nav flex-column py-2">
				<li class="nav-item">
					<a href="#sidebar-layers" class="nav-link active" data-bs-toggle="tab">
						<span class="nav-link-text">LAYERS</span>
					</a>
				</li>
				<li class="nav-item">
					<a href="#sidebar-search" class="nav-link" data-bs-toggle="tab">
						<span class="nav-link-text">SEARCH</span>
					</a>
				</li>
				<sec:authorize access="hasAuthority('MAP_MANAGEMENT')">
					<li class="nav-item">
						<a href="#sidebar-manage" class="nav-link" data-bs-toggle="tab">
							<span class="nav-link-text">MANAGE</span>
						</a>
					</li>
				</sec:authorize>
				<li class="nav-item">
					<a href="#" class="nav-link sidebar-toggle" id="sidebarToggle">
						<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M15 6l-6 6l6 6"></path></svg>
					</a>
				</li>
			</ul>
		</div>
		<!-- Sidebar Panel Container -->
		<aside class="navbar navbar-vertical navbar-sidebar" id="sidebar">
			<div class="tab-content border-end h-100">
			    <div class="tab-pane active show" id="sidebar-layers">
					<div class="d-flex flex-row">
						<div class="flex-grow-1">
							<div class="card">
								<div class="card-header">
									<ul class="nav nav-tabs card-header-tabs nav-fill" data-bs-toggle="tabs">
										<li class="nav-item">
											<a href="#tabs-layers" class="nav-link active" data-bs-toggle="tab">Layers</a>
										</li>
										<li class="nav-item">
											<a href="#tabs-landuse" class="nav-link" data-bs-toggle="tab">Land Use</a>
										</li>	
									</ul>
								</div>
								<div class="card-body">
									<div class="tab-content">
										<div class="tab-pane active show" id="tabs-layers">
											<div class="accordion layer-accordion">
												<div class="accordion-item">
													<h2 class="accordion-header">
														<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#basemap">
															Base Map
														</button>
										                <span class="form-range header-slider me-3" id="basemapSlider"></span>
													</h2>
													<div id="basemap" class="accordion-collapse collapse show">
														<div class="accordion-body pt-0">
															<label class="form-check">
																<input type="radio" class="form-check-input" name="basemap" value="osm_standard" checked="">
																<span class="form-check-label">OSM Map</span>
															</label>
															<label class="form-check">
																<input type="radio" class="form-check-input" name="basemap" value="osm_standard2">
																<span class="form-check-label">OSM Map (Alternative)</span>
															</label>
															<label class="form-check">
																<input type="radio" class="form-check-input" name="basemap" value="google_road">
																<span class="form-check-label">Google Maps</span>
															</label>
															<label class="form-check">
																<input type="radio" class="form-check-input" name="basemap" value="google_satellite">
																<span class="form-check-label">Google Satellite</span>
															</label>
															<label class="form-check">
																<input type="radio" class="form-check-input" name="basemap" value="google_hybrid">
																<span class="form-check-label">Google Hybrid</span>
															</label>
															<label class="form-check">
																<input type="radio" class="form-check-input" name="basemap" value="2gis">
																<span class="form-check-label">2GIS Map</span>
															</label>
															<label class="form-check">
																<input type="radio" class="form-check-input" name="basemap" value="geology">
																<span class="form-check-label">Geology Map</span>
															</label>
														</div>
													</div>
												</div>
												<div class="accordion-item">
													<h2 class="accordion-header">
														<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#rasters">
															Rasters
														</button>
													</h2>
													<div id="rasters" class="accordion-collapse collapse show">
														<div class="accordion-body pt-0">
														    <div class="d-flex">
															    <label class="form-check">
														            <input type="checkbox" class="form-check-input" value="aerial">
														            <span class="form-check-label">Aerial photography</span>
													            </label>
														        <div class="form-range ms-auto" id="aerialSlider"></div>
														    </div>
														    <div class="d-flex">
															    <label class="form-check">
														            <input type="checkbox" class="form-check-input" value="satellite">
														            <span class="form-check-label">Satellite photography</span>
													            </label>
														        <div class="form-range ms-auto" id="satelliteSlider"></div>
														    </div>
														</div>
													</div>
												</div>
												<div class="accordion-item">
													<h2 class="accordion-header">
														<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#borders">
															Borders
														</button>
													</h2>
													<div id="borders" class="accordion-collapse collapse show">
														<div class="accordion-body pt-0">
															<div class="d-flex">
																<label class="form-check">
														            <input type="checkbox" class="form-check-input" value="province">
														            <span class="form-check-label">Province</span>
													            </label>
														        <div class="form-range ms-auto" id="provinceSlider"></div>
														    </div>
														    <div class="d-flex">
															    <label class="form-check">
														            <input type="checkbox" class="form-check-input" value="district">
														            <span class="form-check-label">District</span>
													            </label>
														        <div class="form-range ms-auto" id="districtSlider"></div>
														    </div>
														    <div class="d-flex">
															    <label class="form-check">
														            <input type="checkbox" class="form-check-input" value="community">
														            <span class="form-check-label">Community</span>
															    </label>
														        <div class="form-range ms-auto" id="communitySlider"></div>
														    </div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div class="tab-pane" id="tabs-landuse">
										    <div class="btn-group w-100 mb-4">
										        <input type="radio" class="btn-check" id="landType" name="classType" value="type" checked>
										        <label class="btn btn-outline-primary w-50 fs-5 py-2" for="landType">Type</label>
										
										        <input type="radio" class="btn-check" id="landClass" name="classType" value="class">
										        <label class="btn btn-outline-primary w-50 fs-5 py-2" for="landClass">Classification</label>
										    </div>
											<div class="d-flex justify-content-end mb-2">
										        <button class="btn btn-sm me-2 px-2" id="expandAllBtn">
										            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevrons-down" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M7 7l5 5l5 -5"></path><path d="M7 13l5 5l5 -5"></path></svg>
										            Expand All
										        </button>
										        <button class="btn btn-sm px-2" id="selectAllBtn">
										            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-check" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l5 5l10 -10"></path></svg>
										            Select All
										        </button>
										    </div>
											<!-- 아코디언 메뉴 -->
											<div class="card landuse-card">
										        <div class="card-header">
										            <h4 class="card-title">Land Use Map</h4>
										            <div class="form-range ms-auto" id="landuseSlider"></div>
										        </div>
										        <div class="card-body p-0" id="landuseAccordion"></div>
										    </div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- Search Panel -->
				<div class="tab-pane h-100" id="sidebar-search">
					<div class="card h-100">
						<div class="card-header">
							<h3 class="card-title">Search Result</h3>
						</div>
						<div class="card-body border-bottom py-3">
							<div class="d-flex">
								<div class="text-secondary">
									Show
									<div class="mx-2 d-inline-block">
										<input type="text" class="form-control form-control-sm" id="searchPageUnit" value="10" size="3">
									</div>
									entries
								</div>
								<div class="text-secondary ms-auto" id="searchTotalCount">
									Total: 0
								</div>
							</div>
						</div>
						<div class="table-responsive">
							<table class="table table-vcenter card-table">
								<thead class="sticky-top">
									<tr>
										<th class="w-1">No</th>
										<th class="w-1">Target</th>
										<th>Location</th>
									</tr>
								</thead>
								<tbody id="searchResultTable">
									<tr>
										<td colspan="3" class="text-center text-muted py-4">
						                    No results found
						                </td>
					                </tr>
								</tbody>
							</table>
						</div>
						<div class="card-footer">
							<ul class="pagination justify-content-center m-0" id="searchPagination">
								<li class="page-item disabled">
									<a class="page-link" href="#">
						                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-1">
						                    <path d="M15 6l-6 6l6 6"></path>
						                </svg>
						                prev
						            </a>
					            </li>
					            <li class="page-item disabled">
					            	<a class="page-link" href="#">1</a>
					            </li>
					            <li class="page-item disabled">
					            	<a class="page-link" href="#">
						                next 
						                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-1">
						                    <path d="M9 6l6 6l-6 6"></path>
						                </svg>
					            	</a>
					            </li>
				            </ul>
						</div>
					</div>
				</div>
				<!-- Manage Panel -->
				<div class="tab-pane h-100" id="sidebar-manage">
					<div class="card">
						<div class="card-header">
							<ul class="nav nav-tabs card-header-tabs nav-fill" data-bs-toggle="tabs">
								<li class="nav-item">
									<a href="#tabs-data-upload" class="nav-link active" data-bs-toggle="tab">Data Upload</a>
								</li>
								<li class="nav-item">
									<a href="#tabs-map-edit" class="nav-link" data-bs-toggle="tab">Map Edit</a>
								</li>
								<li class="nav-item">
									<a href="#tabs-symbol-edit" class="nav-link" data-bs-toggle="tab">Symbol Edit</a>
								</li>
							</ul>
						</div>
						<div class="card-body">
							<div class="tab-content">
								<div class="tab-pane active show" id="tabs-data-upload">
									<form id="dataUploadForm" name="dataUploadForm" method="post" enctype="multipart/form-data">
										<!-- 업로드 유형 -->
								        <div class="mb-3">
								            <label class="form-label required">Upload Type</label>
								            <div class="form-selectgroup">
								                <label class="form-selectgroup-item">
								                    <input type="radio" class="form-selectgroup-input" name="uploadType" value="layer" required>
								                    <span class="form-selectgroup-label">Layer</span>
								                </label>
								                <label class="form-selectgroup-item">
								                    <input type="radio" class="form-selectgroup-input" name="uploadType" value="symbol" required>
								                    <span class="form-selectgroup-label">Symbol</span>
								                </label>
								            </div>
								        </div>
								        
								        <!-- 프로세스 옵션 -->
								        <div class="mb-3" id="processContainer">
								            <label class="form-label required">Layer Processing Method</label>
								            <div class="form-selectgroup">
								                <label class="form-selectgroup-item">
								                    <input type="radio" class="form-selectgroup-input" name="layerProcess" value="append">
								                    <span class="form-selectgroup-label">Append to existing layer</span>
								                </label>
								                <label class="form-selectgroup-item">
								                    <input type="radio" class="form-selectgroup-input" name="layerProcess" value="replace">
								                    <span class="form-selectgroup-label">Replace existing layer</span>
								                </label>
								            </div>
								        </div>
								        
								        <!-- 파일 업로드 영역 -->
								        <div class="mb-3">
											<label class="form-label required">File</label>
											<input type="file" class="form-control" id="dataFile" name="dataFile" multiple>
										</div>
								
								        <!-- 진행 상태 표시 (업로드 시작 후 표시) -->
								        <div class="mb-3 d-none" id="progressArea">
								            <label class="form-label">Upload Progress</label>
								            <div class="progress">
								                <div class="progress-bar" id="progressBar" style="width: 0%"></div>
								            </div>
								            <small class="text-muted" id="progressText">0 / 0 records processed</small>
								        </div>
										
										<!-- 알림 -->
										<div id="dataUploadAlertContainer"></div>
										
								        <!-- 정보 알림 -->
								        <div class="alert alert-info mb-3">
								            <h4 class="alert-heading">Note</h4>
								            <ul class="list-unstyled">
								                <li>※ Required file formats: .shp, .shx, .dbf, .prj</li>
								                <li>※ Maximum file size: 200MB per file</li>
								                <li>(Some files Over 60MB, will be processed by schedule in order)</li>
								                <li>※ All required files must be uploaded together</li>
								                <li>※ When file upload is done, the map layer will be replaced with uploaded data.</li>
								            </ul>
								        </div>
								
								        <!-- 버튼 영역 -->
								        <div class="d-flex justify-content-end gap-2">
								            <button type="submit" class="btn btn-primary" id="dataUploadBtn" disabled>Upload</button>
								            <button type="button" class="btn btn-outline-secondary" id="dataClearBtn">Clear</button>
								        </div>
							    	</form>
								</div>
								<div class="tab-pane" id="tabs-map-edit">
					                <!-- 편집 버튼 그룹 -->
					                <div class="d-flex gap-2 mb-3">
					                    <button type="button" class="btn btn-primary w-50" id="editStartBtn">
					                        Edit Start
					                    </button>
					                    <button type="button" class="btn btn-secondary w-50" id="editStopBtn">
					                        Edit Stop
					                    </button>
					                </div>
					                <div class="mb-3">
										<label class="form-label">Toolbar</label>
										<div class="btn-group w-100">
											<div class="btn-group w-100 me-2">
												<input type="radio" class="btn-check" name="editMode" id="selectModeBtn">
												<label for="selectModeBtn" class="btn btn-icon" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="bottom" data-bs-offset="0,12" title="Select">
													<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-pointer"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7.904 17.563a1.2 1.2 0 0 0 2.228 .308l2.09 -3.093l4.907 4.907a1.067 1.067 0 0 0 1.509 0l1.047 -1.047a1.067 1.067 0 0 0 0 -1.509l-4.907 -4.907l3.113 -2.09a1.2 1.2 0 0 0 -.309 -2.228l-13.582 -3.904l3.904 13.563z" /></svg>
												</label>
												<input type="radio" class="btn-check" name="editMode" id="drawModeBtn">
												<label for="drawModeBtn" class="btn btn-icon" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="bottom" data-bs-offset="0,12" title="Draw">
													<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-pencil-bolt"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /><path d="M19 16l-2 3h4l-2 3" /></svg>
												</label>
												<input type="radio" class="btn-check" name="editMode" id="modifyModeBtn">
												<label for="modifyModeBtn" class="btn btn-icon" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="bottom" data-bs-offset="0,12" title="Modify">
													<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
												</label>
												<input type="radio" class="btn-check" name="editMode" id="deleteModeBtn">
												<label for="deleteModeBtn" class="btn btn-icon" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="bottom" data-bs-offset="0,12" title="Delete">
													<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
												</label>
											</div>
											<div class="btn-group w-50">
												<button type="button" class="btn btn-icon" id="editUndoBtn" data-bs-toggle="tooltip"  data-bs-trigger="hover" data-bs-placement="bottom" data-bs-offset="0,12" title="Undo">
													<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-back-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 14l-4 -4l4 -4" /><path d="M5 10h11a4 4 0 1 1 0 8h-1" /></svg>
												</button>
												<button type="button" class="btn btn-icon" id="editRedoBtn" data-bs-toggle="tooltip"  data-bs-trigger="hover" data-bs-placement="bottom" data-bs-offset="0,12" title="Redo">
													<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-forward-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 14l4 -4l-4 -4" /><path d="M19 10h-11a4 4 0 1 0 0 8h1" /></svg>
												</button>
											</div>
										</div>
									</div>
						            <!-- 알림 정보 -->
							        <div class="alert alert-info mb-3">
							            <h4 class="alert-heading">Note</h4>
							            <ul class="list-unstyled">
							            	<li>※ Select geometry(Polygon, line, point).</li>
					                        <li>※ Adjust geometry by selecting and moving vertices.</li>
					                        <li>※ You can edit attributes of geometry data.</li>
							            </ul>
							        </div>
								        
					                <!-- 버튼 영역 -->
							        <div class="d-flex justify-content-end gap-2">
							            <button type="button" class="btn btn-primary" id="editSaveBtn">Save</button>
							            <button type="button" class="btn btn-outline-secondary" id="editDiscardBtn">Discard</button>
							        </div>
								</div>
								<div class="tab-pane" id="tabs-symbol-edit">
								    <div class="symbol-container">
									    <!-- 검색 및 버튼 영역 -->
									    <div class="d-flex gap-2 mb-3">
									        <div class="input-icon w-75">
									            <span class="input-icon-addon">
									                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path><path d="M21 21l-6 -6"></path></svg>
									            </span>
									            <input type="text" id="symbolSearchTerm" class="form-control" placeholder="Search symbol name">
									        </div>
									        <button type="button" class="btn btn-primary w-25" id="symbolCreateBtn">Create</button>
									    </div>
									    
									    <!-- 테이블 영역 -->
									    <div class="card symbol-table-container">
									        <div class="table-responsive">
									            <table class="table table-vcenter card-table">
									                <thead class="sticky-top">
									                    <tr>
									                        <th>Code</th>
									                        <th>Image</th>
									                        <th>Name</th>
									                        <th>Edit</th>
									                    </tr>
									                </thead>
									                <tbody id="symbolResultTable">
									                </tbody>
									            </table>
									        </div>
									    </div>
									    
									    <!-- 미리보기 영역 -->
									    <div class="symbol-preview-container">
								            <div class="card-header">
								                <h3 class="card-title">Preview</h3>
								            </div>
								            <div class="card-body d-flex justify-content-center align-items-center py-0" id="symbolPreview">
								            </div>
									    </div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</aside>
		<!-- Map -->
		<div class="page-wrapper">
			<div class="position-relative h-100">
				<div id="map" class="w-100 h-100 ">
					<div class="toolbar-container d-none d-lg-block">
						<div class="d-flex flex-column gap-2">
							<!-- 전체화면 -->
							<div class="btn-group-vertical shadow-sm">
								<button type="button" class="btn btn-icon" data-action="fullscreen" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-offset="0,15" title="Fullscreen">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrows-maximize"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M16 4l4 0l0 4" /><path d="M14 10l6 -6" /><path d="M8 20l-4 0l0 -4" /><path d="M4 20l6 -6" /><path d="M16 20l4 0l0 -4" /><path d="M14 14l6 6" /><path d="M8 4l-4 0l0 4" /><path d="M4 4l6 6" /></svg>
								</button>
							</div>
							<!-- 확대/축소 그룹 -->
							<div class="btn-group-vertical shadow-sm">
								<button type="button" class="btn btn-icon" data-action="zoomIn" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-offset="0,15" title="Zoom in">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus"> <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
								</button>
								<button type="button" class="btn btn-icon" data-action="zoomOut" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-offset="0,15" title="Zoom out">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-minus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /></svg>
								</button>
							</div>
							<!-- 측정 도구 그룹 -->
							<div class="btn-group-vertical shadow-sm">
								<button type="button" class="btn btn-icon" data-action="defaultLocation" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-offset="0,15" title="Default Location">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-home"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" /></svg>
								</button>
								<button type="button" class="btn btn-icon" data-action="myLocation" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-offset="0,15" title="My Location">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-current-location"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0" /><path d="M12 2l0 2" /><path d="M12 20l0 2" /><path d="M20 12l2 0" /><path d="M2 12l2 0" /></svg>
								</button>
								<button type="button" class="btn btn-icon" data-action="refresh" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-offset="0,15" title="Refresh">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-refresh"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>
								</button>
								<button type="button" class="btn btn-icon" data-action="distanceMeasurement" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-offset="0,15" title="Distance Measurement">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-ruler-measure"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19.875 12c.621 0 1.125 .512 1.125 1.143v5.714c0 .631 -.504 1.143 -1.125 1.143h-15.875a1 1 0 0 1 -1 -1v-5.857c0 -.631 .504 -1.143 1.125 -1.143h15.75z" /><path d="M9 12v2" /><path d="M6 12v3" /><path d="M12 12v3" /><path d="M18 12v3" /><path d="M15 12v2" /><path d="M3 3v4" /><path d="M3 5h18" /><path d="M21 3v4" /></svg>
								</button>
								<button type="button" class="btn btn-icon" data-action="areaMeasurement" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-offset="0,15" title="Area Measurement">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-shape"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M19 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M5 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M19 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M5 7l0 10" /><path d="M7 5l10 0" /><path d="M7 19l10 0" /><path d="M19 7l0 10" /></svg>
								</button>
								<div class="btn-group">
									<button type="button" class="btn btn-icon" data-action="curtainView" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-offset="0,15" title="Curtain View" data-bs-placement="left">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-bar-both"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 12h-6" /><path d="M5 15l-3 -3l3 -3" /><path d="M22 12h-6" /><path d="M19 15l3 -3l-3 -3" /><path d="M12 4v16" /></svg>
									</button>
									<div class="dropdown-menu toolbar-menu" id="curtainMenu">
										<div class="px-3">
											<div class="d-flex justify-content-between border-bottom p-2">
												<div class="fw-bold">Curtain View</div>
												<div class="form-check form-switch mb-0">
													<input class="form-check-input" type="checkbox" id="curtainSwitch">
												</div>
											</div>
											<div class="toolbar-menu-list">
												<label class="py-1">
													<input type="radio" class="align-middle me-2" name="curtainView" value="right_osm_standard" checked>
													<span>OSM Map</span>
												</label>
												<label class="py-1">
													<input type="radio" class="align-middle me-2" name="curtainView" value="right_osm_standard2">
													<span>OSM Map (Alternative)</span>
												</label>
												<label class="py-1">
													<input type="radio" class="align-middle me-2" name="curtainView" value="right_google_road">
													<span>Google Maps</span>
												</label>
												<label class="py-1">
													<input type="radio" class="align-middle me-2" name="curtainView" value="right_google_satellite">
													<span>Google Satellite</span>
												</label>
												<label class="py-1">
													<input type="radio" class="align-middle me-2" name="curtainView" value="right_google_hybrid">
													<span>Google Hybrid</span>
												</label>
												<label class="py-1">
													<input type="radio" class="align-middle me-2" name="curtainView" value="right_2gis">
													<span>2GIS Map</span>
												</label>
												<label class="py-1">
													<input type="radio" class="align-middle me-2" name="curtainView" value="right_geology">
													<span>Geology Map</span>
												</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div id="mapPopup" class="map-popup"></div>
					<div id="mapPopupEdit" class="map-popup-edit"></div>
				</div>
			</div>
		</div>
	</div>
	<script src="${path}/resources/libs/openLayers/v6.15.1-dist/ol.js"></script>
	<script src="${path}/resources/libs/openLayers/ol-ext-v4.0.24/ol-ext.min.js"></script>
	<script src="${path}/resources/js/common/common.js"></script>
	<script src="${path}/resources/js/main/map/map-config.js"></script>
	<script src="${path}/resources/js/main/map/map.js"></script>
	<script src="${path}/resources/js/main/map/map-search.js" defer></script>
	<script src="${path}/resources/js/common/tabler/tabler.min.js" defer></script>
	<script src="${path}/resources/js/common/tabler/demo.min.js" defer></script>
	<sec:authorize access="hasAuthority('MAP_MANAGEMENT')">
		<script src="${path}/resources/js/main/map/map-upload.js" defer></script>
		<script src="${path}/resources/js/main/map/map-edit.js" defer></script>
		<script src="${path}/resources/js/main/map/map-symbol.js" defer></script>
	</sec:authorize>
</body>
</html>