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
package krgz.usr.service;

public class UsrVO {

	private static final long serialVersionUID = 1L;

	private String usr_no;
	private String grp_id;
	private String usr_id;
	private String usr_nm;
	private String eml;
	private String pwd;
	private String inst;
	private String dept;
	private String mdfr;
	private String telno;
	private String reg_date;
	private String mod_date;
	private String prvc_clct_agre_yn;
	private String tmpr_pwd_yn;
	private String login_count;
	private String last_login;
	
	private String grp_nm;
	private String srvc_yn;
	private String author_menu;
	
	/** 검색어 */
	private String type;
	private String search;
	private String grp_search;
	/** 페이징 */
	private int rownum;
	private int pageIndex = 1;
	private int pageUnit = 5;
	private int pageSize = 5;
	private int firstIndex = 1;
	private int lastIndex = 1;
	private int recordCountPerPage = 20;
	
	public String getUsr_no() {
		return usr_no;
	}
	public void setUsr_no(String usr_no) {
		this.usr_no = usr_no;
	}
	public String getUsr_id() {
		return usr_id;
	}
	public void setUsr_id(String usr_id) {
		this.usr_id = usr_id;
	}
	public String getUsr_nm() {
		return usr_nm;
	}
	public void setUsr_nm(String usr_nm) {
		this.usr_nm = usr_nm;
	}
	public String getEml() {
		return eml;
	}
	public void setEml(String eml) {
		this.eml = eml;
	}
	public String getPwd() {
		return pwd;
	}
	public void setPwd(String pwd) {
		this.pwd = pwd;
	}
	public String getGrp_id() {
		return grp_id;
	}
	public void setGrp_id(String grp_id) {
		this.grp_id = grp_id;
	}
	public String getInst() {
		return inst;
	}
	public void setInst(String inst) {
		this.inst = inst;
	}
	public String getDept() {
		return dept;
	}
	public void setDept(String dept) {
		this.dept = dept;
	}
	public String getMdfr() {
		return mdfr;
	}
	public void setMdfr(String mdfr) {
		this.mdfr = mdfr;
	}
	public String getTelno() {
		return telno;
	}
	public void setTelno(String telno) {
		this.telno = telno;
	}
	public String getReg_date() {
		return reg_date;
	}
	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}
	public String getMod_date() {
		return mod_date;
	}
	public void setMod_date(String mod_date) {
		this.mod_date = mod_date;
	}
	public String getPrvc_clct_agre_yn() {
		return prvc_clct_agre_yn;
	}
	public void setPrvc_clct_agre_yn(String prvc_clct_agre_yn) {
		this.prvc_clct_agre_yn = prvc_clct_agre_yn;
	}
	public String getTmpr_pwd_yn() {
		return tmpr_pwd_yn;
	}
	public void setTmpr_pwd_yn(String tmpr_pwd_yn) {
		this.tmpr_pwd_yn = tmpr_pwd_yn;
	}
	public String getLogin_count() {
		return login_count;
	}
	public void setLogin_count(String login_count) {
		this.login_count = login_count;
	}
	public String getLast_login() {
		return last_login;
	}
	public void setLast_login(String last_login) {
		this.last_login = last_login;
	}
	public String getSearch() {
		return search;
	}
	public void setSearch(String search) {
		this.search = search;
	}
	public String getGrp_search() {
		return grp_search;
	}
	public void setGrp_search(String grp_search) {
		this.grp_search = grp_search;
	}
	public String getGrp_nm() {
		return grp_nm;
	}
	public void setGrp_nm(String grp_nm) {
		this.grp_nm = grp_nm;
	}
	public String getSrvc_yn() {
		return srvc_yn;
	}
	public void setSrvc_yn(String srvc_yn) {
		this.srvc_yn = srvc_yn;
	}
	public String getAuthor_menu() {
		return author_menu;
	}
	public void setAuthor_menu(String author_menu) {
		this.author_menu = author_menu;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public int getRownum() {
		return rownum;
	}
	public void setRownum(int rownum) {
		this.rownum = rownum;
	}
	public int getPageIndex() {
		return pageIndex;
	}
	public void setPageIndex(int pageIndex) {
		this.pageIndex = pageIndex;
	}
	public int getPageUnit() {
		return pageUnit;
	}
	public void setPageUnit(int pageUnit) {
		this.pageUnit = pageUnit;
	}
	public int getPageSize() {
		return pageSize;
	}
	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}
	public int getFirstIndex() {
		return firstIndex;
	}
	public void setFirstIndex(int firstIndex) {
		this.firstIndex = firstIndex;
	}
	public int getLastIndex() {
		return lastIndex;
	}
	public void setLastIndex(int lastIndex) {
		this.lastIndex = lastIndex;
	}
	public int getRecordCountPerPage() {
		return recordCountPerPage;
	}
	public void setRecordCountPerPage(int recordCountPerPage) {
		this.recordCountPerPage = recordCountPerPage;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
}
