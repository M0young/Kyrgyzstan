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
 * layerributed under the License is layerributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package krgz.search.service;

import java.io.IOException;
import java.util.List;

/**
 * @Class Name : SearchService.java
 * @Description : SearchService Class
 * @Modification Information
 * @
 * @  수정일      수정자              수정내용
 * @ ---------   ---------   -------------------------------
 * @ 2024.03.18           최초생성
 *
 * @author egis
 * @since 2024.03.18
 * @version 1.0
 * @see
 *
 *  Copyright (C) by MOPAS All right reserved.
 */
public interface SearchService {

	/**
	 * 
	* <PRE>
	* 간략 : 행정구역 목록 조회
	* 상세 : 행정구역 목록을 받아온다.
	* <PRE>
	* @param SearchVO
	* @return SearchVO
	 */
	List<?> selectProvinceList(SearchVO vo) throws IOException;
	
	/**
	 * 
	* <PRE>
	* 간략 : 행정구역 개수 조회
	* 상세 : 행정구역 개수를 받아온다.
	* <PRE>
	* @param SearchVO
	* @return int
	 */
	int selectProvinceListCnt(SearchVO vo) throws IOException;

}
