<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!-- attr Edit popup -->
<div class="popup Attrinfor-edit editpop">
    <button class="width-Btn"></button>
    <button class="Popclose-Btn">close</button>
    <div class="title-wrap">
        <h3 class="popup-tit icon">
            <i class="glb-ico sz25px icobg25 menu-wt-ico"></i>
            Edit
            <input class="result-ct" type="text" value="9,999" placeholder="default" readonly="">
        </h3>
        <div class="setting-Box">
            <div class="tableTradd innerPop">
                <!-- <button class="Popclose-Btn">close</button>                         -->
                <form action="">
                    <ul class="condition-Box">
                        <li>
                            <label for=""><span class="po">name</span></label>
                            <div class="select-Box slbl">
                                <select>
                                    <option>naming list1</option>
                                    <option>naming list2</option>
                                    <option>naming list3</option>
                                </select>
                            </div>
                        </li>
                        <li>
                            <label for=""><span class="po">Data Type</span></label>
                            <div class="select-Box slbl">
                                <select>
                                    <option>text(varchar)</option>
                                    <option>option2</option>
                                    <option>option3</option>
                                </select>
                            </div>
                        </li>
                        <li>
                            <label for=""><span class="po">Default name</span></label>
                            <input type="text" name="" id="" value="default" placeholder="default">
                        </li>
                    </ul>
                    <div class="btn-wrap">
                        <button type="button" class="btn ht25px blbtn icon"><i class="glb-ico sz15px icobg15 plus-bk"></i>add</button>
                    </div>                        
                </form>
            </div>
            <div class="deletePop innerPop">
                <!-- <button class="Popclose-Btn">close</button> -->
                <div class="condition-Box">                            
                    <div class="select-Box slbl">
                        <select>
                            <option>naming list1</option>
                            <option>naming list2</option>
                            <option>naming list3</option>
                        </select>
                    </div>
                    <button class="icon sz25px delete-Btn"><i class="glb-ico sz25px icobg25 trash-bk"></i></button>
                </div>
            </div>
            <div class="select-Box slbl">
                <select>
                    <option>colume</option>
                    <option>Department2</option>
                    <option>Department3</option>
                </select>
            </div>
            <label class="icon">
                <i class="glb-ico sz20px icobg20 search-wt-ico"></i>
                <input type="search" placeholder="Search for district">
            </label>
            <button class="icon sz25px add-Btn"><i class="">+</i></button>
            <button class="icon sz25px edit-delete-Btn"><i class="glb-ico sz20px icobg20 trash-wt"></i></button>
            <button class="icon sz25px"><i class="glb-ico sz20px icobg20 refresh"></i></button>
        </div>
    </div>
    <div class="popup-wrap">
        <div class="table-wrap">
            <table>
                <colgroup>
                    <col style="min-width: 100px;">
                    <col style="min-width: 100px;">
                    <col style="min-width: 100px;">
                    <col style="min-width: 100px;">
                    <col style="min-width: 100px;">
                    <col style="min-width: 100px;">
                    <col style="min-width: 100px;">
                    <col style="min-width: 100px;">
                    <col style="min-width: 100px;">
                    <col style="min-width: 100px;">
                    <col style="min-width: 100px;">
                    <col style="min-width: 100px;">
                    <col style="min-width: 100px;">
                    <col style="min-width: 100px;">
                    <col style="min-width: 100px;">
                </colgroup>
                <thead>
                    <tr>
                        <th>location</th>
                        <th>title2</th>
                        <th>title3</th>
                        <th>title4</th>
                        <th>title5</th>
                        <th>title6</th>
                        <th>title7</th>
                        <th>title8</th>
                        <th>title9</th>
                        <th>title10</th>
                        <th>title11</th>
                        <th>title12</th>
                        <th>title13</th>
                        <th>title14</th>
                        <th>title15</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span class="location left cuso"><i class="glb-ico sz25px icobg25 poi-yw"></i></span></td>
                        <td><span class="txtleft">text-left</span></td>
                        <td><span class="txtleft">text-left</span></td>
                        <td><span class="txtleft">text-left</span></td>
                        <td><span class="txtleft">text-left</span></td>
                        <td><span class="txtleft">text-left</span></td>
                        <td><span class="txtleft">text-left</span></td>
                        <td><span class="txtleft">text-left</span></td>
                        <td><span class="txtleft">text-left</span></td>
                        <td><span class="txtleft">text-left</span></td>
                        <td><span class="txtleft">text-left</span></td>
                        <td><span class="txtleft">text-left</span></td>
                        <td><span class="txtleft">text-left</span></td>
                        <td><span class="txtleft">text-left</span></td>
                        <td><span class="txtleft">text-left</span></td>
                    </tr>
                    <tr>
                        <td><span class="location center cuso"><i class="glb-ico sz25px icobg25 poi-yw"></i></span></td>
                        <td><span class="txtcenter">text-center</span></td>
                        <td><span class="txtcenter">text-center</span></td>
                        <td><span class="txtcenter">text-center</span></td>
                        <td><span class="txtcenter">text-center</span></td>
                        <td><span class="txtcenter">text-center</span></td>
                        <td><span class="txtcenter">text-center</span></td>
                        <td><span class="txtcenter">text-center</span></td>
                        <td><span class="txtcenter">text-center</span></td>
                        <td><span class="txtcenter">text-center</span></td>
                        <td><span class="txtcenter">text-center</span></td>
                        <td><span class="txtcenter">text-center</span></td>
                        <td><span class="txtcenter">text-center</span></td>
                        <td><span class="txtcenter">text-center</span></td>
                        <td><span class="txtcenter">text-center</span></td>
                    </tr>
                    <tr>
                        <td><span class="location right cuso"><i class="glb-ico sz25px icobg25 poi-yw"></i></span></td>
                        <td><span class="txtright">text-right</span></td>
                        <td><span class="txtright">text-right</span></td>
                        <td><span class="txtright">text-right</span></td>
                        <td><span class="txtright">text-right</span></td>
                        <td><span class="txtright">text-right</span></td>
                        <td><span class="txtright">text-right</span></td>
                        <td><span class="txtright">text-right</span></td>
                        <td><span class="txtright">text-right</span></td>
                        <td><span class="txtright">text-right</span></td>
                        <td><span class="txtright">text-right</span></td>
                        <td><span class="txtright">text-right</span></td>
                        <td><span class="txtright">text-right</span></td>
                        <td><span class="txtright">text-right</span></td>
                        <td><span class="txtright">text-right</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="pagenation">
        <div class="pager-wrap">
            <button type="button" class="icon sz20px"><i class="glb-ico sz20px icobg20 pagent"></i></button>
            <button type="button">Prev</button>
            <input type="text" id="" placeholder="-" value="1">
            <small>of</small>
            <input type="text" id="" placeholder="-" value="999">
            <button type="button">Next</button>
            <button type="button" class="icon sz20px"><i class="glb-ico sz20px icobg20 pagent nxt"></i></button>
        </div>
        <div class="content-wrap">
            <label class="switch-tg">
                <input type="checkbox">
                <span class="tg-Slider"></span>
            </label>
            <p>Edit Mode</p>
        </div>
    </div>
</div>