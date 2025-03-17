/*========================================================
    DATE: 2024. 03
    AUTHOR: MOYOUNG
    DESC: Symbol Edit Module
========================================================*/
_GL.MAP_SYMBOL = (function() {
    'use strict';
    
    let initialized = false;
    let instance = null;
    let currentPage = 1;
    
    /**
     * DOM 요소 가져오기
     */
    function getElements() {
        return {
	        searchInput: document.getElementById('regionSearchTemp'),
	        searchTab: document.querySelector('a[href="#sidebar-search"]'),
	        totalCount: document.getElementById('searchTotalCount'),
	        resultTable: document.getElementById('searchResultTable'),
	        pagination: document.getElementById('searchPagination'),
	        pageUnit: document.getElementById('searchPageUnit')
        }
    };
   
/* =====================================================
    Symbol Edit Main
======================================================*/
    
/* =====================================================
    Event Handlers
======================================================*/
    function handlePageClick(value) {
    	const elements = getElements();
        let newPage = currentPage;
        
        if (value === 'prev') {
            newPage = currentPage - 1;
        } else if (value === 'next') {
            newPage = currentPage + 1;
        } else {
            newPage = parseInt(value);
        }
        
        if (newPage !== currentPage) {
            currentPage = newPage;
            searchRegion(currentPage, elements.searchInput.value.trim());
        }
    }
    
/* =====================================================
    Event Listeners
======================================================*/
    function initializeEventListeners() {
    }
    
    // public API
    return {
        init: function() {
            if (initialized) return;
            instance = _GL.MAP.getInstance();
            initializeEventListeners();
            initialized = true;
        }
    };
})();

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    _GL.MAP_SYMBOL.init();
});