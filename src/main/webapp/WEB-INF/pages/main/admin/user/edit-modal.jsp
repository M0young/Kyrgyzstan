<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>

<div class="modal modal-blur fade" id="edit-modal-report" tabindex="-1" aria-hidden="true" role="dialog" aria-labelledby="User Edit">
	<div class="modal-dialog modal-lg modal-dialog-centered" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<div class="modal-title-delete">
				
				</div>
				<h5 class="modal-title">
				User Edit
				</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal"	aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<div class="mb-3">
					<label class="form-label required">Name</label> 
					<input type="text" class="form-control mb-3" placeholder="Your name">
					<div id="nameAlertContainer"></div>
				</div>
				
				<div class="mb-3">
					<label class="form-label required">Role</label>
					<select class="form-select" id="user-group-select"></select>
				</div>	
				
				<div class="mb-3">
					<label class="form-label">Organization</label> 
					<input type="text" class="form-control" placeholder="Your Organization">
				</div>	
				
				<div class="mb-3">
					<label class="form-label">Department</label> 
					<input type="text" class="form-control" placeholder="Your Department">
				</div>			
			</div>
			
			<div class="modal-footer justify-content-between">
				<button type="button" class="btn btn-primary" id="saveEditUser">SAVE</button>
                <button type="button" class="btn btn-outline-danger" id="deleteEditUser">DELETE</button>
                <button type="button" class="btn btn-secondary" id="cancelEditUser">CANCEL</button>
                
			</div>
		</div>
	</div>
</div>
