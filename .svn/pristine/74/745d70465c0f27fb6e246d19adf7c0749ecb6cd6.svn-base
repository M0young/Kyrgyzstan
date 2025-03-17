<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<c:set var="pageFolder" value="admin"/>
<c:set var="pageCss" value="admin"/>
<%@ include file="/WEB-INF/pages/common/layout/main-head.jsp"%>
<aside class="navbar navbar-vertical navbar-expand-lg" id="sidebar-admin">
  <div class="container-fluid">
    <!-- 토글 버튼 추가: 작은 화면에서 메뉴를 열고 닫을 수 있음 -->
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#sidebar-menu" 
            aria-controls="sidebar-menu" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    
    <!-- Main Navigation -->
    <div class="navbar-collapse collapse show" id="sidebar-menu">
      <ul class="navbar-nav pt-lg-3">
        <!-- User Management Section -->
        <li class="nav-item">
          <a class="nav-link ${fn:contains(pageContext.request.requestURI, '/user/list') ? 'active' : ''}" href="../user/list">
            <span class="nav-link-icon">
              <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-users">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
              </svg>
            </span>
            <span class="nav-link-title">User Management</span>
          </a>
        </li>
        <!-- Role Management Section -->
        <li class="nav-item">
          <a class="nav-link ${fn:contains(pageContext.request.requestURI, '/admin/role/list') ? 'active' : ''}" href="../role/list">
            <span class="nav-link-icon">
              <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-shield-check">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06" />
                <path d="M15 19l2 2l4 -4" />
              </svg>
            </span>
            <span class="nav-link-title">Role Management</span>
          </a>
        </li>
        <!-- Code Management Section -->
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#navbar-dashboard" data-bs-toggle="dropdown" data-bs-auto-close="false" role="button" aria-expanded="true" id="admin-dropdown-toggle">
            <span class="nav-link-icon">
              <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-device-desktop-search">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M11.5 16h-7.5a1 1 0 0 1 -1 -1v-10a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v6.5" />
                <path d="M7 20h4" />
                <path d="M9 16v4" />
                <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                <path d="M20.2 20.2l1.8 1.8" />
              </svg>
            </span>
            <span class="nav-link-title">Code Management</span>
          </a>
          <div class="dropdown-menu show" id="admin-dropdown-menu">
            <a class="dropdown-item" id="admin-dropdown-item" href="../code/type">Land Type</a>
            <a class="dropdown-item" id="admin-dropdown-item" href="../code/class">Land Use Classification</a>
            <a class="dropdown-item" id="admin-dropdown-item" href="../code/subclass">Land Use Subclassification</a>
            <a class="dropdown-item" id="admin-dropdown-item" href="../code/mapping">Land Use Mapping</a>
          </div>
        </li>
        <!-- History Section -->
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#navbar-dashboard" data-bs-toggle="dropdown" data-bs-auto-close="false" role="button" aria-expanded="true" id="admin-dropdown-toggle">
            <span class="nav-link-icon">
              <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-days-counter">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M20.779 10.007a9 9 0 1 0 -10.77 10.772" />
                <path d="M13 21h8v-7" />
                <path d="M12 8v4l3 3" />
              </svg>
            </span>
            <span class="nav-link-title">History</span>
          </a>
          <div class="dropdown-menu show" id="admin-dropdown-menu">
            <a class="dropdown-item" id="admin-dropdown-item" href="../history/access" role="button" aria-expanded="true">User Access</a>
            <a class="dropdown-item" id="admin-dropdown-item" href="../history/log">User Activity Log</a>
            <a class="dropdown-item" id="admin-dropdown-item" href="../history/upload">Data Upload</a>
          </div>
        </li>
      </ul>
      
    </div>
  </div>
</aside>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    // 모든 드롭다운 아이템 요소 선택 (id가 #admin-dropdown-item인 요소들)
    const dropdownItems = document.querySelectorAll('#admin-dropdown-item');
    // 현재 페이지 URL 경로 저장
    const currentURL = window.location.pathname;

    dropdownItems.forEach(item => {
      // 만약 아이템의 href에 현재 URL이 포함되어 있다면
      if (item.href.includes(currentURL)) {
        // 해당 아이템에 active 클래스를 추가 (하위 아이템 활성화)
        item.classList.add('active');
        // 아이템의 가장 가까운 상위 메뉴(#admin-dropdown-menu)에서 이전 형제 요소(토글 버튼)에 active 추가
        item.closest('#admin-dropdown-menu')?.previousElementSibling?.classList.add('active');
      }

      // 각 아이템에 클릭 이벤트 리스너 추가
      item.addEventListener('click', () => {
        // 클릭한 아이템의 상위 메뉴 선택
        const parentMenu = item.closest('#admin-dropdown-menu');
        if (parentMenu) {
          // 같은 메뉴 내 모든 아이템에서 active 제거
          parentMenu.querySelectorAll('#admin-dropdown-item').forEach(el => el.classList.remove('active'));
          // 현재 클릭한 아이템에 active 추가
          item.classList.add('active');
          // 상위 토글 버튼에도 active 추가
          parentMenu.previousElementSibling?.classList.add('active');
        }
      });
    });
  });
</script>
