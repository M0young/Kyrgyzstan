/*========================================================
    DATE: 2025. 01
    AUTHOR: JEON
    DESC: Land Use Mapping
========================================================*/
_GL.MAPPING = (function () {
    'use strict';
    
    let currentPage = 0;
    const pageSize = 10;
    let subMappingData = [];  
    let selectedLclsfCd = null;
    
    // DOM 요소들을 한 번에 가져오는 함수
    function getElements() {
        return {
            mappingTableBody: document.getElementById('mapping-table-body'),
            saveButton: document.querySelector('.save-btn'),
            mappingCount: document.getElementById('mapping-count'),
            prevPage: document.getElementById('prev-page'),
            nextPage: document.getElementById('next-page'),
            paginationNumbers: document.getElementById('pagination-numbers'),
            subMappingContainer: document.getElementById('sub-mapping-list')
        };
    }
    
    /**
     * Classification List 조회
     */
    function fetchMappingData(page = 0) {
        const elements = getElements();
        currentPage = page;
        elements.mappingTableBody.innerHTML = `<tr><td colspan="2" class="text-center">Loading...</td></tr>`;
        const lang = _GL.COMMON.getCurrentLanguage();
        let url = `/klums/api/admin/code/mapping/list/paged?page=${page}&size=${pageSize}&lang=${lang}`;
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const result = data.data || {};
                const totalMapping = result.total || 0;
                const mappings = result.mapping || [];
                elements.mappingCount.textContent = totalMapping;
                elements.mappingTableBody.innerHTML = '';
                if (mappings.length === 0) {
                    elements.mappingTableBody.innerHTML = `<tr><td colspan="2" class="text-center">No results found.</td></tr>`;
                } else {
                    mappings.forEach((cls, index) => {
                        const row = `
                            <tr class="classification-row" data-lclsf-cd="${cls.lclsf_cd}">
                                <td>${cls.lclsf_cd}</td>
                                <td>${cls.lclsf_nm}</td>
                            </tr>`;
                        elements.mappingTableBody.insertAdjacentHTML('beforeend', row);
                    });
                    const rows = elements.mappingTableBody.querySelectorAll('.classification-row');
                    rows.forEach(row => {
                        row.addEventListener('click', function () {
                            // 모든 row의 selected 클래스 제거 후 현재 클릭한 row에 selected 추가
                            rows.forEach(r => r.classList.remove('selected'));
                            this.classList.add('selected');
                            // 선택된 대분류 코드 저장 (문자열)
                            selectedLclsfCd = String(this.getAttribute('data-lclsf-cd'));
                            this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            // 선택된 대분류에 해당하는 소분류 체크박스 업데이트
                            updateSubMappingCheckboxes(selectedLclsfCd);
                        });
                    });
                    // 만약 이전에 선택한 대분류가 있다면 해당 row를 다시 선택 처리
                    if (selectedLclsfCd) {
                        const selectedRow = elements.mappingTableBody.querySelector(`tr[data-lclsf-cd="${selectedLclsfCd}"]`);
                        if (selectedRow) {
                            selectedRow.classList.add('selected');
                            selectedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            updateSubMappingCheckboxes(selectedLclsfCd);
                        }
                    }
                }
                setupPagination(totalMapping, page);
                return { totalMapping, mapping: mappings };
            })
            .catch(error => {
                console.error('Error fetching mapping data:', error);
                elements.mappingTableBody.innerHTML = '<tr><td colspan="2" class="text-center text-danger">Failed to load mappings</td></tr>';
                return { totalMapping: 0, mapping: [] };
            });
    }
    
    /**
     * SubClassification List 조회 
     */
    function fetchSubMappingData() {
        const elements = getElements();
        // 로딩 중 메시지 표시
        elements.subMappingContainer.innerHTML = `<div class="d-flex justify-content-center dropdown-menu dropdown-menu-demo">Loading...</div>`;
        const lang = _GL.COMMON.getCurrentLanguage();
        let url = `/klums/api/admin/code/mapping/list/sub/paged?lang=${lang}`;
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // 데이터가 없으면 아무것도 출력하지 않음
                if (!data.data || data.data.length === 0) {
                    console.warn("Subclassification data is null or empty. Skipping output.");
                    elements.subMappingContainer.innerHTML = '';
                    return [];
                }
                subMappingData = data.data;
                renderSubMappingDropdown(subMappingData);
                if (selectedLclsfCd !== null) {
                    updateSubMappingCheckboxes(selectedLclsfCd);
                }
                return subMappingData;
            })
            .catch(error => {
                console.error('Error fetching sub mapping data:', error);
                elements.subMappingContainer.innerHTML = '';
            });
    }

    // 드롭다운 메뉴를 서브분류 데이터로 렌더링 (데이터가 없으면 아무것도 출력하지 않음)
    function renderSubMappingDropdown(data) {
        const elements = getElements();
        if (!data || data.length === 0) {
            elements.subMappingContainer.innerHTML = '';
            return;
        }
        let dropdownHtml = `<div class="dropdown-menu dropdown-menu-demo">`;
        data.forEach(item => {
            // nm 컬럼(sclsf_nm)이 null이 아닐 때만 출력
            if (item.sclsf_nm !== null) {
                dropdownHtml += `<label class="dropdown-item">
                    <input class="form-check-input m-0 me-2" type="checkbox" 
                        data-lclsf-cd="${item.lclsf_cd}" 
                        data-sclsf-cd="${item.sclsf_cds || item.sclsf_cd}"> 
                    ${item.sclsf_nm}
                </label>`;
            }
        });
        dropdownHtml += `</div>`;
        elements.subMappingContainer.innerHTML = dropdownHtml;
    }

    /**
     * 페이지네이션 설정
     */
    function setupPagination(totalMapping, currentPage) {
        const elements = getElements();
        const totalPages = Math.ceil(totalMapping / pageSize);
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
            li.addEventListener('click', (e) => {
                e.preventDefault();
                fetchMappingData(i);
            });
            elements.paginationNumbers.appendChild(li);
        }
    }
    
    function setupPaginationEvents() {
        const elements = getElements();
        if (elements.prevPage) {
            elements.prevPage.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentPage > 0) {
                    fetchMappingData(currentPage - 1);
                }
            });
        }
        if (elements.nextPage) {
            elements.nextPage.addEventListener('click', (e) => {
                e.preventDefault();
                fetchMappingData(currentPage + 1);
            });
        }
    }
    
    // 업데이트 요청을 수행하는 공통 함수 (숫자형 값을 전송)
    function updateMapping(sclsfCd, lclsfCd) {
        return fetch('/klums/api/admin/code/mapping/update/', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': _GL.csrf ? _GL.csrf.token : ''
            },
            body: JSON.stringify({ 
                lclsf_cd: lclsfCd && lclsfCd !== "" ? Number(lclsfCd) : 0, 
                sclsf_cd: Number(sclsfCd) 
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => ({ sclsfCd, data }));
    }
    
    /**
     * 체크박스 UI 업데이트 기능  
     */
    function updateSubMappingCheckboxes(selectedLclsfCd) {
        const elements = getElements();
        const checkboxes = elements.subMappingContainer.querySelectorAll('input[type="checkbox"]');
        let firstCheckedFound = false;
        checkboxes.forEach(checkbox => {
            const checkboxLclsfCd = String(checkbox.getAttribute('data-lclsf-cd'));
            const labelEl = checkbox.closest('label'); 
            // 대분류 코드 0은 항상 활성화
            if (checkboxLclsfCd === "0") {
                checkbox.disabled = false;
                if (labelEl) {
                    labelEl.classList.remove('disabled');
                }
                checkbox.checked = (selectedLclsfCd === "0");
                if (selectedLclsfCd === "0" && !firstCheckedFound) {
                    checkbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstCheckedFound = true;
                }
            } 
            // 만약 해당 소분류의 lclsf_cd와 선택된 대분류가 일치하면 체크, 아니면 체크 해제 및 비활성화
            else if (checkboxLclsfCd === selectedLclsfCd) {
                checkbox.checked = true;
                checkbox.disabled = false;
                if (labelEl) {
                    labelEl.classList.remove('disabled');
                }
                if (!firstCheckedFound) {
                    checkbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstCheckedFound = true;
                }
            } else {
                checkbox.checked = false;
                checkbox.disabled = true;
                if (labelEl) {
                    labelEl.classList.add('disabled');
                }
            }
        });
    }
    
    /**
     * 서브분류 업데이트 요청을 처리하는 함수  
     * - 대분류에 해당하는 소분류만 활성화/체크되도록 처리하며, 업데이트 시 체크 상태에 따라 업데이트 진행
     */
    function updateSubclassification() {
        const elements = getElements();
        const selectedRow = document.querySelector('.classification-row.selected');
        if (!selectedRow) {
            alert('업데이트할 대분류가 선택되지 않았습니다.');
            return;
        }
        // 선택된 대분류 코드는 이미 global 변수(selectedLclsfCd)에 저장됨
        const selectedLclsfCdNum = Number(selectedRow.getAttribute('data-lclsf-cd'));
        const checkboxes = elements.subMappingContainer.querySelectorAll('input[type="checkbox"]');
        
        // 활성화된 체크박스들을 업데이트 대상으로 선택 (체크 상태에 따라 값 결정)
        const targetCheckboxes = Array.from(checkboxes).filter(chk => !chk.disabled);
        if (targetCheckboxes.length === 0) {
            alert('업데이트할 소분류가 없습니다.');
            return;
        }
        
        // 각 소분류에 대해 업데이트 요청 실행
        const updatePromises = targetCheckboxes.map(checkbox => {
            // 체크된 경우 선택된 대분류 코드, 체크 해제된 경우 0 (해제)
            const newLclsfCd = checkbox.checked ? selectedLclsfCdNum : 0;
            const sclsfCd = Number(checkbox.getAttribute('data-sclsf-cd'));
            console.log(`업데이트 요청: sclsfCd = ${sclsfCd}, newLclsfCd = ${newLclsfCd}`);
            return updateMapping(sclsfCd, newLclsfCd);
        });
        
        Promise.all(updatePromises)
            .then(results => {
                console.log("업데이트 결과:", results);
                const allSuccess = results.every(result => result.data.success === true);
                if (allSuccess) {
                    _GL.COMMON.showToast('Mapping updated successfully', 'success');
                    // 전체 페이지 새로고침 대신 서브분류 리스트만 업데이트
                    fetchSubMappingData();
                    // 분류 리스트는 이전 선택(selectedLclsfCd)이 그대로 유지됨
                } else {
                    _GL.COMMON.showToast('Some updates failed', 'error');
                    console.warn('Mapping update results:', results);
                }
            })
            .catch(err => {
                console.error("업데이트 중 오류 발생:", err);
                _GL.COMMON.showToast('Mapping update failed', 'error');
            });
    }
    
    // SAVE 버튼 이벤트 설정 (여러 체크박스 업데이트 처리)
    function setupSaveButton() {
        const elements = getElements();
        if (elements.saveButton) {
            elements.saveButton.removeEventListener('click', updateSubclassification);
            elements.saveButton.addEventListener('click', updateSubclassification);
        }
    }
    
    function init() {
        fetchMappingData(0);
        fetchSubMappingData();
        setupPaginationEvents();
        setupSaveButton();
    }
    
    return { init };
})();

document.addEventListener('DOMContentLoaded', function () {
    _GL.MAPPING.init();
});
