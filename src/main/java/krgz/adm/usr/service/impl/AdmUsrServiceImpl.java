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
package krgz.adm.usr.service.impl;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import krgz.adm.usr.service.AdmUsrService;
import krgz.usr.service.UsrVO;


@Service("AdmUsrService")
public class AdmUsrServiceImpl extends EgovAbstractServiceImpl implements AdmUsrService {

	@Resource(name="AdmUsrDAO")
	private AdmUsrDAO AdmUsrDAO;
	
	@Override
	public List<UsrVO> selectUsrList(UsrVO UsrVO) {
		return AdmUsrDAO.selectUsrList(UsrVO);
	}
	
	@Override
	public int selectUsrCount(UsrVO UsrVO) {
		return AdmUsrDAO.selectUsrCount(UsrVO);
	}
	
	@Override
	public int updateAdmUsrInfo(HashMap<String, String> map) throws Exception {
		return AdmUsrDAO.updateAdmUsrInfo(map);
	}
}
