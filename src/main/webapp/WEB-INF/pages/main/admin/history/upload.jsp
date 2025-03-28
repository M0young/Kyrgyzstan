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
                                <!-- Page pre-title -->
                                <h2 class="page-title">
                                    History > Data Upload
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="page-body">
                    <div class="container-xl">
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
                        </div>
	                	<div class="col-lg-12">
	                		<div class="card mt-3">
	                			<div class="card-header chart-card-header">
	                                <h4 class="mb-0">Data Upload</h4>
		                                <div class="chart-controls">
	                                    <!-- (1) 기간(Granularity) 드롭다운 -->
	                                    <select id="granularitySelect" class="form-select form-select-sm" style="width:auto;">
	                                        <option value="monthly" selected>Monthly</option>
	                                        <option value="weekly">Weekly</option>
	                                        <option value="daily">Daily</option>
	                                    </select>
	                                    <!-- (2) 연도(Year) 드롭다운 (Monthly, Weekly일 때 표시) -->
	                                    <select id="yearSelect" class="form-select form-select-sm" style="width:auto;">
	                                        <option value="2023">2023</option>
	                                        <option value="2024">2024</option>
	                                        <option value="2025" selected>2025</option>
	                                        <option value="2026">2026</option>
	                                    </select>
	                                    <!-- (3) 월(Month) 드롭다운 (Weekly일 때만 표시) -->
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
	                                    <!-- (4) 날짜 범위(Date Range) 입력 (Daily 선택 시만 표시) -->
	                                    <input type="text" id="dateRange" class="form-control form-control-sm" placeholder="YYYY-MM-DD ~ YYYY-MM-DD" style="width:220px; display:none;">
	                                </div>
	                            </div>
	                			<div class="card-body">
	                				<div class="row">
	                					<div class="col">
	                						<div id="chart-active-users-2" class style="min-height: 288px;">
	                							<div id="apexcharts0lg59mk" class="apexcharts-canvas apexcharts0lg59mk apexcharts-theme-">
	                								
	                							</div>
	                						</div>
	                					</div>
	                					<div class="col-md-auto">
	                						<div class="divide-y divide-y-fill">
	                							<div class="px-3">
						                            <div class="text-secondary"><span class="status-dot bg-primary"></span> Today</div>
						                            <div class="h2">7</div>
						                        </div>
						                        <div class="px-3">
						                            <div class="text-secondary"><span class="status-dot bg-azure"></span> This Week</div>
						                            <div class="h2">30</div>
						                        </div>
						                        <div class="px-3">
						                            <div class="text-secondary"><span class="status-dot bg-green"></span> This month</div>
						                            <div class="h2">89</div>
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
        <script src="${path}/resources/js/main/user/auth.js"></script>
        <script src="${path}/resources/js/main/admin/access.js"></script>
        <script src="${path}/resources/js/common/common.js"></script>
        <script src="${path}/resources/js/common/tabler/tabler.min.js" defer></script>
        <script src="${path}/resources/js/common/tabler/demo.min.js" defer></script>
        <script src="${path}/resources/libs/list.js/dist/list.min.js" defer></script>
        <script src="${path}/resources/libs/chart.js-v2.9.4/Chart.js"></script>
        <script src="${path}/resources/libs/jquery-v3.6.0/jquery.min.js"></script>
        <script src="${path}/resources/libs/apexcharts/dist/apexcharts.min.js"></script>
	    <script>
	    document.addEventListener("DOMContentLoaded", function () {
	        if (window.ApexCharts) {
	            var optionsAdvanced = {
	                chart: {
	                    type: "line",
	                    fontFamily: "inherit",
	                    height: 288, 
	                    width: 1300,
	                    parentHeightOffset: 0,	                    
	                    zoom: {
	                        enabled: false
	                    },
	                    toolbar: {
	                        show: true,
	                        tools: {
	                            download: true, 
	                        }
	                    },
 	                    dropShadow: {
	                        enabled: true,
	                        color: "#000",
	                        top: 18,
	                        left: 7,
	                        blur: 10,
	                        opacity: 0.5
	                    } 
	                },
	                stroke: {
	                    curve: "straight",
	                },
 	                markers: {
	                	size: 5
	                },
/* 	                dataLabels: {
	                    enabled: true,
	                    style: {
	                        fontSize: "12px",
	                    },
	                    background: {
	                        enabled: true,
	                        padding: 8,
	                        borderRadius: 3,
	                    }
	                },  */
	                fill: {
	                    opacity: 1
	                },
	                series: [
	                    {
	                        name: "Data upload",
	                        data: [2, 6, 1, 8, 4, 4, 1] 
	                    }
	                ],
	                grid: {
	                    borderColor: "#444",
	                    strokeDashArray: 4,
	                    padding: { top: 20, right: 20, left: 20, bottom: 20 }
	                },
	                xaxis: {
	                    type: "datetime",
	                    labels: {
	                        style: { colors: "#ccc", fontSize: "12px" }
	                    },
	                    crosshairs: {
	                        show: true,
	                        stroke: { color: "#888", width: 1, dashArray: 3 }
	                    }
	                },
	                yaxis: {
	                    labels: {
	                        style: { colors: "#ccc", fontSize: "12px" }
	                    }
	                },
	                labels: [
	                    "2020-06-21",
	                    "2020-06-22",
	                    "2020-06-23",
	                    "2020-06-24",
	                    "2020-06-25",
	                    "2020-06-26",
	                    "2020-06-27"
	                ],
	                responsive: [
	                    {
	                        breakpoint: 480,
	                        options: {
	                            chart: { height: 220 },
	                            xaxis: { labels: { fontSize: "10px" } },
	                            yaxis: { labels: { fontSize: "10px" } }
	                        }
	                    }
	                ],
	                legend: {
	                    position: "top",
	                    horizontalAlign: "right",
	                    floating: true,
	                    markers: { width: 10, height: 10, radius: 12 },
	                    itemMargin: { horizontal: 8, vertical: 8 }
	                },
	                colors: [
	                    tabler.getColor("primary"),
	                    tabler.getColor("azure"),
	                    tabler.getColor("green")
	                ]
	            };

	            new ApexCharts(document.getElementById("chart-active-users-2"), optionsAdvanced).render();
	        }
	    });
	    </script>
    </body>
</html>
