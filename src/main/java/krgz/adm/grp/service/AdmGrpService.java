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
package krgz.adm.grp.service;

import java.util.HashMap;
import java.util.List;

import krgz.adm.grp.service.AdmGrpVO;

public interface AdmGrpService {
	
	public List<AdmGrpVO> selectGrpList();
	
	public int selectGrpCount();
	
	public int selectGrpInfoUsrCount(AdmGrpVO AdmGrpVO);
	
	public int countByGrpId(HashMap<String, String> map);
	
	public int countByGrpNm(HashMap<String, String> map);
	
	public int insertGrpInfo(HashMap<String, String> map) throws Exception;
	
	public int updateGrpStat(HashMap<String, String> map) throws Exception;	

	public int updateGrpInfo(HashMap<String, String> map) throws Exception;	
	
	public int deleteGrpInfo(HashMap<String, String> map) throws Exception;	
}
