<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>

<div class="modal modal-blur fade" id="create-modal-class" tabindex="-1" aria-hidden="true" role="dialog" aria-labelledby="Code">
	<div class="modal-dialog modal-lg modal-dialog-centered" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Code Create</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal"	aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<div class="mb-3">
					<label class="form-label required">Land Use Classification Code</label> 
					<input type="text" class="form-control mb-3" placeholder="Code">
					<div id="createClassCodeAlertContainer"></div>
				</div>
				
				<div class="mb-3">
					<label class="form-label required">Land Use Classification in English</label> 
					<input type="text" class="form-control mb-3" placeholder="English">
					<div id="createClassEnAlertContainer"></div>
				</div>		
				
				<div class="mb-3">
					<label class="form-label required">Land Use Classification in Kirghiz</label> 
					<input type="text" class="form-control mb-3" placeholder="Kirghiz">
					<div id="createClassKyAlertContainer"></div>
				</div>		
				
				<div class="mb-3">
					<label class="form-label required">Land Use Classification in Russian</label> 
					<input type="text" class="form-control mb-3" placeholder="Russian">
					<div id="createClassRuAlertContainer"></div>
				</div>		
				
				<div class="mb-3">
					<label class="form-label">Remark</label> 
					<textarea class="form-control" placeholder="Remark"></textarea>
				</div>				
			</div>
			
			<div class="modal-footer justify-content-between">
				<button type="button" class="btn btn-primary" id="saveCreateClass">Create</button>
				<button type="button" class="btn btn-secondary" id="cancelCreateClass">Cancel</button>
			</div>
		</div>
	</div>
</div>