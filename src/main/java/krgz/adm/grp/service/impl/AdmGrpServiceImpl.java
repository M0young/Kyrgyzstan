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
package krgz.adm.grp.service.impl;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import krgz.adm.grp.service.AdmGrpService;
import krgz.adm.grp.service.AdmGrpVO;


@Service("AdmGrpService")
public class AdmGrpServiceImpl extends EgovAbstractServiceImpl implements AdmGrpService {

	@Resource(name="AdmGrpDAO")
	private AdmGrpDAO AdmGrpDAO;
	
	@Override
	public List<AdmGrpVO> selectGrpList() {
		return AdmGrpDAO.selectGrpList();
	}
	
	@Override
	public int selectGrpCount() {
		return AdmGrpDAO.selectGrpCount();
	}
	
	@Override
	public int selectGrpInfoUsrCount(AdmGrpVO AdmGrpVO) {
		return AdmGrpDAO.selectGrpInfoUsrCount(AdmGrpVO);
	}
	
	@Override
	public int countByGrpId(HashMap<String, String> map) {
		return AdmGrpDAO.countByGrpId(map);
	}
	
	@Override
	public int countByGrpNm(HashMap<String, String> map) {
		return AdmGrpDAO.countByGrpNm(map);
	}
	
	@Override
	public int insertGrpInfo(HashMap<String, String> map) throws Exception {
		return AdmGrpDAO.insertGrpInfo(map);
	}
	
	@Override
	public int updateGrpStat(HashMap<String, String> map) throws Exception {
		return AdmGrpDAO.updateGrpStat(map);
	}
	
	@Override
	public int updateGrpInfo(HashMap<String, String> map) throws Exception {
		return AdmGrpDAO.updateGrpInfo(map);
	}
	
	@Override
	public int deleteGrpInfo(HashMap<String, String> map) throws Exception {
		return AdmGrpDAO.deleteGrpInfo(map);
	}
}
