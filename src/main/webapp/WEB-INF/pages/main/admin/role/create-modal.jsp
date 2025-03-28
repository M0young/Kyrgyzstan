<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div class="modal modal-blur fade" id="create-modal-report" tabindex="-1" aria-hidden="true" role="dialog" aria-labelledby="Edit">
	<div class="modal-dialog modal-lg modal-dialog-centered" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Create Role</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal"	aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<div class="mb-3">
					<label class="form-label required">Role Name</label> 
					<input type="text" class="form-control mb-3" placeholder="Enter role name">
					<div id="rolenameAlertContainer"></div>
				</div>		
			</div>
			
			<div class="modal-footer justify-content-between">
				<button type="button" class="btn btn-primary" id="saveCreateRole">Create</button>
				<button type="button" class="btn btn-secondary" id="cancelCreateRole">Cancel</button>
			</div>
		</div>
	</div>
</div>
