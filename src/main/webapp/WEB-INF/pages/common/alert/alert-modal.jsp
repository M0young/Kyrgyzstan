<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<div class="modal modal-blur fade" id="alertModal" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="alertModalTitle">
    <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-status"></div>
            <div class="modal-body text-center py-4">
                <div class="modal-icon mb-3"></div>
                <h3 class="modal-title" id="alertModalTitle"></h3>
                <div class="modal-message text-secondary"></div>
            </div>
            <div class="modal-footer">
                <div class="w-100">
                    <div class="row">
                        <div class="col">
                            <button type="button" data-btn="btn1" class="btn w-100" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="col" data-wrapper="btn2" style="display: none;">
                            <button type="button" data-btn="btn2" class="btn w-100" data-bs-dismiss="modal"></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>