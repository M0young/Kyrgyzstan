/*========================================================
    DATE: 2025. 01
    AUTHOR: JEON
    DESC: user Activity Log
========================================================*/
_GL.LOG = (function () {
    'use strict';
    
    let currentPage = 0;
    const pageSize = 11;
    
    function getElements() {
        return {
            logTableBody: document.getElementById('log-table-body'),
            searchInput: document.getElementById('search-input'),
            searchButton: document.getElementById('search-btn'),
            logCount: document.getElementById('log-count'),
            prevPage: document.getElementById('prev-page'),
            nextPage: document.getElementById('next-page'),
            paginationNumbers: document.getElementById('pagination-numbers')
        };
    }
    
    function fetchLogData(query = '', page = 0) {
        const elements = getElements();
        currentPage = page;
        
        elements.logTableBody.innerHTML = `<tr><td colspan="5" class="text-center">Loading...</td></tr>`;
        const trimmedQuery = query.trim();
        let url = `/klums/api/admin/history/log/list/paged?page=${page}&size=${pageSize}`;
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
                const totalLogs = result.total || 0;
                const logs = result.logs || [];
                elements.logCount.textContent = totalLogs;
                elements.logTableBody.innerHTML = '';
                if (logs.length === 0) {
                    elements.logTableBody.innerHTML = `<tr><td colspan="5" class="text-center">No results found.</td></tr>`;
                } else {
                    logs.forEach((log, index) => {
                        const row = `<tr>
                            <td>${(page * pageSize) + index + 1}</td>
                            <td>${log.user_nm}</td>
                            <td>${log.msg}</td>
                            <td>${log.ip}</td>
                            <td>${log.reg_dt}</td>
                        </tr>`;
                        elements.logTableBody.insertAdjacentHTML('beforeend', row);
                    });
                }
                setupPagination(totalLogs, page);
            })
            .catch(error => {
                console.error('Error fetching log data:', error);
                elements.logTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Failed to load logs</td></tr>`;
            });
    }
    
    function setupPagination(totalLogs, currentPage) {
        const elements = getElements();
        const totalPages = Math.ceil(totalLogs / pageSize);
        
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
            li.style.display = 'inline-block'; 
            li.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`;
            li.addEventListener('click', function(e) {
                e.preventDefault();
                fetchLogData(elements.searchInput.value, i);
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
                    fetchLogData(elements.searchInput.value, currentPage - 1);
                }
            });
        }
        if (elements.nextPage) {
            elements.nextPage.addEventListener('click', function(e) {
                e.preventDefault();
                fetchLogData(elements.searchInput.value, currentPage + 1);
            });
        }
    }
    
    function setupSearchEvent() {
        const elements = getElements();
        if (elements.searchButton) {
            elements.searchButton.addEventListener('click', function() {
                fetchLogData(elements.searchInput.value, 0);
            });
        }
        if (elements.searchInput) {
            elements.searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    fetchLogData(elements.searchInput.value, 0);
                }
            });
        }
    }
    
    function init() {
        fetchLogData('', 0);
        setupPaginationEvents();
        setupSearchEvent();
    }
    
    return {
        init: init
    };
})();
document.addEventListener('DOMContentLoaded', function(){
    _GL.LOG.init();
});
