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
package krgz.usr.service.impl;

import java.util.HashMap;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import krgz.usr.service.UsrService;
import krgz.usr.service.UsrVO;


@Service("UsrService")
public class UsrServiceImpl extends EgovAbstractServiceImpl implements UsrService {

	@Resource(name="UsrDAO")
	private UsrDAO UsrDAO;

	@Override
	public int selectUsrId(String id) throws Exception {
		return UsrDAO.selectUsrId(id);
	}
	
	@Override
	public int selectEml(String eml) throws Exception {
		return UsrDAO.selectEml(eml);
	}
	
	@Override
	public UsrVO selectUsrInfo(UsrVO UsrVO) throws Exception {
		return UsrDAO.selectUsrInfo(UsrVO);
	}
	
	@Override
	public int insertUsrInfo(HashMap<String, String> map) throws Exception {
		return UsrDAO.insertUsrInfo(map);
	}

	@Override
	public int updateUsrInfo(UsrVO UsrVO) {
		return UsrDAO.updateUsrInfo(UsrVO);
	}

	@Override
	public int deleteUsrInfo(String id) throws Exception {
		return UsrDAO.deleteUsrInfo(id);
	}
	
	@Override
	public HashMap<String, Object> checkLogin(HashMap<String, String> map) {
		return UsrDAO.checkLogin(map);
	}
	
	@Override
	public HashMap<String, Object> selectFindUsrId(HashMap<String, String> map) throws Exception {
		return UsrDAO.selectFindUsrId(map);
	}
	
	@Override
	public int selectFindPwd(UsrVO UsrVO) throws Exception {
		return UsrDAO.selectFindPwd(UsrVO);
	}
	
	@Override
	public int updateUsrPw(UsrVO UsrVO) {
		return UsrDAO.updateUsrPw(UsrVO);
	}

	@Override
	public int updateLoginCount(UsrVO UsrVO) {
		return UsrDAO.updateLoginCount(UsrVO);
	}

	@Override
	public int resetLoginCount(UsrVO UsrVO) {
		return UsrDAO.resetLoginCount(UsrVO);
	}

	@Override
	public int updateUsrLoginDate(UsrVO UsrVO) {
		return UsrDAO.updateUsrLoginDate(UsrVO);
	}
}
