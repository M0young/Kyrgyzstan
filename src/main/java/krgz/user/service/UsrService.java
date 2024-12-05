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

import java.util.HashMap;

public interface UsrService {

	public int selectUsrId(String id) throws Exception;
	
	public int selectEml(String eml) throws Exception;
	
	public UsrVO selectUsrInfo(UsrVO UsrVO) throws Exception;	
	
	public int insertUsrInfo(HashMap<String, String> map) throws Exception;
	
	public int updateUsrInfo(UsrVO UsrVO);
	
	public int deleteUsrInfo(String id) throws Exception;
	
	public HashMap<String, Object> checkLogin(HashMap<String, String> map);
	
	public HashMap<String, Object> selectFindUsrId(HashMap<String, String> map) throws Exception;	
	
	public int selectFindPwd(UsrVO UsrVO) throws Exception;
	
	public int updateUsrPw(UsrVO UsrVO);
	
	public int updateLoginCount(UsrVO UsrVO);
	
	public int resetLoginCount(UsrVO UsrVO);
	
	public int updateUsrLoginDate(UsrVO UsrVO);
		
}
