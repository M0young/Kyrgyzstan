<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!-- Header Search result popup-->
<div class="gnb-pop search-pop-list">
    <button class="Popclose-Btn" onclick="SEARCH.clear();">close</button>
    <div class="search-pop-list-result">
        <i class="glb-ico sz20px icobg20 search-wt-ico pos-r"></i>
        <p>Search</p>
        <div class="search-pop-list-result-box">9,999</div>
    </div>
    <!-- 2024-07-18 내부검색 삭제 -->
    <!-- <div class="sel-an-search">
        <select class="seacrh-list-select">
            <option value="" disabled selected>All</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
        </select>
        <label class="icon">
            <i class="glb-ico sz20px icobg20 search-wt-ico mar-l5"></i>
            <input type="search"placeholder="Search for district " class="pd-l5">
        </label>
    </div> -->
    <div class="search-result">
        <table>
            <colgroup>
                <col style="width: 10%;">
                <col style="width: 10%;">
                <col style="width: 80%;">
            </colgroup>
            <thead>
                <tr>
                    <th class="txt-left">no</th>
                    <th class="txt-left">target</th>
                    <th class="txt-left">location</th>
                </tr>
            </thead>
            <tbody class="search-result-body">
            </tbody>
        </table> 
    </div>          
    <div class="pagenation" id="searchDiAdmdstPage">
    </div>
</div>