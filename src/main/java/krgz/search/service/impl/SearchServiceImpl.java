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
package krgz.search.service.impl;

import java.io.IOException;
import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import egovframework.rte.fdl.idgnr.EgovIdGnrService;
import krgz.search.service.SearchService;
import krgz.search.service.SearchVO;

/**
 * @Class Name : SearchServiceImpl.java
 * @Description : Search Implement Class
 * @Modification Information
 * @
 * @  수정일      수정자              수정내용
 * @ ---------   ---------   -------------------------------
 * @ 2024.03.18           최초생성
 *
 * @author egis
 * @since 2024. 03. 18
 * @version 1.0
 * @see
 *
 *  Copyright (C) by MOPAS All right reserved.
 */

@Service("searchService")
public class SearchServiceImpl extends EgovAbstractServiceImpl implements SearchService {

	@Resource(name="searchDAO")
	private SearchDAO searchDAO;

	@Override
	public List<?> selectProvinceList(SearchVO vo) throws IOException {
		return searchDAO.selectProvinceList(vo);
	}

	@Override
	public int selectProvinceListCnt(SearchVO vo) throws IOException {
		return searchDAO.selectProvinceListCnt(vo);
	}

	
}
