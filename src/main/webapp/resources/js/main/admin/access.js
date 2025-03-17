/*========================================================
    DATE: 2025. 01
    AUTHOR: JEON
    DESC: User Access
========================================================*/
_GL.ACCESS = (function () {
    'use strict';
    
    let currentPage = 0;
    const pageSize = 11;
    
    function getElements() {
        return {
            accessTableBody: document.getElementById('access-table-body'),
            searchInput: document.getElementById('search-input'),
            searchButton: document.getElementById('search-btn'),
            accessCount: document.getElementById('access-count'),
            prevPage: document.getElementById('prev-page'),
            nextPage: document.getElementById('next-page'),
            paginationNumbers: document.getElementById('pagination-numbers')
        };
    }
    
    function fetchAccessData(query = '', page = 0) {
        const elements = getElements();
        currentPage = page;
        elements.accessTableBody.innerHTML = `<tr><td colspan="5" class="text-center">Loading...</td></tr>`;
        const trimmedQuery = query.trim();
        let url = `/klums/api/admin/history/access/list/paged?page=${page}&size=${pageSize}`;
        if (trimmedQuery) {
            url += `&query=${encodeURIComponent(trimmedQuery)}`;
        }
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const result = data.data || {};
                const totalAccess = result.total || 0;
                const access = result.access || [];
                elements.accessCount.textContent = totalAccess;
                elements.accessTableBody.innerHTML = '';
                if (access.length === 0) {
                    elements.accessTableBody.innerHTML = `<tr><td colspan="5" class="text-center">No results found.</td></tr>`;
                } else {
                	access.forEach((access, index) => {
                        const row = `<tr>
                            <td>${(page * pageSize) + index + 1}</td>
                            <td>${access.user_nm}</td>
                            <td>${access.msg}</td>
                            <td>${access.ip}</td>
                            <td>${access.reg_dt}</td>
                        </tr>`;
                        elements.accessTableBody.insertAdjacentHTML('beforeend', row);
                    });
                }
                setupPagination(totalAccess, page);
            })
            .catch(error => {
                console.error('Error fetching log data:', error);
                elements.accessTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Failed to load logs</td></tr>`;
            });
    }
    
    function setupPagination(totalAccess, currentPage) {
        const elements = getElements();
        const totalPages = Math.ceil(totalAccess / pageSize);
        
        // 이전/다음 버튼 상태 업데이트
        if (currentPage <= 0) {
            elements.prevPage.parentElement.classList.add('disabled');
        } else {
            elements.prevPage.parentElement.classList.remove('disabled');
        }
        if (currentPage >= totalPages - 1) {
            elements.nextPage.parentElement.classList.add('disabled');
        } else {
            elements.nextPage.parentElement.classList.remove('disabled');
        }
        
        // 숫자 페이지네이션 (최대 5개) - 블록 단위로 표시
        const blockSize = 5;
        const block = Math.floor(currentPage / blockSize);
        const startPage = block * blockSize;
        const endPage = Math.min(totalPages, startPage + blockSize);
        
        elements.paginationNumbers.innerHTML = '';
        for (let i = startPage; i < endPage; i++) {
            let li = document.createElement('li');
            li.className = 'page-item' + (i === currentPage ? ' active' : '');
            li.style.display = 'inline-block'; // 가로 배치 보장
            li.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`;
            li.addEventListener('click', function(e) {
                e.preventDefault();
                fetchAccessData(elements.searchInput.value, i);
            });
            elements.paginationNumbers.appendChild(li);
        }
    }
    
    function setupPaginationEvents() {
        const elements = getElements();
        if (elements.prevPage) {
            elements.prevPage.addEventListener('click', function(e) {
                e.preventDefault();
                if (currentPage > 0) {
                    fetchAccessData(elements.searchInput.value, currentPage - 1);
                }
            });
        }
        if (elements.nextPage) {
            elements.nextPage.addEventListener('click', function(e) {
                e.preventDefault();
                fetchAccessData(elements.searchInput.value, currentPage + 1);
            });
        }
    }
    
    function setupSearchEvent() {
        const elements = getElements();
        if (elements.searchButton) {
            elements.searchButton.addEventListener('click', function() {
                fetchAccessData(elements.searchInput.value, 0);
            });
        }
        if (elements.searchInput) {
            elements.searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                	fetchAccessData(elements.searchInput.value, 0);
                }
            });
        }
    }
    
    function init() {
        fetchAccessData('', 0);
        setupPaginationEvents();
        setupSearchEvent();
    }
    
    return {
        init: init
    };
})();
document.addEventListener('DOMContentLoaded', function(){
    _GL.ACCESS.init();
});
