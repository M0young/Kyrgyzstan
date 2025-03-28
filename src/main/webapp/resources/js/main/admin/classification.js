/*========================================================
    DATE: 2025. 01
    AUTHOR: JEON
    DESC: Land Use Classification
========================================================*/
_GL.CLASSIFICATION = (function () {
	'use strict';
	
	let currentPage = 0;
	let editModalInstance = null;
	const pageSize = 9;
	
	function getElements() {
		return {
			classTableBody: document.getElementById('class-table-body'),
			createModal: document.getElementById('create-modal-class'),
			createButton: document.querySelector('.create-btn'),
			cancelButton: document.getElementById('cancelCreateClass'),
			saveButton: document.getElementById('saveCreateClass'),
			// 생성 모달 입력 요소
			inputLandClassCode: document.querySelector('#create-modal-class input[placeholder="Code"]'),
			inputLandClassEn: document.querySelector('#create-modal-class input[placeholder="English"]'),
			inputLandClassKy: document.querySelector('#create-modal-class input[placeholder="Kirghiz"]'),
			inputLandClassRu: document.querySelector('#create-modal-class input[placeholder="Russian"]'),
			inputRemark: document.querySelector('#create-modal-class textarea[placeholder="Remark"]'),
			// 편집 모달 입력 요소
			editModal: document.getElementById('edit-modal-class'),
			editLandClass: document.querySelector('#edit-modal-class input[placeholder="Land Code"]'),
			editClassEn: document.querySelector('#edit-modal-class input[placeholder="Land Use Classification in English"]'),
			editClassKy: document.querySelector('#edit-modal-class input[placeholder="Land Use Classification in Kirghiz"]'),
			editClassRu: document.querySelector('#edit-modal-class input[placeholder="Land Use Classification in Russian"]'),
			editClassRmrk: document.querySelector('#edit-modal-class textarea[placeholder="Remark"]'),
			editsaveButton: document.getElementById('saveEditClass'),
			editdeleteButton: document.getElementById('deleteEditClass'),
			editcancelButton: document.getElementById('cancelEditClass'),
			// 검색 및 페이징 관련 요소
			searchInput: document.getElementById('search-input'),
			searchButton: document.getElementById('search-btn'),
			classCount: document.getElementById('class-count'),
			prevPage: document.getElementById('prev-page'),
			nextPage: document.getElementById('next-page'),
			paginationNumbers: document.getElementById('pagination-numbers')
		};
	}

	/**
	 * 지목 대분류 조회
	 */
	function fetchClassData(query = '', page = 0) {
		const elements = getElements();
		currentPage = page;
		elements.classTableBody.innerHTML = `<tr><td colspan="7" class="text-center">Loading...</td></tr>`;
		const trimmedQuery = query.trim();
		let url = `/klums/api/admin/code/class/list/paged?page=${page}&size=${pageSize}`;
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
			const totalClasses = result.total || 0;
			const classifications = result.classification || [];
			elements.classCount.textContent = totalClasses;
			elements.classTableBody.innerHTML = '';
			if (classifications.length === 0) {
				elements.classTableBody.innerHTML = `<tr><td colspan="7" class="text-center">No results found.</td></tr>`;
			} else {
				classifications.forEach((cls, index) => {
					const row = `
						<tr>
							<td>${formatTableValue(cls.lclsf_cd)}</td>
							<td>${formatTableValue(cls.lclsf_nm_en)}</td>
							<td>${formatTableValue(cls.lclsf_nm_ky)}</td>
							<td>${formatTableValue(cls.lclsf_nm_ru)}</td>
							<td style="width: 350px">
								<div class="remark-container">
								<div class="remark-text">${formatTableValue(cls.rmrk)}</div>
									<span class="read-more">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-caret-down">
										<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
										<path d="M18 9c.852 0 1.297 .986 .783 1.623l-.076 .084l-6 6a1 1 0 0 1 -1.32 .083l-.094 -.083l-6 -6l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057v-.118l.005 -.058l.009 -.06l.01 -.052l.032 -.108l.027 -.067l.07 -.132l.065 -.09l-.073 -.081l-.094 -.083l-.077 -.054l-.096 -.054l-.036 -.017l-.067 -.027l-.108 -.032l-.053 -.01l-.06 -.01l-.057 -.004l12.059 -.002z" />
									</svg>
									</span>
								</div>
							</td>
							<td>
							<button class="btn btn-sm btn-ghost-primary edit-button" data-id="${formatTableValue(cls.lclsf_cd)}">
							EDIT
							</button>
							</td>
						</tr>`;
					elements.classTableBody.insertAdjacentHTML('beforeend', row);
				});
			}
			checkRemarkOverflow();
			setupPagination(totalClasses, page);
			return { totalClasses, classification: classifications };
		})
		.catch(error => {
			console.error('Error fetching classification data:', error);
			elements.classTableBody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Failed to load classifications</td></tr>';
			return { totalClasses: 0, classification: [] };
		});
	}	
	
	
	/**
	 * remark overflow
	 */
	function checkRemarkOverflow() {
		const containers = document.querySelectorAll('#class-table-body .remark-container');
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
	function setupPagination(totalClass, currentPage) {
		const elements = getElements();
		const totalPages = Math.ceil(totalClass / pageSize);
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
				fetchClassData(elements.searchInput.value, i);
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
					fetchClassData(elements.searchInput.value, currentPage - 1);
				}
			});
		}
		if (elements.nextPage) {
			elements.nextPage.addEventListener('click', (e) => {
				e.preventDefault();
				fetchClassData(elements.searchInput.value, currentPage + 1);
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
				fetchClassData(elements.searchInput.value, 0);
			});
		}
		if (elements.searchInput) {
			elements.searchInput.addEventListener('keypress', (e) => {
				if (e.key === 'Enter') {
					fetchClassData(elements.searchInput.value, 0);
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
			elements.inputLandClassCode.value = '';
			elements.inputLandClassEn.value = '';
			elements.inputLandClassKy.value = '';
			elements.inputLandClassRu.value = '';
			elements.inputRemark.value = '';
			
			// alert 초기화
		    document.getElementById('createClassCodeAlertContainer').innerHTML = '';
		    document.getElementById('createClassEnAlertContainer').innerHTML = '';
		    document.getElementById('createClassKyAlertContainer').innerHTML = '';
		    document.getElementById('createClassRuAlertContainer').innerHTML = '';
		    
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
	 * create 모달 클릭 기능
	 */
	function setupCreateClassSaveEvent() {
		const elements = getElements();
		if (!elements.saveButton) return;
		elements.saveButton.removeEventListener('click', handleCreateClassSave);
		elements.saveButton.addEventListener('click', handleCreateClassSave);
	}

	
	
	/**
	 * create 모달 기능
	 */
	function handleCreateClassSave() {
	    
	    // alert 영역 초기화
	    document.getElementById('createClassCodeAlertContainer').innerHTML = '';
	    document.getElementById('createClassEnAlertContainer').innerHTML = '';
	    document.getElementById('createClassKyAlertContainer').innerHTML = '';
	    document.getElementById('createClassRuAlertContainer').innerHTML = '';
	    
	    const elements = getElements();
	    const landClassCode = elements.inputLandClassCode.value.trim();
	    const landClassEn   = elements.inputLandClassEn.value.trim();
	    const landClassKy   = elements.inputLandClassKy.value.trim();
	    const landClassRu   = elements.inputLandClassRu.value.trim();
	    const remark        = elements.inputRemark.value.trim();
	    const rgtr          = _GL.user.no;
	    
	    // 필수 입력값 검증: 값이 빈 문자열 또는 "-"이면 에러 처리
	    if (!landClassCode) {
	        _GL.COMMON.showAlert("createClassCodeAlert", "Enter Classification Code", 'error');
	        return;
	    }
	    if (!landClassEn) {
	        _GL.COMMON.showAlert("createClassEnAlert", "Enter Classification in English", 'error');
	        return;
	    }
	    if (!landClassKy) {
	        _GL.COMMON.showAlert("createClassKyAlert", "Enter Classification in Kirghiz", 'error');
	        return;
	    }
	    if (!landClassRu) {
	        _GL.COMMON.showAlert("createClassRuAlert", "Enter Classification in Russian", 'error');
	        return;
	    }
	    
	    const payload = {
	        lclsf_cd: landClassCode,
	        lclsf_nm_en: landClassEn,
	        lclsf_nm_ky: landClassKy,
	        lclsf_nm_ru: landClassRu,
	        rmrk: remark,
	        rgtr: rgtr
	    };
	    
	    // 중복 체크 API 호출 (백단의 /validation 엔드포인트 사용)
	    fetch(`/klums/api/admin/code/class/validation?code=${encodeURIComponent(landClassCode)}`)
	      .then(response => response.json())
	      .then(data => {
	          if (data.data && data.data.duplicate) {
	              _GL.COMMON.showAlert("createClassCodeAlert", "Duplicate Classification Code", 'error');
	              return;
	          }
	          // 중복이 아니면 insert API 호출
	          fetch('/klums/api/admin/code/class/insert', {
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
	                  return response.json().then(errorData => {
	                      throw new Error(errorData.message);
	                  });
	              }
	              return response.json();
	          })
	          .then(data => {
	              const modalInstance = bootstrap.Modal.getInstance(elements.createModal);
	              if (modalInstance) modalInstance.hide();
	              // 입력필드 초기화
	              elements.inputLandClassCode.value = '';
	              elements.inputLandClassEn.value = '';
	              elements.inputLandClassKy.value = '';
	              elements.inputLandClassRu.value = '';
	              elements.inputRemark.value = '';
	              fetchClassData(elements.searchInput.value, currentPage);
	              _GL.COMMON.showToast('Classification created successfully', 'success');
	          })
	          .catch(error => {
	              console.error('Error creating classification:', error);
	              _GL.COMMON.showToast(error.message, 'error');
	          });
	      })
	      .catch(error => {
	          console.error("Error checking duplicate:", error);
	          _GL.COMMON.showToast("Error checking duplicate", 'error');
	      });
	}

	
	
	
	/**
	 * Edit 모달 기능
	 */
	function setupEditEvent() {
		const elements = getElements();
		elements.classTableBody.addEventListener('click', function (e) {
			if (e.target.classList.contains('edit-button')) {
				const row = e.target.closest('tr');
				const classData = {
						lclsf_cd: row.cells[0].textContent.trim(),
						lclsf_nm_en: row.cells[1].textContent,
						lclsf_nm_ky: row.cells[2].textContent,
						lclsf_nm_ru: row.cells[3].textContent,
						rmrk: row.cells[4].textContent
				};
				elements.editLandClass.value = classData.lclsf_cd;
				elements.editClassEn.value = classData.lclsf_nm_en;
				elements.editClassKy.value = classData.lclsf_nm_ky;
				elements.editClassRu.value = classData.lclsf_nm_ru;
				elements.editClassRmrk.value = classData.rmrk.trim();
				elements.editModal.setAttribute('data-code', classData.lclsf_cd);
				editModalInstance = new bootstrap.Modal(elements.editModal);
				editModalInstance.show();
			}
		});
	
		elements.editsaveButton.addEventListener('click', function () {
			
			document.getElementById('editClassEnAlertContainer').innerHTML = '';
			document.getElementById('editClassKyAlertContainer').innerHTML = '';
			document.getElementById('editClassRuAlertContainer').innerHTML = '';
			
			if (!elements.editClassEn.value.trim()) {
				_GL.COMMON.showAlert("editClassEnAlert", "Enter Classification in English", 'error');
				return;
			}
			
			if (!elements.editClassKy.value.trim()) {
				_GL.COMMON.showAlert("editClassKyAlert", "Enter Classification in Kirghiz", 'error');
				return;
			}
			
			if (!elements.editClassRu.value.trim()) {
				_GL.COMMON.showAlert("editClassRuAlert", "Enter Classification in Russian", 'error');
				return;
			}
			
			const code = elements.editModal.getAttribute('data-code');
			const updatedData = {
					lclsf_cd: code,
					lclsf_nm_en: elements.editClassEn.value,
					lclsf_nm_ky: elements.editClassKy.value,
					lclsf_nm_ru: elements.editClassRu.value,
					rmrk: elements.editClassRmrk.value,
					mdfr: _GL.user.no
			};
			fetch('/klums/api/admin/code/class/update', {
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
					_GL.COMMON.showToast('Classification updated successfully', 'success');
					fetchClassData(elements.searchInput.value, currentPage);
				} else {
					alert('분류 수정에 실패했습니다.');
				}
			})
			.catch(error => {
				alert('분류 수정 중 오류가 발생했습니다.');
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
		fetch('/klums/api/admin/code/class/delete', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRF-TOKEN': _GL.csrf.token
			},
			body: JSON.stringify({ lclsf_cd: code })
		})
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		})
		.then(result => {
			if (result.success) {
				fetchClassData(elements.searchInput.value, currentPage)
				.then(data => {
					if (data.classification.length === 0 && currentPage > 0) {
						currentPage = currentPage - 1;
						fetchClassData(elements.searchInput.value, currentPage);
					}
					_GL.COMMON.showToast('Classification deleted successfully', 'success');
				});
			} else {
				alert('분류 삭제에 실패했습니다.');
			}
		})
		.catch(error => {
			alert('분류 삭제 중 오류가 발생했습니다.');
		});
	}

	/**
	 * remark overflow
	 */
	function toggleRemark() {
		const tableBody = document.getElementById('class-table-body');
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
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-caret-down">
							<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
							<path d="M18 9c.852 0 1.297 .986 .783 1.623l-.076 .084l-6 6a1 1 0 0 1 -1.32 .083l-.094 -.083l-6 -6l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057v-.118l.005 -.058l.009 -.06l.01 -.052l.032 -.108l-.027 -.067l-.07 .132l-.065 .09l-.073 .081l-.094 .083l-.077 .054l-.096 .054l-.036 .017l-.067 .027l-.108 .032l-.053 .01l-.06 .01l-.057 .004l12.059 -.002z" />
						</svg>`;
				}
			}
		});
	}
	
	// _GL.CLASSIFICATION 모듈 내에 추가
	function setupLandClassCodeValidation() {
	    const elements = getElements();
	    let debounceTimer;
	    elements.inputLandClassCode.addEventListener('input', function () {
	        const landClassCode = this.value.trim();
	        const alertContainer = document.getElementById('createClassCodeAlertContainer');
	        alertContainer.innerHTML = '';
	        if (!landClassCode) {
	            _GL.COMMON.showAlert("createClassCodeAlert", "Enter Classification Code", 'error');
	            return;
	        }
	        clearTimeout(debounceTimer);
	        debounceTimer = setTimeout(() => {
	            fetch(`/klums/api/admin/code/class/validation?code=${encodeURIComponent(landClassCode)}`)
	                .then(response => response.json())
	                .then(data => {
	                    if (data.data && data.data.duplicate) {
	                        _GL.COMMON.showAlert("createClassCodeAlert", "Duplicate Classification Code", 'error');
	                    }
	                })
	                .catch(error => {
	                    console.error("Error checking duplicate:", error);
	                });
	        }, 100); // 디바운스 시간: 100ms
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
		fetchClassData('', 0);
		setupPaginationEvents();
		setupSearchEvent();
		setupCreateModalEvent();
		setupCreateClassSaveEvent();
		setupEditEvent();
		toggleRemark();
		setupLandClassCodeValidation();
	}	

    return { init };
})();

document.addEventListener('DOMContentLoaded', function () {
    _GL.CLASSIFICATION.init();
});
