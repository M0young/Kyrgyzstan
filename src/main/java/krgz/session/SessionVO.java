/*
 * Copyright 2008-2009 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package krgz.session;

public class SessionVO {

	private static final long serialVersionUID = 1L;

	private String sessUsrNo;
	private String sessEncryUsrId;
	private String sessUsrId;
	private String sessUsrNm;
	private String sessPwd;
	private String sessGrpId;
	private String sessGrpNm;
	private String sessEml;
	private String sessTelno;
	private String sessInst;
	private String sessDept;
	private String sessSrvcYn;
	private String sessAuthorMenu;
	
	public String getSessUsrNo() {
		return sessUsrNo;
	}
	public void setSessUsrNo(String sessUsrNo) {
		this.sessUsrNo = sessUsrNo;
	}
	public String getSessEncryUsrId() {
		return sessEncryUsrId;
	}
	public void setSessEncryUsrId(String sessEncryUsrId) {
		this.sessEncryUsrId = sessEncryUsrId;
	}
	public String getSessUsrId() {
		return sessUsrId;
	}
	public void setSessUsrId(String sessUsrId) {
		this.sessUsrId = sessUsrId;
	}
	public String getSessUsrNm() {
		return sessUsrNm;
	}
	public void setSessUsrNm(String sessUsrNm) {
		this.sessUsrNm = sessUsrNm;
	}
	public String getSessEml() {
		return sessEml;
	}
	public void setSessEml(String sessEml) {
		this.sessEml = sessEml;
	}
	public String getSessTelno() {
		return sessTelno;
	}
	public void setSessTelno(String sessTelno) {
		this.sessTelno = sessTelno;
	}
	public String getSessInst() {
		return sessInst;
	}
	public void setSessInst(String sessInst) {
		this.sessInst = sessInst;
	}
	public String getSessDept() {
		return sessDept;
	}
	public void setSessDept(String sessDept) {
		this.sessDept = sessDept;
	}
	public String getSessPwd() {
		return sessPwd;
	}
	public void setSessPwd(String sessPwd) {
		this.sessPwd = sessPwd;
	}
	public String getSessGrpId() {
		return sessGrpId;
	}
	public void setSessGrpId(String sessGrpId) {
		this.sessGrpId = sessGrpId;
	}
	public String getSessGrpNm() {
		return sessGrpNm;
	}
	public void setSessGrpNm(String sessGrpNm) {
		this.sessGrpNm = sessGrpNm;
	}
	public String getSessSrvcYn() {
		return sessSrvcYn;
	}
	public void setSessSrvcYn(String sessSrvcYn) {
		this.sessSrvcYn = sessSrvcYn;
	}
	public String getSessAuthorMenu() {
		return sessAuthorMenu;
	}
	public void setSessAuthorMenu(String sessAuthorMenu) {
		this.sessAuthorMenu = sessAuthorMenu;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
}
