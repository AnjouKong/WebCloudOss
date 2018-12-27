
var chks,postType,ruleText;
// var gridster;
// var picId;
// var colPicId,focusPicId,clickPicId;
// 静态，焦点，点击，面板，图标静态，图标焦点，图标点击
// var backgImage,focusImage,clickImage,previewBGUpload,iconStatic,iconFocus,iconClick;
// 栏目的index、自定义选择、保存json、
var indexNum,cusInput,category;
// 推荐位样式
var recommendStyle = {};
var modalStatic = true;
var modalFocus = true;
var modalClick = true;
var dragPreview = true;
var staticIcon = true;
var fucosIcon = true;
var clickIcon = true;
var TimeFn = null;
// type: 1管理，2商户
var loginType = window.sessionStorage.getItem('UV_userInfo') ? JSON.parse(window.sessionStorage.getItem('UV_userInfo')).type : '';
console.log(loginType);

// 事件类型下拉列表
function selectNum(){
    $(".selectNum").on("click","select",function(){
        $("#packageNameGeneral,#actionGeneral,#packageNameSpecial,#actionSpecial,#sourceSpecial,#channelSpecial,#packageName,#action").val("");
        $(".selectTab").show();
        $(".selectTab > div").hide();
        var dataTo = $(".selectNum").find("option:selected").attr("data-to");
        $(".selectTab").find("."+dataTo).show();
        if(dataTo == "custom"){
            // $(".customMedia,.customList,.customWeather,.customWorldTime,.customMediaTopics").hide();
            // $(".custom").find("input[value='customMedia']").prop("checked", true);
            // $(".custom").find(".customMedia").show();
            $(".customRadio").on("click","input",function(){
                $(".customMedia,.customList,.customPackage,.customWorldTime,.customMediaTopics").hide();
                var dataCus = $(".custom").find("input[name='custom']:checked").attr("data-cus");
                $(".custom").find("."+dataCus).show();
            });
            $(".custom").find("input[value='customMedia']").trigger("click");
        };
    });
};
// ruleID   e为select的value值，p为回显判断
function ruleId(e,p){
    switch (e) {
        case "Recommended":// 容器
            ruleText = "推荐位容器";
            postType = "Recommended"; // ruleVal 跳转类型input的val
            chks = "null"; // rule 跳转类型id
            break;
        case "Menu":// 容器
            ruleText = "导航菜单容器";
            postType = "Menu";
            chks = "null";
            break;
        case "Show":// 容器
            ruleText = "内容展示容器";
            postType = "Show";
            chks = "null";
            break;
        case "secondary":// 二级列表页面
            ruleText = "二级页面";
            postType = "secondary";
            chks = dataTableSecondary.rows('.selected').data();
            break;
        case "image":// 图片
            ruleText = "图片";
            postType = "image";
            chks = dataTableImg.rows('.selected').data();
            break;
        case "app":// app
            ruleText = "app";
            postType = "app";
            chks = dataTableApp.rows('.selected').data();
            break;
        case "imageList":// 图片列表
            ruleText = "图片列表";
            postType = "imageList";
            chks = dataTableImgCollection.rows('.selected').data();
            break;
        case "video":// 视频
            ruleText = "视频";
            postType = "video";
            chks = dataTableVideo.rows('.selected').data();
            break;
        case "adv":// 广告
            ruleText = "广告";
            postType = "adv";
            chks = dataTableAdv.rows('.selected').data();
            break;
        case "GeneralTVSignal":// 普通电视信号
            ruleText = "普通电视信号";
            postType = "GeneralTVSignal";
            var general = {
                "packageName": $("input#packageNameGeneral").val(),
                "action": $("input#actionGeneral").val()
            };
            chks = JSON.stringify(general);
            break;
        case "SpecialTVSignal":// 特殊电视信号
            ruleText = "特殊电视信号";
            postType = "SpecialTVSignal";
            var special = {
                "packageName": $("input#packageNameSpecial").val(),
                "action": $("input#actionSpecial").val(),
                "source": $("input#sourceSpecial").val(),
                "channel": $("input#channelSpecial").val()
            };
            chks = JSON.stringify(special);
            break;
        case "Custom":// 自定义
            ruleText = "自定义";
            postType = "Custom";
            if(p != "param"){
                cusInput = $("input[name='custom']:checked").val();
                function paramId(){
                    if(cusInput == "customMedia"){
                        return dataTableMedia.rows('.selected').data()[0].id;
                    };
                    if(cusInput == "customMediaTopics"){
                        return dataTableMediaSubject.rows('.selected').data()[0].id;
                    }
                };
                var customChks = {
                    "packageName": $("."+cusInput).find("input.packageName").val(),
                    "action": $("."+cusInput).find("input.action").val(),
                    "param": (cusInput == "customMedia" || cusInput == "customMediaTopics") ? paramId() : ""
                };
                chks = JSON.stringify(customChks);
            }
            break;
        case "website":// 内部网站，外部网站，vod专题
            ruleText = "网站";
            postType = "website";
            var websiteDataTo = $(".selectNum").find("option:selected").attr("data-to");
            var websiteChks;
            if(p != "param"){
                if(websiteDataTo == "dataInternal"){
                    websiteChks = {  // 内部网站
                        "resourceId": dataTableWebsite_internal.rows('.selected').data()[0].id, // 网站地址
                        "subjectId": "" // 专题
                    };
                }else if(websiteDataTo == "dataExternal"){
                    websiteChks = { // 外部网站
                        "resourceId": dataTableWebsite_external.rows('.selected').data()[0].id,
                        "subjectId": ""
                    };
                }else{
                    websiteChks = { // vod专题
                        "resourceId": dataTableWebsite_mediaSubject.rows('.selected').data()[0].id,
                        "subjectId": dataTableMediaSubject.rows('.selected').data()[0].id
                    };
                }
                chks = JSON.stringify(websiteChks);
                // console.log(chks);
            }
            break;
        case "undefined":
            ruleText = "";
            postType = "";
            chks = "";
            break;
        case  "":
            ruleText = "";
            postType = "";
            chks = "";
            break;
    };
    $(".selectNum").on("click",".deleteSet",function(){
        $(this).parent().attr("rule","");
        $(this).parent().attr("ruleVal","");
        $(this).parent().hide();
    })
}
// 栏目推荐modal重置
function modalReset(){
    $(".selectTab").hide();
    $("tbody tr").removeClass('selected');
    selectNum();
    $("#staticBackgroundPicForm tr,#focusBackgroundPicForm tr,#clickBackgroundPicForm tr,#previewBackgroundPicForm tr").remove();
    // 挂件
    if( $("#accordionPanel").css("display") == "none" && $("#accordionEvent").css("display") == "none" ){
        var selIconStatic = $("div[data-pendantId='pendantId']").attr("iconStaticPosition") == null? "top":$("div[data-pendantId='pendantId']").attr("iconStaticPosition");
        $("#editW").val(parseInt($("div[data-pendantId='pendantId']").width()));
        $("#editH").val(parseInt($("div[data-pendantId='pendantId']").height()));
        $("#positionX").val($("div[data-pendantId='pendantId']").css("left").split("px")[0]);
        $("#positionY").val($("div[data-pendantId='pendantId']").css("top").split("px")[0]);

        $("#staticColor").val($("div[data-pendantId='pendantId']").css("color"));
        $("#staticSize").val($("div[data-pendantId='pendantId']").css("font-size"));
        // 图标
        $(".iconStaticPosition").find("option[value='"+selIconStatic+"']").prop("selected", true);
        $("#iconStaticWidth").val($("div[data-pendantId='pendantId']").attr("iconStaticWidth")== null?"13":$("div[data-pendantId='pendantId']").attr("iconStaticWidth"));
        $("#iconStaticHeight").val($("div[data-pendantId='pendantId']").attr("iconStaticHeight")== null?"13":$("div[data-pendantId='pendantId']").attr("iconStaticHeight"));
        $("#iconStaticSpacing").val($("div[data-pendantId='pendantId']").attr("iconStaticSpacing")== null?"5":$("div[data-pendantId='pendantId']").attr("iconStaticSpacing"));
        // 图标静态
        publicUploadEcho("iconStatic", $("div[data-pendantId='pendantId']").attr("iconStatic"));
    };
    // 菜单容器
    if( $("div[data-id='boxId']").attr("type")== "MenuUI"){
        $(".selectNum .selClick,.selectNum .selFocus").remove();
        $(".selectNum option:first").prop("selected", true);
        $(".setFocus").hide();
        $(".selectNum select").trigger("click");
        if($("div[data-id='boxId'] .menuBox").length > 0){
            $("#menuW").val(parseInt($("div[data-id='boxId'] .menuBox").width()));
            $("#menuH").val(parseInt($("div[data-id='boxId'] .menuBox").height()));
            $("#itemSpacing").val($("div[data-id='boxId'] .menuBox").css("margin-bottom").split("px")[0]);
            $("#staticBG").val($("div[data-id='boxId'] .menuBox").css("background-color"));
            $("#staticColor").val($("div[data-id='boxId'] .menuBox").css("color"));
            $("#staticSize").val($("div[data-id='boxId'] .menuBox").css("font-size"));
            $("#focusBG").val($("div[data-id='boxId'] .menuBox").attr("focusBG"));
            $("#focusColor").val($("div[data-id='boxId'] .menuBox").attr("focusColor"));
            $("#focusSize").val($("div[data-id='boxId'] .menuBox").attr("focusSize"));
            $("#clickBG").val($("div[data-id='boxId'] .menuBox").attr("clickBG"));
            $("#clickColor").val($("div[data-id='boxId'] .menuBox").attr("clickColor"));
            $("#clickSize").val($("div[data-id='boxId'] .menuBox").attr("clickSize"));
            // 新建条目表格
            $(".tableMenu").find("tbody").empty();
            $(".tableMenu").show();
            var tbodyTr = $("div[data-id='boxId'] .menuBox");
            for(var t = 0; t < tbodyTr.length; t++){
                // console.log(tbodyTr.eq(t).attr("namelist"));
                $(".tableMenu tbody").append(menuBox);
                // 删除一条数据
                $(".tableMenu").on("click", ".menuDelete", function(){
                    var _this = $(this);
                    var dialog = $("#deleteCheck");
                    dialog.modal("show");
                    dialog.find("#deleteConfirm").unbind("click");
                    dialog.find("#deleteConfirm").bind("click", function () {
                        _this.parent().parent().remove();   // 推荐菜单
                        //重置按钮状态，关闭提示框
                        dialog.modal("hide");
                    });
                });
                // 索引
                $(".tableMenu tr:last-child .menuNewIndex").find("input").val(tbodyTr.eq(t).attr("index"));
                // 别名
                $(".tableMenu tr:last-child .alias").find("input").val(tbodyTr.eq(t).attr("alias"));
                // 语言
                $(".tableMenu tr:last-child .menuNewName").append($(".drag .newMenuLanguage").clone());
                $(".tableMenu .newMenuLanguage").show();
                $(".tableMenu tr:last-child .newMenuLanguage").find("input:first-child").show();
                $(".tableMenu .selectMenu").change(function(){
                    var optionNum = $(this).children('option:selected').val();
                    $(this).parent().find(".languageMenu input").hide();
                    $(this).parent().find(".languageMenu input").eq(optionNum).show();
                });
                // 多语言name
                var nameReset = JSON.parse(tbodyTr.eq(t).attr("namelist"));
                var languageName = $(".tableMenu tr:last-child .newMenuLanguage").find("option");
                languageName.each(function(){
                    for(var key in nameReset){
                        if($(this).attr("id") == key){
                            $(this).parent().next().find("input").eq( $(this).val()).val(nameReset[key]);
                        }
                    }
                });
                // 事件
                var trRuleVal = tbodyTr.eq(t).attr("ruleVal");
                ruleId(trRuleVal,"param");
                $(".tableMenu tr:last-child .menuNewRule").text(ruleText);
                $(".tableMenu tr:last-child .menuNewRule").attr({"rule":tbodyTr.eq(t).attr("rule"),"ruleVal":postType});
            }
            // 静态
            publicUploadEcho("backgImage", $("div[data-id='boxId'] .menuBox").attr("backGroupImage"));
            // 聚焦
            publicUploadEcho("focusImage", $("div[data-id='boxId'] .menuBox").attr("focusBGImg"));
            // 点击
            publicUploadEcho("clickImage", $("div[data-id='boxId'] .menuBox").attr("clickBGImg"));
        }else{
            $("#itemSpacing").val("");
            $("#menuW").val("98");
            $("#menuH").val("30");
            $(".tableMenu").hide();
            $(".tableMenu").find("tbody").empty();
            $("#editName,#staticBG,#staticColor,#staticSize,#focusBG,#focusColor,#focusSize,#clickBG,#clickColor,#clickSize,#indexSort").val("");
            $(".iconStatic,.iconFocus,.iconClick,.backgImage,.focusImage,.clickImage").find("input").val("");
        }
    };
    // 栏目 --- 推荐
    if($("#accordionPanel").css("display") == "none" && $("#accordionEvent").css("display") == "block"){
        $(".setFocus").show();
        var selCorner = $("#columnId").parent().attr("corner");
        var inpAuthority = $("#columnId").parent().attr("authority");
        var defaultOpen = $("#columnId").parent().attr("defaultOpen");
        var getFocus = $("#columnId").parent().attr("getFocus");
        var selIconStatic = $("#columnId").parent().attr("iconStaticPosition");
        var selIconFocus = $("#columnId").parent().attr("iconFocusPosition");
        var selIconClick = $("#columnId").parent().attr("iconClickPosition");
        $("#editW").val(parseInt($("#columnId").parent().width()));
        $("#editH").val(parseInt($("#columnId").parent().height()));
        $("#positionX").val($("#columnId").parent().css("left").split("px")[0]);
        $("#positionY").val($("#columnId").parent().css("top").split("px")[0]);
        $("#alias").val($("#columnId").parent().attr("alias"));
        $("#staticColor").val($("#columnId").parent().css("color"));
        $("#staticSize").val($("#columnId").parent().css("font-size"));
        $("#focusColor").val($("#columnId").parent().attr("focusColor"));
        $("#focusSize").val($("#columnId").parent().attr("focusSize"));
        $("#clickColor").val($("#columnId").parent().attr("clickColor"));
        $("#clickSize").val($("#columnId").parent().attr("clickSize"));
        $(".selectNum option:first").prop("selected", true);
        $("#editName,#staticBG,#focusBG,#clickBG,#indexSort").val("");
        // 名称等
        if($("#columnId").text() == "请编辑" || ($("#columnId").parent().attr("ruleVal") == undefined && $("#columnId").parent().attr("ruleValFocus") == undefined)){
            $(".languageName").find("input").val("");
            $(".corner").find("option:first").prop("selected", true);
            $(".authority").find("input[value='0']").prop("checked", true);
            $(".defaultOpen").find("input[value='0']").prop("checked", true);
            $(".getFocus").find("input[value='1']").prop("checked", true);
            $("#largeMultiple").val("1");
            $("#staticBackgroundPicForm .imgUpload,#focusBackgroundPicForm .imgUpload,#clickBackgroundPicForm .imgUpload,#iconStaticPicForm .imgUpload,#iconFocusPicForm .imgUpload,#iconClickPicForm .imgUpload").remove();
            $(".selectNum select").trigger("click");
            $(".deleteSet").parent().remove();
            $(".iconStatic,.iconFocus,.iconClick,.backgImage,.focusImage,.clickImage").find("input").val("");
        }else{
            $(".languageName").find("input[type='text']").val("");
            // 多语言name
            var nameReset = JSON.parse($("#columnId").parent().attr("namelist"));
            var languageName = $(".languageName").find("input[type='hidden']");
            languageName.each(function(){
                for(var key in nameReset){
                    // console.log(key); //json对象的key
                    // console.log(nameReset[key]); //json对象的值
                    if($(this).attr("id") == key){
                        $(this).prev().val(nameReset[key]);
                    }
                }
            });
            $(".corner").find("option[value='"+selCorner+"']").prop("selected", true);
            $(".authority").find("input[value='"+inpAuthority+"']").prop("checked", true);
            $(".defaultOpen").find("input[value='"+defaultOpen+"']").prop("checked", true);
            $(".getFocus").find("input[value='"+getFocus+"']").prop("checked", true);
            $("#largeMultiple").val($("#columnId").parent().attr("largeMultiple"));
            $("#indexSort").val($("#columnId").parent().attr("index"));
            $("#staticBG").val($("#columnId").parent().css("background-color"));
            $("#focusBG").val($("#columnId").parent().attr("focusBG"));
            $("#clickBG").val($("#columnId").parent().attr("clickBG"));
            // 图标
            $(".iconStaticPosition").find("option[value='"+selIconStatic+"']").prop("selected", true);
            $("#iconStaticWidth").val($("#columnId").parent().attr("iconStaticWidth"));
            $("#iconStaticHeight").val($("#columnId").parent().attr("iconStaticHeight"));
            $("#iconStaticSpacing").val($("#columnId").parent().attr("iconStaticSpacing"));
            $(".iconFocusPosition").find("option[value='"+selIconFocus+"']").prop("selected", true);
            $("#iconFocusWidth").val($("#columnId").parent().attr("iconFocusWidth"));
            $("#iconFocusHeight").val($("#columnId").parent().attr("iconFocusHeight"));
            $("#iconFocusSpacing").val($("#columnId").parent().attr("iconFocusSpacing"));
            $(".iconClickPosition").find("option[value='"+selIconClick+"']").prop("selected", true);
            $("#iconClickWidth").val($("#columnId").parent().attr("iconClickWidth"));
            $("#iconClickHeight").val($("#columnId").parent().attr("iconClickHeight"));
            $("#iconClickSpacing").val($("#columnId").parent().attr("iconClickSpacing"));
            // 图标静态
            publicUploadEcho("iconStatic", $("#columnId").parent().attr("iconStatic"));
            // 图标聚焦
            publicUploadEcho("iconFocus", $("#columnId").parent().attr("iconFocus"));
            // 图标点击
            publicUploadEcho("iconClick", $("#columnId").parent().attr("iconClick"));
            // 静态
            publicUploadEcho("backgImage", $("#columnId").parent().attr("backGroupImage"));
            // 聚焦
            publicUploadEcho("focusImage", $("#columnId").parent().attr("focusBGImg"));
            // 点击
            publicUploadEcho("clickImage", $("#columnId").parent().attr("clickBGImg"));
        };
        // 事件类型
        var selClick = $("#columnId").parent().attr("ruleVal");
        if( selClick == undefined || selClick == ""){
            $(".selectNum .selClick").remove();
            // $(".selectNum option:first").prop("selected", true);
        }else{
            ruleId(selClick,"param");
            if($(".selectNum .selClick").length > 0){
                // $(".selClick span").text(ruleText);
                $(".selClick").attr({"rule":$("#columnId").parent().attr("rule"),"ruleVal": selClick});
                publicGetName($(".selClick"),true);
            }else{
                $(".selectNum").append("<div class='selClick' rule='"+$("#columnId").parent().attr("rule")+"' ruleVal='"+selClick+"'>" +
                    "<p class='col-xs-9' style='margin-top: 6px;'>点击事件：<span></span>数据</p>" + // "+ruleText+"
                    "<button type='button' class='col-xs-3 deleteSet' style='margin-top: 3px;'>删除</button>" +
                    "</div>");
                publicGetName($(".selClick"),true);
            }
        };
        setTimeout(function(){
            var selFocus = $("#columnId").parent().attr("ruleValFocus");
            if( selFocus == undefined || selFocus == ""){
                $(".selectNum .selFocus").remove();
                // $(".selectNum option:first").prop("selected", true);
            }else{
                ruleId(selFocus,"param");
                if($(".selectNum .selFocus").length > 0){
                    // $(".selFocus span").text(ruleText);
                    $(".selFocus").attr({"rule":$("#columnId").parent().attr("ruleFocus"),"ruleVal": selFocus});
                    publicGetName($(".selFocus"),true);
                }else{
                    $(".selectNum").append("<div class='selFocus' rule='"+$("#columnId").parent().attr("ruleFocus")+"' ruleVal='"+selFocus+"'>" +
                        "<p class='col-xs-9' style='margin-top: 6px;'>焦点事件：<span></span>数据</p>" + // "+ruleText+"
                        "<button type='button' class='col-xs-3 deleteSet' style='margin-top: 3px;'>删除</button>" +
                        "</div>");
                    publicGetName($(".selFocus"),true);
                }
            };
        },1000);
    };
    // 面板容器信息
    if($("#accordionPanel").css("display") == "block"){
        $(".setFocus").hide();
        var inpRoll = $("div[data-id='boxId'").attr("roll");
        var inpWifiStyle = $("div[data-id='boxId'").attr("wifiStyle");
        var inpFocusChange = $("div[data-id='boxId'").attr("focusChange")
        $("#previewW").val(parseInt($("div[data-id='boxId']").width()));
        $("#previewH").val(parseInt($("div[data-id='boxId']").height()));
        $("#previewX").val($("div[data-id='boxId']").css("left").split("px")[0]);
        $("#previewY").val($("div[data-id='boxId']").css("top").split("px")[0]);
        $("#previewColor").val($("div[data-id='boxId']").css("color"));
        $("#previewSize").val($("div[data-id='boxId']").css("font-size"));
        if($("div[data-id='boxId'").attr("backGroupImage") == undefined ){
            $(".selectNum select").trigger("click");
            $(".roll").find("input[value='0']").prop("checked", true);
            $(".wifiStyle").find("input[value='topLeft']").prop("checked", true);
            $(".focusChange").find("input[value='1']").prop("checked", true);
            $("#previewBG,#focusBG").val("");
            $(".languageName").find("input[type='text']").val("");
            $(".tableMenu").hide();
            $(".tableMenu").find("tbody").empty();
            $(".previewBGUpload").find("input").val("");
        }else{
            $(".roll").find("input[value='"+inpRoll+"']").prop("checked", true);
            $(".wifiStyle").find("input[value='"+inpWifiStyle+"']").prop("checked", true);
            $(".focusChange").find("input[value='"+inpFocusChange+"']").prop("checked", true);
            $("#previewBG").val($("div[data-id='boxId']").css("background-color"));
            $("#focusBG").val($("div[data-id='boxId']").attr("focusBG"));
            $(".languageName").find("input[type='text']").val("");
            // 多语言name
            var nameReset = JSON.parse($("div[data-id='boxId']").attr("namelist"));
            var languageName = $(".languageName").find("input[type='hidden']");
            languageName.each(function(){
                for(var key in nameReset){
                    if($(this).attr("id") == key){
                        $(this).prev().val(nameReset[key]);
                    }
                }
            });
        }
        // 面板容器上传图片
        publicUploadEcho("previewBGUpload", $("div[data-id='boxId'").attr("backGroupImage"));
        // 聚焦
        publicUploadEcho("focusImage",$("div[data-id='boxId']").attr("focusBGImg"));
        // 事件类型
        $(".selectNum .selFocus").remove();
        var panelClick = $("div[data-id='boxId']").attr("ruleVal");
        if( panelClick == undefined || panelClick == ""){
            $(".selectNum .selClick").remove();
            $(".selectNum option:first").prop("selected", true);
        }else{
            ruleId(panelClick,"param");
            if($(".selectNum .selClick").length > 0){
                // $(".selClick span").text(ruleText);
                $(".selClick").attr({"rule":$("div[data-id='boxId']").attr("rule"),"ruleVal": panelClick});
                publicGetName($(".selClick"),true);
            }else{
                $(".selectNum").append("<div class='selClick' rule='"+$("div[data-id='boxId']").attr("rule")+"' ruleVal='"+panelClick+"'>" +
                    "<p class='col-xs-9' style='margin-top: 6px;'>点击事件：<span></span>数据</p>" + // "+ruleText+"
                    "<button type='button' class='col-xs-3 deleteSet' style='margin-top: 3px;'>删除</button>" +
                    "</div>");
                publicGetName($(".selClick"),true);
            }
        };
    };
};
// 拖动切换
function publicCutover(){
    movePosition();
    $(".drag").on("click", ".closeEdit,.close", function(){
        var _this = $(this);
        var dialog = $("#deleteCheck");
        dialog.modal("show");
        dialog.find("#deleteConfirm").unbind("click");
        dialog.find("#deleteConfirm").bind("click", function () {
            _this.parent().remove();   // 推荐菜单
            // 推荐菜单项关联的栏目
            $(".drag").find("#"+_this.parent().attr("class").split(" ")[1]).attr({"rule":"","ruleVal":"","ruleFocus":"","ruleValFocus":""});
            // 栏目相关联
            var recNum = _this.parent().attr("id");
            $(".drag").find("."+recNum).remove();
            // 面板相关联
            if(_this.parent().find(".columnBox").length > 0){
                $(".drag").find(".speciesBox").remove();
                // var speciesBox = $(".drag").find(".speciesBox");
                // for(var f = 0; f < speciesBox.length; f++){
                //     if(speciesBox.eq(f).attr("type") != "WifiUI"){
                //         speciesBox[f].remove();
                //     }
                // };
            }
            //重置按钮状态，关闭提示框
            dialog.modal("hide");
        });
    });
    // 挂件的切换
    $(".drag").on("click",".pendantChild",function(){
        $(".drag").find(".pendantChild").removeClass("addPendantTo");
        $(this).addClass("addPendantTo");
    });
    // 面板的切换
    $(".drag").on("click",".dragBox",function(){
        // var dragBoxId = $(this).attr("id");
        $(".drag").find(".dragBox").removeClass("addDragTo");
        $(this).addClass("addDragTo");
        $(this).css("z-index","99");
        if($(this).find(".columnBox").length < 1 && !$(this).parent().hasClass("speciesBox")){
            $(".dragBox").find(".columnBox").removeClass("addColumnTo");
            $(".drag").find(".speciesBox").removeClass("addSpeciesTo");
            $(".drag").find(".speciesBox").hide();
        }
        // $(".drag").find("."+dragBoxId).show();
    });
    // 栏目的切换
    $(".dragBox").on("click",".columnBox",function(){
        var dataId = $(this).attr("id");
        $(".dragBox").find(".columnBox").removeClass("addColumnTo");
        $(this).addClass("addColumnTo");
        // 取消上次延时未执行的方法
        clearTimeout(TimeFn);
        //执行延时
        TimeFn = setTimeout(function(){
            $(".speciesBox").hide();
            $(".drag").find("."+dataId).show();
            $(".drag").find(".speciesBox").removeClass("addSpeciesTo");
            $(".drag").find("."+dataId).addClass("addSpeciesTo");
        },300);
    });
    $(".drag").on("click",".speciesBox",function(){
        $(".drag").find(".speciesBox").removeClass("addSpeciesTo");
        $(this).addClass("addSpeciesTo");
    });
    // 推荐位的切换
    $(".speciesBox").on("click",".childBox",function(){
        $(".speciesBox").find(".childBox").removeClass("addChildTo");
        $(this).addClass("addChildTo");
    });
};
// 编辑回显图片
function publicUploadEcho(name, nameUpload){
    if(nameUpload && nameUpload != "" ){
        $("."+name).parents(".form-group").find("p").remove();
        $("."+name).find("input[type='file']").val("");
        $("."+name).parents(".form-group").append('<p class="imgUpload col-xs-8">已上传：<a href="'+nameUpload+'" target="_blank">'+nameUpload+'</a></p>')
        $("."+name).find("input[type='hidden']").val(nameUpload);
    }else{
        $("."+name).parents(".form-group").find("p").remove();
        $("."+name).find("input").val("");
    }
};
// 添加挂件判断
function publicPendant(type,pendantType){
    if($(".dragBox.addDragTo").find(".columnBox").length > 0){
        alert("只可添加一种容器！");
        return;
    };
    var childType = $(".dragBox.addDragTo").find(".pendantChild");
    for(var c = 0; c < childType.length; c++){
        if(childType.eq(c).attr("type") == type){
            alert("已经添加了！");
            return;
        }
    };
    if($(".dragBox").hasClass("addDragTo") && !$(".dragBox.addDragTo").parent().hasClass("speciesBox")){
        $(".speciesBox").hide();
        $(".dragBox.addDragTo").append(pendantType);
        publicCutover();
    }else if($(".dragBox").hasClass("addDragTo") && $(".dragBox.addDragTo").parent().hasClass("speciesBox")){
        $(".dragBox.addDragTo").append(pendantType);
        publicCutover();
    }else{
        alert("请选择添加位置！");
    };
};
// 添加业务容器判断
function publicPanelUI(type){
    if($(".speciesBox").hasClass("addSpeciesTo") && $(".speciesBox.addSpeciesTo").attr("type") == "RecommendedUI"){
        panelType(type);
        $(".speciesBox.addSpeciesTo").append(dragBox);
        $(".speciesBox.addSpeciesTo").find(".dragBox").addClass("childBox");
        $(".speciesBox.addSpeciesTo").find(".dragBox").last().css({"width":"150px","height":"170px"});
    }else{
        panelType(type);
        $(".drag").append(dragBox);
    };
    publicCutover();
};
// 点击焦点事件获取名称
function publicGetName(nameClass,bool){
    if(postType=="Recommended"||postType=="Menu"||postType=="Show"||postType=="Menu"||postType=="SpecialTVSignal"||postType=="GeneralTVSignal"||(postType=="Custom"&&(cusInput=="customList" || cusInput=="customPackage"))){
        if(bool != true){
            nameClass.find("span").text(ruleText);
            return alert("设置成功！");
        }else{
            nameClass.find("span").text(ruleText);
            return;
        }
    };
    var getNameRule;
    if(postType=="Custom"){ // 自定义 && (cusInput=="customMedia" || cusInput=="customMediaTopics")
        getNameRule = JSON.parse(nameClass.attr("rule")).param;
    }else if(postType=="website"){ // 网站resourceId
        getNameRule = JSON.parse(nameClass.attr("rule")).resourceId;
    }else{
        getNameRule = nameClass.attr("rule");
    };
    $.post(base+"/op/ui/content/content", {type:nameClass.attr("ruleVal")+"Event",id:getNameRule}, function (data) {
        nameClass.find("span").text(ruleText+"-"+data.data);
        $("tr.on").find("td.menuNewRule").text(ruleText+"-"+data.data);
        if(bool == true) return;
        alert("设置成功！");
    });
};
// 阻止冒泡
function stopBubble(e){
    if(e && e.stopPropagation){//非IE
        e.stopPropagation();
    }else{//IE
        window.event.cancelBubble = true;
    }
};
// 挂件双击
function pendantDouble(){
    stopBubble();
    $("div.addPendantTo").attr("data-pendantId","pendantId");
    // $(".dragBox").removeAttr("ondblclick");
    $("#accordionPanel,#accordionMenu,#newMenu,#accordionEvent").hide();
    $("#accordion,#accordionStyle,.iconEdit,.pendantInfoHide,.wifi").show();
    $(".pendantInfo,.recomInfo,.columnInfo").hide();
    $("#publicDetail").modal("show");
    modalReset();
};
// 栏目双击
function columnDouble(){
    stopBubble();
    // 取消上次延时未执行的方法
    clearTimeout(TimeFn);
    if(loginType === 2){
        if($(".columnBox.addColumnTo").attr("authority") == '0') return alert("您没有权限修改此项");
    }
    $(".columnBox.addColumnTo").find("p").attr("id","columnId");
    var scrollReset =  $("#columnId").parent().parent();
    scrollReset.animate({ 'scrollTop':0, 'scrollLeft':0 },0);
    // $(".dragBox").removeAttr("ondblclick");
    $("#accordionPanel,#accordionMenu,#newMenu,.pendantInfoHide,.recomInfo,.pendantWifiHide").hide();
    $("#accordion,#accordionStyle,#accordionEvent,.pendantInfo,.wifiContainer,.recPublic,.iconEdit,.columnInfo,.wifi").show(); // .indexSort,
    $(".selectNum").find("option[data-to='mark']").remove();
    $(".selectNum select").prepend("<option data-to='mark' value='Show'>内容展示容器</option>");
    $(".selectNum select").prepend("<option data-to='mark' value='Menu'>导航菜单容器</option>");
    $(".selectNum select").prepend("<option data-to='mark' value='Recommended'>推荐位容器</option>");
    $("#publicDetail").modal("show");
    modalReset();
};
// 推荐双击
function childDouble(){
    stopBubble();
    if(loginType === 2){
        if($(".childBox.addChildTo").attr("authority") == '0') return alert("您没有权限修改此项");
    }
    $(".childBox.addChildTo").find("p").attr("id","columnId");
    var scrollReset =  $("#columnId").parent().parent();
    scrollReset.animate({ 'scrollTop':0, 'scrollLeft':0 },0);
    $("#accordionPanel,#accordionMenu,#newMenu,.pendantInfoHide,.recPublic,.iconEdit,.columnInfo,.pendantWifiHide").hide();
    $("#accordion,#accordionStyle,#accordionEvent,.pendantInfo,.recomInfo,.wifi,.wifiContainer").show(); // ,.indexSort
    $(".selectNum").find("option[data-to='mark']").remove();
    $("#publicDetail").modal("show");
    modalReset();
};
// 面板双击
function dragBoxDouble(){
    stopBubble();
    $(".dragBox.addDragTo").attr("data-id","boxId");
    $("#accordion,#accordionMenu,#accordionStyle,#accordionEvent").hide();
    $(".iconEdit,.focusChange,.pms,.wifi").hide(); // .indexSort,
    $("#accordionPanel,.ShowUI,.ImageUI").show();
    if($("div[data-id='boxId']").attr("type") == "PmsUI"){
        $(".pms").show();
    };
    if($("div[data-id='boxId']").attr("type") == "AnnouncementUI"){
        $(".pms").show();
        $(".announcement").hide();
    };
    if($("div[data-id='boxId']").attr("type") == "ImageUI"){
        $(".ImageUI").hide();
    };
    if($("div[data-id='boxId']").attr("type") == "WifiUI"){
        $(".iconEdit,.recPublic,.wifiContainer,#newMenu").hide();
        $("#accordionStyle,.wifi,.pendantWifiHide").show();
    };
    $("#publicDetail").modal("show");
    modalReset();
};
// 容器双击
function speciesBoxDouble(){
    stopBubble();
    $(".speciesBox.addSpeciesTo").attr("data-id","boxId");
    if($(".speciesBox.addSpeciesTo").attr("type") == "MenuUI"){ // 菜单
        $("#accordion,.pendantInfoHide,.focusChange").hide();
        $("#accordionPanel,#accordionMenu,#accordionStyle,#accordionEvent,#newMenu,.ShowUI,.wifi").show();
        $(".selectNum").find("option[data-to='mark']").remove();
    }else if($(".speciesBox.addSpeciesTo").attr("type") == "RecommendedUI"){  // 推荐位
        $("#accordion,#accordionMenu,#accordionStyle,#accordionEvent").hide();
        $("#accordionPanel,.focusChange,.ShowUI").show();
    }else if($(".speciesBox.addSpeciesTo").attr("type") == "ShowUI"){  // 内容展示容器
        $("#accordion,#accordionMenu,#accordionStyle,#accordionEvent,.focusChange,.ShowUI").hide();
        $("#accordionPanel,#accordionEvent").show();
        $(".selectNum").find("option[data-to='mark']").remove();
    };
    $(".languageMenu input,.iconEdit,.pms").hide(); // .indexSort,
    $("#previewDetail .languageMenu").find("input:first-child").show();
    $("#previewDetail .languageMenu").find("option:first-child").prop("selected",true);
    $("#publicDetail").modal("show");
    modalReset();
};
// 绘制网格
function drawRect(i,j,GRID_WIDTH,GRID_HEIGHT){
    var canvas = document.getElementById("canvas");
    if(!canvas.getContext) return false;
    var context = canvas.getContext("2d");
    context.lineWidth = 0.5;//线条的宽度
    context.strokeStyle = "#999";//线条的颜色
    context.strokeRect(i*GRID_WIDTH,j*GRID_HEIGHT,GRID_WIDTH,GRID_HEIGHT);
}
function drawGrid(CANVAS_WIDTH,CANVAS_HEIGHT,GRID_WIDTH,GRID_HEIGHT){
    var rows = parseInt(CANVAS_WIDTH/GRID_WIDTH);
    var cols = parseInt(CANVAS_HEIGHT/GRID_HEIGHT);
    for(var i = 0; i < rows; i++){
        for(var j = 0;j < cols; j++){
            drawRect(i,j,GRID_WIDTH,GRID_HEIGHT);
        }
    }
}
var CANVAS_WIDTH = 800;           //画布的大小
var CANVAS_HEIGHT = 450;
var GRID_WIDTH = 10;              //网格的大小
var GRID_HEIGHT = 10;
// drawGrid(CANVAS_WIDTH,CANVAS_HEIGHT,GRID_WIDTH,GRID_HEIGHT);

var query = JSON.parse(getQueryString('currentId'));
var currentId = query.id; // window.location.search.split("=");
var tenantId = query.tenantId;
var sceneName = query.sceneName;
tenantId = tenantId ? tenantId : '';
sceneName = sceneName ? sceneName : '';

console.log(currentId);
// console.log(tenantId);
// console.log(sceneName);

$(function(){
    business();

    // 获取语言
    $.post(base+"/op/ui/scene/langauge", {sceneId: currentId}, function (data) {
        var language = data.data;
        for(var g = 0; g < language.length; g++){
            $(".languageName").append('<label class="col-xs-3 control-label">'+language[g].language+'名称：</label>' +
                '<div class="col-xs-8">' +
                '<input type="text" id="" name="" value="" class="form-control" placeholder="请输入名称">' +
                '<input type="hidden" id="'+language[g].language+'" value="'+language[g].id+'">' +
                '</div>');
            $(".newMenuLanguage .selectMenu").append("<option value='"+g+"' id='"+language[g].language+"'>"+language[g].language+"</option>");
            $(".newMenuLanguage .languageMenu").append("<input type='text' class='form-control' placeholder='"+language[g].language+"' />");
            if(language[g].language == "zh-Hans"){
                $(".languageName input[type='text']").removeAttr("id");
                $(".languageName #zh-Hans").prev().attr("id","editName");
            }else{
                $(".languageName div").eq(0).find("input[type='text']").attr("id","editName");
            }
        };
    });
    // 上传图片
    $("input[type='file']").on('change', function (e) {
        var _this = $(this);
        if($("#pic").val() == "") return;
        var targetElement = e.target, file = targetElement.files[0];
        var fd = new FormData();
        fd.append('file', file);
        $.ajax({
            url : "/op/ui/content/upload",
            type : 'post',
            data : fd,
            contentType : false, // 必须false才会自动加上正确的Content-Type
            processData : false, // 必须false才会避开jQuery对 formdata 的默认处理 XMLHttpRequest会对 formdata 进行正确的处理
            cache : false,
            success : function (data) {
                console.log(_this.next().attr("type"));
                _this.next().val(data.data.url);
                _this.parents(".form-group").find("p").remove();
                _this.parents(".form-group").append('<p class="imgUpload col-xs-8">已上传：<a href="'+data.data.url+'" target="_blank">'+data.data.url+'</a></p>')
            }
        });
    });
    // 颜色设定
    $('#overallBG,#overallColor,#staticBG,#staticColor,#focusBG,#focusColor,#clickBG,#clickColor,#previewBG,#previewColor,#recommendStaticColor,#recommendFocusColor,#recommendClickColor').colpick({
        layout:'hex',
        submit:0,
        color:'#ffffff',
        onChange:function(hsb,hex,rgb,el,bySetColor) {
            $(el).css('border-color','#'+hex);
            if(!bySetColor) $(el).val(hex);
        }
    }).keyup(function(){
        $(this).colpickSetColor(this.value);
    });

    // 设置点击事件
    $(".setClick").on("click",function(){
        var selVal = $(".selectNum").find("option:selected").val();
        var dataTo = $(".selectNum").find("option:selected").attr("data-to");
        // if(dataTo == "dataVOD" && ( !$(".dataTableWebsite_mediaSubject").find("tr").hasClass("selected") || !$(".dataTableMediaSubject").find("tr").hasClass("selected"))) return Toast.error("每个表格选择一条数据！");
        if(dataTo == "mark" || dataTo == "generalTVSignal" || dataTo == "specialTVSignal"
            || (dataTo != "custom" && $("."+dataTo).find("tr").hasClass("selected"))
            || (dataTo == "custom" && ($("input[name='custom']:checked").val() == "customList" || $("input[name='custom']:checked").val() == "customPackage"))
            || (dataTo == "custom" && $("input[name='custom']:checked").val() == "customMedia" && $(".dataTableMedia").find("tr").hasClass("selected"))
            || (dataTo == "custom" && $("input[name='custom']:checked").val() == "customMediaTopics" && $(".dataTableMediaSubject").find("tr").hasClass("selected"))){
            ruleId(selVal);
            if($(".selClick").length > 0){
                $(".selClick").show();
                // $(".selClick span").text(ruleText);
                $(".selClick").attr({"rule":chks[0].id || chks,"ruleVal":postType});
                publicGetName($(".selClick"));
            }else{
                if($("#newMenu").css("display") == "none"){  // 菜单
                    $(".selectNum").append("<div class='selClick'>" +
                        "<p class='col-xs-9' style='margin-top: 6px;'>点击事件：<span></span>数据</p>" + // "+ruleText+"
                        "<button type='button' class='col-xs-3 deleteSet' style='margin-top: 3px;'>删除</button>" +
                        "</div>");
                    $(".selClick").attr({"rule":chks[0].id || chks,"ruleVal":postType});
                    publicGetName($(".selClick"));
                }else{
                    if($(".tableMenu tr").hasClass("on")){
                        // $("tr.on").find("td.menuNewRule").text(ruleText);
                        $("tr.on").find("td.menuNewRule").attr({"rule":chks[0].id || chks,"ruleVal":postType});
                        publicGetName($(".tableMenu .on").find(".menuNewRule"));
                    }else{
                        alert("请选择一条表格数据！");
                    };
                }
            }
        }else{
            alert("请选择一条数据！");
        };
    });

    // 设置焦点事件
    $(".setFocus").on("click",function(){
        var selVal = $(".selectNum").find("option:selected").val();
        var dataTo = $(".selectNum").find("option:selected").attr("data-to");
        // if(dataTo == "dataVOD" && ( !$(".dataTableWebsite_mediaSubject").find("tr").hasClass("selected") || !$(".dataTableMediaSubject").find("tr").hasClass("selected"))) return Toast.error("每个表格选择一条数据！");
        if(dataTo == "mark" || dataTo == "generalTVSignal" || dataTo == "specialTVSignal"
            || (dataTo != "custom" && $("."+dataTo).find("tr").hasClass("selected"))
            || (dataTo == "custom" && ($("input[name='custom']:checked").val() == "customList" || $("input[name='custom']:checked").val() == "customPackage"))
            || (dataTo == "custom" && $("input[name='custom']:checked").val() == "customMedia" && $(".dataTableMedia").find("tr").hasClass("selected"))
            || (dataTo == "custom" && $("input[name='custom']:checked").val() == "customMediaTopics" && $(".dataTableMediaSubject").find("tr").hasClass("selected"))){
            ruleId(selVal);
            if($(".selFocus").length > 0){
                $(".selFocus").show();
                // $(".selFocus span").text(ruleText);
                $(".selFocus").attr({"rule":chks[0].id || chks,"ruleVal":postType});
                publicGetName($(".selFocus"));
            }else{
                $(".selectNum").append("<div class='selFocus'>" +
                    "<p class='col-xs-9' style='margin-top: 6px;'>焦点事件：<span></span>数据</p>" +  // "+ruleText+"
                    "<button type='button' class='col-xs-3 deleteSet' style='margin-top: 3px;'>删除</button>" +
                    "</div>");
                $(".selFocus").attr({"rule":chks[0].id || chks,"ruleVal":postType});
                publicGetName($(".selFocus"));
            }
        }else{
            alert("请选择一条数据！");
        }
    });

    // 添加面板、栏目、推荐位容器
    $("#addContainer").on("click",function(){
        publicPanelUI("PanelUI");
    });
    $("#addColumn").on("click",function(){
        if($(".dragBox.addDragTo").find(".pendantChild").length > 0){
            alert("只可添加一种容器！");
            return;
        };
        if($(".dragBox.addDragTo").width() < "100" || $(".dragBox.addDragTo").height() < "30") {
            alert("您的面板太小了！");
            return;
        };
        if($(".dragBox").hasClass("addDragTo")){
            $(".speciesBox").hide();
            $(".dragBox.addDragTo").append(columnBox);
            publicCutover();
        }else{
            alert("请选择添加位置！");
        };
    });
    $("#addRecommend").on("click",function(){
        if($(".speciesBox.addSpeciesTo").find(".menuBox").length > 0){
            alert("只可添加一种容器！");
            return;
        };
        if($(".speciesBox").hasClass("addSpeciesTo") && $(".speciesBox.addSpeciesTo").css("display") == "block"){
            if($(".speciesBox.addSpeciesTo").attr("type") != "RecommendedUI"){
                alert("您栏目选择的不是此容器");
                return;
            };
            if($(".speciesBox.addSpeciesTo").width() < "150" || $(".speciesBox.addSpeciesTo").height() < "170"){
                alert("您的面板太小了！");
                return;
            };
            $(".speciesBox.addSpeciesTo").append(recommendBox);
            publicCutover();
        }else{
            alert("请选择添加位置！");
        }
    });

    // 添加挂件
    $("#time").on("click",function(){
        publicPendant("time",pendantTime);
    });
    $("#weather").on("click",function(){
        publicPendant("weather",pendantWeather);
    });
    $("#date").on("click",function(){
        publicPendant("date",pendantDate);
    });
    $("#wifi").on("click",function(){
        publicPendant("wifi",pendantWifi);
    });
    $("#area").on("click",function(){
        publicPendant("area",pendantArea);
    });
    $("#languagePen").on("click",function(){
        publicPendant("language",pendantLanguage);
    });

    // 添加业务容器PMS，公告信息，ImageUI
    $("#pmsUI").on("click",function(){
        publicPanelUI("PmsUI");
    });
    $("#announcementUI").on("click",function(){
        publicPanelUI("AnnouncementUI");
    });
    $("#imageUI").on("click",function(){
        publicPanelUI("ImageUI");
    });
    $("#wifiUI").on("click",function(){
        publicPanelUI("WifiUI");
    });

    // 整体编辑
    $("#overallEdit").on("click",function(){
        var dragAuth = $(".drag").attr("isAuthorize");
        var dragLayout = $(".drag").attr("layout");
        var dragLayoutstyle = $(".drag").attr("layoutstyle");
        var dragBGUpload = $(".drag").attr("backGroupImage");
        if(dragAuth == undefined){
            $("#overallBG,#overallFont,#overallColor").val("");
            $(".allAuthority").find("input[value='0']").prop("checked", true);
            $(".switchType").find("input[value='horizontal']").prop("checked", true);
            $(".styleTypes").find("input[value='delayering']").prop("checked", true);
            $(".dragBGUpload").find("input").val("");
        }else{
            $("#overallBG").val($(".drag").css("background-color"));
            $("#overallFont").val($(".drag").css("font-size"));
            $("#overallColor").val($(".drag").css("color"));
            $(".allAuthority").find("input[value='"+dragAuth+"']").prop("checked", true);
            $(".switchType").find("input[value='"+dragLayout+"']").prop("checked", true);
            $(".styleTypes").find("input[value='"+dragLayoutstyle+"']").prop("checked", true);
            if(dragBGUpload != ""){
                $(".dragBGUpload").parents(".form-group").find("p").remove();
                $(".dragBGUpload").find("input[type='file']").val("");
                $(".dragBGUpload").parents(".form-group").append('<p class="imgUpload col-xs-8">已上传：<a href="'+dragBGUpload+'" target="_blank">'+dragBGUpload+'</a></p>')
                $(".dragBGUpload").find("input[type='hidden']").val(dragBGUpload);
            }
        };
    });

    // 整体编辑保存
    $("#overall").on("click",function(){
        var dragBGUpload = $(".dragBGUpload").find("input[type='hidden']").val();
        $(".drag").css({"background-image":"url("+dragBGUpload+")","background-color": $("#overallBG").val()==""?"":"#"+$("#overallBG").val(),"font-size":$("#overallFont").val(),"color": $("#overallColor").val()==""?"":"#"+$("#overallColor").val()});
        $(".drag").attr("backGroupImage",dragBGUpload);
        $(".drag").attr({"authority":$(".allAuthority").find("input[type='radio']:checked").val(),
                         "layout": $(".switchType").find("input[name='switchType']:checked").val(),
                         "layoutStyle": $(".styleTypes").find("input[name='styleTypes']:checked").val() });  // 授权  布局  风格
        $("#overallDetail").modal("hide");
    });

    // modal编辑保存
    $("#publicDetail").on("click","#publicSave",function(){
        // 栏目 --- 推荐
        if($("#accordionPanel").css("display") == "none" && $("#accordionEvent").css("display") == "block"){
            // 基本宽高判断
            if($("#editW").val() > $("#columnId").parent().parent().width()){
                alert("基本宽度不能超出"+ $("#columnId").parent().parent().width());
                return;
            };
            if($("#editH").val() > $("#columnId").parent().parent().height()){
                alert("基本高度不能超出"+ $("#columnId").parent().parent().height());
                return;
            };
            //  点击事件
            if(($(".selectNum").find(".selClick").length < 1 || $(".selectNum").find(".selClick").css("display") == "none") && ($(".selectNum").find(".selFocus").length < 1 || $(".selectNum").find(".selFocus").css("display") == "none")){
                alert("请选择一条点击或焦点事件");
                return;
            };
            if($(".selClick").attr("rule") == "null" && $(".selFocus").attr("rule") == "null"){
                alert("点击和焦点不能同时选择容器！");
                return;
            }
        }
        // 面板容器宽高判断
        if($("#accordionPanel").css("display") == "block"){
            if($("#previewW").val() > $(".drag").width()){
                alert("容器宽度不能超出"+ $(".drag").width());
                return;
            };
            if($("#previewH").val() > $(".drag").height()){
                alert("容器高度不能超出"+ $(".drag").height());
                return;
            };
        }
        // 菜单公共宽高判断
        if($("div[data-id='boxId']").attr("type")== "MenuUI"){
            if($("#menuW").val() > parseInt($("#previewW").val())-2){
                alert("菜单公共宽度不能超出"+ (parseInt($("#previewW").val())-2));
                return;
            };
            if($("#menuH").val() > parseInt($("#previewH").val())){
                alert("菜单公共高度不能超出"+ $("#previewH").val());
                return;
            };
        }
        // 内容展示容器
        if($("div[data-id='boxId']").attr("type")== "ShowUI"){
            if($(".selectNum").find(".selClick").length < 1 || $(".selectNum").find(".selClick").css("display") == "none"){
                alert("请选择一条点击事件");
                return;
            };
        }
        // 判断是面板还是容器
        if($("#accordionPanel").css("display") == "none"){
            editSave();
        }else{
            previewSave();
        }
    })

    // 面板显示
    $("#navEdit").on("click",function(){
        $(".drag").find(".speciesBox").removeClass("addSpeciesTo");
        $(".drag").find(".speciesBox").hide();
    });

    // 推荐位样式
    $("#recommendEdit").on("click",function(){
        $("#recommendDetail").modal("show");
        $("#recommendStaticColor").val($(".recommendBox").css("color"));
        $("#recommendStaticSize").val($(".recommendBox").css("font-size"));
        $("#recommendFocusColor").val($(".recommendBox").attr("focusColor"));
        $("#recommendFocusSize").val($(".recommendBox").attr("focusSize"));
        $("#recommendClickColor").val($(".recommendBox").attr("clickColor"));
        $("#recomendClickSize").val($(".recommendBox").attr("clickSize"));
    })
    $("#recommendetail").on("click","#recommendSave",function(){
        recommendtyle = {
            "statcColor": $("#recommendStaticColor").val(),
            "staticSize": $("#recommendStaticSize").val(),
            "focusColor": $("#recommendFocusColor").val(),
            "focusSize": $("#recommendFocusSize").val(),
            "clickColor": $("#recommendClickColor").val(),
            "clickSize": $("#recommendClickSize").val()
        };
        $(".recommendBox").css({"color":"#"+recommendStyle.staticColor,"font-size": recommendStyle.staticSize })
        $(".recommendBox").attr({"focusColor": recommendStyle.focusColor,"focusSize": recommendStyle.focusSize,"clickColor": recommendStyle.clickColor,"clickSize": recommendStyle.clickSize });
        $("#recommendDetail").modal("hide");
    });

    // 挂件栏目推荐弹出框取消
    $("#publicDetail").on("click","#publicCancel,#publicClose",function(){
        $(".dragBox p").removeAttr("id");
        $(".speciesBox p").removeAttr("id");
        $(".speciesBox").removeAttr("data-id");
        $(".dragBox").removeAttr("data-id");
        $(".pendantChild").removeAttr("data-pendantId");
        // $(".dragBox").attr("ondblclick","dragBoxDouble()");
        // $(".speciesBox").attr("ondblclick","speciesBoxDouble()");
    });

    // 删除上传
    $(".deleteUpload").on("click",function(){
        $(this).next().remove();
        $(this).prev().find("input").val("");
    });

    // 添加菜单条目
    $(".newMenu").on("click",function(){
        $(".tableMenu").show();
        $(".tableMenu tbody").append(menuBox);
        $(".tableMenu tr:last-child .menuNewName").append($(".drag .newMenuLanguage").clone());
        $(".tableMenu .newMenuLanguage").show();
        $(".tableMenu tr:last-child .newMenuLanguage").find("input:first-child").show();
        $(".selectMenu").change(function(){
            var optionNum = $(this).children('option:selected').val();
            $(this).parent().find(".languageMenu input").hide();
            $(this).parent().find(".languageMenu input").eq(optionNum).show();
        });
        $(".tableMenu").on("click", ".menuDelete", function(){
            var _this = $(this);
            var dialog = $("#deleteCheck");
            dialog.modal("show");
            dialog.find("#deleteConfirm").unbind("click");
            dialog.find("#deleteConfirm").bind("click", function () {
                _this.parent().parent().remove();   // 推荐菜单
                //重置按钮状态，关闭提示框
                dialog.modal("hide");
            });
        });
    });
    // 表格行选中
    $(".tableMenu").on("click","tr",function(){
        if(!$(this).hasClass("on")){
            $("tbody tr").removeClass("on");
        };
        $(this).toggleClass("on");
    });
    // 编辑输入框阻止冒泡
    $(".tableMenu").on("click","input,.selectMenu",function(e){
        if(e && e.stopPropagation){//非IE
            e.stopPropagation();
        }else{//IE
            window.event.cancelBubble = true;
        };
    });

    // 保存
    $("#save").on("click", function() {
        saveSubmit();
        var sceneSaveVo = {
            appUI: category, //JSON.stringify(category)
        };
        // 提交
        $.ajax({
            url: base+"/op/ui/scene/addScene?sceneId=" + currentId,
            type : "POST",
            dataType : "JSON",
            contentType: "application/json;charset=UTF-8",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(sceneSaveVo),
            success: function (data) {
                if (data.success) {
                    alert(data.message);
                    window.parent.location.href = "/#/sceneManage/sceneManage?tenantId=" + tenantId + "&sceneName=" + sceneName;
                } else {
                    alert(data.message);
                }
            }
        });
    });
    // 返回
    $("#goBack").on("click", function() {
        window.parent.location.href = "/#/sceneManage/sceneManage?tenantId=" + tenantId + "&sceneName=" + sceneName;
    });
});

// 保存数据
function saveSubmit(){
    // 栏目和推荐位的遍历
    // 栏目滚动条还原
    var columnScroll =  $(".columnBox").parent();
    columnScroll.animate({ 'scrollTop':0, 'scrollLeft':0 },0);
    var columnList = $(".columnBox").parent().find("p.handle");
    var columuSet = [];
    for(var i = 0; i < columnList.length; i++){
        var columuLi = columnList.eq(i).parent();
        // 推荐位循环
        var recomNum = columnList.eq(i).parent().attr("id");  // 找到与栏目相匹配的推荐面板  data-num
        $(".drag").find("."+recomNum).css({"display":"block","opacity":"1"});
        // 推荐位滚动条还原
        var recomScroll =  $(".drag").find("."+recomNum);
        recomScroll.animate({ 'scrollTop':0, 'scrollLeft':0 },0);
        var recomList = $(".drag").find("."+recomNum).find(".childBox");
        var recomSet = [];
        for(var e = 0; e < recomList.length; e++){
            if(recomList.eq(e).hasClass("dragBox")){
                var recomBoxList = recomList.eq(e).find(".pendantChild");
                var recomBoxTotal = [];
                for(var r = 0; r < recomBoxList.length; r++){
                    var recomBoxSet = {
                        "id": recomBoxList.eq(r).attr("id") || uuid(),
                        "text": "", // 天气
                        "isAuthorize": "0", //容器是否向下授权1是 0否
                        "style": {
                            "width": parseInt(recomBoxList.eq(r).width()),          //宽
                            "height": parseInt(recomBoxList.eq(r).height()),         //高
                            "parentLeft": recomBoxList.eq(r).css("left").split("px")[0],     //相对父窗口位置
                            "parentTop": recomBoxList.eq(r).css("top").split("px")[0],       //相对父窗口位置
                            "fontColor": recomBoxList.eq(r).css("color"),  //文字颜色
                            "fontSize": recomBoxList.eq(r).css("font-size"),   //字体大小
                            "icon": recomBoxList.eq(r).attr("iconStatic"),   //图标图片
                            "iconPosition": recomBoxList.eq(r).attr("iconStaticPosition"), //图标位置
                            "iconWidth": recomBoxList.eq(r).attr("iconStaticWidth"), //图标宽
                            "iconHeight": recomBoxList.eq(r).attr("iconStaticHeight"), //图标高
                            "iconSpacing": recomBoxList.eq(r).attr("iconStaticSpacing") //图标间距
                        },
                        "pendantType": recomBoxList.eq(r).attr("type"),//挂件类型 time、weather
                        "uiClassID": "PendantUI" //挂件控件
                    };
                    recomBoxTotal.push(recomBoxSet);
                };
                // 推荐位内挂件面板
                var recomBox = {
                    "id": recomList.eq(e).attr("id") || uuid(),
                    "text": "", // 挂件
                    "isAuthorize": "0", //容器是否向下授权1是 0否
                    "style": {
                        "width": parseInt(recomList.eq(e).width()),          //宽
                        "height": parseInt(recomList.eq(e).height()),         //高
                        "parentLeft": recomList.eq(e).css("left").split("px")[0],     //相对父窗口位置
                        "parentTop": recomList.eq(e).css("top").split("px")[0],       //相对父窗口位置
                        "fontColor": recomList.eq(e).css("color"),  //文字颜色
                        "fontSize": recomList.eq(e).css("font-size"),   //字体大小
                        "backGroupColor":  recomList.eq(e).css("background-color"), //背景颜色
                        "backGroupImage": recomList.eq(e).attr("backGroupImage")    //背景图片
                    },
                    "subContainer": recomBoxTotal,
                    "uiClassID": "PanelUI" //面板控件
                };
                recomSet.push(recomBox);
            }else{
                // 推荐位
                var recomDiv = {
                    "name": recomList.eq(e).attr("nameList") == null ? null : JSON.parse(recomList.eq(e).attr("nameList")),
                    "id": recomList.eq(e).attr("id") || uuid(),
                    "text": "", // 推荐位
                    "isAuthorize": recomList.eq(e).attr("authority") || "0", //容器是否向下授权1是 0否
                    "defaultOpen": recomList.eq(e).attr("defaultOpen") || "0", //是否默认打开1是 0否
                    "magnification": recomList.eq(e).attr("largeMultiple"), //放大
                    "corner": recomList.eq(e).attr("corner"),
                    "index": recomList.eq(e).attr("index"),
                    "alias": recomList.eq(e).attr("alias"),
                    "style":{
                        "width": parseInt(recomList.eq(e).width())+2,          //宽
                        "height": parseInt(recomList.eq(e).height())+2,        //高
                        "parentLeft": recomList.eq(e).css("left").split("px")[0],     //相对父窗口位置
                        "parentTop": recomList.eq(e).css("top").split("px")[0],       //相对父窗口位置
                        "fontSize": recomList.eq(e).css("font-size"),   //字体大小
                        "fontColor":  recomList.eq(e).css("color"),  //文字颜色
                        "backGroupColor": recomList.eq(e).css("background-color"), //背景颜色
                        "backGroupImage": recomList.eq(e).attr("backGroupImage")  //背景图片
                    },
                    "onfocusStyle":{
                        "fontSize": recomList.eq(e).attr("focusSize") || "",   //字体大小
                        "fontColor":  recomList.eq(e).attr("focusColor") || "",  //文字颜色
                        "backGroupColor":  recomList.eq(e).attr("focusBG") || "", //背景颜色
                        "backGroupImage":  recomList.eq(e).attr("focusBGImg") || "" //背景图片
                    },
                    "onclickStyle":{
                        "fontSize": recomList.eq(e).attr("clickSize") || "",   //字体大小
                        "fontColor":  recomList.eq(e).attr("clickColor") || "",  //文字颜色
                        "backGroupColor":  recomList.eq(e).attr("clickBG") || "", //背景颜色
                        "backGroupImage":  recomList.eq(e).attr("clickBGImg") || "" //背景图片
                    },
                    "sceneEvents": [ //动作
                        {
                            "eventType": "onclick",  //事件类型
                            "sceneAction": "WINDOW", // 场景动作 IAMGE,APP,LAUNCHER,HTML,WINDOW,URL,CONTAINER
                            "beforeEvent": null, //事件触发前事件
                            "afterEvent": null,  //事件触发后事件
                            "rule":  recomList.eq(e).attr("rule") == "null" ? recomList.eq(e).attr("ruleVal") : recomList.eq(e).attr("rule") || "",		//源Id  ---跳转类型id
                            // "modelName": recomList.eq(e).attr("ruleVal"),    //源类型  article,adv,media,video，imageList   跳转类型input的val
                            "eventID": recomList.eq(e).attr("ruleVal") == undefined ? "": recomList.eq(e).attr("ruleVal")+"Event" //ArticleEvent,AdvEvent,mediaEvent,videoEvent，ImageListEvent  跳转类型input的val +Event
                        },{
                            "eventType": "onfocus",  //事件类型 onclick/onfocus
                            "sceneAction": "WINDOW", //场景动作  IAMGE,APP,LAUNCHER,HTML,WINDOW,URL,CONTAINER
                            "beforeEvent": null, //事件触发前事件
                            "afterEvent": null,  //事件触发后事件
                            "rule": recomList.eq(e).attr("ruleFocus"),		//源Id  ---跳转类型id
                            "eventID": recomList.eq(e).attr("ruleValFocus") == undefined ? "": recomList.eq(e).attr("ruleValFocus")+"Event" //ArticleEvent,AdvEvent,mediaEvent,videoEvent，ImageListEvent  跳转类型input的val +Event
                            // "modelName": "Container"  //容器
                        }
                    ],
                    "uiClassID": (columuLi.attr("ruleVal") == "Menu" || columuLi.attr("ruleValFocus") == "Menu") ? "MenuItemUI" : "RecommendedUI" //  推荐位：   菜单：MenuUI
                };
                recomSet.push(recomDiv);
            }
        };
        // 栏目循环
        // var columuLi = columnList.eq(i).parent();
        var navList = {
            "name": columuLi.attr("nameList") == null ? null : JSON.parse(columuLi.attr("nameList")),
            "id": columuLi.attr("id") || uuid(),
            "text": "", // 栏目
            "isAuthorize": columuLi.attr("authority") || "0", //容器是否向下授权0是（默认） 1否
            "magnification": columuLi.attr("largeMultiple"), //放大
            "corner": columuLi.attr("corner"), // 标签
            "index": columuLi.attr("index"), // 索引
            "alias": columuLi.attr("alias"), // 别名
            "getFocus": columuLi.attr("getFocus"), // 允许获得焦点  0否  1是（默认）
            "style": {
                "width": parseInt(columuLi.width()),          //宽
                "height": parseInt(columuLi.height()),        //高
                "parentLeft": columuLi.css("left").split("px")[0],     //相对父窗口位置+117
                "parentTop": columuLi.css("top").split("px")[0],     //相对父窗口位置+15
                "fontSize": columuLi.css("font-size"),   //字体大小
                "fontColor": columuLi.css("color"),  //文字颜色
                "backGroupColor": columuLi.css("background-color"), //背景颜色
                "backGroupImage": columuLi.attr("backGroupImage"), //背景图片
                "icon": columuLi.attr("iconStatic"), //图标图片
                "iconPosition": columuLi.attr("iconStaticPosition"), //图标位置
                "iconWidth": columuLi.attr("iconStaticWidth"), //图标宽
                "iconHeight": columuLi.attr("iconStaticHeight"), //图标高
                "iconSpacing": columuLi.attr("iconStaticSpacing") //图标间距
            },
            "onfocusStyle":{
                "fontSize": columuLi.attr("focusSize"),   //字体大小
                "fontColor":  columuLi.attr("focusColor"),  //文字颜色
                "backGroupColor":  columuLi.attr("focusBG"), //背景颜色
                "backGroupImage":  columuLi.attr("focusBGImg"), //背景图片
                "icon": columuLi.attr("iconFocus"), //图标图片
                "iconPosition": columuLi.attr("iconFocusPosition"), //图标位置
                "iconWidth": columuLi.attr("iconFocusWidth"), //图标宽
                "iconHeight": columuLi.attr("iconFocusHeight"), //图标高
                "iconSpacing": columuLi.attr("iconFocusSpacing") //图标间距
            },
            "onclickStyle":{
                "fontSize": columuLi.attr("clickSize"),   //字体大小
                "fontColor":  columuLi.attr("clickColor"),  //文字颜色
                "backGroupColor":  columuLi.attr("clickBG"), //背景颜色
                "backGroupImage":  columuLi.attr("clickBGImg"), //背景图片
                "icon": columuLi.attr("iconClick"), //图标图片
                "iconPosition": columuLi.attr("iconClickPosition"), //图标位置
                "iconWidth": columuLi.attr("iconClickWidth"), //图标宽
                "iconHeight": columuLi.attr("iconClickHeight"), //图标高
                "iconSpacing": columuLi.attr("iconClickSpacing") //图标间距
            },
            "sceneEvents": [ //动作
                {
                    "eventType": "onclick",  //事件类型 onclick/onfocus
                    "sceneAction": columuLi.attr("rule") == "null" ? "CONTAINER" : "WINDOW", //场景动作  容器：CONTAINER   其他：WINDOW
                    "beforeEvent": null, //事件触发前事件
                    "afterEvent": null,  //事件触发后事件
                    "rule": columuLi.attr("rule") == "null"? { //容器 ===  推荐位
                        // "name": null,
                        "id": $(".drag").find("."+recomNum).attr("id") || uuid(),
                        "text": "", // 容器集合
                        "itemSpacing": $(".drag").find("."+recomNum).find(".menuBox").length > 0
                                       ? ($(".drag").find("."+recomNum).find(".menuBox").css("margin-bottom")).split("px")[0]
                                       : "",  // 条目间距
                        "focusChange": $(".drag").find("."+recomNum).attr("focusChange") || "1", //容器是否支持遥控器左右换屏
                        "style": {
                            "width": parseInt($(".drag").find("."+recomNum).width()),          //宽
                            "height": parseInt($(".drag").find("."+recomNum).height()),        //高
                            "parentLeft": $(".drag").find("."+recomNum).css("left").split("px")[0],     //相对父窗口位置
                            "parentTop": $(".drag").find("."+recomNum).css("top").split("px")[0],       //相对父窗口位置
                            "fontColor":  $(".drag").find("."+recomNum).css("color"),  //文字颜色
                            "fontSize": $(".drag").find("."+recomNum).css("font-size"),   //字体大小
                            "backGroupColor": $(".drag").find("."+recomNum).css("background-color"), //背景颜色
                            "backGroupImage": $(".drag").find("."+recomNum).attr("backGroupImage")    //背景图片
                        },
                        "sceneEvents": [ // 动作 ：内容展示容器
                            {
                                "eventType": "onclick",  //事件类型
                                "sceneAction": "WINDOW", // 场景动作 IAMGE,APP,LAUNCHER,HTML,WINDOW,URL,CONTAINER
                                "beforeEvent": null, //事件触发前事件
                                "afterEvent": null,  //事件触发后事件
                                "rule": $(".drag").find("."+recomNum).attr("rule") || "",  //源Id  ---跳转类型id
                                "eventID": $(".drag").find("."+recomNum).attr("ruleVal") == undefined ? "": $(".drag").find("."+recomNum).attr("ruleVal")+"Event" //ArticleEvent,AdvEvent,mediaEvent,videoEvent，ImageListEvent  跳转类型input的val +Event
                            }
                        ],
                        "subContainer": recomSet,
                                  // $(".drag").find("."+recomNum).attr("type") == "MenuItemUI" ? "MenuUI": ($(".drag").find("."+recomNum).attr("type") == "RecommendedUI"?"PanelUI":$(".drag").find("."+recomNum).attr("type"))
                        "uiClassID": $(".drag").find("."+recomNum).attr("type") == "RecommendedUI"?"PanelUI":$(".drag").find("."+recomNum).attr("type")
                    } : columuLi.attr("rule"),		//源Id  ---跳转类型id
                    "eventID": columuLi.attr("ruleVal") == undefined ? "": columuLi.attr("ruleVal")+"Event" //ArticleEvent,AdvEvent,mediaEvent,videoEvent，ImageListEvent  跳转类型input的val +Event
                    // "modelName": "Container"  //容器
                },{
                    "eventType": "onfocus",  //事件类型 onclick/onfocus
                    "sceneAction": "WINDOW", //场景动作  容器：CONTAINER   其他：WINDOW
                    "beforeEvent": null, //事件触发前事件
                    "afterEvent": null,  //事件触发后事件
                    // "rule": columuLi.attr("ruleFocus"),		//源Id  ---跳转类型id
                    "rule": columuLi.attr("ruleFocus") == "null"? { //容器 ===  推荐位
                        // "name": null,
                        "id": $(".drag").find("."+recomNum).attr("id") || uuid(),
                        "text": "", // 容器集合
                        "itemSpacing": $(".drag").find("."+recomNum).find(".menuBox").length > 0
                            ? ($(".drag").find("."+recomNum).find(".menuBox").css("margin-bottom")).split("px")[0]
                            : "",  // 条目间距
                        "focusChange": $(".drag").find("."+recomNum).attr("focusChange") || "1", //容器是否支持遥控器左右换屏
                        "style": {
                            "width": parseInt($(".drag").find("."+recomNum).width()),          //宽
                            "height": parseInt($(".drag").find("."+recomNum).height()),        //高
                            "parentLeft": $(".drag").find("."+recomNum).css("left").split("px")[0],     //相对父窗口位置
                            "parentTop": $(".drag").find("."+recomNum).css("top").split("px")[0],       //相对父窗口位置
                            "fontColor":  $(".drag").find("."+recomNum).css("color"),  //文字颜色
                            "fontSize": $(".drag").find("."+recomNum).css("font-size"),   //字体大小
                            "backGroupColor": $(".drag").find("."+recomNum).css("background-color"), //背景颜色
                            "backGroupImage": $(".drag").find("."+recomNum).attr("backGroupImage")    //背景图片
                        },
                        "sceneEvents": [ // 动作 ：内容展示容器
                            {
                                "eventType": "onclick",  //事件类型
                                "sceneAction": "WINDOW", // 场景动作 IAMGE,APP,LAUNCHER,HTML,WINDOW,URL,CONTAINER
                                "beforeEvent": null, //事件触发前事件
                                "afterEvent": null,  //事件触发后事件
                                "rule": $(".drag").find("."+recomNum).attr("rule") || "",  //源Id  ---跳转类型id
                                "eventID": $(".drag").find("."+recomNum).attr("ruleVal") == undefined ? "": $(".drag").find("."+recomNum).attr("ruleVal")+"Event" //ArticleEvent,AdvEvent,mediaEvent,videoEvent，ImageListEvent  跳转类型input的val +Event
                            }
                        ],
                        "subContainer": recomSet,
                        // $(".drag").find("."+recomNum).attr("type") == "MenuItemUI" ? "MenuUI": ($(".drag").find("."+recomNum).attr("type") == "RecommendedUI"?"PanelUI":$(".drag").find("."+recomNum).attr("type"))
                        "uiClassID": $(".drag").find("."+recomNum).attr("type") == "RecommendedUI"?"PanelUI":$(".drag").find("."+recomNum).attr("type")
                    } : columuLi.attr("ruleFocus"),		//源Id  ---跳转类型id
                    "eventID": columuLi.attr("ruleValFocus") == undefined ? "": columuLi.attr("ruleValFocus")+"Event" //ArticleEvent,AdvEvent,mediaEvent,videoEvent，ImageListEvent  跳转类型input的val +Event
                    // "modelName": "Container"  //容器
                }
            ],
            "uiClassID": "ColumnUI"  //导航控件
        };
        columuSet.push(navList);
    };
    $(".drag .speciesBox").css({"display":"none","opacity":"1"});
    $(".drag").find("."+$(".columnBox.addColumnTo").attr("id")).css({"display":"block","opacity":"1"});
    // 挂件
    var pendantList = $(".drag>.dragBox").find(".pendantChild");
    var pendantTotal = [];
    for(var p = 0; p < pendantList.length; p++){
        var pendantSet = {
            "id": pendantList.eq(p).attr("id") || uuid(),
            "text": "", // 天气
            "isAuthorize": "0", //容器是否向下授权1是 0否
            "style": {
                "width": parseInt(pendantList.eq(p).width()),          //宽
                "height": parseInt(pendantList.eq(p).height()),         //高
                "parentLeft": pendantList.eq(p).css("left").split("px")[0],     //相对父窗口位置
                "parentTop": pendantList.eq(p).css("top").split("px")[0],       //相对父窗口位置
                "fontColor": $("#sceneBasicInfoId").val() == "152D6TD1tH980NW6MbE" || $("#sceneBasicInfoId").val() == "S6bs2zXmaLQopyi4GSi" ? "" : pendantList.eq(p).css("color"),  //文字颜色
                "fontSize": pendantList.eq(p).css("font-size"),   //字体大小
                "icon": pendantList.eq(p).attr("iconStatic"),   //图标图片
                "iconPosition": pendantList.eq(p).attr("iconStaticPosition"), //图标位置
                "iconWidth": pendantList.eq(p).attr("iconStaticWidth"), //图标宽
                "iconHeight": pendantList.eq(p).attr("iconStaticHeight"), //图标高
                "iconSpacing": pendantList.eq(p).attr("iconStaticSpacing") //图标间距
            },
            "pendantType": pendantList.eq(p).attr("type"),//挂件类型 time、weather
            "uiClassID": "PendantUI" //挂件控件
        };
        pendantTotal.push(pendantSet);
    };
    // 面板
    var subContainer = [
        // 挂件面板
        pendantList.parent().length > 0 ? { // "name": "dragging", pendantList.parent()
            "id": pendantList.parent().attr("id") || uuid(),
            "text": "", // 挂件
            "isAuthorize": "0", //容器是否向下授权1是 0否
            "style": {
                "width": parseInt(pendantList.parent().width()),          //宽
                "height": parseInt(pendantList.parent().height()),         //高
                "parentLeft": pendantList.parent().css("left").split("px")[0],     //相对父窗口位置
                "parentTop": pendantList.parent().css("top").split("px")[0],       //相对父窗口位置
                "backGroupColor":  pendantList.parent().css("background-color"), //背景颜色
                "backGroupImage": pendantList.parent().attr("backGroupImage")    //背景图片
            },
            "subContainer": pendantTotal,
            "uiClassID": "PanelUI" //面板控件
        } : "",
        $(".columnBox").length > 0 ? { //导航面板  // "name": "fullSlide",
            "id": $(".columnBox").parent().attr("id") || uuid(),
            "text": "", // 导航
            "isAuthorize": "0", //容器是否向下授权1是 0否
            "style":  {
                "width": parseInt($(".columnBox").parent().width()),          //宽
                "height": parseInt($(".columnBox").parent().height()),         //高
                "parentLeft": $(".columnBox").parent().length > 0 ? $(".columnBox").parent().css("left").split("px")[0] : "",     //相对父窗口位置
                "parentTop": $(".columnBox").parent().length > 0 ? $(".columnBox").parent().css("top").split("px")[0] : "",        //相对父窗口位置
                "fontColor":  $(".columnBox").parent().css("color"),  //文字颜色
                "fontSize": $(".columnBox").parent().css("font-size"),   //字体大小
                "backGroupColor":  $(".columnBox").parent().css("background-color"), //背景颜色
                "backGroupImage": $(".columnBox").parent().attr("backGroupImage")    //背景图片
            },
            "subContainer":columuSet,
            "uiClassID": "PanelUI" //面板控件
        }: "",
    ];
    // 空面板集合
    var dragBoxList = $(".drag").find(".dragBox");
    for(var b = 0; b < dragBoxList.length; b++){
        if(dragBoxList.eq(b).children(".pendantChild").length < 1 && dragBoxList.eq(b).children(".columnBox").length < 1 && dragBoxList.eq(b).parent().hasClass("drag")){
            // $("."+dragBoxList.eq(b).attr("id")).css({"display":"block","opacity":"1"});
            var dragBoxDiv = {
                "name": dragBoxList.eq(b).attr("nameList") == null ? null : JSON.parse(dragBoxList.eq(b).attr("nameList")),
                "id":  dragBoxList.eq(b).attr("id") || uuid(),
                "text": "", // 导航
                "isAuthorize": "0", //容器是否向下授权1是 0否
                // "roll": dragBoxList.eq(b).attr("roll"),
                "style": {
                    "width": parseInt(dragBoxList.eq(b).width()),          //宽
                    "height": parseInt(dragBoxList.eq(b).height()),         //高
                    "parentLeft": dragBoxList.eq(b).css("left").split("px")[0],     //相对父窗口位置
                    "parentTop":  dragBoxList.eq(b).css("top").split("px")[0],        //相对父窗口位置
                    "fontColor":   dragBoxList.eq(b).css("color"),  //文字颜色
                    "fontSize":  dragBoxList.eq(b).css("font-size"),   //字体大小
                    "backGroupColor":  dragBoxList.eq(b).css("background-color"), //背景颜色
                    "backGroupImage":  dragBoxList.eq(b).attr("backGroupImage") || ""    //背景图片
                },
                "onfocusStyle":{
                    "backGroupColor":  dragBoxList.eq(b).attr("focusBG"), //背景颜色
                    "backGroupImage":  dragBoxList.eq(b).attr("focusBGImg"), //背景图片
                },
                "subContainer": [],
                "uiClassID":  dragBoxList.eq(b).attr("type")  //面板控件
            };
            // pms专用属性
            if(dragBoxList.eq(b).attr("type") == "PmsUI"){
                dragBoxDiv.roll = dragBoxList.eq(b).attr("roll");
            }
            // wifi专用属性
            if(dragBoxList.eq(b).attr("type") == "WifiUI"){
                dragBoxDiv.wifiStyle = dragBoxList.eq(b).attr("wifiStyle");
            }
            subContainer.push(dragBoxDiv);
        }
    };
    // 去掉subContainer中的“”
    for(var sl = 0; sl < subContainer.length; sl++){
        // console.log(subContainer[sl] == "")
        if(subContainer[sl] == ""){
            subContainer.splice(sl,1);
        }
        if(subContainer[0] == ""){
            subContainer.splice(0,1);
        }
    };
    category = {
        // 整体
        // "name": "drag", //容器名称
        "id": $(".drag").attr("id") || uuid(),
        "text": "", // 容器
        "isAuthorize":$(".drag").attr("authority") || "0", //容器是否向下授权   1是 ，0否
        "layout": $(".drag").attr("layout") || "horizontal",  // 布局
        "layoutStyle": $(".drag").attr("layoutStyle") || "delayering",  // 风格
        "style" : {
            "fontSize": $(".drag").css("font-size"),   //字体大小
            "fontFamily": $(".drag").css("font-family"), //字体样式
            "fontColor": $(".drag").css("color"),  //文字颜色
            "backGroupColor": $(".drag").css("background-color"), //背景颜色
            "backGroupImage": $(".drag").attr("backGroupImage"), //背景图片
            "width": parseInt($(".drag").width()),          //宽 $(".dragging").width()
            "height": parseInt($(".drag").height()),        //高
            "parentLeft": 0,     //相对父窗口位置
            "parentTop": 0       //相对父窗口位置
        },
        "subContainer": subContainer,
        // "bit" : bit, // 推荐位
        "uiClassID": "AppUI"
    };
}

// 面板保存填充
function previewSave(){
    // 语言名称
    var nameList = [];
    for(var i = 0; i < $("#accordionPanel .languageName div").length; i++){
        var name = {};
        name.key = $("#accordionPanel .languageName div").eq(i).find("input[type='hidden']").attr("id");
        name.value =  $("#accordionPanel .languageName div").eq(i).find("input[type='text']").val();
        nameList.push(name);
    }
    var nameMap = {};
    for(var s = 0; s < nameList.length; s++){
        nameMap[nameList[s].key] = nameList[s].value;
    };
    var previewBGUpload = $(".previewBGUpload").find("input[type='hidden']").val();
    var focusImage = $(".focusImage").find("input[type='hidden']").val();
    var backgImage = $(".backgImage").find("input[type='hidden']").val();
    var focusImage = $(".focusImage").find("input[type='hidden']").val();
    var clickImage = $(".clickImage").find("input[type='hidden']").val();
    // 面板
    $(".dragBox").each(function(){
        var dragBox = $(this);
        if(dragBox.attr('data-id') == 'boxId'){
            if(dragBox.attr("type") == "PmsUI" || dragBox.attr("type") == "AnnouncementUI"){
                dragBox.find("p").remove();
                dragBox.append("<p style='position: absolute;top: 0;'>"+$("#accordionPanel input#editName").val()+"</p>");
                // dragBox.find("button").text("×");
                dragBox.find("p").css("color",$("#previewColor").val()==""?"":"#"+$("#previewColor").val());
            };
            // 静态样式
            dragBox.css({"width": $("#previewW").val() == "" ? dragBox.css("width") : $("#previewW").val(),
                         "height": $("#previewH").val()== "" ? dragBox.css("height") : $("#previewH").val(),
                         "left": $("#previewX").val() == "" ? dragBox.css("left") : $("#previewX").val()+"px",
                         "top": $("#previewY").val() == "" ? dragBox.css("top") : $("#previewY").val()+"px",
                         "background-image":"url("+previewBGUpload+")","background-color": $("#previewBG").val()==""?"":"#"+$("#previewBG").val(),
                         "font-size":$("#previewSize").val(),"color": $("#previewColor").val()==""?"":"#"+$("#previewColor").val() });
            dragBox.attr({"backGroupImage": previewBGUpload,"focusBG": $("#focusBG").val(), "focusBGImg": focusImage,"nameList": JSON.stringify(nameMap) || null,"roll": $(".roll").find("input[name='roll']:checked").val(),"wifiStyle": $(".wifiStyle").find("input[name='wifiStyle']:checked").val()});
            dragBox.find("p").css({"font-size":"14px"});
            if(dragPreview == true){
                $("#publicDetail").modal("hide");
                $(".dragBox").removeAttr("data-id");
            }
        }
    });
    // 推荐位菜单内容展示容器面板
    $(".speciesBox").each(function(){
        var speciesBox = $(this);
        if(speciesBox.attr('data-id') == 'boxId'){
            // 静态样式
            speciesBox.css({"width": $("#previewW").val() == "" ? speciesBox.css("width") : $("#previewW").val(),
                            "height": $("#previewH").val()== "" ? speciesBox.css("height") : $("#previewH").val(),
                            "left": $("#previewX").val() == "" ? speciesBox.css("left") : $("#previewX").val()+"px",
                            "top": $("#previewY").val() == "" ? speciesBox.css("top") : $("#previewY").val()+"px",
                            "background-image":"url("+previewBGUpload+")","background-color": $("#previewBG").val()==""?"":"#"+$("#previewBG").val(),
                            "font-size":$("#previewSize").val(),"color": $("#previewColor").val()==""?"":"#"+$("#previewColor").val() });
            speciesBox.attr({"backGroupImage":previewBGUpload,"nameList":"{}","focusChange": $(".focusChange").find("input[name='focusChange']:checked").val(),
                             "rule":$(".selClick").attr("rule"),"ruleVal":$(".selClick").attr("ruleVal")});
            // 菜单
            if(speciesBox.attr("type") == "MenuUI"){
                var trList = $(".tableMenu tbody").find("tr");
                speciesBox.find(".menuBox").remove();
                for(var i = 0; i < trList.length; i++){
                    // console.log(trList.eq(i).find(".newMenuLanguage input").length);
                    // 语言名称
                    var nameList = [];
                    var inputNumMenu = trList.eq(i).find(".newMenuLanguage input");
                    for(var n = 0; n < inputNumMenu.length; n++){
                        var name = {};
                        name.key = trList.eq(i).find(".newMenuLanguage option").eq(n).attr("id");
                        name.value =  trList.eq(i).find(".newMenuLanguage input").eq(n).val();
                        nameList.push(name);
                    }
                    var nameMap = {};
                    for(var s = 0; s < nameList.length; s++){
                        nameMap[nameList[s].key] = nameList[s].value;
                    };
                    var menuName;
                    for(var keys in nameMap){
                        if(keys == "zh-Hans"){
                            menuName = nameMap[keys];
                            break;
                        }else{
                            menuName = nameMap[keys];
                        }
                    };
                    var menuBG = $('#staticBG').val().split("rgb").length > 1 ? $('#staticBG').val() : "#"+ $('#staticBG').val();
                    var menuColor = $('#staticColor').val().split("rgb").length > 1 ? $('#staticColor').val() : "#"+ $('#staticColor').val();
                    var menuBoxList = "<div class='menuBox childBox' style='font-size:"+$('#staticSize').val()+";color:"+menuColor+";background-color:"+menuBG+";background-image:url("+backgImage+");width: "+(parseInt($('#menuW').val())+2)+"px;height: "+(parseInt($('#menuH').val())+2)+"px;margin-bottom: "+$('#itemSpacing').val()+"px;' " +
                                     "authorityMenu='"+$('.authorityMenu').find("input[type='radio']:checked").val()+"' index='"+trList.eq(i).find('.menuNewIndex input').val()+"' alias='"+trList.eq(i).find('.alias input').val()+"' backGroupImage='"+backgImage+"' " +
                                     "focusBG='"+$("#focusBG").val()+"' focusColor='"+$("#focusColor").val()+"' focusBGImg='"+focusImage+"' focusSize='"+$("#focusSize").val()+"' " +
                                     "clickBG='"+$("#clickBG").val()+"' clickColor='"+$("#clickColor").val()+"' clickBGImg='"+clickImage+"' clickSize='"+$("#clickSize").val()+"' " +
                                     "rule='"+trList.eq(i).find('.menuNewRule').attr("rule")+"' ruleVal='"+trList.eq(i).find('.menuNewRule').attr("ruleVal")+"' nameList='"+JSON.stringify(nameMap)+"' >" +
                                        "<button type='button' class='close closeEdit'>×</button>" +
                                        "<p class='' ondblclick='speciesBoxDouble()' style='line-height:"+(parseInt($('#menuH').val())+2)+"px;'>"+menuName+"</p>" +
                                     "</div>";
                    speciesBox.append(menuBoxList);
                    menuName = "";
                }
            };
            if(dragPreview == true && modalStatic == true && modalFocus == true && modalClick == true){
                $("#publicDetail").modal("hide");
                $(".speciesBox").removeAttr("data-id");
            };
        }
    })
}

// 挂件栏目推荐保存填充
function editSave(){
    // if( $(".selectNum").find(".optionSel").length > 0 ){
    //     chks = $("#columnId").parent().attr("rule");
    // }
    // 语言名称
    var nameList = [];
    for(var i = 0; i < $("#accordion .languageName div").length; i++){
        var name = {};
        name.key = $("#accordion .languageName div").eq(i).find("input[type='hidden']").attr("id");
        name.value =  $("#accordion .languageName div").eq(i).find("input[type='text']").val();
        nameList.push(name);
    }
    var nameMap = {};
    for(var s = 0; s < nameList.length; s++){
        nameMap[nameList[s].key] = nameList[s].value;
    }
    // console.log(nameMap);

    var iconStatic = $(".iconStatic").find("input[type='hidden']").val();
    var iconFocus = $(".iconFocus").find("input[type='hidden']").val();
    var iconClick = $(".iconClick").find("input[type='hidden']").val();
    var backgImage = $(".backgImage").find("input[type='hidden']").val();
    var focusImage = $(".focusImage").find("input[type='hidden']").val();
    var clickImage = $(".clickImage").find("input[type='hidden']").val();
    //  栏目
    $(".dragBox p").each(function(){
        var columnCur = $(this);
        if(columnCur.attr('id') == 'columnId'){
            // 保存前ruleVal
            var beforeRuleVal = columnCur.parent().attr("rule") == "null"? columnCur.parent().attr("ruleVal"):columnCur.parent().attr("ruleValFocus");
            // 基本信息
            columnCur.text($("#accordion input#editName").val());
            columnCur.parent().attr({"id": columnCur.parent().attr("id") == null? uuid():columnCur.parent().attr("id"),
                                     "nameList": JSON.stringify(nameMap) || null,"corner": $(".corner").find("option:selected").val(),
                                     "authority": $(".authority").find("input[type='radio']:checked").val(),"index": $("input#indexSort").val(),
                                     "alias": $("input#alias").val(),"largeMultiple":$("#largeMultiple").val(),
                                     "getFocus": $(".getFocus").find("input[type='radio']:checked").val()});
            // 图标
            columnCur.parent().append("");
            columnCur.parent().attr({"iconStatic": iconStatic,"iconStaticPosition": $(".iconStaticPosition").find("option:selected").val(),"iconStaticWidth":$("#iconStaticWidth").val(),"iconStaticHeight":$("#iconStaticHeight").val(),"iconStaticSpacing":$("#iconStaticSpacing").val(),
                                     "iconFocus": iconFocus,"iconFocusPosition": $(".iconFocusPosition").find("option:selected").val(),"iconFocusWidth":$("#iconFocusWidth").val(),"iconFocusHeight":$("#iconFocusHeight").val(),"iconFocusSpacing":$("#iconFocusSpacing").val(),
                                     "iconClick": iconClick,"iconClickPosition": $(".iconClickPosition").find("option:selected").val(),"iconClickWidth":$("#iconClickWidth").val(),"iconClickHeight":$("#iconClickHeight").val(),"iconClickSpacing":$("#iconClickSpacing").val()});
            // 静态样式
            columnCur.parent().css({"width": $("#editW").val() == "" ? columnCur.parent().css("width") : $("#editW").val(),
                                    "height": $("#editH").val() == "" ? columnCur.parent().css("height") : $("#editH").val(),
                                    "left": $("#positionX").val() == "" ? columnCur.parent().css("left") : $("#positionX").val()+"px",
                                    "top": $("#positionY").val() == "" ? columnCur.parent().css("top") : $("#positionY").val()+"px",
                                    "background-image":"url("+backgImage+")","background-color": $("#staticBG").val()==""?"":"#"+$("#staticBG").val(),
                                    "color": $("#staticColor").val() == "" ? "#fff": "#"+$("#staticColor").val(),"font-size": $("#staticSize").val() });
            columnCur.parent().attr({"backGroupImage":backgImage});
            columnCur.css({"font-size":"18px","color":"#fff"});
            // onfocusStyle 容器聚焦样式
            columnCur.parent().attr({"focusBGImg": focusImage,"focusBG": $("#focusBG").val(), "focusColor": $("#focusColor").val(), "focusSize": $("#focusSize").val() });
            // onclickStyle 容器点击样式
            columnCur.parent().attr({"clickBGImg": clickImage,"clickBG": $("#clickBG").val(), "clickColor": $("#clickColor").val(), "clickSize": $("#clickSize").val() });
            // 点击焦点事件
            columnCur.parent().attr({"rule":$(".selClick").attr("rule"),"ruleVal":$(".selClick").attr("ruleVal"),
                                     "ruleFocus":$(".selFocus").attr("rule"),"ruleValFocus":$(".selFocus").attr("ruleVal") }); //跳转类型id   //跳转类型input的val

            //  当选择的不是本容器时，清空相应内容
            if(columnCur.parent().attr("rule") == "null" || columnCur.parent().attr("ruleFocus") == "null"){
                // 保存后ruleVal
                var afterRuleVal = columnCur.parent().attr("rule") == "null"? columnCur.parent().attr("ruleVal"):columnCur.parent().attr("ruleValFocus");
                if(beforeRuleVal != afterRuleVal){
                    $(".drag").find("."+columnCur.parent().attr("id")).remove();
                    species(columnCur.parent().attr("id"),afterRuleVal);
                    $(".drag").append(speciesBox);
                    publicCutover();
                };
                //  没有对应的推荐或菜单
                // if($(".index"+indexNum).length < 1){
                //     species(indexNum,boxRuleVal);
                //     $(".drag").append(speciesBox);
                //     publicCutover();
                //     $(".drag").on("click",".speciesBox",function(){
                //         $(".drag").find(".speciesBox").removeClass("addSpeciesTo");
                //         $(this).addClass("addSpeciesTo");
                //     });
                // };
            };
            if(modalStatic == true && modalFocus == true && modalClick == true && staticIcon == true && fucosIcon == true && clickIcon == true){
                $("#publicDetail").modal("hide");
                $(".dragBox p").removeAttr("id");
                // $(".dragBox").attr("ondblclick","dragBoxDouble()");
            }
        }
    });
    // 推荐位
    $(".speciesBox p").each(function(){
        console.log($(".recommendBox").css("color"));
        var current = $(this);
        if(current.attr('id') == 'columnId'){
            // 基本信息
            current.text($("#accordion input#editName").val());
            current.parent().attr({"nameList": JSON.stringify(nameMap) || null,"corner": $(".corner").find("option:selected").val(),
                                   "authority": $(".authority").find("input[type='radio']:checked").val(),"index": $("input#indexSort").val(),
                                   "alias": $("input#alias").val(),"largeMultiple":$("#largeMultiple").val(),
                                   "defaultOpen": $(".defaultOpen").find("input[type='radio']:checked").val()});
            // 静态样式
            current.parent().css({"width": $("#editW").val() == "" ? current.parent().css("width") : parseInt($("#editW").val())+2,
                                  "height": $("#editH").val() == "" ? current.parent().css("height") : parseInt($("#editH").val())+2,
                                  "left": $("#positionX").val() == "" ? current.parent().css("left") : $("#positionX").val()+"px",
                                  "top": $("#positionY").val() == "" ? current.parent().css("top") : $("#positionY").val()+"px",
                                  "background-image":"url("+backgImage+")","background-color": $("#staticBG").val()==""?"":"#"+$("#staticBG").val(),
                                  "font-size": $(".recommendBox").css("font-size"), "color": $(".recommendBox").css("color") });
            current.parent().attr({"backGroupImage":backgImage });
            current.css({"font-size":"18px","color":"#fff"});
            if(current.parent().hasClass("menuBox")){
                current.css({"line-height": current.parent().height()+"px" });
            }else{
                current.css({"line-height": "" });
            };
            // onfocusStyle 容器聚焦样式
            current.parent().attr({"focusBGImg": focusImage,"focusBG": $("#focusBG").val() });
            // onclickStyle 容器点击样式
            current.parent().attr({"clickBGImg": clickImage,"clickBG": $("#clickBG").val() });
            // 点击焦点事件
            current.parent().attr({"rule":$(".selClick").attr("rule"),"ruleVal":$(".selClick").attr("ruleVal"),
                                   "ruleFocus":$(".selFocus").attr("rule"),"ruleValFocus":$(".selFocus").attr("ruleVal") });  //跳转类型id   //跳转类型input的val
            if(modalStatic == true && modalFocus == true && modalClick == true){
                $("#publicDetail").modal("hide");
                $(".speciesBox p").removeAttr("id");
                // $(".speciesBox").attr("ondblclick","speciesBoxDouble()");
            }
            // 推荐位置超出添加滚动
            // console.log(current.parent().position().top > current.parent().parent().height() - current.parent().height())
            // console.log(current.parent().position().left > current.parent().parent().width() - current.parent().width())
            // if(current.parent().position().top > current.parent().parent().height() - current.parent().height()
            //     || current.parent().position().left > current.parent().parent().width() - current.parent().width()){
            //     current.parent().parent().css("overflow","scroll");
            //     current.parent().find(".move").trigger("click");
            // }
        }
    });
    // 挂件
    $(".pendantChild").each(function(){
        var pendantSub = $(this);
        if(pendantSub.attr('data-pendantId') == 'pendantId'){
            // 静态样式
            pendantSub.css({"width": $("#editW").val() == "" ? pendantSub.css("width") : $("#editW").val(),
                "height": $("#editH").val() == "" ? pendantSub.css("height") : $("#editH").val(),
                "left": $("#positionX").val() == "" ? pendantSub.css("left") : $("#positionX").val()+"px",
                "top": $("#positionY").val() == "" ? pendantSub.css("top") : $("#positionY").val()+"px",
                "color": $("#staticColor").val() == "" ? "#fff": "#"+$("#staticColor").val(),
                "font-size": $("#staticSize").val()});
            pendantSub.find("p").css({"font-size":"14px"});
            // 图标
            pendantSub.attr({"iconStatic": iconStatic,"iconStaticPosition": $(".iconStaticPosition").find("option:selected").val(),"iconStaticWidth":$("#iconStaticWidth").val(),"iconStaticHeight":$("#iconStaticHeight").val(),"iconStaticSpacing":$("#iconStaticSpacing").val()});
            if(iconStatic != ""){
                pendantSub.find("img").remove();
                var iconPosition = pendantSub.attr("iconStaticPosition");
                var positionSel;
                switch (iconPosition) {
                    case "top":
                        pendantSub.find("p").css({"top":parseInt(pendantSub.attr("iconStaticHeight"))+parseInt(pendantSub.attr("iconStaticSpacing"))+"px","bottom":"auto","left":"50%","right":"auto","margin-left":"-"+parseInt(pendantSub.find("p").css("width"))/2+"px"});
                        positionSel = "top: 0;left: 50%;margin-left: -"+parseInt(pendantSub.attr("iconStaticWidth"))/2+"px;";
                        break;
                    case "bottom":
                        pendantSub.find("p").css({"top":"auto","bottom":parseInt(pendantSub.attr("iconStaticHeight"))+parseInt(pendantSub.attr("iconStaticSpacing"))+"px","left":"50%","right":"auto","margin-left":"-"+parseInt(pendantSub.find("p").css("width"))/2+"px"});
                        positionSel = "bottom: 0;left: 50%;margin-left: -"+parseInt(pendantSub.attr("iconStaticWidth"))/2+"px;";
                        break;
                    case "left":
                        pendantSub.find("p").css({"top":"0","bottom":"auto","left":parseInt(pendantSub.attr("iconStaticWidth"))+parseInt(pendantSub.attr("iconStaticSpacing"))+"px","right":"auto","margin-left":"0"});
                        positionSel = "top: 50%;left: 0;margin-top: -"+parseInt(pendantSub.attr("iconStaticHeight"))/2+"px;";
                        break;
                    case "right":
                        pendantSub.find("p").css({"top":"0","bottom":"auto","left":"auto","right":parseInt(pendantSub.attr("iconStaticWidth"))+parseInt(pendantSub.attr("iconStaticSpacing"))+"px","margin-left":"0"});
                        positionSel = "top: 50%;right: 0;margin-top: -"+parseInt(pendantSub.attr("iconStaticHeight"))/2+"px;";
                        break;
                };
                pendantSub.append("<img src='"+iconStatic+"' style='width:"+pendantSub.attr("iconStaticWidth")+"px;height:"+pendantSub.attr("iconStaticHeight")+"px;"+positionSel+"' />");
            }else{
                pendantSub.find("img").remove();
                pendantSub.find("p").css({"width":"100%","top":"0","left":"0"});
            };
            if(modalStatic == true && staticIcon == true){
                $("#publicDetail").modal("hide");
                $(".pendantChild").removeAttr("data-pendantId");
                // $(".dragBox").attr("ondblclick","dragBoxDouble()");
            }
        }
    });
}


// 获取URL中参数
// 参数 name 链接中的参数名称
// 返回 参数值
function getQueryString(name) {
  console.log(window.location);
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var queryStr = decodeURI(window.location.search.substr(1));
  var matchStr = queryStr.match(reg);
  if (matchStr != null) {
    return (matchStr[2]);
  }
  return null;
}
