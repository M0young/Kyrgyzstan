<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="en">
<c:set var="pageFolder" value="admin" />
<c:set var="pageCss" value="mapping" />
<%@ include file="/WEB-INF/pages/common/layout/main-head.jsp"%>
<body class="d-flex flex-column">
    <script src="${path}/resources/js/common/tabler/demo-theme.min.js"></script>
    <%@ include file="/WEB-INF/pages/common/layout/main-header.jsp"%>
    <div class="page-mapping">
        <!-- Sidebar -->
        <%@ include file="/WEB-INF/pages/main/admin/view.jsp" %>
        <div class="page-wrapper">
            <!-- Page header -->
            <div class="page-header d-print-none">
                <div class="container-xl">
                    <div class="row g-2 align-items-center">
                        <div class="col">
                            <h2 class="page-title">Code Management > Land Use Mapping</h2>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Page body -->
            <div class="page-body">
                <div class="container-xl">
					<div class="row row-cards">
						<!-- Role list -->
						<div class="col-lg-7">
							<div class="card" id="mapping-list-card">
								<!-- card header -->
								<div class="card-header d-flex justify-content-between align-items-center">
	                                    <h3 class="card-title">Classification List</h3>
	                                    <span class="text-muted">Total: <span id="mapping-count"></span></span>
	                            </div>
	                            <!-- table -->
								<div class="card-body">
									<table class="table table-bordered table-hover">
										<thead>
											<tr>
												<th>Code</th>
												<th>Classification</th>
											</tr>
										</thead>
										<tbody id="mapping-table-body">
										  	<tr>
										  		<td colspan="9" class="text-center">Loading...</td>
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
					                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-1">
					                        <path d="M15 6l-6 6l6 6"></path>
					                      </svg>
					                      prev
					                    </a>
					                  </li>
					                  <!-- 페이지 번호 동적으로 삽입 -->
					                  <span id="pagination-numbers"></span>
					
					                  <!-- Next 버튼 -->
					                  <li class="page-item">
					                    <a class="page-link" href="#" id="next-page">
					                      next
					                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-1">
					                        <path d="M9 6l6 6l-6 6"></path>
					                      </svg>
					                    </a>
					                  </li>
					                </ul>
					              </nav>
					            </div>
							</div>
						</div>
						
						<!-- Role Authority -->
						<div class="col-lg-5">
							<div class="card" id="mapping-card">
								<!-- card header -->
								<div class="card-header">
									<h3 class="card-title">Subclassification List</h3>
								</div>
								<!-- card body -->
								<div class="card-body">
									<div class="role-section">
									    <div id="sub-mapping-list"></div>
									</div>

								</div>
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
    <script src="${path}/resources/js/common/common.js"></script>
	<script src="${path}/resources/js/main/admin/mapping.js"></script>
    <script src="${path}/resources/js/common/tabler/tabler.min.js" defer></script>
    <script src="${path}/resources/js/common/tabler/demo.min.js" defer></script>
    <script src="${path}/resources/libs/list.js/dist/list.min.js" defer></script>
</body>
</html>