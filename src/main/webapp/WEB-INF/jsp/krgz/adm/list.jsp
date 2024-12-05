<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!-- 사용자/권한 관리시스템  -->
<div class="popup adminSystem-pop">
    <button type="button" class="closetxt-Btn">Close</button>
    <h3 class="popup-tit icon"><i class="glb-ico sz25px icobg25 datamanage-wt-ico"></i>Administrator</h3>
    <div class="popup-wrap">
        <div class="tab-container">
            <ol class="tab-tit">
                <li class="active">사용자 관리</li>
                <li>권한 관리</li>
            </ol>
            <div class="tab-content-Box active">
                <!-- 1. tab1 사용자 관리 -->
                <div class="tab-detail user-info-List active">
                    <!-- top table container -->
                    <div class="table-wrap">
                        <div class="content-wrap">
                            <div class="select-Box slbl">
                                <select>
                                    <option value="userID">user id</option>
                                    <option value="userName">user name</option>
                                    <option value="Date of subscription">Date of subscription</option>
                                    <option value="department">Department</option>
                                </select>
                            </div>
                            <label class="icon" for="adminSearch">
                                <i class="glb-ico sz20px icobg20 search-wt-ico"></i>
                                <input class="main-search" type="search" name="adminSearch" placeholder="Search for user informaiton">
                            </label>
                        </div>
                        <div class="scroll-wrap">
                            <table>
                                <colgroup>
                                    <col style="width: 65px;">
                                    <col style="width: 125px;">
                                    <col style="width: auto;">
                                    <col style="width: auto;">
                                    <col style="width: auto;">
                                    <col style="width: auto;">
                                    <col style="width: auto;">
                                    <col style="width: auto;">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>user ID</th>
                                        <th>user Name</th>
                                        <th>Institution</th>
                                        <th>Department</th>
                                        <th>Authority</th>
                                        <th>Registered On</th>
                                        <th>Last Access</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>context1</td>
                                        <td>context2</td>
                                        <td>context3</td>
                                        <td>context4</td>
                                        <td>context5</td>
                                        <td>context6</td>
                                        <td>context7</td>
                                        <td>context8</td>
                                    </tr>                                            
                                </tbody>
                            </table>
                        </div>
                        <div class="pagenation">
                            <button type="button" class="icon sz25px"><i class="glb-ico sz25px icobg25 pagent"></i></button>
                            <button type="button">Prev</button>
                            <input type="text" name="" id="" placeholder="-" value="1">
                            <small>of</small>
                            <input type="text" name="" id="" placeholder="-" value="999">
                            <button type="button">Next</button>
                            <button type="button" class="icon sz25px"><i class="glb-ico sz25px icobg25 pagent nxt"></i></button>
                        </div>
                    </div>
                    <!-- bottom content -->
                    <div class="table-detail-inform">
                        <h4 class="sub-tit">Detailed user information</h4>
                        <!-- wrapper -->
                        <div class="content-wrap">
                            <!--Left - inform detail1 -->
                            <div class="table-wrap">
                                <!-- Detailed user information area -->
                                 <div class="scroll-wrap">
                                    <table>
                                        <colgroup>
                                            <col style="width: 40%;">
                                            <col style="width: 60%;">
                                        </colgroup>
                                        <tbody>
                                            <tr>
                                                <th>user id</th>
                                                <td>user infomation Iput text</td>
                                            </tr>
                                            <tr>
                                                <th>user name</th>
                                                <td>user infomation Iput text</td>
                                            </tr>
                                            <tr>
                                                <th>user email</th>
                                                <td>user infomation Iput text</td>
                                            </tr>
                                            <tr>
                                                <th>phone/mobile</th>
                                                <td>user infomation Iput text</td>
                                            </tr>
                                            <tr>
                                                <th>Authority</th>
                                                <td>user infomation Iput text</td>
                                            </tr>
                                            <tr>
                                                <th>institution</th>
                                                <td>user infomation Iput text</td>
                                            </tr>
                                            <tr>
                                                <th>Department</th>
                                                <td>user infomation Iput text</td>
                                            </tr>
                                        </tbody>
                                    </table>                                           
                                 </div>
                                <!-- button area -->
                                <div class="btn-Box">
                                    <button class="Edit-Btn"><i></i>Edit</button>
                                    <button class="Delete-Btn"><i></i>Delete</button>
                                </div>
                            </div>
                            <!--Right - inform detail2-->
                            <div class="tab-container">
                                <ul class="tab-tit">
                                    <li class="active">회원정보이력</li>
                                    <li>업로드 이력관리</li>
                                </ul>
                                <div class="tab-content-Box">
                                    <!-- 1.회원정보이력 -->
                                    <div class="tab-detail active">
                                        <div class="table-wrap">
                                           <table>
                                                <colgroup>
                                                    <col style="width: 25%;">
                                                    <col style="width: 25%;">
                                                    <col style="width: 25%;">
                                                    <col style="width: 25%;">
                                                </colgroup>
                                                <thead>
                                                    <tr>
                                                        <th>No.</th>
                                                        <th>Message</th>
                                                        <th>IP</th>
                                                        <th>Access</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td colspan="4" class="defalut">There is no result</td>                                                                
                                                    </tr>
                                                </tbody>
                                           </table>
                                        </div>
                                    </div>
                                    <!-- 2.업로드이력관리 -->
                                    <div class="tab-detail">
                                        <div class="table-wrap">
                                           <table>
                                                <colgroup>
                                                    <col style="width: 10%;">
                                                    <col style="width: 10%;">
                                                    <col style="width: 20%;">
                                                    <col style="width: 20%;">
                                                    <col style="width: 20%;">
                                                    <col style="width: 20%;">
                                                </colgroup>
                                                <thead>
                                                    <tr>
                                                        <th>No.</th>
                                                        <th>Item</th>
                                                        <th>Type</th>
                                                        <th>Acquired on</th>
                                                        <th>Registed On</th>
                                                        <th>Deleted On</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td colspan="6" class="defalut">There is no result</td>                                                                
                                                    </tr>
                                                </tbody>
                                           </table>
                                        </div>
                                    </div>
                                </div>
                            </div>                                    
                        </div>
                    </div>
                </div>
                <!-- 2. 권한 관리 -->
                <div class="tab-detail user-Author-List">
                    <!-- 1. top content - table area-->
                    <div class="table-wrap">
                        <div class="btn-Box">
                            <button type="button" class="creat-Btn">create group</button>
                        </div>
                        <div class="scroll-wrap">
                            <table>
                                <colgroup>
                                    <col style="width: 10%;">
                                    <col style="width: 150px;">
                                    <col style="width: auto;">
                                    <col style="width: auto;">
                                    <col style="width: auto;">
                                    <col style="width: auto;">
                                    <col style="width: auto;">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Group name</th>
                                        <th>Register</th>
                                        <th>Registered on</th>
                                        <th>Modified on</th>
                                        <th>Service on/off</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>context test1</td>
                                        <td>context test2</td>
                                        <td>context test3</td>
                                        <td>context test4</td>
                                        <td>context test5</td>
                                        <td>context test6</td>
                                        <td>context test7</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="pagenation">
                            <button type="button" class="icon sz25px"><i class="glb-ico sz25px icobg25 pagent"></i></button>
                            <button type="button">Prev</button>
                            <input type="text" name="" id="" placeholder="-" value="1">
                            <small>of</small>
                            <input type="text" name="" id="" placeholder="-" value="999">
                            <button type="button">Next</button>
                            <button type="button" class="icon sz25px"><i class="glb-ico sz25px icobg25 pagent nxt"></i></button>
                        </div>
                    </div>
                    <!-- 2. bottom content - layer tree -->
                    <div class="content-wrap">
                        <h4 class="sub-tit">Detailed user Authority</h4>
                        <!-- wrap -->
                        <div class="wrap">
                            <!-- 권한정보 상세 -->
                            <div class="table-content-Box">
                                <p class="wrap-tit">information authority</p>
                                <!-- Detailed user Authority area -->
                                 <div class="table-wrap">
                                    <table>
                                        <colgroup>
                                            <col style="width: 40%;">
                                            <col style="width: 60%;">
                                        </colgroup>
                                        <tbody>
                                            <tr>
                                                <th>Group Name</th>
                                                <td>Iput text</td>
                                            </tr>
                                            <tr>
                                                <th>Number of user</th>
                                                <td>Iput text</td>
                                            </tr>
                                            <tr>
                                                <th>Group Name</th>
                                                <td>Iput text</td>
                                            </tr>
                                            <tr>
                                                <th>Number of user</th>
                                                <td>Iput text</td>
                                            </tr>
                                        </tbody>
                                    </table>                                            
                                 </div>
                            </div>
                            <!-- select group container -->
                            <div class="content-Box">
                                <p class="wrap-tit">Group authority</p>
                                <div class="layertreeList">
                                     <!-- layertree Left Sample 1 -->
                                     <div class="tree-wrap">
                                        <div class="layertr-tit LastDepth">
                                            <i class="layertreeList-ico"></i>
                                            <label><input type="checkbox"></label>
                                            <strong>Search</strong>
                                        </div>
                                        <div class="layertr-tit">
                                            <i class="layertreeList-ico"></i>
                                            <label><input type="checkbox" onclick="event.stopPropagation();"></label>
                                            <strong>User Information Management</strong>
                                            <button type="button" class="lytr-edit-Btn"><i class="layertreeList-ico"></i></button>
                                        </div>
                                        <div class="layertr-det">
                                            <div class="layertr-tit LastDepth">
                                                <i class="layertreeList-ico"></i>
                                                <label><input type="checkbox" name=""></label>
                                                <strong>User Information</strong>
                                            </div>
                                            <div class="layertr-tit LastDepth">
                                                <i class="layertreeList-ico"></i>
                                                <label><input type="checkbox" name=""></label>
                                                <strong>Manage Permissions</strong>
                                            </div>
                                        </div>   
                                        <div class="layertr-tit">
                                            <i class="layertreeList-ico"></i>
                                            <label><input type="checkbox" onclick="event.stopPropagation();"></label>
                                            <strong>User Information Management</strong>
                                            <button type="button" class="lytr-edit-Btn"><i class="layertreeList-ico"></i></button>
                                        </div>
                                        <div class="layertr-det">
                                            <div class="layertr-tit LastDepth">
                                                <i class="layertreeList-ico"></i>
                                                <label><input type="checkbox" name=""></label>
                                                <strong>User Information</strong>
                                            </div>
                                            <div class="layertr-tit LastDepth">
                                                <i class="layertreeList-ico"></i>
                                                <label><input type="checkbox" name=""></label>
                                                <strong>Manage Permissions</strong>
                                            </div>
                                        </div>   
                                     </div>
                                    <!-- layertree Right Sample 2 -->
                                     <div class="tree-wrap">
                                        <div class="layertr-tit">
                                            <i class="layertreeList-ico"></i>
                                            <label><input type="checkbox" onclick="event.stopPropagation();"></label>
                                            <strong>User Information Management</strong>
                                            <button type="button" class="lytr-edit-Btn"><i class="layertreeList-ico"></i></button>
                                        </div>
                                        <div class="layertr-det">
                                            <div class="layertr-tit LastDepth">
                                                <i class="layertreeList-ico"></i>
                                                <label><input type="checkbox" name=""></label>
                                                <strong>User Information</strong>
                                            </div>
                                            <div class="layertr-tit LastDepth">
                                                <i class="layertreeList-ico"></i>
                                                <label><input type="checkbox" name=""></label>
                                                <strong>Manage Permissions</strong>
                                            </div>
                                        </div>                                                
                                        <div class="layertr-tit LastDepth">
                                            <i class="layertreeList-ico"></i>
                                            <label><input type="checkbox" name=""></label>
                                            <strong>Dashboard</strong>
                                        </div>                                                
                                     </div>
                                </div>
                            </div>                                    
                        </div>                                
                        <div class="btn-Box">
                            <button type="button" class="sv-Btn">Save</button>
                            <button type="button" class="Cancel-Btn">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>