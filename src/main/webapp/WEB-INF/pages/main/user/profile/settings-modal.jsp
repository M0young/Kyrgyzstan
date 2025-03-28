<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="modal modal-blur fade" id="modal-report" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="Profile">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div id="profileSection">
				<div class="modal-header">
					<h5 class="modal-title">Profile</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="mb-3">
						<label class="form-label small text-uppercase">Name</label>
						<input type="text" class="form-control" placeholder="Enter your name">
					</div>

					<div class="mb-3">
						<label class="form-label small text-uppercase">Email address</label>
						<input type="email" class="form-control" placeholder="Enter your email" readonly>
						<div class="form-text text-muted">Email cannot be changed</div>
					</div>

					<div class="mb-3">
						<label class="form-label small text-uppercase">Role</label>
						<div class="d-flex align-items-center">
							<span class="badge bg-blue-lt">User</span>
						</div>
					</div>

					<div class="mt-4">
						<button class="btn btn-outline-primary" onclick="showPasswordForm()">Change Password</button>
					</div>
				</div>
			</div>

			<!-- Password Section -->
			<div id="passwordSection" style="display: none;">
				<div class="modal-header">
					<h5 class="modal-title">Profile</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="mb-3">
						<label class="form-label small text-uppercase">Current Password</label>
						<input type="password" class="form-control" placeholder="Enter current password">
					</div>
					<div class="mb-3">
						<label class="form-label small text-uppercase">New Password</label>
						<input type="password" class="form-control" placeholder="Enter new password">
						<div class="form-text text-muted">
							Password must be 8-15 characters long and include letters, numbers, and special characters
						</div>
					</div>
					<div class="mb-3">
						<label class="form-label small text-uppercase">Confirm Password</label>
						<input type="password" class="form-control" placeholder="Confirm new password">
					</div>
					<div class="mt-4">
						<button class="btn btn-outline-secondary" onclick="showProfileForm()">Back to Profile</button>
					</div>
				</div>
			</div>
			<div class="modal-footer justify-content-between">
				<button type="button" class="btn btn-primary" id="saveButton">Save</button>
				<button type="button" class="btn btn-link link-secondary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>