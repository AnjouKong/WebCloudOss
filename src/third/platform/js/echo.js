//  页面回显
var base = "";
$(function(){
    //监听粘贴事件
    $('#contents').bind('paste',function(e){
        var pastedText = undefined;
        if (window.clipboardData && window.clipboardData.getData) { // IE
            pastedText = window.clipboardData.getData('Text');
        } else {
            pastedText = e.originalEvent.clipboardData.getData('Text');//e.clipboardData.getData('text/plain');
        }
        $("#contents").text(pastedText);

    });
    // 数据文本
    $("#dataText").on("click", function(){
        saveSubmit();
        var dataTextSave = {
            appUI: category
        };
        $("#contents").text(JSON.stringify(dataTextSave, null, 4))
    });
    $("#textSave").on("click",function(){
        // var textData = dataTextSave.appUI;
        var dataTextCopy = eval("(" + $("#contents").text() + ")");
        var textData = dataTextCopy.appUI;
        $(".move").parent().remove();
        dataEcho(textData);
        $("#textDetail").modal("hide");
    });
});
// var currentId = window.location.search.split("=");
$.post(base+"/op/ui/scene/content", {sceneId: currentId}, function (data) {
    var data = data.data;
    setTimeout(function(){
        dataEcho(data);
    },1000);
});

// 复制
function textCopy(){
    var Url2 = document.getElementById("contents");
    Url2.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    alert("已复制好，可贴粘。");
}

function dataEcho(data){
    // console.log(data)
    if(data != null){
        var dragStyle = data.style; // 容器drag的样式
        $(".drag").css({
            "height":dragStyle.height,
            "width":dragStyle.width,
            "top":"0",
            "left":"0",
            "font-size":dragStyle.fontSize,
            "font-family":dragStyle.fontFamily,
            "color":dragStyle.fontColor,
            "background-color":dragStyle.backGroupColor,
            "background-image":"url("+dragStyle.backGroupImage+")"
        });
        $(".drag").attr({"id":data.id,"backGroupImage":dragStyle.backGroupImage,"isAuthorize":data.isAuthorize,"layout":data.layout,"layoutStyle":data.layoutStyle});
        var subContainer = data.subContainer;
        for(var s = 0; s < subContainer.length; s++){
            // console.log(subContainer[s].subContainer == "");
            var dragBoxStyle = subContainer[s].style; // 挂件父级dragging的样式
            //  多语言name 对象
            var dragBoxNames = subContainer[s].name;
            var disDragBoxName;
            for(var keyd in dragBoxNames){
                if(keyd == "zh-Hans"){
                    disDragBoxName = dragBoxNames[keyd];
                    break;
                }else{
                    disDragBoxName = dragBoxNames[keyd];
                }
            };
            if(subContainer[s].onfocusStyle == null){
                $(".drag").append("<div class='dragBox addDragTo' id='"+subContainer[s].id+"' ondblclick='dragBoxDouble()' type='"+subContainer[s].uiClassID+"' backGroupImage='"+dragBoxStyle.backGroupImage+"' nameList='"+JSON.stringify(dragBoxNames)+"' roll='"+subContainer[s].roll+"' " +
                    "style='font-size:"+dragBoxStyle.fontSize+";color:"+dragBoxStyle.fontColor+";background-color:"+dragBoxStyle.backGroupColor+";background-image:url("+ dragBoxStyle.backGroupImage+");width:" + dragBoxStyle.width + "px;height:" + dragBoxStyle.height + "px;left:"+dragBoxStyle.parentLeft+"px;top:"+dragBoxStyle.parentTop+"px;'>" +
                    "<div class='downBtn'></div>" +
                    "<div class='centerRightBtn'></div>" +
                    "<div class='downRightBtn'></div>" +
                    "<div type='button' class='move'></div>" +
                    "<button type='button' class='close closeEdit'>×面板</button>" +
                    // "<p style='position: absolute;top: 0;'>"+(disDragBoxName==null?"":disDragBoxName) +"</p>" +
                    "</div>");
            }else{
                var dragBoxFocus = subContainer[s].onfocusStyle; // 聚焦
                $(".drag").append("<div class='dragBox addDragTo' id='"+subContainer[s].id+"' ondblclick='dragBoxDouble()' type='"+subContainer[s].uiClassID+"' backGroupImage='"+dragBoxStyle.backGroupImage+"' nameList='"+JSON.stringify(dragBoxNames)+"' wifiStyle='"+subContainer[s].wifiStyle+"' roll='"+subContainer[s].roll+"' " +
                    "style='font-size:"+dragBoxStyle.fontSize+";color:"+dragBoxStyle.fontColor+";background-color:"+dragBoxStyle.backGroupColor+";background-image:url("+ dragBoxStyle.backGroupImage+");width:" + dragBoxStyle.width + "px;height:" + dragBoxStyle.height + "px;left:"+dragBoxStyle.parentLeft+"px;top:"+dragBoxStyle.parentTop+"px;'" +
                    "focusBG='"+dragBoxFocus.backGroupColor+"' focusBGImg='"+dragBoxFocus.backGroupImage+"' >" +
                    "<div class='downBtn'></div>" +
                    "<div class='centerRightBtn'></div>" +
                    "<div class='downRightBtn'></div>" +
                    "<div type='button' class='move'></div>" +
                    "<button type='button' class='close closeEdit'>×面板</button>" +
                    // "<p style='position: absolute;top: 0;'>"+(disDragBoxName==null?"":disDragBoxName) +"</p>" +
                    "</div>");
            }

            if(disDragBoxName!=null && $(".dragBox.addDragTo").attr("type") != "PanelUI" ){
                $("#"+subContainer[s].id).append("<p>"+disDragBoxName+"</p>");
                // $(".dragBox.addDragTo>button").text("×");
                $(".dragBox.addDragTo>p").css({"color":dragBoxStyle.fontColor,"position":"absolute","top":"0","font-size":"14px"});
            }
            if(subContainer[s].subContainer != ""){
                // console.log(subContainer[s].subContainer[0])
                if(subContainer[s].subContainer[0].uiClassID == "PendantUI"){  //挂件
                    // console.log("这个是挂件");
                    var dragSub = subContainer[s].subContainer;
                    for(var d = 0; d < dragSub.length; d++){
                        var dragSubStyle = dragSub[d].style;
                        $(".dragBox.addDragTo").append("<div id='"+dragSub[d].id+"' ondblclick='pendantDouble()' type='"+dragSub[d].pendantType+"' class='pendantChild' " +
                            "style='width:" + dragSubStyle.width + "px;height:" + dragSubStyle.height + "px;left:"+dragSubStyle.parentLeft+"px;top:"+dragSubStyle.parentTop+"px;color:"+dragSubStyle.fontColor+";font-size:"+dragSubStyle.fontSize+";' " +
                            "iconStatic='"+dragSubStyle.icon+"' iconStaticPosition='"+dragSubStyle.iconPosition+"' iconStaticWidth='"+(dragSubStyle.iconWidth==null?"18":dragSubStyle.iconWidth)+"' iconStaticHeight='"+(dragSubStyle.iconHeight==null?"18":dragSubStyle.iconHeight)+"' iconStaticSpacing='"+(dragSubStyle.iconSpacing==null?"7":dragSubStyle.iconSpacing)+"'> " +
                            "<div class='downBtn'></div>" +
                            "<div class='centerRightBtn'></div>" +
                            "<div class='downRightBtn'></div>" +
                            "<button type='button' class='close'>×</button>" +
                            "<div type='button' class='move'></div>" +
                            "<p style='font-size:14px;'>"+dragSub[d].pendantType+"</p>" +
                            "</div>");
                        if(dragSubStyle.icon != ""){
                            var iconPosition = dragSubStyle.iconPosition;
                            var positionSel;
                            switch (iconPosition) {
                                case "top":
                                    $(".dragBox.addDragTo").find(".pendantChild:last-child p").css({"top":parseInt(dragSubStyle.iconHeight)+parseInt(dragSubStyle.iconSpacing)+"px","bottom":"auto","left":"50%","right":"auto","margin-left":"-"+parseInt($(".dragBox.addDragTo").find(".pendantChild:last-child p").css("width"))/2+"px"});
                                    // $(".dragBox.addDragTo").find(".pendantChild:last-child img").css({"top":"0","left":"50%","margin-left":"-"+parseInt(dragSubStyle.iconWidth)/2+"px"});
                                    positionSel = "top: 0;left: 50%;margin-left: -"+parseInt(dragSubStyle.iconWidth)/2+"px;";
                                    break;
                                case "bottom":
                                    $(".dragBox.addDragTo").find(".pendantChild:last-child p").css({"top":"auto","bottom":parseInt(dragSubStyle.iconHeight)+parseInt(dragSubStyle.iconSpacing)+"px","left":"50%","right":"auto","margin-left":"-"+parseInt($(".dragBox.addDragTo").find(".pendantChild:last-child p").css("width"))/2+"px"});
                                    positionSel = "bottom: 0;left: 50%;margin-left: -"+parseInt(dragSubStyle.iconWidth)/2+"px;";
                                    break;
                                case "left":
                                    $(".dragBox.addDragTo").find(".pendantChild:last-child p").css({"top":"0","bottom":"auto","left":parseInt(dragSubStyle.iconWidth)+parseInt(dragSubStyle.iconSpacing)+"px","right":"auto","margin-left":"0"});
                                    positionSel = "top: 50%;left: 0;margin-top: -"+parseInt(dragSubStyle.iconHeight)/2+"px;";
                                    break;
                                case "right":
                                    $(".dragBox.addDragTo").find(".pendantChild:last-child p").css({"top":"0","bottom":"auto","left":"auto","right":parseInt(dragSubStyle.iconWidth)+parseInt(dragSubStyle.iconSpacing)+"px","margin-left":"0"});
                                    positionSel = "top: 50%;right: 0;margin-top: -"+parseInt(dragSubStyle.iconHeight)/2+"px;";
                                    break;
                            };
                            if(dragSubStyle.icon != "null"){
                                $(".dragBox.addDragTo").find(".pendantChild:last-child").append("<img src='"+dragSubStyle.icon+"' style='width:"+dragSubStyle.iconWidth+"px;height:"+dragSubStyle.iconHeight+"px;"+positionSel+"' />");
                            }
                        }else{
                            $(".dragBox.addDragTo").find(".pendantChild:last-child p").css({"width":"100%","top":"0","left":"0"});
                        };
                        // if(dragSub[d].pendantType == "weather"){
                        //     // $(".dragging .weather").css({"height":dragSubStyle.height,"width":dragSubStyle.width,"top":dragSubStyle.parentTop+"px","left":dragSubStyle.parentLeft+"px","display":"block" });
                        //     // $(".dragging .weather").attr("id",dragSub[d].id);
                        //     $(".dragBox.addDragTo").append("<div id='"+dragSub[d].id+"' ondblclick='pendantDouble()' type='time' class='pendantChild time' style='width:" + dragSubStyle.width + "px;height:" + dragSubStyle.height + "px;left:"+dragSubStyle.parentLeft+"px;top:"+dragSubStyle.parentTop+"px;'>" +
                        //         "<div class='downBtn'></div>" +
                        //         "<div class='centerRightBtn'></div>" +
                        //         "<div class='downRightBtn'></div>" +
                        //         "<div type='button' class='move'>时间</div>" +
                        //         "<button type='button' class='close'>×</button>" +
                        //         "</div>");
                        //
                        // };
                    };
                    $(".drag").find(".dragBox").removeClass("addDragTo");
                }else if(subContainer[s].subContainer[0].uiClassID == "ColumnUI"){
                    // console.log("这个是导航");
                    var fullSub = subContainer[s].subContainer;
                    for(var f = 0; f < fullSub.length; f++){
                        var columnStyle = fullSub[f].style; // 挂件父级hdDown li的样式
                        var columnFocus = fullSub[f].onfocusStyle; // 聚焦
                        var columnClick = fullSub[f].onclickStyle; // 点击
                        //  多语言name 对象
                        var fullName = fullSub[f].name;
                        var disName;
                        for(var key in fullName){
                            if(key == "zh-Hans"){
                                disName = fullName[key];
                                break;
                            }else{
                                disName = fullName[key];
                            }
                        };
                        // console.log(fullSub[f].sceneEvents);
                        if(fullSub[f].sceneEvents[0] && fullSub[f].sceneEvents[0].eventID != "undefinedEvent"){
                            // 栏目
                            $(".dragBox.addDragTo").append("<div class='columnBox' id='"+fullSub[f].id+"' style='font-size:"+columnStyle.fontSize+";color:"+columnStyle.fontColor+";background-color:"+columnStyle.backGroupColor+";background-image:url("+ columnStyle.backGroupImage+");width:"+columnStyle.width+"px;height:"+columnStyle.height+"px;top:"+columnStyle.parentTop+"px;left:"+columnStyle.parentLeft+"px;' " +
                                "authority='"+fullSub[f].isAuthorize+"' largeMultiple='"+fullSub[f].magnification+"' corner='"+fullSub[f].corner+"' index='"+fullSub[f].index+"' alias='"+fullSub[f].alias+"' backGroupImage='"+columnStyle.backGroupImage+"' nameList='"+JSON.stringify(fullName)+"' getFocus='"+fullSub[f].getFocus+"' " +
                                "focusBG='"+columnFocus.backGroupColor+"' focusColor='"+columnFocus.fontColor+"' focusBGImg='"+columnFocus.backGroupImage+"' focusSize='"+columnFocus.fontSize+"' " +
                                "clickBG='"+columnClick.backGroupColor+"' clickColor='"+columnClick.fontColor+"' clickBGImg='"+columnClick.backGroupImage+"' clickSize='"+columnClick.fontSize+"' " +
                                // "rule='"+columnRule+"' ruleVal='"+columnRuleVal+"' ruleFocus='"+columnRuleFocus+"' ruleValFocus='"+columnRuleValFocus+"' " +
                                "iconStatic='"+columnStyle.icon+"' iconStaticPosition='"+columnStyle.iconPosition+"' iconStaticWidth='"+(columnStyle.iconWidth=="null"?"18":columnStyle.iconWidth)+"' iconStaticHeight='"+(columnStyle.iconHeight=="null"?"18":columnStyle.iconHeight)+"' iconStaticSpacing='"+(columnStyle.iconSpacing=="null"?"7":columnStyle.iconSpacing)+"' " +
                                "iconFocus='"+columnFocus.icon+"' iconFocusPosition='"+columnFocus.iconPosition+"' iconFocusWidth='"+(columnFocus.iconWidth=="null"?"18":columnFocus.iconWidth)+"' iconFocusHeight='"+(columnFocus.iconHeight=="null"?"18":columnFocus.iconHeight)+"' iconFocusSpacing='"+(columnFocus.iconSpacing=="null"?"7":columnFocus.iconSpacing)+"' " +
                                "iconClick='"+columnClick.icon+"' iconClickPosition='"+columnClick.iconPosition+"' iconClickWidth='"+(columnClick.iconWidth=="null"?"18":columnClick.iconWidth)+"' iconClickHeight='"+(columnClick.iconHeight=="null"?"18":columnClick.iconHeight)+"' iconClickSpacing='"+(columnClick.iconSpacing=="null"?"7":columnClick.iconSpacing)+"' >" +
                                "   <div class='downBtn'></div>" +
                                "   <div class='centerRightBtn'></div>" +
                                "   <div class='downRightBtn'></div>" +
                                "   <button type='button' class='close closeEdit'>×</button>" +
                                "   <p class='handle move' ondblclick='columnDouble()'>"+disName+"</p>" +
                                "</div>");
                            // 栏目置超出添加滚动
                            if($("#"+fullSub[f].id).position().top > $(".dragBox.addDragTo").height() - $("#"+fullSub[f].id).height()
                                || $("#"+fullSub[f].id).position().left > $(".dragBox.addDragTo").width() - $("#"+fullSub[f].id).width()){
                                $("#"+fullSub[f].id).parent().css("overflow","scroll")
                            }
                            disName = "";
                            // 添加rule和ruleVal
                            var columnScene = fullSub[f].sceneEvents;
                            for(var c = 0; c < columnScene.length; c++){
                                if(columnScene[c].eventType == "onclick"){
                                    $("#"+fullSub[f].id).attr({"rule":(columnScene[c].rule) == undefined ?"": ((columnScene[c].rule.id) == undefined ? columnScene[c].rule : "null"),
                                                               "ruleVal":columnScene[c] == undefined ? "" : (columnScene[c].eventID).split("Event")[0]})
                                };
                                if(columnScene[c].eventType == "onfocus"){
                                    $("#"+fullSub[f].id).attr({"ruleFocus":(columnScene[c].rule) == undefined ?"":((columnScene[c].rule.id) == undefined ? columnScene[c].rule : "null"),
                                                               "ruleValFocus":columnScene[c] == undefined ? "" : (columnScene[c].eventID).split("Event")[0]})
                                };
                                // 栏目点击事件为容器
                                if(columnScene[c].rule && columnScene[c].rule.id){
                                    var sceneStyle = columnScene[c].rule.style; // 推荐位集合
                                    // 当前容器的类型
                                    $(".drag").append("<div class='speciesBox addSpeciesTo "+fullSub[f].id+"' ondblclick='speciesBoxDouble()' type='"+(($("#"+fullSub[f].id).attr("rule") == "null"? $("#"+fullSub[f].id).attr("ruleval"):$("#"+fullSub[f].id).attr("ruleValFocus"))+"UI")+"' id='"+columnScene[c].rule.id+"' backGroupImage='"+sceneStyle.backGroupImage+"' nameList='"+JSON.stringify(columnScene[c].rule.name)+"' " +
                                        "style='font-size:"+sceneStyle.fontSize+";color:"+sceneStyle.fontColor+";background-color:"+sceneStyle.backGroupColor+";background-image:url("+ sceneStyle.backGroupImage+");width:" + sceneStyle.width + "px;height:" + sceneStyle.height + "px;left:"+sceneStyle.parentLeft+"px;top:"+sceneStyle.parentTop+"px;' >" +
                                        "   <div class='downBtn'></div>" +
                                        "   <div class='centerRightBtn'></div>" +
                                        "   <div class='downRightBtn'></div>" +
                                        "   <div type='button' class='move' style='width: 100%;height: 100%;position: absolute;top: 0;'></div>" +
                                        "   <button type='button' class='close closeEdit' style='top:"+($("#"+fullSub[f].id).attr("ruleval")=="Menu"?"-20px":"0")+"'>×容器</button>" +
                                        "</div>");
                                    if($("#"+columnScene[c].rule.id).attr("type") == "ShowUI"){
                                        $("#"+columnScene[c].rule.id).attr({"rule":columnScene[c].rule.sceneEvents[0].rule,"ruleVal":(columnScene[c].rule.sceneEvents[0].eventID).split("Event")[0]})
                                    };
                                    // console.log(fullSub[f].sceneEvents)
                                    // 栏目下容器遍历
                                    var sceneList = columnScene[c].rule.subContainer;
                                    for(var e = 0; e < sceneList.length; e++){
                                        var sceneLiList = sceneList[e].style; // 静态
                                        var sceneFocus = sceneList[e].onfocusStyle; // 聚焦
                                        var sceneClick = sceneList[e].onclickStyle; // 点击

                                        //  多语言name 对象
                                        var sceneNames = sceneList[e].name;
                                        var disSceneName;
                                        for(var keys in sceneNames){
                                            if(keys == "zh-Hans"){
                                                disSceneName = sceneNames[keys];
                                                break;
                                            }else{
                                                disSceneName = sceneNames[keys];
                                            }
                                        };
                                        if(sceneList[e].uiClassID == "RecommendedUI"){    // 推荐位
                                            $(".speciesBox.addSpeciesTo").append(
                                                "<div class='recommendBox childBox' ondblclick='stopBubble()' id='"+sceneList[e].id+"' style='font-size:"+sceneLiList.fontSize+";color:"+sceneLiList.fontColor+";background-color:"+sceneLiList.backGroupColor+";background-image:url("+sceneLiList.backGroupImage+");width:"+sceneLiList.width+"px; height:"+sceneLiList.height+"px;left:"+sceneLiList.parentLeft+"px; top:"+sceneLiList.parentTop+"px;'" +
                                                "authority='"+sceneList[e].isAuthorize+"' largeMultiple='"+sceneList[e].magnification+"' index='"+sceneList[e].index+"' corner='"+sceneList[e].corner+"' defaultOpen='"+sceneList[e].defaultOpen+"' backGroupImage='"+sceneLiList.backGroupImage+"' " +
                                                "focusBG='"+sceneFocus.backGroupColor+"' focusColor='"+sceneFocus.fontColor+"' focusBGImg='"+sceneFocus.backGroupImage+"' focusSize='"+sceneFocus.fontSize+"' " +
                                                // "rule='"+sceneRule+"' ruleVal='"+sceneEventID+"' ruleFocus='"+sceneRuleFocus+"' ruleValFocus='"+sceneEventIDFocus+"' " +
                                                "clickBG='"+sceneClick.backGroupColor+"' clickColor='"+sceneClick.fontColor+"' clickBGImg='"+sceneClick.backGroupImage+"' clickSize='"+sceneClick.fontSize+"' nameList='"+JSON.stringify(sceneNames)+"' > "+
                                                "   <div class='downBtn'></div>" +
                                                "   <div class='centerRightBtn'></div>" +
                                                "   <div class='downRightBtn'></div>" +
                                                "   <button type='button' class='close closeEdit'>×</button>" +
                                                "   <div type='button' class='move'></div>" +
                                                "   <p class='childEdit' ondblclick='childDouble()'>"+disSceneName+"</p>" +
                                                "</div>");
                                            // 推荐位置超出添加滚动
                                            // console.log($("#"+sceneList[e].id).position().left > $(".speciesBox.addSpeciesTo").width() - $("#"+sceneList[e].id).width())
                                            if($("#"+sceneList[e].id).position().top > $(".speciesBox.addSpeciesTo").height() - $("#"+sceneList[e].id).height()
                                                || $("#"+sceneList[e].id).position().left > $(".speciesBox.addSpeciesTo").width() - $("#"+sceneList[e].id).width()){
                                                $("#"+sceneList[e].id).parent().css("overflow","scroll")
                                            }
                                        }else if(sceneList[e].uiClassID == "MenuItemUI"){    // 菜单
                                            $(".speciesBox.addSpeciesTo").append(
                                                "<div class='menuBox childBox' id='"+sceneList[e].id+"' style='font-size:"+sceneLiList.fontSize+";color:"+sceneLiList.fontColor+";background-color:"+sceneLiList.backGroupColor+";background-image:url("+sceneLiList.backGroupImage+");width:"+sceneLiList.width+"px; height:"+sceneLiList.height+"px;margin-bottom:"+columnScene[c].rule.itemSpacing+"px;'" +   // left:"+sceneLiList.parentLeft+"px; top:"+sceneLiList.parentTop+"px;
                                                "authority='"+sceneList[e].isAuthorize+"' corner='"+sceneList[e].corner+"' backGroupImage='"+sceneLiList.backGroupImage+"' index='"+sceneList[e].index+"' alias='"+sceneList[e].alias+"' nameList='"+JSON.stringify(sceneNames)+"' " +
                                                "focusBG='"+sceneFocus.backGroupColor+"' focusColor='"+sceneFocus.fontColor+"' focusBGImg='"+sceneFocus.backGroupImage+"' focusSize='"+sceneFocus.fontSize+"' " +
                                                // "rule='"+sceneRule+"' ruleVal='"+sceneEventID+"' ruleFocus='"+sceneRuleFocus+"' ruleValFocus='"+sceneEventIDFocus+"' " +
                                                "clickBG='"+sceneClick.backGroupColor+"' clickColor='"+sceneClick.fontColor+"' clickBGImg='"+sceneClick.backGroupImage+"' clickSize='"+sceneClick.fontSize+"' >" +
                                                "   <button type='button' class='close closeEdit'>×</button>" +
                                                "   <p class='' ondblclick='speciesBoxDouble()' style='line-height:"+sceneLiList.height+"px;'>"+disSceneName+"</p>" +
                                                "</div>");
                                        }else if(sceneList[e].uiClassID == "PanelUI"){    // 面板
                                            $(".speciesBox.addSpeciesTo").append(
                                                "<div class='dragBox childBox addDragTo' id='"+sceneList[e].id+"' ondblclick='dragBoxDouble()' backGroupImage='"+sceneLiList.backGroupImage+"' nameList='{}' " +
                                                "style='font-size:"+sceneLiList.fontSize+";color:"+sceneLiList.fontColor+";background-color:"+sceneLiList.backGroupColor+";background-image:url("+ sceneLiList.backGroupImage+");width:" + sceneLiList.width + "px;height:" + sceneLiList.height + "px;left:"+sceneLiList.parentLeft+"px;top:"+sceneLiList.parentTop+"px;'>" +
                                                "   <div class='downBtn'></div>" +
                                                "   <div class='centerRightBtn'></div>" +
                                                "   <div class='downRightBtn'></div>" +
                                                "   <div type='button' class='move'></div>" +
                                                "   <button type='button' class='close closeEdit'>×面板</button>" +
                                                "</div>");
                                            var recomBox = sceneList[e].subContainer;
                                            for(var r= 0; r < recomBox.length; r++){
                                                var recomBoxStyle = recomBox[r].style;
                                                $(".speciesBox").find(".dragBox.addDragTo").append("<div id='"+recomBox[r].id+"' ondblclick='pendantDouble()' type='"+recomBox[r].pendantType+"' class='pendantChild' " +
                                                    "style='width:" + recomBoxStyle.width + "px;height:" + recomBoxStyle.height + "px;left:"+recomBoxStyle.parentLeft+"px;top:"+recomBoxStyle.parentTop+"px;color:"+recomBoxStyle.fontColor+";font-size:"+recomBoxStyle.fontSize+";' " +
                                                    "iconStatic='"+recomBoxStyle.icon+"' iconStaticPosition='"+recomBoxStyle.iconPosition+"' iconStaticWidth='"+(recomBoxStyle.iconWidth==null?"18":recomBoxStyle.iconWidth)+"' iconStaticHeight='"+(recomBoxStyle.iconHeight==null?"18":recomBoxStyle.iconHeight)+"' iconStaticSpacing='"+(recomBoxStyle.iconSpacing==null?"7":recomBoxStyle.iconSpacing)+"'> " +
                                                    "   <div class='downBtn'></div>" +
                                                    "   <div class='centerRightBtn'></div>" +
                                                    "   <div class='downRightBtn'></div>" +
                                                    "   <button type='button' class='close'>×</button>" +
                                                    "   <div type='button' class='move'></div>" +
                                                    "   <p style='font-size:14px;'>"+recomBox[r].pendantType+"</p>" +
                                                    "</div>");
                                                if(recomBoxStyle.icon != ""){
                                                    var iconPosition = recomBoxStyle.iconPosition;
                                                    var positionSel;
                                                    switch (iconPosition) {
                                                        case "top":
                                                            $(".dragBox.addDragTo").find(".pendantChild:last-child p").css({"width":"100%","top":parseInt(recomBoxStyle.iconHeight)+parseInt(recomBoxStyle.iconSpacing)+"px","left":"0"});
                                                            positionSel = "top: 0;left: 50%;margin-left: -"+parseInt(recomBoxStyle.iconWidth)/2+"px;";
                                                            break;
                                                        case "bottom":
                                                            $(".dragBox.addDragTo").find(".pendantChild:last-child p").css({"width":"100%","bottom":parseInt(recomBoxStyle.iconHeight)+parseInt(recomBoxStyle.iconSpacing)+"px","left":"0"});
                                                            positionSel = "bottom: 0;left: 50%;margin-left: -"+parseInt(recomBoxStyle.iconWidth)/2+"px;";
                                                            break;
                                                        case "left":
                                                            $(".dragBox.addDragTo").find(".pendantChild:last-child p").css({"top":"0","left":parseInt(recomBoxStyle.iconWidth)+parseInt(recomBoxStyle.iconSpacing)+"px","line-height":recomBoxStyle.height+"px"});
                                                            positionSel = "top: 50%;left: 0;margin-top: -"+parseInt(recomBoxStyle.iconHeight)/2+"px;";
                                                            break;
                                                        case "right":
                                                            $(".dragBox.addDragTo").find(".pendantChild:last-child p").css({"top":"0","right":parseInt(recomBoxStyle.iconWidth)+parseInt(recomBoxStyle.iconSpacing)+"px","line-height":recomBoxStyle.height+"px"});
                                                            positionSel = "top: 50%;right: 0;margin-top: -"+parseInt(recomBoxStyle.iconHeight)/2+"px;";
                                                            break;
                                                    };
                                                    if(recomBoxStyle.icon != "null"){
                                                        $(".dragBox.addDragTo").find(".pendantChild:last-child").append("<img src='"+recomBoxStyle.icon+"' style='width:"+recomBoxStyle.iconWidth+"px;height:"+recomBoxStyle.iconHeight+"px;"+positionSel+"' />");
                                                    }
                                                }else{
                                                    $(".dragBox.addDragTo").find(".pendantChild:last-child p").css({"width":"100%","top":"0","left":"0"});
                                                };
                                            };
                                            $(".speciesBox").find(".dragBox").removeClass("addDragTo");
                                        }
                                        disSceneName = "";
                                        // 添加rule和ruleVal
                                        if(sceneList[e].sceneEvents){
                                            var childScene = sceneList[e].sceneEvents;
                                            for(var cs = 0; cs < childScene.length; cs++){
                                                if(childScene[cs].eventType == "onclick"){
                                                    $("#"+sceneList[e].id).attr({"rule":childScene[cs] == undefined ? "":childScene[cs].rule,
                                                                                 "ruleVal":childScene[cs] == undefined ? "" : (childScene[cs].eventID).split("Event")[0]})
                                                };
                                                if(childScene[cs].eventType == "onfocus"){
                                                    $("#"+sceneList[e].id).attr({"ruleFocus":childScene[cs] == undefined ? "":childScene[cs].rule,
                                                                                 "ruleValFocus":childScene[cs] == undefined ? "" : (childScene[cs].eventID).split("Event")[0]})
                                                };
                                            }

                                        }
                                    }
                                    $(".drag").find(".speciesBox").removeClass("addSpeciesTo");
                                }
                            };
                        }else{
                            $(".dragBox.addDragTo").append("<div class='columnBox' id='"+fullSub[f].id+"' style='font-size:"+columnStyle.fontSize+";color:"+columnStyle.fontColor+";background-color:"+columnStyle.backGroupColor+";background-image:url("+ columnStyle.backGroupImage+");width:"+columnStyle.width+"px;height:"+columnStyle.height+"px;top:"+columnStyle.parentTop+"px;left:"+columnStyle.parentLeft+"px;' " +
                                "authority='"+fullSub[f].isAuthorize+"' corner='"+fullSub[f].corner+"' backGroupImage='"+columnStyle.backGroupImage+"' focusBG='"+columnFocus.backGroupColor+"' focusColor='"+columnFocus.fontColor+"' focusBGImg='"+columnFocus.backGroupImage+"' focusSize='"+columnFocus.fontSize+"' " +
                                "clickBG='"+columnClick.backGroupColor+"' clickColor='"+columnClick.fontColor+"' clickBGImg='"+columnClick.backGroupImage+"' clickSize='"+columnClick.fontSize+"' >" +
                                "<div class='downBtn'></div>" +
                                "<div class='centerRightBtn'></div>" +
                                "<div class='downRightBtn'></div>" +
                                "<button type='button' class='close closeEdit'>×</button>" +
                                "<p class='handle move' ondblclick='columnDouble()'>"+disName+"</p>" +
                                "</div>");
                            disName = "";
                        }
                        $(".speciesBox").hide();
                    };
                    $(".drag").find(".dragBox").removeClass("addDragTo");
                }
            }
        };
        publicCutover();
        $(".dragBox .columnBox").eq(0).trigger("click");
        // $(".speciesBox").hide();
        // $(".dragBox .columnBox").eq(0).addClass("addColumnTo");
        // $(".dragBox .columnBox").eq(0).parent().addClass("addDragTo");
        // $(".speciesBox."+$(".dragBox .columnBox").eq(0).attr("id")).addClass("addSpeciesTo").show();
    }
}


