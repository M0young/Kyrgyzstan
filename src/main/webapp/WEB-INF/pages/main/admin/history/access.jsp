<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
    <c:set var="pageFolder" value="admin"/>
    <c:set var="pageCss" value="access"/>
    <%@ include file="/WEB-INF/pages/common/layout/main-head.jsp"%>
    <body class="d-flex flex-column">
        <script src="${path}/resources/js/common/tabler/demo-theme.min.js"></script>
        <div class="page-access">
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
                                    History > User Access
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="page-body">
                    <div class="container-xl">
                        <!-- 테이블 카드 -->
                        <div class="card" id="accessCard">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <div class="input-group">
                                    <label for="search-input" class="visually-hidden">Search</label>
                                    <input type="text" id="search-input" name="search" class="form-control" placeholder="Search" aria-label="Search">
                                    <button id="search-btn" class="btn btn-square-light" type="button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                                             stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-zoom">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"/>
                                            <path d="M21 21l-6 -6"/>
                                        </svg>
                                    </button>
                                </div>
                                <span class="text-muted">Total: <span id="access-count">0</span></span>
                            </div>
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
                                    <tbody id="access-table-body">
                                        <tr>
                                            <td colspan="5" class="text-center">Loading...</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="card-footer d-flex justify-content-center">
                                <nav>
                                    <ul class="pagination">
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
                                        <span id="pagination-numbers"></span>
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
                        </div>
                        
                        <!-- 차트 카드 -->
                        <div class="card mt-3" id="userAccessChart">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h4 class="mb-0">User Access</h4>
                                <div class="chart-controls">
                                    <select id="granularitySelect" class="form-select form-select-sm" style="width:auto;">
                                        <option value="monthly" selected>Monthly</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="daily">Daily</option>
                                    </select>
                                    <select id="yearSelect" class="form-select form-select-sm" style="width:auto;">
                                        <option value="2024">2024</option>
                                        <option value="2025" selected>2025</option>
                                    </select>
                                    <select id="monthSelect" class="form-select form-select-sm" style="width:auto;">
                                        <option value="1">Jan</option>
                                        <option value="2">Feb</option>
                                        <option value="3" selected>Mar</option>
                                        <option value="4">Apr</option>
                                        <option value="5">May</option>
                                        <option value="6">Jun</option>
                                        <option value="7">Jul</option>
                                        <option value="8">Aug</option>
                                        <option value="9">Sep</option>
                                        <option value="10">Oct</option>
                                        <option value="11">Nov</option>
                                        <option value="12">Dec</option>
                                    </select>
                                    <input type="text" id="dateRange" class="form-control form-control-sm" placeholder="YYYY-MM-DD ~ YYYY-MM-DD" style="width:220px; display:none;">
                                </div>
                            </div>
                            
                            <!-- 차트 & 우측 통계 -->
                            <div class="card-body d-flex">
                                <!-- 차트 영역 (ApexCharts) -->
                                <div class="flex-grow-1">
                                    <div id="apexcharts5eff3xfu" class="apexcharts-canvas apexcharts5eff3xfu apexcharts-theme-light" style="min-height:320px;"></div>
                                </div>
                                <!-- 우측 통계 -->
                                <div class="col-md-auto ms-4">
                                    <div class="divide-y divide-y-fill">
                                        <div class="px-3">
                                            <div class="text-secondary">
                                                <span class="status-dot bg-primary"></span> Today
                                            </div>
                                            <div class="h2" id="todayCount">7</div>
                                        </div>
                                        <div class="px-3">
                                            <div class="text-secondary">
                                                <span class="status-dot bg-azure"></span> This Week
                                            </div>
                                            <div class="h2" id="thisWeekCount">30</div>
                                        </div>
                                        <div class="px-3">
                                            <div class="text-secondary">
                                                <span class="status-dot bg-green"></span> This Month
                                            </div>
                                            <div class="h2" id="thisMonthCount">89</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div><!-- end 차트 카드 -->
                    </div><!-- end container-xl -->
                </div><!-- end page-body -->
            </div><!-- end page-wrapper -->
        </div><!-- end page-access -->
        
        <!-- 스크립트 -->
        <script src="${path}/resources/js/main/user/auth.js"></script>
        <script src="${path}/resources/js/main/admin/access.js"></script>
        <script src="${path}/resources/js/common/common.js"></script>
        <script src="${path}/resources/js/common/tabler/tabler.min.js" defer></script>
        <script src="${path}/resources/js/common/tabler/demo.min.js" defer></script>
        <script src="${path}/resources/libs/list.js/dist/list.min.js" defer></script>
        <!-- jQuery & Moment & Daterangepicker -->
        <script src="${path}/resources/libs/jquery-v3.6.0/jquery.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-daterangepicker@3.1.0/daterangepicker.css" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap-daterangepicker@3.1.0/daterangepicker.min.js"></script>
        <!-- ApexCharts -->
        <script src="${path}/resources/libs/apexcharts/dist/apexcharts.min.js"></script>
    </body>
</html>
