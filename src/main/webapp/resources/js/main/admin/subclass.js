/*========================================================
    DATE: 2025. 01
    AUTHOR: JEON
    DESC: Land Use Subclassification (fld_nm 추가)
========================================================*/
_GL.SUBCLASSIFICATION = (function () {
	'use strict';
	
	let currentPage = 0;
	let editModalInstance = null;
	const pageSize = 10;
	
	function getElements() {
		return {
			// 테이블 관련
			subclassTableBody: document.getElementById('subclass-table-body'),
			// 생성 모달 관련
			createModal: document.getElementById('create-modal-subclass'),
			createButton: document.querySelector('.create-btn'),
			cancelCreateButton: document.getElementById('cancelCreateSubClass'),
			saveCreateButton: document.getElementById('saveCreateSubClass'),
			// 생성 모달 입력 요소 (fld_nm 입력란 추가)
			inputSubClassCode: document.querySelector('#create-modal-subclass input[placeholder="SubCode"]'),
			inputClassCode: document.querySelector('#create-modal-subclass input[placeholder="Code"]'),
			inputSubClassEn: document.querySelector('#create-modal-subclass input[placeholder="English"]'),
			inputSubClassKy: document.querySelector('#create-modal-subclass input[placeholder="Kirghiz"]'),
			inputSubClassRu: document.querySelector('#create-modal-subclass input[placeholder="Russian"]'),
			inputFldNm: document.querySelector('#create-modal-subclass input[placeholder="Field Name"]'),
			inputRemark: document.querySelector('#create-modal-subclass textarea[placeholder="Remark"]'),
			// 편집 모달 관련 (fld_nm 입력란 추가)
			editModal: document.getElementById('edit-modal-subclass'),
			editSubClassCode: document.querySelector('#edit-modal-subclass input[placeholder="Land SubCode"]'),
			editClassCode: document.querySelector('#edit-modal-subclass input[placeholder="Land ClassCode"]'),
			editSubClassEn: document.querySelector('#edit-modal-subclass input[placeholder="Land Use SubClassification in English"]'),
			editSubClassKy: document.querySelector('#edit-modal-subclass input[placeholder="Land Use SubClassification in Kirghiz"]'),
			editSubClassRu: document.querySelector('#edit-modal-subclass input[placeholder="Land Use SubClassification in Russian"]'),
			editFldNm: document.querySelector('#edit-modal-subclass input[placeholder="Field Name"]'),
			editRemark: document.querySelector('#edit-modal-subclass textarea[placeholder="Remark"]'),
			editSaveButton: document.getElementById('saveEditSubClass'),
			editDeleteButton: document.getElementById('deleteEditSubClass'),
			editCancelButton: document.getElementById('cancelEditSubClass'),
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
	 * 지목 소분류 조회
	 */
	function fetchSubClassData(query = '', page = 0) {
		const elements = getElements();
		currentPage = page;
		// 컬럼이 추가되었으므로 colspan을 8로 수정
		elements.subclassTableBody.innerHTML = `<tr><td colspan="8" class="text-center">Loading...</td></tr>`;
		const trimmedQuery = query.trim();
		let url = `/klums/api/admin/code/subclass/list/paged?page=${page}&size=${pageSize}`;
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
			const totalSubClass = result.total || 0;
			const subClasses = result.subclass || [];
			elements.classCount.textContent = totalSubClass;
			elements.subclassTableBody.innerHTML = '';
			if (subClasses.length === 0) {
				elements.subclassTableBody.innerHTML = `<tr><td colspan="8" class="text-center">No results found.</td></tr>`;
			} else {
				subClasses.forEach((item, index) => {
					// fld_nm 컬럼 추가 (remark 왼쪽)
					const row = `
						<tr data-classcode="${formatTableValue(item.lclsf_cd || '')}">
							<td>${formatTableValue(item.sclsf_cd)}</td>
							<td>${formatTableValue(item.sclsf_nm_en)}</td>
							<td>${formatTableValue(item.sclsf_nm_ky)}</td>
							<td>${formatTableValue(item.sclsf_nm_ru)}</td>
							<td>${formatTableValue(item.fld_nm)}</td>
							<td style="width: 350px">
								<div class="remark-container">
									<div class="remark-text">${formatTableValue(item.rmrk || '')}</div>
									<span class="read-more">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-caret-down">
											<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
											<path d="M18 9c.852 0 1.297 .986 .783 1.623l-.076 .084l-6 6a1 1 0 0 1 -1.32 .083l-.094 -.083l-6 -6l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057v-.118l.005 -.058l.009 -.06l.01 -.052l.032 -.108l.027 -.067l.07 -.132l.065 -.09l-.073 -.081l-.094 -.083l-.077 -.054l-.096 -.054l-.036 -.017l-.067 -.027l-.108 -.032l-.053 -.01l-.06 -.01l-.057 -.004l12.059 -.002z" />
										</svg>
									</span>
								</div>
							</td>
							<td>
								<button class="btn btn-sm btn-ghost-primary edit-button" data-id="${formatTableValue(item.sclsf_cd)}">
									EDIT
								</button>
							</td>
						</tr>`;
					elements.subclassTableBody.insertAdjacentHTML('beforeend', row);
				});
			}
			checkRemarkOverflow();
			setupPagination(totalSubClass, page);
			return { totalSubClass, subclass: subClasses };
		})
		.catch(error => {
			console.error('Error fetching subclass data:', error);
			elements.subclassTableBody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Failed to load subclass data</td></tr>';
			return { totalSubClass: 0, subclass: [] };
		});
	}
	
	/**
	 * remark overflow
	 */
	function checkRemarkOverflow() {
		const containers = document.querySelectorAll('#subclass-table-body .remark-container');
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
	function setupPagination(totalCount, currentPage) {
		const elements = getElements();
		const totalPages = Math.ceil(totalCount / pageSize);
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
				fetchSubClassData(elements.searchInput.value, i);
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
					fetchSubClassData(elements.searchInput.value, currentPage - 1);
				}
			});
		}
		if (elements.nextPage) {
			elements.nextPage.addEventListener('click', (e) => {
				e.preventDefault();
				fetchSubClassData(elements.searchInput.value, currentPage + 1);
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
				fetchSubClassData(elements.searchInput.value, 0);
			});
		}
		if (elements.searchInput) {
			elements.searchInput.addEventListener('keypress', (e) => {
				if (e.key === 'Enter') {
					fetchSubClassData(elements.searchInput.value, 0);
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
			elements.inputSubClassCode.value = '';
			elements.inputClassCode.value = '';
			elements.inputSubClassEn.value = '';
			elements.inputSubClassKy.value = '';
			elements.inputSubClassRu.value = '';
			elements.inputFldNm.value = '';
			elements.inputRemark.value = '';
			
			// alert 초기화
			document.getElementById('createSubclassCodeAlertContainer').innerHTML = '';
			document.getElementById('createClassSubCodeAlertContainer').innerHTML = '';
			document.getElementById('createSubclassEnAlertContainer').innerHTML = '';
			document.getElementById('createSubclassKyAlertContainer').innerHTML = '';
			document.getElementById('createSubclassRuAlertContainer').innerHTML = '';
			
			const modalInstance = new bootstrap.Modal(elements.createModal);
			modalInstance.show();
		});
		if (elements.cancelCreateButton) {
			elements.cancelCreateButton.addEventListener('click', function () {
				const modalInstance = bootstrap.Modal.getInstance(elements.createModal);
				if (modalInstance) modalInstance.hide();
			});
		}
	}
	
	/**
	 * create 모달 클릭 기능
	 */
	function setupCreateSubClassSaveEvent() {
		const elements = getElements();
		if (!elements.saveCreateButton) return;
		elements.saveCreateButton.removeEventListener('click', handleCreateSubClassSave);
		elements.saveCreateButton.addEventListener('click', handleCreateSubClassSave);
	}
	
	
	/**
	 * create 모달 기능
	 */
	function handleCreateSubClassSave() {
		document.getElementById('createSubclassCodeAlertContainer').innerHTML = '';
		document.getElementById('createClassSubCodeAlertContainer').innerHTML = '';
		document.getElementById('createSubclassEnAlertContainer').innerHTML = '';
		document.getElementById('createSubclassKyAlertContainer').innerHTML = '';
		document.getElementById('createSubclassRuAlertContainer').innerHTML = '';
		
		
		const elements = getElements();
		const subClassCode = elements.inputSubClassCode.value.trim();
		const subClassEn = elements.inputSubClassEn.value.trim();
		const subClassKy = elements.inputSubClassKy.value.trim();
		const subClassRu = elements.inputSubClassRu.value.trim();
		const fldNm = elements.inputFldNm.value.trim();
		const remark = elements.inputRemark.value.trim();
		const classCode = elements.inputClassCode.value.trim();
		const rgtr = _GL.user.no;
		
		if (!subClassCode) {
			_GL.COMMON.showAlert("createSubclassCodeAlert", "Enter Subclassification Code", 'error');
			return;
		}
		
		const rows = document.querySelectorAll('#subclass-table-body tr');
		for (let row of rows) {
			const existingCode = row.cells[0].textContent.trim();
			if (existingCode === subClassCode) {
				_GL.COMMON.showAlert("createSubclassCodeAlert", "Duplicate Subclassification Code", 'error');
				return;
			}
		}
		
		if (!classCode) {
			_GL.COMMON.showAlert("createClassSubCodeAlert", "Enter Classification Code", 'error');
			return;
		}
		if (!subClassEn) {
			_GL.COMMON.showAlert("createSubclassEnAlert", "Enter Subclassification English", 'error');
			return;
		}
		if (!subClassKy) {
			_GL.COMMON.showAlert("createSubclassKyAlert", "Enter Subclassification kirghiz", 'error');
			return;
		}
		if (!subClassRu) {
			_GL.COMMON.showAlert("createSubclassRuAlert", "Enter Subclassification Russian", 'error');
			return;
		}
		
		
		
		
		const payload = {
			sclsf_cd: subClassCode,
			sclsf_nm_en: subClassEn,
			sclsf_nm_ky: subClassKy,
			sclsf_nm_ru: subClassRu,
			fld_nm: fldNm,
			rmrk: remark,
			lclsf_cd: classCode,
			rgtr: rgtr
		};
		fetch('/klums/api/admin/code/subclass/insert', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRF-TOKEN': _GL.csrf.token
			},
			body: JSON.stringify(payload)
		})
		.then(response => response.json())
		.then(data => {
			if (!data.success) {
				throw new Error(data.message);
			}
			const modalInstance = bootstrap.Modal.getInstance(elements.createModal);
			if (modalInstance) modalInstance.hide();
			// 초기화
			elements.inputSubClassCode.value = '';
			elements.inputClassCode.value = '';
			elements.inputSubClassEn.value = '';
			elements.inputSubClassKy.value = '';
			elements.inputSubClassRu.value = '';
			elements.inputFldNm.value = '';
			elements.inputRemark.value = '';
			fetchSubClassData(elements.searchInput.value, currentPage);
			_GL.COMMON.showToast('Subclassification created successfully', 'success');
		})
		.catch(error => {
			console.error('Error creating subclass:', error);
			if (error.message.includes("land_sclsf_pk")) {
				_GL.COMMON.showToast("Duplicate Subclassification Code", "error");
			} else {
				_GL.COMMON.showToast(error.message, "error");
			}
		});
	}
	
	/**
	 * Edit 모달 기능
	 */
	function setupEditEvent() {
		const elements = getElements();
		elements.subclassTableBody.addEventListener('click', function (e) {
			if (e.target.classList.contains('edit-button')) {
				const row = e.target.closest('tr');
				let classCode = row.getAttribute('data-classcode') || '0';
				if (classCode === "") {
					classCode = "0";
				}
				const subClassData = {
					sclsf_cd: row.cells[0].textContent.trim(),
					sclsf_nm_en: row.cells[1].textContent,
					sclsf_nm_ky: row.cells[2].textContent,
					sclsf_nm_ru: row.cells[3].textContent,
					fld_nm: row.cells[4].textContent,
					rmrk: row.cells[5].textContent
				};
				elements.editSubClassCode.value = subClassData.sclsf_cd;
				elements.editClassCode.value = classCode;
				elements.editSubClassEn.value = subClassData.sclsf_nm_en;
				elements.editSubClassKy.value = subClassData.sclsf_nm_ky;
				elements.editSubClassRu.value = subClassData.sclsf_nm_ru;
				elements.editFldNm.value = subClassData.fld_nm;
				elements.editRemark.value = subClassData.rmrk.trim();
				elements.editModal.setAttribute('data-code', subClassData.sclsf_cd);
				editModalInstance = new bootstrap.Modal(elements.editModal);
				editModalInstance.show();
			}
		});	
	
		elements.editSaveButton.addEventListener('click', function () {
			
			document.getElementById('editSubclassEnAlertContainer').innerHTML = '';
			document.getElementById('editSubclassKyAlertContainer').innerHTML = '';
			document.getElementById('editSubclassRuAlertContainer').innerHTML = '';
			
			if (!elements.editSubClassEn.value.trim()) {
				_GL.COMMON.showAlert("editSubclassEnAlert", "Enter Subclassification English", 'error');
				return;
			}
			if (!elements.editSubClassKy.value.trim()) {
				_GL.COMMON.showAlert("editSubclassKyAlert", "Enter Subclassificaitoin Kirghiz", 'error');
				return;
			}
			if (!elements.editSubClassRu.value.trim()) {
				_GL.COMMON.showAlert("editSubclassRuAlert", "Enter Subclassification Russian", 'error');
				return;
			}
			
//			const elements = getElements();
			const code = elements.editModal.getAttribute('data-code');
			const updatedData = {
				sclsf_cd: code,
				lclsf_cd: elements.editClassCode.value, 
				sclsf_nm_en: elements.editSubClassEn.value,
				sclsf_nm_ky: elements.editSubClassKy.value,
				sclsf_nm_ru: elements.editSubClassRu.value,
				fld_nm: elements.editFldNm.value,
				rmrk: elements.editRemark.value,
				mdfr: _GL.user.no
			};
			fetch('/klums/api/admin/code/subclass/update', {
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
					fetchSubClassData(elements.searchInput.value, currentPage);
					_GL.COMMON.showToast('Subclassification updated successfully', 'success');
				} else {
					alert('서브클래스 수정에 실패했습니다.');
				}
			})
			.catch(error => {
				console.error('Error updating subclass:', error);
				if (error.message.includes("land_sclsf_pk")) {
					_GL.COMMON.showToast("Duplicate Subclassification Code", "error");
				} else if (error.message.includes("land_lclsf_pk")) {
					_GL.COMMON.showToast("Duplicate Classification Code", "error");
				} else {
					_GL.COMMON.showToast("Error updating subclass", "error");
				}
			});
		});
	
		elements.editDeleteButton.addEventListener('click', function () {
			const elements = getElements();
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
						deleteSubClassItem();
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
	
		elements.editCancelButton.addEventListener('click', function () {
			if (editModalInstance) {
				editModalInstance.hide();
			}
		});
	}
  
	/**
	 * delete 모달
	 */
	function deleteSubClassItem() {
		const elements = getElements();
		const code = elements.editModal.getAttribute('data-code');
		fetch('/klums/api/admin/code/subclass/delete', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRF-TOKEN': _GL.csrf.token
			},
			body: JSON.stringify({ sclsf_cd: code })
		})
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		})
		.then(result => {
			if (result.success) {
				fetchSubClassData(elements.searchInput.value, currentPage)
				.then(data => {
					if (data.subclass.length === 0 && currentPage > 0) {
						currentPage = currentPage - 1;
						fetchSubClassData(elements.searchInput.value, currentPage);
					}
					_GL.COMMON.showToast('Subclassification deleted successfully', 'success');
				});
			} else {
				alert('서브클래스 삭제에 실패했습니다.');
			}
		})
		.catch(error => {
			alert('서브클래스 삭제 중 오류가 발생했습니다.');
		});
	}
  
	/**
	 * remark overflow
	 */
	function toggleRemark() {
		const tableBody = document.getElementById('subclass-table-body');
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
		fetchSubClassData('', 0);
		setupPaginationEvents();
		setupSearchEvent();
		setupCreateModalEvent();
		setupCreateSubClassSaveEvent();
		setupEditEvent();
		toggleRemark();
	}

  return { init };
})();

document.addEventListener('DOMContentLoaded', function () {
	_GL.SUBCLASSIFICATION.init();
});
