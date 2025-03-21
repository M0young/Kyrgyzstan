<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>

<div class="modal modal-blur fade" id="create-modal-subclass" tabindex="-1" aria-hidden="true" role="dialog" aria-labelledby="Code">
	<div class="modal-dialog modal-lg modal-dialog-centered" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Code Create</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal"	aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<div class="mb-3">
					<label class="form-label required">Land Use SubClassification Code</label> 
					<input type="text" class="form-control mb-3" placeholder="SubCode">
					<div id="createSubclassCodeAlertContainer"></div>
				</div>
				
				<div class="mb-3">
					<label class="form-label required">Land Use Classification Code</label> 
					<input type="text" class="form-control mb-3" placeholder="Code">
					<div id="createClassSubCodeAlertContainer"></div>
				</div>
				
				<div class="mb-3">
					<label class="form-label required">Land Use SubClassification in English</label> 
					<input type="text" class="form-control mb-3" placeholder="English">
					<div id="createSubclassEnAlertContainer"></div>
				</div>		
				
				<div class="mb-3">
					<label class="form-label required">Land Use SubClassification in Kirghiz</label> 
					<input type="text" class="form-control mb-3" placeholder="Kirghiz">
					<div id="createSubclassKyAlertContainer"></div>
				</div>		
				
				<div class="mb-3">
					<label class="form-label required">Land Use SubClassification in Russian</label> 
					<input type="text" class="form-control mb-3" placeholder="Russian">
					<div id="createSubclassRuAlertContainer"></div>
				</div>
				
				<!-- Field Name 추가 -->
				<div class="mb-3">
					<label class="form-label">Field Name</label> 
					<input type="text" class="form-control" placeholder="Field Name">
				</div>
				
				<div class="mb-3">
					<label class="form-label">Remark</label> 
					<textarea class="form-control" placeholder="Remark"></textarea>
				</div>				
			</div>
			
			<div class="modal-footer justify-content-between">
				<button type="button" class="btn btn-primary" id="saveCreateSubClass">Create</button>
				<button type="button" class="btn btn-secondary" id="cancelCreateSubClass">Cancel</button>
			</div>
		</div>
	</div>
</div>
