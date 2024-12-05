<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!-- 우측 상단 영역 -->
<nav class="gnb-Menu">
    <ul>
        <li class="gnbmenu-1"><span><i></i>Data management</span></li>
        <li class="gnbmenu-2"><span><i></i>Statistics</span></li>
        <li class="gnbmenu-3"><a><i></i>Dashboard</a></li>
    </ul>
</nav>
<h1>
    <a href="#" onclick="location.reload(); return false;">
        <img src="./Images/favicon_ico.png" alt="Logo">
        <strong>Кыргызская Республика<small>Land use map utilization system</small></strong>
    </a>
</h1>
<div class="search-Container">
    <!-- <div class="search-Box">
        <button type="button" class="sz20px Sub-close"><i class="glb-ico sz20px icobg20 close-wt"></i></button>
        <p class="pop-tit"><i class="glb-ico sz20px icobg20 layer-wt-ico"></i>Search</p>
        <div>
            <strong>Administrative boundary</strong>
            <label for=""><input class="commaBox" type="text" id="admdstCnt" value="99999"></label>
        </div>
    </div> -->
    <label class="icon" for="mainSearch">
        <i class="glb-ico sz20px icobg20 search-wt-ico"></i>
        <input class="main-search" type="search" id="cmmIpSearch" name="mainSearch" placeholder="Search for District">
    </label>
</div>
<nav class="Lnb-Menu">
    <ol>
        <li class="lnb-pmapview">
            <i></i>
            <b>Print map view</b>
        </li>
        <li class="lnb-mapimg">
            <i></i>
            <b>Save map to image</b>
        </li>
        <li class="lnb-curtain">
            <i></i>
            <b>Curtain View</b>
            <div class="Lnb-Menu-Box" style="display: none;">
            	<p><label for="sidebyside"><input type="radio" name="sidebyside" checked value="right_osm_standard"></label>Карта OSM</p>
                <p><label for="sidebyside"><input type="radio" name="sidebyside" value="right_osm_standard2"></label>Карта OSM2</p>
                <p><label for="sidebyside"><input type="radio" name="sidebyside" value="right_stadia_alidadeSmooth"></label>Stadia_AlidadeSmooth</p>
                <p><label for="sidebyside"><input type="radio" name="sidebyside" value="right_2gis"></label>2гис</p>
                <p><label for="sidebyside"><input type="radio" name="sidebyside" value="right_geology"></label>Геология</p>
                <p><label for="sidebyside"><input type="radio" name="sidebyside" value="right_google_road"></label>Google</p>
                <p><label for="sidebyside"><input type="radio" name="sidebyside" value="right_google_satellite"></label>Google Satellite</p>
                <p><label for="sidebyside"><input type="radio" name="sidebyside" value="right_google_hybrid"></label>Google Hybrid</p>
            </div>
        </li>
        <li class="lnb-tmlayer">
            <i></i>
            <b>Theme Layer</b>
            <div class="Lnb-Menu-Box" style="">
                <p>     
                    <label class="toggle-custom" for="">
                        <input type="checkbox" name="tmlayer" value="province">
                        <span class="toggle-Sder"></span>
                    </label>
                    Province
                </p>
                <p>     
                    <label class="toggle-custom" for="">
                        <input type="checkbox" name="tmlayer" value="district">
                        <span class="toggle-Sder"></span>
                    </label>
                    District
                </p>
                <p>     
                    <label class="toggle-custom" for="">
                        <input type="checkbox" name="tmlayer" value="community">
                        <span class="toggle-Sder"></span>
                    </label>
                    Community
                </p>
                <p>     
                    <label class="toggle-custom" for="">
                        <input type="checkbox" name="tmlayer" value="aerial">
                        <span class="toggle-Sder"></span>
                    </label>
                    Aerial Photography
                </p>
                <p>     
                    <label class="toggle-custom" for="">
                        <input type="checkbox" name="tmlayer" value="satellite">
                        <span class="toggle-Sder"></span>
                    </label>
                    Satellite Photography
                </p>
                <p>     
                    <label class="toggle-custom" for="">
                        <input type="checkbox" name="tmlayer" value="issykata">
                        <span class="toggle-Sder"></span>
                    </label>
                    Land Use Map
                </p>
            </div>
        </li>
        <li class="lnb-basemap">
            <i></i>
            <b>Base map</b>
            <div class="Lnb-Menu-Box" style="display: none;">
                <p><label for="BaseMapsett"><input type="radio" name="BaseMapsett" checked value="osm_standard"></label>Карта OSM</p>
                <p><label for="BaseMapsett"><input type="radio" name="BaseMapsett" value="osm_standard2"></label>Карта OSM2</p>
                <p><label for="BaseMapsett"><input type="radio" name="BaseMapsett" value="stadia_alidadeSmooth"></label>Stadia_AlidadeSmooth</p>
                <p><label for="BaseMapsett"><input type="radio" name="BaseMapsett" value="2gis"></label>2гис</p>
                <p><label for="BaseMapsett"><input type="radio" name="BaseMapsett" value="geology"></label>Геология</p>
                <p><label for="BaseMapsett"><input type="radio" name="BaseMapsett" value="google_road"></label>Google</p>
                <p><label for="BaseMapsett"><input type="radio" name="BaseMapsett" value="google_satellite"></label>Google Satellite</p>
                <p><label for="BaseMapsett"><input type="radio" name="BaseMapsett" value="google_hybrid"></label>Google Hybrid</p>
            </div>
        </li>
        <li class="lnb-lang">
            <i></i>
            <b>Language</b>
            <div class="Lnb-Menu-Box" style="display: none;">
                <p><label for="setLanguage"><input type="radio" name="setLanguage" value="ru">RU</label></p>
                <p><label for="setLanguage"><input type="radio" name="setLanguage" value="en">EN</label></p>
            </div>
        </li>
        <li class="lnb-User">
            <i></i>
            <b>User information</b>
            <ul class="Lnb-Menu-Box" style="display: none;">
            <c:if test="${usrInfo==null }">
                <li class="Signin-Btn" id="cmmLiSiin">Sign in</li>
                <li class="Signup-Btn" id="cmmLiSiup">Sign up</li>
	    	</c:if>
	    	<c:if test="${usrInfo!=null }">
                <li class="userinfo-Btn" id="cmmLiUsrInfo">User information</li>
                <c:if test="${fn:contains(usrInfo.sessAuthorMenu, '050000') and usrInfo.sessSrvcYn eq 'Y'}">
		        	<li class="admminsys-Btn" id="cmmLiAdm">Administrator system</li>
		        </c:if>
                <li id="cmmLiLogout">Logout</li>
            </c:if>
            </ul>
        </li>
    </ol>
</nav>
<script>

	$('input[name="tmlayer"]').change(function(){
	    var layerName = $(this).val();
	    var isChecked = $(this).is(':checked');
	    MAP.layerControl(layerName, isChecked);
	});
	
	$('input[name="setLanguage"]').change(function() {
	    var selectedLang = $(this).val();
	    setLanguage(selectedLang);
	});

	function setLanguage(lang) {
	    $.ajax({
	        url: './setLanguage.do',
	        type: 'POST',
	        data: { lang: lang },
	        success: function(res) {
	            console.log('Selected language:', res);
                updatePageTexts(lang);
	        },
	        error: function(xhr, status, error) {
	            console.error('Language setting failed:', error);
	        }
	    });
	}
    
    function updatePageTexts(lang) {
        // 예시: data-lang-key 속성을 가진 요소들의 텍스트를 업데이트
        $('[data-lang-key]').each(function() {
            const key = $(this).data('lang-key');
            $(this).text(translations[lang][key]);
        });
    }
	
</script>