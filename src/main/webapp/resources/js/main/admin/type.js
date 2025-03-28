/*========================================================
    DATE: 2025. 01
    AUTHOR: JEON
    DESC: Land Type
========================================================*/
_GL.TYPE = (function () {
	'use strict';
	
	let currentPage = 0;
	let editModalInstance = null;
	const pageSize = 9;
	
	function getElements() {
		return {
			typeTableBody: document.getElementById('type-table-body'),
			createModal: document.getElementById('create-modal-code'),
			createButton: document.querySelector('.create-btn'),
			cancelButton: document.getElementById('cancelCreateCode'),
			saveButton: document.getElementById('saveCreateRole'),
			// 	생성 모달 입력 요소
			inputLandCode: document.querySelector('#create-modal-code input[placeholder="Code"]'),
			inputLandTypeEn: document.querySelector('#create-modal-code input[placeholder="English"]'),
			inputLandTypeKy: document.querySelector('#create-modal-code input[placeholder="Kirghiz"]'),
			inputLandTypeRu: document.querySelector('#create-modal-code input[placeholder="Russian"]'),
			inputRemark: document.querySelector('#create-modal-code textarea[placeholder="Remark"]'),
			// 편집 모달 입력 요소
			editModal: document.getElementById('edit-modal-code'),
			editLandCode: document.querySelector('#edit-modal-code input[placeholder="Land Code"]'),
			editTypeEn: document.querySelector('#edit-modal-code input[placeholder="Land Type in English"]'),
			editTypeKy: document.querySelector('#edit-modal-code input[placeholder="Land Type in Kirghiz"]'),
			editTypeRu: document.querySelector('#edit-modal-code input[placeholder="Land Type in Russian"]'),
			editTypeRmrk: document.querySelector('#edit-modal-code textarea[placeholder="Remark"]'),
			editsaveButton: document.getElementById('saveEditCode'),
			editdeleteButton: document.getElementById('deleteEditCode'),
			editcancelButton: document.getElementById('cancelEditCode'),
			// 검색 및 페이징 관련 요소
			searchInput: document.getElementById('search-input'),
			searchButton: document.getElementById('search-btn'),
			typeCount: document.getElementById('type-count'),
			prevPage: document.getElementById('prev-page'),
			nextPage: document.getElementById('next-page'),
			paginationNumbers: document.getElementById('pagination-numbers')
		};
	}

	/**
	 * 토지 유형 조회
	 */
	function fetchTypeData(query = '', page = 0) {
		const elements = getElements();
		currentPage = page;
		elements.typeTableBody.innerHTML = `<tr><td colspan="7" class="text-center">Loading...</td></tr>`;
		const trimmedQuery = query.trim();
		let url = `/klums/api/admin/code/type/list/paged?page=${page}&size=${pageSize}`;
		if (trimmedQuery) {
			url += `&query=${encodeURIComponent(trimmedQuery)}`;
		}
		return fetch(url)
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		})
		.then(data => {
			const result = data.data || {};
			const totalTypes = result.total || 0;
			const types = result.type || [];
			elements.typeCount.textContent = totalTypes;
			elements.typeTableBody.innerHTML = '';
			if (types.length === 0) {
				elements.typeTableBody.innerHTML = `<tr><td colspan="7" class="text-center">No results found.</td></tr>`;
			} else {
				types.forEach((type, index) => {
					const row = `
						<tr>
							<td>${formatTableValue(type.type_cd)}</td>
							<td>${formatTableValue(type.type_nm_en)}</td>
							<td>${formatTableValue(type.type_nm_ky)}</td>
							<td>${formatTableValue(type.type_nm_ru)}</td>
							<td style="width: 350px">
								<div class="remark-container">
								<div class="remark-text">${formatTableValue(type.rmrk)}</div>
								<span class="read-more">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-caret-down">
										<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
										<path d="M18 9c.852 0 1.297 .986 .783 1.623l-.076 .084l-6 6a1 1 0 0 1 -1.32 .083l-.094 -.083l-6 -6l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057v-.118l.005 -.058l.009 -.06l.01 -.052l.032 -.108l.027 -.067l.07 -.132l.065 -.09l-.073 -.081l-.094 -.083l-.077 -.054l-.096 -.054l-.036 -.017l-.067 -.027l-.108 -.032l-.053 -.01l-.06 -.01l-.057 -.004l12.059 -.002z" />
									</svg>
								</span>
								</div>
							</td>
							<td>
								<button class="btn btn-sm btn-ghost-primary edit-button" data-id="${formatTableValue(type.type_cd)}">
									EDIT
								</button>
							</td>
						</tr>`;
					elements.typeTableBody.insertAdjacentHTML('beforeend', row);
				});
			}
	
			checkRemarkOverflow();
			setupPagination(totalTypes, page);
			return { totalTypes, types };
		})
		.catch(error => {
			console.error('Error fetching type data:', error);
			elements.typeTableBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Failed to load types</td></tr>`;
			return { totalTypes: 0, types: [] };
		});
	}

	/**
	 * remark text overflow 함수
	 */
	function checkRemarkOverflow() {
		const containers = document.querySelectorAll('#type-table-body .remark-container');
		containers.forEach(container => {
			const remarkText = container.querySelector('.remark-text');
			const readMoreButton = container.querySelector('.read-more');
			if (remarkText && readMoreButton) {
				if (remarkText.scrollHeight <= remarkText.clientHeight) {
					readMoreButton.remove();
				}
			}
		});
	}
	
	
	/**
	 * 페이지네이션
	 */
	function setupPagination(totalTypes, currentPage) {
		const elements = getElements();
		const totalPages = Math.ceil(totalTypes / pageSize);
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
				fetchTypeData(elements.searchInput.value, i);
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
					fetchTypeData(elements.searchInput.value, currentPage - 1);
				}
			});
		}
		if (elements.nextPage) {
			elements.nextPage.addEventListener('click', (e) => {
				e.preventDefault();
				fetchTypeData(elements.searchInput.value, currentPage + 1);
			});
		}
	}

	/**
	 * 검색
	 */
	function setupSearchEvent() {
		const elements = getElements();
		if (elements.searchButton) {
			elements.searchButton.addEventListener('click', () => {
				fetchTypeData(elements.searchInput.value, 0);
			});
		}
		if (elements.searchInput) {
			elements.searchInput.addEventListener('keypress', (e) => {
				if (e.key === 'Enter') {
					fetchTypeData(elements.searchInput.value, 0);
				}
			});
		}
	}

	/**
	 * create 모달
	 */
	function setupCreateModalEvent() {
		const elements = getElements();
		if (!elements.createButton || !elements.createModal) return;
		elements.createButton.addEventListener('click', function () {
			// 모달 열기 전에 생성 입력 필드 초기화
			elements.inputLandCode.value = '';
			elements.inputLandTypeEn.value = '';
			elements.inputLandTypeKy.value = '';
			elements.inputLandTypeRu.value = '';
			elements.inputRemark.value = '';
			
			// alert 초기화
		    document.getElementById('landCodeAlertContainer').innerHTML = '';
		    document.getElementById('landTypeEnAlertContainer').innerHTML = '';
		    document.getElementById('landTypeKyAlertContainer').innerHTML = '';
		    document.getElementById('landTypeRuAlertContainer').innerHTML = '';
	    
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
	 * create 모달 save 클릭
	 */
	function setupCreateTypeSaveEvent() {
		const elements = getElements();
		if (!elements.saveButton) return;
		elements.saveButton.removeEventListener('click', handleCreateTypeSave);
		elements.saveButton.addEventListener('click', handleCreateTypeSave);
	}
	
	
	/**
	 * create 모달 save 클릭 시 기능
	 */
	function handleCreateTypeSave() {			
		  // 각 필드의 이전 오류 alert 초기화
		  document.getElementById('landCodeAlertContainer').innerHTML = '';
		  document.getElementById('landTypeEnAlertContainer').innerHTML = '';
		  document.getElementById('landTypeKyAlertContainer').innerHTML = '';
		  document.getElementById('landTypeRuAlertContainer').innerHTML = '';

		  const elements = getElements();
		  const landCode = elements.inputLandCode.value.trim();
		  const landTypeEn = elements.inputLandTypeEn.value.trim();
		  const landTypeKy = elements.inputLandTypeKy.value.trim();
		  const landTypeRu = elements.inputLandTypeRu.value.trim();
		  const remark = elements.inputRemark.value.trim();
		  const rgtr = _GL.user.no;

		  if (!landCode) {
		    _GL.COMMON.showAlert("landCodeAlert", "Enter Land Code", 'error');
		    return;
		  }
		  if (!landTypeEn) {
		    _GL.COMMON.showAlert("landTypeEnAlert", "Enter Land Type in English", 'error');
		    return;
		  }
		  if (!landTypeKy) {
		    _GL.COMMON.showAlert("landTypeKyAlert", "Enter Land Type in Kirghiz", 'error');
		    return;
		  }
		  if (!landTypeRu) {
		    _GL.COMMON.showAlert("landTypeRuAlert", "Enter Land Type in Russian", 'error');
		    return;
		  }

		  // 서버의 중복 체크 API 호출
		  fetch(`/klums/api/admin/code/type/validation?code=${encodeURIComponent(landCode)}`)
		    .then(response => response.json())
		    .then(data => {
		      if (data.data && data.data.duplicate) {
		        _GL.COMMON.showAlert("landCodeAlert", "Duplicate Land Code", 'error');
		        return;
		      }
		      
		      // 중복이 아니면 데이터 생성 진행
		      const payload = {
		        type_cd: landCode,
		        type_nm_en: landTypeEn,
		        type_nm_ky: landTypeKy,
		        type_nm_ru: landTypeRu,
		        rmrk: remark,
		        rgtr: rgtr
		      };

		      fetch('/klums/api/admin/code/type/insert', {
		        method: 'POST',
		        credentials: 'include',
		        headers: {
		          'Content-Type': 'application/json',
		          'X-CSRF-TOKEN': _GL.csrf.token
		        },
		        body: JSON.stringify(payload)
		      })
		      .then(response => {
		        if (!response.ok) {
		          throw new Error('타입 생성에 실패하였습니다.');
		        }
		        return response.json();
		      })
		      .then(data => {
		        const modalInstance = bootstrap.Modal.getInstance(elements.createModal);
		        if (modalInstance) modalInstance.hide();
		        // 생성 후 입력 필드 초기화
		        elements.inputLandCode.value = '';
		        elements.inputLandTypeEn.value = '';
		        elements.inputLandTypeKy.value = '';
		        elements.inputLandTypeRu.value = '';
		        elements.inputRemark.value = '';
		        _GL.COMMON.showToast('Type created successfully', 'success');
		        fetchTypeData(elements.searchInput.value, currentPage);
		      })
		      .catch(error => {
		        console.error('Error creating type:', error);
		        alert('타입 생성 중 오류가 발생했습니다: ' + error.message);
		      });
		    })
		    .catch(error => {
		      console.error("Error checking duplicate:", error);
		      alert("Error checking duplicate");
		    });
		}


	
	/**
	 * Edit 모달
	 */
	function setupEditEvent() {
		const elements = getElements();
		elements.typeTableBody.addEventListener('click', function (e) {
			if (e.target.classList.contains('edit-button')) {
				const row = e.target.closest('tr');
				const typeData = {
						type_cd: row.cells[0].textContent.trim(),
						type_nm_en: row.cells[1].textContent,
						type_nm_ky: row.cells[2].textContent,
						type_nm_ru: row.cells[3].textContent,
						rmrk: row.cells[4].textContent
				};
				elements.editLandCode.value = typeData.type_cd;
				elements.editTypeEn.value = typeData.type_nm_en;
				elements.editTypeKy.value = typeData.type_nm_ky;
				elements.editTypeRu.value = typeData.type_nm_ru;
				elements.editTypeRmrk.value = typeData.rmrk.trim();
				elements.editModal.setAttribute('data-code', typeData.type_cd);
				editModalInstance = new bootstrap.Modal(elements.editModal);
				editModalInstance.show();
				
				
			}
		});
	
		elements.editsaveButton.addEventListener('click', function () {
			
			  // edit 모달의 이전 오류 alert 초기화 (수정된 값에 대해 alert가 남지 않도록 함)
			  document.getElementById('landTypeEnEditAlertContainer').innerHTML = '';
			  document.getElementById('landTypeKyEditAlertContainer').innerHTML = '';
			  document.getElementById('landTypeRuEditAlertContainer').innerHTML = '';

			  // 필수 입력값 검증
			  if (!elements.editTypeEn.value.trim()) {
			    _GL.COMMON.showAlert("landTypeEnEditAlert", "Enter Land Type in English", 'error');
			    return;
			  }
			  if (!elements.editTypeKy.value.trim()) {
			    _GL.COMMON.showAlert("landTypeKyEditAlert", "Enter Land Type in Kirghiz", 'error');
			    return;
			  }
			  if (!elements.editTypeRu.value.trim()) {
			    _GL.COMMON.showAlert("landTypeRuEditAlert", "Enter Land Type in Russian", 'error');
			    return;
			  }
			
			const code = elements.editModal.getAttribute('data-code');
			const updatedData = {
					type_cd: code,
					type_nm_en: elements.editTypeEn.value,
					type_nm_ky: elements.editTypeKy.value,
					type_nm_ru: elements.editTypeRu.value,
					rmrk: elements.editTypeRmrk.value,
					mdfr: _GL.user.no

			};
			

			
			fetch('/klums/api/admin/code/type/update', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRF-TOKEN': _GL.csrf.token
				},
				body: JSON.stringify(updatedData)
			})
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then(result => {
				if (result.success) {
					if (editModalInstance) editModalInstance.hide();
					_GL.COMMON.showToast('Type updated successfully', 'success');
					fetchTypeData(elements.searchInput.value, currentPage);
				} else {
					alert('Failed to update type.');
				}
			})
			.catch(error => {
				alert('An error occurred while updating type.');
			});
		});
	
		elements.editdeleteButton.addEventListener('click', function () {
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
	
		elements.editcancelButton.addEventListener('click', function () {
			if (editModalInstance) {
				editModalInstance.hide();
			}
		});	
	}	
	
	
	/**
	 * delete 모달
	 */
	function deleteItems() {
		const elements = getElements();
		const code = elements.editModal.getAttribute('data-code');
		fetch('/klums/api/admin/code/type/delete', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRF-TOKEN': _GL.csrf.token
			},
			body: JSON.stringify({ type_cd: code })
		})
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		})
		.then(result => {
			if (result.success) {
				fetchTypeData(elements.searchInput.value, currentPage)
				.then(data => {
					if (data.types.length === 0 && currentPage > 0) {
						currentPage = currentPage - 1;
						fetchTypeData(elements.searchInput.value, currentPage);
					}
					_GL.COMMON.showToast('Type deleted successfully', 'success');
				});
			} else {
				alert('Failed to delete type.');
			}
		})
		.catch(error => {
			alert('An error occurred while deleting type.');
		});
	}

	/**
	 * remark overflow
	 */
	function toggleRemark() {
		const tableBody = document.getElementById('type-table-body');
		tableBody.addEventListener('click', function(e) {
			const readMoreElement = e.target.closest('.read-more');
			if (readMoreElement) {
				const remarkText = readMoreElement.parentElement.querySelector('.remark-text');
				remarkText.classList.toggle('expanded');
				if (remarkText.classList.contains('expanded')) {
					readMoreElement.innerHTML = `
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-caret-up">
							<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
							<path d="M11.293 7.293a1 1 0 0 1 1.32 -.083l.094 .083l6 6l.083 .094l.054 .077l.054 .096l.017 .036l.027 .067l.032 .108l.01 .053l.01 .06l.004 .057l.002 .059l-.002 .059l-.005 .058l-.009 .06l-.01 .052l-.032 .108l-.027 .067l-.07 .132l-.065 .09l-.073 .081l-.094 .083l-.077 .054l-.096 .054l-.036 .017l-.067 .027l-.108 .032l-.053 .01l-.06 .01l-.057 .004l-.059 .002h-12c-.852 0 -1.297 -.986 -.783 -1.623l.076 -.084l6 -6z" />
						</svg>`;
				} else {
					readMoreElement.innerHTML = `
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-caret-down">
							<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
							<path d="M18 9c.852 0 1.297 .986 .783 1.623l-.076 .084l-6 6a1 1 0 0 1 -1.32 .083l-.094 -.083l-6 -6l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057v-.118l.005 -.058l.009 -.06l.01 -.052l.032 -.108l.027 -.067l.07 -.132l.065 -.09l.073 -.081l.094 -.083l.077 -.054l.096 -.054l.036 -.017l-.067 -.027l-.108 -.032l-.053 -.01l-.06 -.01l-.057 -.004l12.059 -.002z" />
						</svg>`;
				}
			}
		});
	}
	
	// 기존 _GL.TYPE IIFE 내부에 추가
	function setupLandCodeValidation() {
		  const elements = getElements();
		  let debounceTimer;
		  elements.inputLandCode.addEventListener('input', function () {
		    const landCode = this.value.trim();
		    const alertContainer = document.getElementById('landCodeAlertContainer');
		    alertContainer.innerHTML = '';
		    if (!landCode) {
		      _GL.COMMON.showAlert("landCodeAlert", "Enter Land Code", 'error');
		      return;
		    }
		    clearTimeout(debounceTimer);
		    debounceTimer = setTimeout(() => {
		      fetch(`/klums/api/admin/code/type/validation?code=${encodeURIComponent(landCode)}`)
		        .then(response => response.json())
		        .then(data => {
		          if (data.data && data.data.duplicate) {
		            _GL.COMMON.showAlert("landCodeAlert", "Duplicate Land Code", 'error');
		          }
		        })
		        .catch(error => {
		          console.error("Error checking duplicate:", error);
		        });
		    }, 100);
		  });
		}


	
	/**
	 * null / 기본값은 "-" 처리
	 */  
	function formatTableValue(value) {
		if (value === null || value === "null" || value === undefined || (typeof value === 'string' && value.trim() === '')) {
			return "-";
		}
		return value;
	}

	function init() {
		fetchTypeData('', 0);
		setupPaginationEvents();
		setupSearchEvent();
		setupCreateModalEvent();
		setupCreateTypeSaveEvent();
		setupEditEvent();
		toggleRemark();
		setupLandCodeValidation();
	}

	return { init };
})();

document.addEventListener('DOMContentLoaded', function () {
  _GL.TYPE.init();
});
