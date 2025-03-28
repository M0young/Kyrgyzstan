<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="en">
<c:set var="pageFolder" value="admin" />
<c:set var="pageCss" value="role" />
<%@ include file="/WEB-INF/pages/common/layout/main-head.jsp"%>
<body class="d-flex flex-column">
    <script src="${path}/resources/js/common/tabler/demo-theme.min.js"></script>
    <%@ include file="/WEB-INF/pages/common/layout/main-header.jsp"%>
    <div class="page-role">
        <!-- Sidebar -->
        <%@ include file="/WEB-INF/pages/main/admin/view.jsp" %>
        <div class="page-wrapper">
            <!-- Page header -->
            <div class="page-header d-print-none">
                <div class="container-xl">
                    <div class="row g-2 align-items-center">
                        <div class="col">
                            <h2 class="page-title">Role Management</h2>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Page body -->
            <div class="page-body">
                <div class="container-xl">
					<div class="row row-cards">
						<!-- Role list -->
						<div class="col-lg-8">
							<div class="card" id="role-list-card">
								<!-- card header -->
								<div class="card-header d-flex justify-content-between align-items-center">
	                                    <h3 class="card-title">Role List</h3>
	                                    <button class="btn btn-primary create-btn">
	                                    Create
	                                    </button>
	                            </div>
	                            <!-- table -->
								<div class="card-body">
									<table class="table table-bordered table-hover">
										<thead>
											<tr>
                                                <th>No</th>
                                                <th>Name</th>
                                                <th>Registered By</th>
                                                <th>Registered On</th>
                                                <th>Modified On</th>
                                                <th>Edit</th>
											</tr>
										</thead>
                                        <tbody id="role-table-body">
                                            <tr>
                                                <td colspan="6" class="text-center">Loading...</td>
                                            </tr>
                                        </tbody>
									</table>
								</div>
								
								<!-- card footer -->
								<div class="card-footer d-flex justify-content-center">
								    <nav>
								        <ul class="pagination">
								            <!-- Previous 버튼 -->
								            <li class="page-item disabled">
								                <a class="page-link" href="#" id="prev-page" tabindex="-1" aria-disabled="true">
								                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-1"><path d="M15 6l-6 6l6 6"></path></svg>
								                    prev
								                </a>
								            </li>
								
								            <!-- 페이지 번호 동적으로 삽입 -->
								            <span id="pagination-numbers"></span>
								
								            <!-- Next 버튼 -->
								            <li class="page-item">
								                <a class="page-link" href="#" id="next-page">
								                    next
								                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-1"><path d="M9 6l6 6l-6 6"></path></svg>
								                </a>
								            </li>
								        </ul>
								    </nav>
								</div>
							</div>
						</div>
						
						<!-- Role Authority -->
						<div class="col-lg-4">
							<div class="card" id="role-authority-card">
								<!-- card header -->
								<div class="card-header">
									<h3 class="card-title">Role Authority</h3>
								</div>
								<!-- card body -->
								<div class="card-body">
									<div class="role-section">
										<!-- 역할 소제목 -->
										<h4 class="role-title">Role - Authority</h4>
										<div class="accordion" id="roleAuthorityAccordion">
											<!-- Dashboard -->
											<div class="accordion-item">
												<h2 class="accordion-header">
													<button class="accordion-button d-flex align-items-center"
														type="button" data-bs-toggle="collapse"
														data-bs-target="#dashboard">
														
														<span>Dashboard</span>
													</button>
													<input type="checkbox" class="form-check-input parent-checkbox"	id="parent-checkbox">
												</h2>
												<div id="dashboard" class="accordion-collapse collapse show">
													<div class="accordion-body pt-0">
														<div class="list-group list-group-flush">
															<label class="list-group-item border-0">
																<div class="row align-items-center">
																	<div class="col-auto">
																		<input type="checkbox" class="form-check-input child-checkbox dashboard-child" data-authry-no="1" id="dashboard-view">
																	</div>
																	<div class="col ps-0">View</div>
																</div>
															</label>
														</div>
													</div>
												</div>
											</div>
						
											<!-- Map -->
											<div class="accordion-item">
												<h2 class="accordion-header">
													<button class="accordion-button d-flex align-items-center"
														type="button" data-bs-toggle="collapse" data-bs-target="#map">
														<span>Map</span>
													</button>
													<input type="checkbox" class="form-check-input parent-checkbox"	id="parent-checkbox">
												</h2>
												<div id="map" class="accordion-collapse collapse show">
													<div class="accordion-body pt-0">
														<div class="list-group list-group-flush">
															<label class="list-group-item border-0">
																<div class="row align-items-center">
																	<div class="col-auto">
																		<input type="checkbox"	class="form-check-input child-checkbox map-child" data-authry-no="2" id="map-view">
																	</div>
																	<div class="col ps-0">View</div>
																</div>
															</label> 
															<label class="list-group-item border-0">
																<div class="row align-items-center">
																	<div class="col-auto">
																		<input type="checkbox"	class="form-check-input child-checkbox map-child"	data-authry-no="4" id="map-upload">
																	</div>
																	<div class="col ps-0">Management</div>
																</div>
															</label>
														</div>
													</div>
												</div>
											</div>
						
											<!-- Admin -->
											<div class="accordion-item">
												<h2 class="accordion-header">
													<button class="accordion-button d-flex align-items-center"
														type="button" data-bs-toggle="collapse" data-bs-target="#admin">
														
														<span>Admin</span>
													</button>
													<input type="checkbox" class="form-check-input parent-checkbox"	id="parent-checkbox">
												</h2>
												<div id="admin" class="accordion-collapse collapse show">
													<div class="accordion-body pt-0">
														<div class="list-group list-group-flush">
															<label class="list-group-item border-0">
																<div class="row align-items-center">
																	<div class="col-auto">
																		<input type="checkbox"	class="form-check-input child-checkbox admin-child"	data-authry-no="3" id="admin-user-management">
																	</div>
																	<div class="col ps-0">View</div>
																</div>
															</label>
														</div>
													</div>
												</div>
											</div>
											<!-- card footer -->
											<div class="card-footer text-center">
												<button class="btn btn-outline-primary save-btn">SAVE</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
        	</div>
        	
    	</div>
    </div>
    <%@ include file="/WEB-INF/pages/main/admin/role/create-modal.jsp"%>
    <script src="${path}/resources/js/common/common.js"></script>
    <script src="${path}/resources/js/main/admin/role.js"></script>
    <script src="${path}/resources/js/common/tabler/tabler.min.js" defer></script>
    <script src="${path}/resources/js/common/tabler/demo.min.js" defer></script>
    <script src="${path}/resources/libs/list.js/dist/list.min.js" defer></script>
</body>
</html>