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
var currentId = window.location.search.split("=");
$.post(base+"/op/ui/content/echo", {id: currentId[currentId.length-1]}, function (data) {
    var data = data.data;
    setTimeout(function(){
        dataEcho(JSON.parse(data));
    },1000);
});

// 复制
function textCopy(){
    var Url2 = document.getElementById("contents");
    Url2.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    Toast.success("已复制好，可贴粘。");
}

function dataEcho(data){
    console.log(data);
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
            "background-color": dragStyle.backGroupColor == undefined ? "" : "#"+JSON.parse(dragStyle.backGroupColor)[0].color,
            "background-image": dragStyle.backGroupImage == undefined ? "" : "url("+JSON.parse(dragStyle.backGroupImage)[0].src+")"
        });
        $(".drag").attr({"id":data.id,"backGroupColor": dragStyle.backGroupColor,"backGroupImage": dragStyle.backGroupImage,"isAuthorize":data.isAuthorize,"layout":data.layout,"layoutStyle":data.layoutStyle});
        var subContainer = data.subContainer;
        for(var s = 0; s < subContainer.length; s++){
            // console.log(subContainer[s]);
            var dragBoxStyle = subContainer[s].style;
            var dragBoxFocus = subContainer[s].onfocusStyle; // 聚焦
            var name;
            switch (subContainer[s].uiClassID) {
                case "pms":
                    name = "PMS信息"
                    break;
                case "multiLanguage":
                    name = "多语言"
                    break;
                case "time":
                    name = "时间"
                    break;
                case "weather":
                    name = "天气"
                    break;
                case "date":
                    name = "日期"
                    break;
                case "area":
                    name = "地区"
                    break;
            };
            if(subContainer[s].uiClassID == "pms"){ //  || subContainer[s].uiClassID =="multiLanguage"
                $(".drag").append("<div class='dragBox' id='"+subContainer[s].id+"' ondblclick='dragBoxDouble()' type='"+subContainer[s].uiClassID+"' backGroupImage='"+dragBoxStyle.backGroupImage+"' roll='"+subContainer[s].roll+"' content='"+JSON.stringify(subContainer[s].content)+"' " +
                    "style='font-size:"+dragBoxStyle.fontSize+";color:"+dragBoxStyle.fontColor+";background-color:"+dragBoxStyle.backGroupColor+";background-image:url("+ dragBoxStyle.backGroupImage+");width:" + dragBoxStyle.width + "px;height:" + dragBoxStyle.height + "px;left:"+dragBoxStyle.parentLeft+"px;top:"+dragBoxStyle.parentTop+"px;'>" +
                    "<div class='downBtn'></div>" +
                    "<div class='centerRightBtn'></div>" +
                    "<div class='downRightBtn'></div>" +
                    "<div type='button' class='move'></div>" +
                    "<button type='button' class='close closeEdit'>"+name+"×</button>" +
                    "</div>");
            }else{
                $(".drag").append("<div class='pendantChild' id='"+subContainer[s].id+"' ondblclick='pendantDouble()' type='"+subContainer[s].uiClassID+"' radius='"+subContainer[s].radius+"' " +
                    "style='width:" + dragBoxStyle.width + "px;height:" + dragBoxStyle.height + "px;left:"+dragBoxStyle.parentLeft+"px;top:"+dragBoxStyle.parentTop+"px;color:"+dragBoxStyle.fontColor+";font-size:"+dragBoxStyle.fontSize+"; background-color:"+dragBoxStyle.backGroupColor+";background-image:url("+ dragBoxStyle.backGroupImage+");' " +
                    "iconStatic='"+dragBoxStyle.icon+"' iconStaticPosition='"+dragBoxStyle.iconPosition+"' iconStaticWidth='"+(dragBoxStyle.iconWidth==null?"18":dragBoxStyle.iconWidth)+"' iconStaticHeight='"+(dragBoxStyle.iconHeight==null?"18":dragBoxStyle.iconHeight)+"' iconStaticSpacing='"+(dragBoxStyle.iconSpacing==null?"7":dragBoxStyle.iconSpacing)+"' " +
                    "backGroupImage='"+dragBoxStyle.backGroupImage+"' leftImage='"+subContainer[s].leftImage+"' rightImage='"+subContainer[s].rightImage+"' num='"+subContainer[s].num+"' formate='"+JSON.stringify(subContainer[s].formate)+"' " +
                    "focusBG='"+dragBoxFocus.backGroupColor+"' focusColor='"+dragBoxFocus.fontColor+"' focusBGImg='"+dragBoxFocus.backGroupImage+"' focusSize='"+dragBoxFocus.fontSize+"'> " +
                    "<div class='downBtn'></div>" +
                    "<div class='centerRightBtn'></div>" +
                    "<div class='downRightBtn'></div>" +
                    "<div type='button' class='move'></div>" +
                    "<button type='button' class='close' style='right: -55px;'>"+name+"×</button>" +
                    "</div>");
                if(dragBoxStyle.icon != "" && dragBoxStyle.icon != undefined && dragBoxStyle.icon != "undefined"){
                    var iconPosition = dragBoxStyle.iconPosition;
                    var positionSel;
                    switch (iconPosition) {
                        case "top":
                            positionSel = "top: 0;left: 50%;margin-left: -"+parseInt(dragBoxStyle.iconWidth)/2+"px;";
                            break;
                        case "bottom":
                            positionSel = "bottom: 0;left: 50%;margin-left: -"+parseInt(dragBoxStyle.iconWidth)/2+"px;";
                            break;
                        case "left":
                            positionSel = "top: 50%;left: 0;margin-top: -"+parseInt(dragBoxStyle.iconHeight)/2+"px;";
                            break;
                        case "right":
                            positionSel = "top: 50%;right: 0;margin-top: -"+parseInt(dragBoxStyle.iconHeight)/2+"px;";
                            break;
                    };
                    $(".drag").find(".pendantChild:last-child").append("<img src='"+dragBoxStyle.icon+"' style='width:"+dragBoxStyle.iconWidth+"px;height:"+dragBoxStyle.iconHeight+"px;"+positionSel+"' />");
                }
            }
        };
        publicCutover();
    }
}


