//容器样式        宽，高，相对父窗口位置左，相对父窗口位置上，字体大小，文字颜色，背景颜色，背景图片，字体背景，图标图片，图标位置，图标宽，图标高，图标间距
function UiStyle(width, height, parentLeft, parentTop, fontSize, fontColor, backGroupColor, backGroupImage, fontBackGroupColor, icon, iconPosition, iconWidth, iconHeight, iconSpacing) {
    this.width = width;
    this.height = height;
    this.parentLeft = parentLeft;
    this.parentTop = parentTop;
    this.fontSize = fontSize;
    this.fontColor = fontColor;
    this.backGroupColor = backGroupColor;
    this.backGroupImage = backGroupImage;
    this.fontBackGroupColor = fontBackGroupColor;
    this.icon = icon;
    this.iconPosition = iconPosition;
    this.iconWidth = iconWidth;
    this.iconHeight = iconHeight;
    this.iconSpacing = iconSpacing;
}

//事件
function UiEventUiEvent(eventType, sceneAction, beforeEvent, afterEvent, rule, event, model) {
    this.eventType = eventType;    // 事件类型 onclick/onfocus
    this.sceneAction = sceneAction;    // 场景动作  IAMGE,APP,LAUNCHER,HTML,WINDOW,URL,CONTAINER
    this.beforeEvent = beforeEvent;    // 事件触发前事件  null
    this.afterEvent = afterEvent;    // 事件触发后事件  null
    this.rule = rule;    // rule源Id  ---跳转类型id
    this.event = event;    // 跳转类型ruleVal +Event
    this.model = model;    // 容器
}

//容器
function Container(id, name, text, layout, layoutStyle, isAuthorize, magnification, corner, index, alias, uiStyle, onfocusStyle, onclickStyle, sceneEvents, subContainer, uiClassID) {
    this.id = id;
    this.name = name;
    this.text = text;
    this.layout = layout;    // 整体布局
    this.layoutStyle = layoutStyle;    // 整体风格
    this.isAuthorize = isAuthorize;    // 授权1是 0否
    this.magnification = magnification;    // 放大
    this.corner = corner;    // 标签
    this.index = index;    // 索引
    this.alias = alias;    // 别名
    this.style = uiStyle;    // 静态
    this.onfocusStyle = onfocusStyle;    // 焦点
    this.onclickStyle = onclickStyle;    // 点击
    this.sceneEvents = sceneEvents;    // 动作
    this.subContainer = subContainer;    // 子容器
    this.uiClassID = uiClassID;    // AppUI,一级：PanelUI,ColumnUI,PmsUI,二级：PendantUI,MenuUI,RecommendedUI,ShowUI,三级：MenuItemUI
}

//栏目
function CategoryUI(id, name, text, isAuthorize, uiStyle, uiEvent, subContainer) {
    Container.call(this, id, name, text, isAuthorize, uiStyle, uiEvent, subContainer);
    this.uiClass = "ColumnUI";
}

//面板
function PanelUI(id, name, text, isAuthorize, uiStyle, uiEvent, subContainer) {
    Container.call(this, id, name, text, isAuthorize, uiStyle, uiEvent, subContainer);
    this.uiClass = "PanelUI";
}

//挂件
function PendantUI(id, name, text, isAuthorize, uiStyle, uiEvent, subContainer, pendantType) {
    Container.call(this, id, name, text, isAuthorize, uiStyle, uiEvent, subContainer);
    this.pendantType = pendantType;
    this.uiClass = "PendantUI";
}

//html控件
function HtmlUI(id, name, text, isAuthorize, uiStyle, uiEvent, subContainer) {
    Container.call(this, id, name, text, isAuthorize, uiStyle, uiEvent, subContainer);
    this.uiClass = "HtmlUI";
}
var pendantTime,pendantWeather,pendantDate,pendantWifi,pendantArea,pendantLanguage;
var dragBox,columnBox,recommendBox,menuBox;
function business() {
    // 挂件  日期date、天气weather、时间time、地区area、语言language
    pendantTime = "<div class='pendantChild' style='width: 120px;height: 35px;' ondblclick='pendantDouble()' type='time'>" +
                     "<div class='downBtn'></div>" +
                     "<div class='centerRightBtn'></div>" +
                     "<div class='downRightBtn'></div>" +
                     "<button type='button' class='close'>×</button>" +
                     "<div type='button' class='move'></div>" +
                     "<p>time</p>" +
                  "</div>";
    pendantWeather = "<div class='pendantChild' style='width: 120px;height: 35px;' ondblclick='pendantDouble()' type='weather'>" +
                        "<div class='downBtn'></div>" +
                        "<div class='centerRightBtn'></div>" +
                        "<div class='downRightBtn'></div>" +
                        "<button type='button' class='close'>×</button>" +
                        "<div type='button' class='move'></div>" +
                        "<p>weather</p>" +
                     "</div>";
    pendantDate = "<div class='pendantChild' style='width: 120px;height: 35px;' ondblclick='pendantDouble()' type='date'>" +
                    "<div class='downBtn'></div>" +
                    "<div class='centerRightBtn'></div>" +
                    "<div class='downRightBtn'></div>" +
                    "<button type='button' class='close'>×</button>" +
                    "<div type='button' class='move'></div>" +
                    "<p>date</p>" +
                  "</div>";
    pendantWifi = "<div class='pendantChild' style='width: 120px;height: 35px;' ondblclick='pendantDouble()' type='wifi'>" +
                    "<div class='downBtn'></div>" +
                    "<div class='centerRightBtn'></div>" +
                    "<div class='downRightBtn'></div>" +
                    "<button type='button' class='close'>×</button>" +
                    "<div type='button' class='move'></div>" +
                    "<p>wifi</p>" +
                    "</div>";
    pendantArea = "<div class='pendantChild' style='width: 120px;height: 35px;' ondblclick='pendantDouble()' type='area'>" +
                    "<div class='downBtn'></div>" +
                    "<div class='centerRightBtn'></div>" +
                    "<div class='downRightBtn'></div>" +
                    "<button type='button' class='close'>×</button>" +
                    "<div type='button' class='move'></div>" +
                    "<p>area</p>" +
                  "</div>";
    pendantLanguage = "<div class='pendantChild' style='width: 120px;height: 35px;' ondblclick='pendantDouble()' type='language'>" +
                        "<div class='downBtn'></div>" +
                        "<div class='centerRightBtn'></div>" +
                        "<div class='downRightBtn'></div>" +
                        "<button type='button' class='close'>×</button>" +
                        "<div type='button' class='move'></div>" +
                        "<p>language</p>" +
                     "</div>";
    // 栏目
    columnBox = "<div class='columnBox' style='width: 100px;height: 30px;'>" +
                    "<div class='downBtn'></div>" +
                    "<div class='centerRightBtn'></div>" +
                    "<div class='downRightBtn'></div>" +
                    "<button type='button' class='close closeEdit'>×</button>" +
                    "<p class='handle move' ondblclick='columnDouble()'>请编辑</p>" +
                "</div>";

    // 推荐位容器
    recommendBox = "<div class='recommendBox childBox' style='width: 150px;height: 170px;' ondblclick='stopBubble()'>" +
                        "<div class='downBtn'></div>" +
                        "<div class='centerRightBtn'></div>" +
                        "<div class='downRightBtn'></div>" +
                        "<button type='button' class='close closeEdit'>×</button>" +
                        "<div type='button' class='move'></div>" +
                        "<p class='childEdit' ondblclick='childDouble()'>请编辑</p>" +
                    "</div>";
    // 菜单容器
   /* menuBox = "<div class='menuBox childBox' style='width: 100px;height: 30px;'>" +
                "<div class='downBtn'></div>" +
                "<div class='centerRightBtn'></div>" +
                "<div class='downRightBtn'></div>" +
                "<button type='button' class='close closeEdit'>×</button>" +
                "<p class='move' ondblclick='childDouble()'>请编辑</p>" +
              "</div>";*/
    // 菜单容器表格
    menuBox = "<tr>" +
                "<td class='menuNewIndex'><input type='number' class='form-control' onkeypress='return( /[\\d]/.test(String.fromCharCode(event.keyCode)))' placeholder='请填写数字'></td>" +
                "<td class='menuNewName'></td>" +
                "<td class='alias'><input type='text' class='form-control' placeholder='请填写数字或英文'></td>" +
                "<td class='menuNewRule' style='line-height: 34px;'></td>" +
                "<td class='menuNewDel'><button type='button' class='btn btn-default menuDelete'>删除</button></td>" +
             "</tr>"
}
// 面板
function panelType(type) {
    dragBox = "<div class='dragBox' style='width: 768px;height: 72px;' ondblclick='dragBoxDouble()' type='"+type+"'>" +
        "<div class='downBtn'></div>" +
        "<div class='centerRightBtn'></div>" +
        "<div class='downRightBtn'></div>" +
        "<div type='button' class='move'></div>" +
        "<button type='button' class='close closeEdit'>×面板</button>" +
        "</div>";
    // if(type == "Wifi"){
    //     var val = uuid();
    //     dragBox = "<div class='dragBox' id='"+val+"' style='width: 468px;height: 72px;' ondblclick='dragBoxDouble()' type='PanelUI' rulevalfocus='Wifi'>" +
    //         "<div class='downBtn'></div>" +
    //         "<div class='centerRightBtn'></div>" +
    //         "<div class='downRightBtn'></div>" +
    //         "<div type='button' class='move'></div>" +
    //         "<button type='button' class='close closeEdit'>×wifi面板</button>" +
    //         "</div>";
    //     species(val,"Wifi");
    //     $(".drag").append(speciesBox);
    // }else{
    //     dragBox = "<div class='dragBox' style='width: 468px;height: 72px;' ondblclick='dragBoxDouble()' type='"+type+"'>" +
    //         "<div class='downBtn'></div>" +
    //         "<div class='centerRightBtn'></div>" +
    //         "<div class='downRightBtn'></div>" +
    //         "<div type='button' class='move'></div>" +
    //         "<button type='button' class='close closeEdit'>×面板</button>" +
    //         "</div>";
    // }
}
// 容器种类
var speciesW,speciesH,speciesBox,type;
function species(mark,ruleVal) {
    if(ruleVal == "Recommended"){
        speciesW = "768px";
        speciesH = "200px";
        type = "RecommendedUI";
    }else if(ruleVal == "Menu"){
        speciesW = "100px";
        speciesH = "200px";
        // type = "MenuItemUI";
        type = "MenuUI";
    }else if(ruleVal == "Show"){
        speciesW = "768px";
        speciesH = "200px";
        type = "ShowUI";
    }
    speciesBox = "<div class='speciesBox "+mark+"' ondblclick='speciesBoxDouble()' style='width:"+speciesW+";height:"+speciesH+";' type="+type+">" +
                    "<div class='downBtn'></div>" +
                    "<div class='centerRightBtn'></div>" +
                    "<div class='downRightBtn'></div>" +
                    "<div type='button' class='move' style='position: absolute;top: 0;'></div>" +
                    "<button type='button' class='close closeEdit' style='top: -20px;'>×容器</button>" +
                "</div>";
}
$(function () {
    //工具集------------------------------

    //画布    var canvas = $(".fullSlide");

    // 推荐位
    // var bdTop = $(".bdTop");
    // var positionElements = {
    //     init: function () {
    //         var p = this;
    //         $("#addBD1").bind("click", {calc: "25% - 14px", height: "49%"}, p.addEvent);
    //         $("#addBD2").bind("click", {calc: "25% - 14px", height: "100%"}, p.addEvent);
    //         $("#addBD3").bind("click", {calc: "50% - 14px", height: "49%"}, p.addEvent);
    //         $("#addBD4").bind("click", {calc: "50% - 14px", height: "100%"}, p.addEvent);
    //         $("#addBD5").bind("click", {calc: "75% - 14px", height: "100%"}, p.addEvent);
    //         $("#addBD6").bind("click", {calc: "100% - 14px", height: "100%"}, p.addEvent);
    //     },
    //     addEvent: function (style) {
    //         var addUI = '<li class="firstLi"><div class="liList" style="width:calc(' + style.data.calc + '); height:' + style.data.height + '; border:1px solid gray; position:absolute; left: 7px; top: 0;" >'+
    //             '<button type="button" class="close bitClose">×</button>'+
    //             '<p class="edit" data-toggle="modal" data-target="#columnDetail" data-backdrop="static" data-keyboard="false">请编辑</p>'+
    //             '</div></li>';
    //         bdTop.find("ul#currentTabId").append(addUI);
    //     }
    // };
    // positionElements.init();

    //挂件
    // var pendantElements = {
    //     init: function () {
    //         var wd = this;
    //         $("#addDate1").bind("click", {left: "0px", top: "15px"}, wd.dateEvent);
    //         $("#addDate2").bind("click", {left: "199px", top: "15px"}, wd.dateEvent);
    //         $("#addDate3").bind("click", {left: "398px", top: "15px"}, wd.dateEvent);
    //         $("#addDate4").bind("click", {left: "597px", top: "15px"}, wd.dateEvent);
    //         $("#addWeather1").bind("click", {left: "0px", top: "15px"}, wd.weatherEvent);
    //         $("#addWeather2").bind("click", {left: "199px", top: "15px"}, wd.weatherEvent);
    //         $("#addWeather3").bind("click", {left: "398px", top: "15px"}, wd.weatherEvent);
    //         $("#addWeather4").bind("click", {left: "597px", top: "15px"}, wd.weatherEvent);
    //     },
    //     weatherEvent: function (w) {
    //         if($(".date").position().left + "px" == w.data.left && $(".date").css("display") != "none"){
    //             alert("位置重复，请重新选择！");
    //             return;
    //         }else{
    //             $(".weather").show();
    //             $(".weather").css({"left": w.data.left,"top": w.data.top,"position":"absolute"});
    //         }
    //     },
    //     dateEvent: function (d) {
    //         console.log(d.data.left)
    //         if($(".weather").position().left + "px" == d.data.left && $(".date").css("display") != "none"){
    //             alert("位置重复，请重新选择！");
    //             return;
    //         }else{
    //             $(".date").show();
    //             $(".date").css({"left": d.data.left,"top": d.data.top,"position":"absolute"})
    //         }
    //     }
    // };
    // pendantElements.init();
    // $(".pendant").on({
    //     mousedown: function (event) {
    //         $("." + event.target.id).show();
    //         $("." + event.target.id).css({"top":"15px","left":"0px","position":"absolute"});
    //         $(".date").css({"left":"197px"});
    //         // $("." + event.target.id).draggable({containment: ".dragging", scroll: false});
    //     }
    // }, "#weather,#date");
});