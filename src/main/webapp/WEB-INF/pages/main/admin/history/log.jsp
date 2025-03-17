<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<c:set var="pageFolder" value="admin"/>
<c:set var="pageCss" value="log"/>
<%@ include file="/WEB-INF/pages/common/layout/main-head.jsp" %>
<body class="d-flex flex-column">
    <script src="${path}/resources/js/common/tabler/demo-theme.min.js"></script>
    <div class="page-log">
        <%@ include file="/WEB-INF/pages/common/layout/main-header.jsp" %>
        <!-- Sidebar -->
        <%@ include file="/WEB-INF/pages/main/admin/view.jsp" %>
        <div class="page-wrapper">
            <!-- Page header -->
            <div class="page-header d-print-none">
                <div class="container-xl">
                    <div class="row g-2 align-items-center">
                        <div class="col">
                            <h2 class="page-title">
                                History > User Activity Log
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Page body -->
            <div class="page-body">
                <div class="container-xl">
                    <div class="card">
                        <!-- Card header: 검색창 및 총 건수 표시 -->
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <div class="input-group">
                                <label for="search-input" class="visually-hidden">Search</label>
                                <input type="text" id="search-input" name="search" class="form-control" placeholder="Search" aria-label="Search">
                                <button id="search-btn" class="btn btn-square-light" type="button">
                                	<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-zoom"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg>
                                </button>
                            </div>
                            <span class="text-muted">Total: <span id="log-count">0</span></span>
                        </div>
                        <!-- Card body: 로그 목록 테이블 -->
                        <div class="card-body p-0">
                            <table class="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Name</th>
                                        <th>Content</th>
                                        <th>IP</th>
                                        <th>Access</th>
                                    </tr>
                                </thead>
                                <tbody id="log-table-body">
                                    <tr>
                                        <td colspan="5" class="text-center">Loading...</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <!-- Card footer: 페이지네이션 -->
                        <div class="card-footer d-flex justify-content-center">
                            <nav>
                                <ul class="pagination">
                                    <!-- Previous 버튼 -->
                                    <li class="page-item disabled">
                                        <a class="page-link" href="#" id="prev-page" tabindex="-1" aria-disabled="true">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                                                 stroke-linecap="round" stroke-linejoin="round" class="icon icon-1">
                                                <path d="M15 6l-6 6 6 6"></path>
                                            </svg>
                                            prev
                                        </a>
                                    </li>
                                    <!-- 숫자 버튼 영역 -->
                                    <span id="pagination-numbers"></span>
                                    <!-- Next 버튼 -->
                                    <li class="page-item">
                                        <a class="page-link" href="#" id="next-page">
                                            next
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                                                 stroke-linecap="round" stroke-linejoin="round" class="icon icon-1">
                                                <path d="M9 6l6 6-6 6"></path>
                                            </svg>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div><!-- card -->
                </div><!-- container-xl -->
            </div><!-- page-body -->
            <!-- Footer -->
            
        </div><!-- page-wrapper -->
    </div><!-- page -->
    <!-- 스크립트 참조 -->
    <script src="${path}/resources/js/main/user/auth.js"></script>
    <!-- log.js: 로그 데이터 불러오기, 검색, 페이지네이션 기능 구현 -->
    <script src="${path}/resources/js/main/admin/log.js"></script>
    <script src="${path}/resources/js/common/common.js"></script>
    <script src="${path}/resources/js/common/tabler/tabler.min.js" defer></script>
    <script src="${path}/resources/js/common/tabler/demo.min.js" defer></script>
    <script src="${path}/resources/libs/list.js/dist/list.min.js" defer></script>
</body>
</html>
