/*========================================================
    DATE: 2025. 01
    AUTHOR: JEON
    DESC: User Management
========================================================*/
_GL.ADMIN = (function () {
	'use strict';

	let initialized = false;
	let currentPage = 0;
	const pageSize = 10; 
	let editModalInstance = null;

	/**
	 * DOM 요소 가져오기 (모달 관련 선택자)
	 */
	function getElements() {
		return {
			userTableBody: document.querySelector('#user-table-body') || { innerHTML: '' },
			userCount: document.querySelector('#user-count') || { textContent: '0' },
			editModal: document.getElementById('edit-modal-report'),
			editUserName: document.querySelector('#edit-modal-report input[placeholder="Your name"]'),
			editUserRole: document.querySelector('#edit-modal-report select'),
			editUserOrg: document.querySelector('#edit-modal-report input[placeholder="Your Organization"]'),
			editUserDept: document.querySelector('#edit-modal-report input[placeholder="Your Department"]'),
			cancelButton: document.getElementById('cancelEditUser'),
			saveButton: document.getElementById('saveEditUser'),
			deleteButton: document.getElementById('deleteEditUser'),
			searchInput: document.getElementById('search-input'),
			searchButton: document.getElementById('search-btn')
		};
	}

	/**
	 * 사용자 데이터 가져오기 (페이지네이션 지원)
	 */
	function fetchUserData(query = '', page = 0) {
		const elements = getElements();
		currentPage = page;
		const trimmedQuery = query.trim();
		elements.userTableBody.innerHTML = `<tr><td colspan="9" class="text-center">Loading...</td></tr>`;

	    const url = `/klums/api/admin/user/list/paged?page=${page}&size=${pageSize}${trimmedQuery ? `&query=${encodeURIComponent(trimmedQuery)}` : ''}`;
	
	    fetch(url)
		    .then((response) => {
		      if (!response.ok) {
		        throw new Error(`HTTP error! status: ${response.status}`);
		      }
		      return response.json();
		    })
		    .then((data) => {
		      const result = data.data || {};
		      const users = result.users || [];
		      const totalUsers = result.total || 0;
		      const totalPages = Math.ceil(totalUsers / pageSize);
		
		      elements.userTableBody.innerHTML = '';
		      elements.userCount.textContent = totalUsers || 0;
		
		      if (users.length === 0) {
		        elements.userTableBody.innerHTML = `<tr><td colspan="9" class="text-center">No results found.</td></tr>`;
		        return;
		      }
	
		      // 각 사용자 row 생성
		      users.forEach((user, index) => {
		      	  const row = `
			      	  <tr>
				      	  <td>${index + 1 + page * pageSize}</td>
				      	  <td>${formatTableValue(user.user_nm)}</td>
				      	  <td>${formatTableValue(user.eml)}</td>
				      	  <td>${formatTableValue(user.group_nm)}</td>
				      	  <td>${formatTableValue(user.inst)}</td>
				      	  <td>${formatTableValue(user.dept)}</td>
				      	  <td>${formatTableValue(user.reg_dt)}</td>
				      	  <td>${formatTableValue(user.last_lgn_dt)}</td>
				      	  <td>
				      	    <button class="btn btn-sm btn-ghost-primary edit-button" data-id="${formatTableValue(user.eml)}">
				      	      EDIT
				      	    </button>
				      	  </td>
			      	  </tr>`;
		      	    elements.userTableBody.insertAdjacentHTML('beforeend', row);
		      });
		      setupPagination(totalPages, page, elements);
		    })
		    .catch((error) => {
		        elements.userTableBody.innerHTML = `<tr><td colspan="9" class="text-center text-danger">Failed to load data</td></tr>`;
		    });
	}

	/**
	 * 페이지네이션 이벤트 설정
	 */
	function setupPagination(totalPages, currentPage, elements) {
	    const paginationContainer = document.querySelector('.pagination');
	    paginationContainer.innerHTML = '';
	     // Previous 버튼
	    const prevButton = document.createElement('li');
	    prevButton.className = `page-item ${currentPage === 0 ? 'disabled' : ''}`;
	    prevButton.innerHTML = `
	        <a class="page-link" href="#" tabindex="-1" aria-disabled="${currentPage === 0}">
	            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-1">
	            	<path d="M15 6l-6 6l6 6"></path>
	            </svg>
	            prev
	        </a>`;
	    prevButton.addEventListener('click', () => {
			if (currentPage > 0) {
			fetchUserData(elements.searchInput.value, currentPage - 1);
		    }
		});
	    paginationContainer.appendChild(prevButton);
	
	    // 페이지 번호 생성
	    for (let i = 0; i < totalPages; i++) {
	        const pageItem = document.createElement('li');
	        pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
	        pageItem.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`;
	        pageItem.addEventListener('click', () => {
	            fetchUserData(elements.searchInput.value, i);
	        });
	        paginationContainer.appendChild(pageItem);
	    }
	
	    // Next 버튼
	    const nextButton = document.createElement('li');
	    nextButton.className = `page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`;
	    nextButton.innerHTML = `
		    <a class="page-link" href="#">
		        next
		        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 	stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-1">
		            <path d="M9 6l6 6l-6 6"></path>
		        </svg>
		    </a>`;
	    nextButton.addEventListener('click', () => {
		    if (currentPage < totalPages - 1) {
		        fetchUserData(elements.searchInput.value, currentPage + 1);
		    }
	    });
	    paginationContainer.appendChild(nextButton);
	}

	/**
	 * Edit 버튼 클릭 이벤트 및 Save/DELETE 기능
	 * Bootstrap Modal API를 사용하여 모달 제어
	 */
	function setupEditEvent() {
		const elements = getElements();
		// 	EDIT 버튼 클릭 시, 해당 row 데이터를 편집 모달에 채워넣고 모달 표시
		elements.userTableBody.addEventListener('click', function (e) {
			if (e.target.classList.contains('edit-button')) {
				const row = e.target.closest('tr');
				const userData = {
						user_nm: row.cells[1].textContent,
						group_nm: row.cells[3].textContent,
						inst: row.cells[4].textContent,
						dept: row.cells[5].textContent,
						email: e.target.getAttribute('data-id')
				};
	
				elements.editUserName.value = userData.user_nm;
				elements.editUserRole.value = userData.group_nm;
				elements.editUserOrg.value = userData.inst;
				elements.editUserDept.value = userData.dept;
				elements.editModal.setAttribute('data-email', userData.email);
	
				editModalInstance = new bootstrap.Modal(elements.editModal);
				editModalInstance.show();
			}
		});
	    
	
	    // SAVE 버튼 클릭 시, 수정된 데이터를 서버에 전송
		elements.saveButton.addEventListener('click', function () {
			const email = elements.editModal.getAttribute('data-email');
			const updatedData = {
					user_nm: elements.editUserName.value,
					group_nm: elements.editUserRole.value,
					inst: elements.editUserOrg.value,
					dept: elements.editUserDept.value,
					eml: email,
					mdfr: _GL.user.no
			};
	      
			if (!updatedData.user_nm || /^\s*$/.test(updatedData.user_nm)) {
				_GL.COMMON.showAlert("nameAlert", "이름을 입력하세요", 'error')
				return; 
			}
	      
			fetch('/klums/api/admin/user/update', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRF-TOKEN': _GL.csrf.token
				},
				body: JSON.stringify(updatedData)
			})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then((result) => {
				if (result.success) {
					if (editModalInstance) editModalInstance.hide();
					_GL.COMMON.showToast('User updated successfully', 'success');
					fetchUserData(elements.searchInput.value, currentPage); 
				} else {
					alert('Failed to update user.');
				}
			})
			.catch((error) => {
				alert('An error occurred while updating the user.');
			});
		});
	
		// 	DELETE 버튼 클릭 이벤트
		elements.deleteButton.addEventListener('click', function () {
			if (editModalInstance) {
				editModalInstance.hide();
			}
			_GL.COMMON.showAlertModal({
				type: 'error',
				title: 'Are you sure?',
				message: '항목을 삭제하시겠습니까?',
				btn1: {
					text: 'Delete',
					callback: function () {
						deleteItems();
					}
				},
				btn2: {
					text: 'Cancel',
					callback: function () {
						if (editModalInstance) {
							editModalInstance.show();
						}
					}
				}
			});
		});
	
		// CANCEL 버튼 클릭 시 모달 닫기
		elements.cancelButton.addEventListener('click', function () {
			if (editModalInstance) {
				editModalInstance.hide();
			}
		});
	}
  
	/**
	 * delete 기능
	 */
	function deleteItems() {
		const emailElem = document.getElementById('edit-modal-report');
		const email = emailElem.getAttribute('data-email');
		fetch('/klums/api/admin/user/delete', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRF-TOKEN': _GL.csrf.token
			},
			body: JSON.stringify({ eml: email })
		})
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		})
		.then((result) => {
			if (result.success) {
				_GL.COMMON.showToast('User deleted successfully', 'success');
				fetchUserData();
			} else {
				alert('Failed to delete user.');
			}
		})
		.catch((error) => {
			alert('An error occurred while deleting the user.');
		});
	}

	/**
	 * 검색 이벤트 설정
	 */
	function setupSearchEvent() {
		const elements = getElements();
		elements.searchButton.addEventListener('click', () => {
			currentPage = 0;
			fetchUserData(elements.searchInput.value, currentPage);
		});
	
		elements.searchInput.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') {
				currentPage = 0;
				fetchUserData(elements.searchInput.value, currentPage);
			}
		});
	}
  
	/**
	 * 그룹 데이터를 가져오기
	 */
	function selectUserGroups() {
		fetch('/klums/api/admin/user/groups')
			.then(response => {
				if (!response.ok) {
					throw new Error('네트워크 응답에 문제가 있습니다.');
				}
				return response.json();
			})
			.then(data => {
				if (data.success) {
					const groups = data.data;
					const selectElement = document.getElementById('user-group-select');
					selectElement.innerHTML = '';
					groups.forEach(group => {
						const option = document.createElement('option');
						option.value = group.group_nm; 
						option.textContent = group.group_nm;
						selectElement.appendChild(option);
					});
				} else {
					console.error('그룹 데이터를 불러오지 못했습니다.');
				}
			})
			.catch(error => console.error('Error fetching groups:', error));
		}

	function formatTableValue(value) {
		if (value === null || value === "null" || value === undefined || (typeof value === 'string' && value.trim() === '')) {
			return "-";
		}
			return value;
	}
  

	/**
	 * 초기화
	 */
	function init() {
		if (initialized) return;
		fetchUserData();
		setupEditEvent();
		setupSearchEvent();
		selectUserGroups();
		initialized = true;
	}

	return {
		init
	};
})();

document.addEventListener('DOMContentLoaded', function () {
  _GL.ADMIN.init();
});
