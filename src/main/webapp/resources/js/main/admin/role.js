/*========================================================
    DATE: 2025. 01
    AUTHOR: JEON
    DESC: Role Management
========================================================*/
_GL.ROLE = (function () {
    'use strict';

    let initialized = false;
    let currentGroupNo = null;  
    let currentPage = 0;       
    const pageSize = 10;       
    
    /**
     * DOM 요소를 가져옵니다.
     */
    function getElements() {
        return {
            roleTableBody: document.querySelector('#role-table-body'),
            createModal: document.getElementById('create-modal-report'),
            createButton: document.querySelector('.create-btn'),
            cancelButton: document.getElementById('cancelCreateRole'),
            saveButton: document.getElementById('saveCreateRole'),
            roleNameInput: document.querySelector('#create-modal-report input[placeholder="Enter role name"]'),
            roleTitle: document.querySelector('.role-title'),
            authoritySaveButton: document.querySelector('#role-authority-card .save-btn'),
            prevPage: document.getElementById('prev-page'),
            nextPage: document.getElementById('next-page'),
            paginationNumbers: document.getElementById('pagination-numbers')
        };
    }

    /**
     * 체크박스 이벤트 설정 함수
     * - 각 아코디언 항목(권한 그룹)에서 부모 체크박스의 상태가 변경되면 자식 체크박스 상태를 동기화하고,
     *   자식 체크박스의 상태 변경 시 부모 체크박스의 체크 상태를 갱신합니다.
     */
    function setupCheckboxEvents() {
        const setChildren = (children, state) => {
            children.forEach(child => child.checked = state);
        };

        // 모든 자식 체크박스가 체크되어 있는지 확인하는 함수
        const allChecked = children => [...children].every(child => child.checked);

        // #roleAuthorityAccordion 내의 각 아코디언 항목 처리
        const accordionItems = document.querySelectorAll('#roleAuthorityAccordion .accordion-item');
        accordionItems.forEach(item => {
            // 현재 항목의 부모 체크박스 선택
            const parentCb = item.querySelector('.accordion-header .parent-checkbox');
            // 현재 항목의 자식(하위) 체크박스 선택
            const children = item.querySelectorAll('.accordion-body .child-checkbox');
            if (!parentCb) return;
            
            // 부모 체크박스 변경 시 자식 체크박스 모두 동일 상태 적용
            parentCb.addEventListener('change', () => setChildren(children, parentCb.checked));
            
            // 자식 체크박스 변경 시 부모 체크박스의 체크 상태 갱신
            children.forEach(child => {
                child.addEventListener('change', () => {
                    parentCb.checked = allChecked(children);
                });
            });
        });
    }


    /**
     * 페이지네이션 적용 역할 목록 데이터를 가져와 테이블에 출력합니다.
     */
    function fetchRoleData(page = 0) {
        const elements = getElements();
        currentPage = page;
        if (!elements.roleTableBody) return;

        elements.roleTableBody.innerHTML = `<tr><td colspan="6" class="text-center">Loading...</td></tr>`;
        const url = `/klums/api/role/list/paged?page=${page}&size=${pageSize}`;

        fetch(url, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
        	const result = data.data || [];
            const roles = result.roles || [];
            elements.roleTableBody.innerHTML = '';

            if (roles.length === 0) {
                elements.roleTableBody.innerHTML = `<tr><td colspan="6" class="text-center">No results found.</td></tr>`;
            } else {
                roles.forEach((role, index) => {
                    const row = `<tr data-group-name="${role.group_nm}">
                        <td>${(page * pageSize) + index + 1}</td>
                        <td class="role-name clickable">${role.group_nm}</td>
                        <td>${role.rgtr}</td>
                        <td>${role.reg_dt}</td>
                        <td>${role.mdfcn_dt}</td>
                        <td><button class="btn btn-sm btn-ghost-primary edit-button" data-group-no="${role.group_no}">EDIT</button></td>
                    </tr>`;
                    elements.roleTableBody.insertAdjacentHTML('beforeend', row);
                });
            }
            // 숫자 페이지네이션 업데이트
            updateNumericPagination(roles.length);
            // 이전/다음 버튼 업데이트
            setupPagination(roles.length);
        })
        .catch(() => {
            elements.roleTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Failed to load roles</td></tr>`;
        });
    }

    /**
     * 이전/다음 버튼의 활성/비활성 상태를 업데이트합니다.
     */
    function setupPagination(fetchedCount) {
        const elements = getElements();

        if (currentPage > 0) {
            elements.prevPage.parentElement.classList.remove('disabled');
        } else {
            elements.prevPage.parentElement.classList.add('disabled');
        }

        if (fetchedCount < pageSize) {
            elements.nextPage.parentElement.classList.add('disabled');
        } else {
            elements.nextPage.parentElement.classList.remove('disabled');
        }
    }

    /**
     * 숫자 페이지네이션 버튼을 업데이트합니다.
     */
    function updateNumericPagination(fetchedCount) {
        const elements = getElements();
        if (!elements.paginationNumbers) return;
        elements.paginationNumbers.style.display = 'flex';
        elements.paginationNumbers.style.flexDirection = 'row';
        elements.paginationNumbers.innerHTML = '';

        let totalPages;
        if (fetchedCount < pageSize) {
            totalPages = currentPage + 1;
        } else {
            totalPages = currentPage === 0 ? 2 : currentPage + 2;
        }

        for (let i = 0; i < totalPages; i++) {
            let li = document.createElement('li');
            li.className = 'page-item' + (i === currentPage ? ' active' : '');
            li.style.display = 'inline-block';
            li.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`;
            li.addEventListener('click', function(e) {
                e.preventDefault();
                fetchRoleData(i);
            });
            elements.paginationNumbers.appendChild(li);
        }
    }

    /**
     * 페이지네이션 버튼(이전/다음)의 클릭 이벤트를 설정합니다.
     */
    function setupPaginationEvents() {
        const elements = getElements();

        if (elements.prevPage) {
            elements.prevPage.addEventListener('click', function (e) {
                e.preventDefault();
                if (currentPage > 0) {
                    fetchRoleData(currentPage - 1);
                }
            });
        }

        if (elements.nextPage) {
            elements.nextPage.addEventListener('click', function (e) {
                e.preventDefault();
                if (!elements.nextPage.parentElement.classList.contains('disabled')) {
                    fetchRoleData(currentPage + 1);
                }
            });
        }
    }

    /**
     * create modal 이벤트 설정
     */
    function setupCreateModalEvent() {
        const elements = getElements();
        if (!elements.createButton || !elements.createModal) return;

        elements.createButton.addEventListener('click', function () {
            const modalInstance = new bootstrap.Modal(elements.createModal);
            modalInstance.show();
        });

        if (elements.cancelButton) {
            elements.cancelButton.addEventListener('click', function () {
                const modalInstance = bootstrap.Modal.getInstance(elements.createModal);
                if (modalInstance) modalInstance.hide();
            });
        }
    }

    /**
     * 역할 생성 SAVE 버튼 이벤트 설정
     */
    function setupCreateRoleSaveEvent() {
        const elements = getElements();
        if (!elements.saveButton || !elements.roleNameInput) return;

        elements.saveButton.removeEventListener('click', handleCreateRoleSave);
        elements.saveButton.addEventListener('click', handleCreateRoleSave);
    }

    /**
     * 역할 생성 처리 함수
     */
    function handleCreateRoleSave() {
        const elements = getElements();
        const roleName = elements.roleNameInput.value.trim();
        if (!roleName) {
            _GL.COMMON.showAlert("rolenameAlert", "You must enter the Role Name.", 'error')
            return;
        }
        
        const registeredBy = _GL.user.no;

        fetch('/klums/api/role/insert', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': _GL.csrf.token
            },
            body: JSON.stringify({ group_nm: roleName, rgtr: registeredBy })
        })
        .then(response => {
            return response.json().then(data => {
                return { status: response.status, data: data };
            });
        })
        .then(result => {
            if (result.data.success) {
                const modalInstance = bootstrap.Modal.getInstance(elements.createModal);
                if (modalInstance) modalInstance.hide();
                elements.roleNameInput.value = '';
                _GL.COMMON.showToast('Role created successfully', 'success');
                fetchRoleData(currentPage);
            } else {
                alert('Role creation failed: ' + (result.data.message || 'Unknown error.'));
            }
        })
        .catch(err => {
            alert('An error occurred while creating the role. Please contact the administrator.');
        });
    }

    /**
     * 선택된 그룹의 권한 정보를 가져와 체크박스 및 역할 제목을 업데이트합니다.
     */
    function fetchAuthorityData(groupNo, groupName, disableCheckboxes = false) {
        currentGroupNo = groupNo;
        const url = `/klums/api/role/getInfo`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': _GL.csrf.token
            },
            body: JSON.stringify({ group_no: groupNo })
        })
        .then(response => response.json())
        .then(data => {
            const authorityList = data.data || [];
            document.querySelectorAll('.form-check-input[data-authry-no]').forEach(checkbox => {
                let authryNo = Number(checkbox.getAttribute('data-authry-no'));
                checkbox.checked = authorityList.includes(authryNo);
                checkbox.disabled = disableCheckboxes;
            });
            document.querySelectorAll(".parent-checkbox").forEach(parent => {
                const childCheckboxes = parent.closest(".accordion-item").querySelectorAll(".child-checkbox");
                const allChecked = Array.from(childCheckboxes).every(cb => cb.checked);
                parent.checked = allChecked;
                parent.disabled = disableCheckboxes;
            });
            const elements = getElements();
            if (elements.roleTitle) {
                elements.roleTitle.textContent = `Role - ${groupName}`;
            }
            
            // 저장 버튼 활성화 여부 처리
            if (elements.authoritySaveButton) {
                elements.authoritySaveButton.disabled = disableCheckboxes;
            }
        })
        .catch(error => {
            console.error('Error fetching authority data:', error);
        });
    }

    /**
     * 역할 리스트 행 클릭 이벤트 설정
     */
    function setupRoleListEvents() {
        const elements = getElements();
        if (!elements.roleTableBody) {
            console.error('Role table body not found');
            return;
        }
        elements.roleTableBody.addEventListener('click', function(e) {
            const target = e.target;
            const row = target.closest('tr');
            if (!row) return;
            const editBtn = row.querySelector('.edit-button');
            let groupNo = editBtn ? editBtn.getAttribute('data-group-no') : null;
            const groupName = row.getAttribute('data-group-name') || row.cells[1].textContent;
            if (!groupNo) return;
            if (target.classList.contains('edit-button')) {
                fetchAuthorityData(groupNo, groupName, false);
            } else {
                fetchAuthorityData(groupNo, groupName, true);
            }
        });
    }

    /**
     * authority 카드의 SAVE 버튼 이벤트 설정
     */
    function setupAuthoritySaveEvent() {
        const elements = getElements();
        const saveBtn = elements.authoritySaveButton;
        if (!saveBtn) return;
        saveBtn.addEventListener('click', function() {
            if (currentGroupNo == null) {
                alert("No role selected.");
                return;
            }
            const checkboxes = document.querySelectorAll('#role-authority-card input.form-check-input[data-authry-no]');
            let selectedAuthryNos = [];
            checkboxes.forEach(cb => {
                if (cb.checked) {
                    selectedAuthryNos.push(Number(cb.getAttribute('data-authry-no')));
                }
            });
            fetch('/klums/api/role/updateAuthList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': _GL.csrf.token
                },
                body: JSON.stringify({
                    group_no: currentGroupNo,
                    authry_nos: selectedAuthryNos
                })
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            }).then(data => {
                if (data.success) {
                	_GL.COMMON.showToast('Authority updated successfully', 'success');
                	 fetchRoleData(currentPage);
                } else {
                	_GL.COMMON.showToast('Authority update failed', 'error')
                }
            }).catch(err => {
                console.error("Error updating authority:", err);
                _GL.COMMON.showToast('Authority update failed', 'error')
            });
        });
    }

    /**
     * 초기화 함수
     */
    function init() {
        setupCreateModalEvent();
        setupCreateRoleSaveEvent();
        fetchRoleData(0);
        setupRoleListEvents();
        setupAuthoritySaveEvent();
        setupPaginationEvents();
        setupCheckboxEvents(); // 체크박스 이벤트 설정 추가
        initialized = true;
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', function () {
    _GL.ROLE.init();
});
