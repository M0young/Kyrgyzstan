<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<%@ include file="/WEB-INF/pages/common/layout/main-head.jsp" %>
<style>
/* 전체 페이지 레이아웃 */
.page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.page-wrapper {
	flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.page-body {
    flex: 1;
    display: flex;
    flex-direction: column;
}

/* 대시보드 컨테이너 */
.dashboard-container-custom {
    max-width: 100% !important;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.row-custom {
    flex: 1;
    margin: 0;
}

.card {
    height: 100%;
    margin: 0 !important;
    display: flex;
    flex-direction: column;
}

.card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
}

/* 첫 번째, 세 번째 카드 (Land Type Statistics) */
.row {
    height: calc(100% - 60px);  /* 헤더 영역 높이를 제외한 나머지 */
}

/* 두 번째 카드 (System Usage Statistics) */
.system-usage {
    height: 50%;
    margin-bottom: 1rem;
}

.chart-container {
    height: calc(100% - 40px);  /* 헤더 영역 높이를 제외한 나머지 */
}

.land-management {
    height: 50%;
}

/* 네 번째 카드 (Map) */
.ratio-21x9 {
    height: 100% !important;
}

.ratio-21x9 img {
    object-fit: cover;
    width: 100%;
    height: 100%;
}
</style>
<body class="d-flex flex-column">
    <script src="${path}/resources/js/common/tabler/demo-theme.min.js"></script>
	<div class="page">
 	  <%@ include file="/WEB-INF/pages/common/layout/main-header.jsp" %>
      <div class="page-wrapper">
        <div class="page-body">
          <div class="container-xl dashboard-container-custom">
            <div class="row row-deck row-cards row-custom">
              <div class="col-lg-6">
                <div class="card">
				    <div class="card-body">
				      <!-- 헤더 영역 -->
				      <div class="d-flex justify-content-between align-items-center mb-3">
				        <h3 class="card-title">Land Type Statistics(Based Year: 2024)</h3>
				        <div class="ms-auto">
				          <label class="form-check form-check-inline">
				            <input class="form-check-input" type="radio" name="landType" checked>
				            <span class="form-check-label">대분류</span>
				          </label>
				          <label class="form-check form-check-inline">
				            <input class="form-check-input" type="radio" name="landType">
				            <span class="form-check-label">소분류</span>
				          </label>
				        </div>
				      </div>
				      <!-- 메인 컨텐츠 영역 -->
				      <div class="row">
				        <!-- 테이블 영역 -->
				        <div class="col-md-8">
				          <div class="table-responsive mb-4" style="height: 27vh; overflow-y: auto;">
				            <table class="table table-vcenter">
				              <thead>
				                <tr>
				                  <th>Types</th>
				                  <th>Ratio(%)</th>
				                  <th>Area(%)</th>
				                  <th>Map</th>
				                </tr>
				              </thead>
				              <tbody>
				                <tr>
				                  <td>토지유형1</td>
				                  <td>18</td>
				                  <td>5</td>
				                  <td>
				                    <button class="btn btn-primary btn-sm">Go</button>
				                  </td>
				                </tr>
				                <tr>
				                  <td>토지유형2</td>
				                  <td>12</td>
				                  <td>3</td>
				                  <td>
				                    <button class="btn btn-primary btn-sm">Go</button>
				                  </td>
				                </tr>
				                <tr>
				                  <td>토지유형3</td>
				                  <td>18</td>
				                  <td>5</td>
				                  <td>
				                    <button class="btn btn-primary btn-sm">Go</button>
				                  </td>
				                </tr>
				                <tr>
				                  <td>토지유형4</td>
				                  <td>12</td>
				                  <td>3</td>
				                  <td>
				                    <button class="btn btn-primary btn-sm">Go</button>
				                  </td>
				                </tr>
				                <tr>
				                  <td>토지유형5</td>
				                  <td>18</td>
				                  <td>5</td>
				                  <td>
				                    <button class="btn btn-primary btn-sm">Go</button>
				                  </td>
				                </tr>
				                <tr>
				                  <td>토지유형6</td>
				                  <td>12</td>
				                  <td>3</td>
				                  <td>
				                    <button class="btn btn-primary btn-sm">Go</button>
				                  </td>
				                </tr>
				                <tr>
				                  <td>토지유형7</td>
				                  <td>18</td>
				                  <td>5</td>
				                  <td>
				                    <button class="btn btn-primary btn-sm">Go</button>
				                  </td>
				                </tr>
				                <tr>
				                  <td>토지유형8</td>
				                  <td>12</td>
				                  <td>3</td>
				                  <td>
				                    <button class="btn btn-primary btn-sm">Go</button>
				                  </td>
				                </tr>
				              </tbody>
				            </table>
				          </div>
					        <!-- 하단 통계 영역 -->
					        <div class="text-muted">
						    	<div>Total Area: 123(ha)</div>
							    <div class="mt-2">
							      <span class="me-4">Assigned Area: 83(70%)</span>
							      <span>Unassigned Area: 40(30%)</span>
							    </div>
					        </div>
				        </div>
				        
				        <!-- 차트 영역 -->
				        <div class="col-md-4">
				          <div class="d-flex align-items-center justify-content-center">
				            <canvas id="landTypeChart" width="100" height="100"></canvas>
				          </div>
				          <div class="text-center mt-2">
						      <span class="text-muted">&lt;Ratio&gt;</span>
						    </div>
				        </div>
				      </div>
				    </div>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="card">
                  <div class="card-body">
				      <!-- System Usage Statistics -->
				      <div class="system-usage">
				        <div class="d-flex justify-content-between align-items-center mb-3">
				          <h3 class="card-title m-0">► System Usage Statistics</h3>
				          <div class="text-muted">Today's Visit: 12</div>
				        </div>
				        <!-- Line Chart -->
				        <div style="height: 180px;">
				          <canvas id="systemUsageChart"></canvas>
				        </div>
				      </div>
				
				      <!-- Land Management Statistics -->
				      <div class="land-management">
				        <h3 class="card-title mb-4">► Land Management Statistics</h3>
				        <div class="table-responsive">
				          <table class="table table-vcenter card-table">
				            <thead>
				              <tr class="bg-primary text-white">
				                <th style="width: 40%">Management</th>
				                <th style="width: 20%">Number of</th>
				                <th style="width: 20%">See Log</th>
				                <th style="width: 20%">Map</th>
				              </tr>
				            </thead>
				            <tbody>
				              <tr class="bg-light">
				                <td>Uploaded Data</td>
				                <td>12</td>
				                <td><button class="btn btn-info btn-sm w-100">Show</button></td>
				                <td><button class="btn btn-info btn-sm w-100">Go</button></td>
				              </tr>
				              <tr>
				                <td>Edited Data</td>
				                <td>12</td>
				                <td><button class="btn btn-info btn-sm w-100">Show</button></td>
				                <td><button class="btn btn-info btn-sm w-100">Go</button></td>
				              </tr>
				            </tbody>
				          </table>
				        </div>
				      </div>
				    </div>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="card">
				    <div class="card-body">
				      <!-- 헤더 영역 -->
				      <div class="d-flex justify-content-between align-items-center mb-3">
				        <h3 class="card-title">Land Usage Statistics(Based Year: 2024)</h3>
				        <div class="ms-auto">
				          <label class="form-check form-check-inline">
				            <input class="form-check-input" type="radio" name="usageType" checked>
				            <span class="form-check-label">대분류</span>
				          </label>
				          <label class="form-check form-check-inline">
				            <input class="form-check-input" type="radio" name="usageType">
				            <span class="form-check-label">소분류</span>
				          </label>
				        </div>
				      </div>
				      <!-- 메인 컨텐츠 영역 -->
				      <div class="row">
				        <!-- 테이블 영역 -->
				        <div class="col-md-8">
				          <div class="table-responsive mb-4" style="height: 27vh; overflow-y: auto;">
				            <table class="table table-vcenter">
				              <thead>
				                <tr>
				                  <th>Types</th>
				                  <th>Ratio(%)</th>
				                  <th>Area(%)</th>
				                  <th>Map</th>
				                </tr>
				              </thead>
				              <tbody>
				                <tr>
				                  <td>토지유형1</td>
				                  <td>18</td>
				                  <td>5</td>
				                  <td>
				                    <button class="btn btn-primary btn-sm">Go</button>
				                  </td>
				                </tr>
				                <tr>
				                  <td>토지유형2</td>
				                  <td>12</td>
				                  <td>3</td>
				                  <td>
				                    <button class="btn btn-primary btn-sm">Go</button>
				                  </td>
				                </tr>
				                <tr>
				                  <td>토지유형3</td>
				                  <td>18</td>
				                  <td>5</td>
				                  <td>
				                    <button class="btn btn-primary btn-sm">Go</button>
				                  </td>
				                </tr>
				                <tr>
				                  <td>토지유형4</td>
				                  <td>12</td>
				                  <td>3</td>
				                  <td>
				                    <button class="btn btn-primary btn-sm">Go</button>
				                  </td>
				                </tr>
				                <tr>
				                  <td>토지유형5</td>
				                  <td>18</td>
				                  <td>5</td>
				                  <td>
				                    <button class="btn btn-primary btn-sm">Go</button>
				                  </td>
				                </tr>
				                <tr>
				                  <td>토지유형6</td>
				                  <td>12</td>
				                  <td>3</td>
				                  <td>
				                    <button class="btn btn-primary btn-sm">Go</button>
				                  </td>
				                </tr>
				                <tr>
				                  <td>토지유형7</td>
				                  <td>18</td>
				                  <td>5</td>
				                  <td>
				                    <button class="btn btn-primary btn-sm">Go</button>
				                  </td>
				                </tr>
				                <tr>
				                  <td>토지유형8</td>
				                  <td>12</td>
				                  <td>3</td>
				                  <td>
				                    <button class="btn btn-primary btn-sm">Go</button>
				                  </td>
				                </tr>
				              </tbody>
				            </table>
				          </div>
					        <!-- 하단 통계 영역 -->
					        <div class="text-muted">
						    	<div>Total Area: 123(ha)</div>
							    <div class="mt-2">
							      <span class="me-4">Assigned Area: 83(70%)</span>
							      <span>Unassigned Area: 40(30%)</span>
							    </div>
					        </div>
				        </div>
				        
				        <!-- 차트 영역 -->
				        <div class="col-md-4">
				          <div class="d-flex align-items-center justify-content-center">
				            <canvas id="landTypeChart2" width="100" height="100"></canvas>
				          </div>
				          <div class="text-center mt-2">
						      <span class="text-muted">&lt;Ratio&gt;</span>
						    </div>
				        </div>
				      </div>
				    </div>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="card">
                  <div class="card-body">
                    <div class="ratio ratio-21x9">
                    	<img src="${path}/resources/images/map-sample.png">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <script src="${path}/resources/js/common/common.js"></script>
    <script src="${path}/resources/js/common/tabler/tabler.min.js" defer></script>
    <script src="${path}/resources/js/common/tabler/demo.min.js" defer></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
var ctx = document.getElementById('systemUsageChart').getContext('2d');
    
    var data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Upload',
            data: [65, 59, 80, 81, 56, 55],
            borderColor: '#4299e1',
            fill: false,
            tension: 0.4
        }, {
            label: 'Download',
            data: [28, 48, 40, 19, 86, 27],
            borderColor: '#48bb78',
            fill: false,
            tension: 0.4
        }, {
            label: 'View',
            data: [45, 25, 65, 40, 55, 30],
            borderColor: '#ed8936',
            fill: false,
            tension: 0.4
        }]
    };

    var config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    };

    new Chart(ctx, config);
    var ctx1 = document.getElementById('landTypeChart').getContext('2d');
    var ctx2 = document.getElementById('landTypeChart2').getContext('2d');
    
    var data1 = {
        datasets: [{
            data: [18, 12, 70],
            backgroundColor: [
                '#4299e1',
                '#ed8936',
                '#48bb78'
            ],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    var data2 = {
        datasets: [{
            data: [25, 15, 20, 12, 18, 10],
            backgroundColor: [
                '#4299e1',  // 파랑
                '#ed8936',  // 주황
                '#48bb78',  // 초록
                '#9f7aea',  // 보라
                '#ed64a6',  // 분홍
                '#667eea'   // 남색
            ],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    var config1 = {
        type: 'doughnut',
        data: data1,
        options: {
            responsive: true,
            cutout: '60%',
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    };

    var config2 = {
        type: 'doughnut',
        data: data2,
        options: {
            responsive: true,
            cutout: '60%',
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    };

    new Chart(ctx1, config1);
    new Chart(ctx2, config2);
});
</script>
</body>
</html>
