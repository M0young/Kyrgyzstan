<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div class="modal modal-blur fade" id="edit-modal-class" tabindex="-1" aria-hidden="true" role="dialog" aria-labelledby="User Edit">
	<div class="modal-dialog modal-lg modal-dialog-centered" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Code Edit</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal"	aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<div class="mb-3">
					<label class="form-label required">Land Use Classification Code</label> 
					<input type="text" class="form-control mb-3" placeholder="Land Code" disabled="true">
					<div id="editClassCodeAlertContainer"></div>
				</div>
				
				<div class="mb-3">
					<label class="form-label required">Land Use Classification in English</label> 
					<input type="text" class="form-control mb-3" placeholder="Land Use Classification in English">
					<div id="editClassEnAlertContainer"></div>
				</div>
				
				<div class="mb-3">
					<label class="form-label required">Land Use Classification in Kirghiz</label> 
					<input type="text" class="form-control mb-3" placeholder="Land Use Classification in Kirghiz">
					<div id="editClassKyAlertContainer"></div>
				</div>	
				
				<div class="mb-3">
					<label class="form-label required">Land Use Classification in Russian</label> 
					<input type="text" class="form-control mb-3" placeholder="Land Use Classification in Russian">
					<div id="editClassRuAlertContainer"></div>
				</div>		
				
				<div class="mb-3">
					<label class="form-label">Remark</label> 
					<textarea class="form-control" placeholder="Remark"></textarea>
				</div>	
			</div>
			
			<div class="modal-footer justify-content-between">
				<button type="button" class="btn btn-primary" id="saveEditClass">SAVE</button>
				<button type="button" class="btn btn-outline-danger" id="deleteEditClass">DELETE</button>
                <button type="button" class="btn btn-secondary" id="cancelEditClass">CANCEL</button>
			</div>
		</div>
	</div>
</div>
