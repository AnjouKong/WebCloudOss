
var chks,postType,ruleText;
// var gridster;
// var picId;
// var colPicId,focusPicId,clickPicId;
// 静态，焦点，点击，面板，图标静态，图标焦点，图标点击
var backgImage,focusImage,previewBGUpload,iconStatic,leftArrow,rightArrow;
// 栏目的index、自定义选择、保存json、
var indexNum,cusInput,category;
// 推荐位样式
var recommendStyle = {};
var modalStatic = true;
var modalFocus = true;
var modalClick = true;
var dragPreview = true;
var staticIcon = true;
var modalLeft = true;
var modalRight = true;
var fucosIcon = true;
var clickIcon = true;
var TimeFn = null;

// 栏目推荐modal重置
function modalReset(){
    $(".selectTab").hide();
    $("tbody tr").removeClass('selected');
    $("#staticBackgroundPicForm tr,#focusBackgroundPicForm tr,#clickBackgroundPicForm tr,#previewBackgroundPicForm tr").remove();
    // 挂件
    if( $("#accordionPanel").css("display") == "none"){
        var selIconStatic = $("div[data-pendantId='pendantId']").attr("iconStaticPosition") == null? "top":$("div[data-pendantId='pendantId']").attr("iconStaticPosition");
        $("#editW").val($("div[data-pendantId='pendantId']").width());
        $("#editH").val($("div[data-pendantId='pendantId']").height());
        $("#positionX").val($("div[data-pendantId='pendantId']").position().left);
        $("#positionY").val($("div[data-pendantId='pendantId']").position().top);
        $("#radius").val($("div[data-pendantId='pendantId']").attr("radius") || '0');
        $("#weatherNum").val($("div[data-pendantId='pendantId']").attr("num"));
        $("#staticBG").val($("div[data-pendantId='pendantId']").css("background-color"));
        $("#staticColor").val($("div[data-pendantId='pendantId']").css("color"));
        $("#staticSize").val($("div[data-pendantId='pendantId']").css("font-size"));
        $("#focusBG").val($("div[data-pendantId='pendantId']").attr("focusBG"));
        $("#focusColor").val($("div[data-pendantId='pendantId']").attr("focusColor"));
        $("#focusSize").val($("div[data-pendantId='pendantId']").attr("focusSize"));
        // 图标
        $(".iconStaticPosition").find("option[value='"+selIconStatic+"']").prop("selected", true);
        $("#iconStaticWidth").val($("div[data-pendantId='pendantId']").attr("iconStaticWidth")== null?"13":$("div[data-pendantId='pendantId']").attr("iconStaticWidth"));
        $("#iconStaticHeight").val($("div[data-pendantId='pendantId']").attr("iconStaticHeight")== null?"13":$("div[data-pendantId='pendantId']").attr("iconStaticHeight"));
        $("#iconStaticSpacing").val($("div[data-pendantId='pendantId']").attr("iconStaticSpacing")== null?"5":$("div[data-pendantId='pendantId']").attr("iconStaticSpacing"));
        // 图标静态
        publicUploadEcho("iconStatic", $("div[data-pendantId='pendantId']").attr("iconStatic"));
        // 左箭头图片
        publicUploadEcho("leftArrow", $("div[data-pendantId='pendantId']").attr("leftArrow"));
        // 右箭头图片
        publicUploadEcho("rightArrow", $("div[data-pendantId='pendantId']").attr("rightArrow"));
        // 静态
        publicUploadEcho("backgImage", $("div[data-pendantId='pendantId']").attr("backGroupImage"));
        // 聚焦
        publicUploadEcho("focusImage", $("div[data-pendantId='pendantId']").attr("focusBGImg"));
        // 多语言时间格式
        if($("div[data-pendantId='pendantId']").attr("formate") == "undefined" || $("div[data-pendantId='pendantId']").attr("formate") == undefined) return;
        var nameReset = JSON.parse($("div[data-pendantId='pendantId']").attr("formate"));
        var languageName = $(".timeFormat").find("input[type='hidden']");
        languageName.each(function(){
            for(var key in nameReset){
                if($(this).val() == key){
                    $(this).parent().find("input[type='text']").val(nameReset[key].formate);
                    $(this).parent().find("select option[value='"+nameReset[key].locale+"']").prop("selected", true);
                }
            }
        });
    };
    // 面板容器信息
    if($("#accordionPanel").css("display") == "block"){
        $(".setFocus").hide();
        var inpRoll = $("div[data-id='boxId'").attr("roll");
        $("#previewW").val($("div[data-id='boxId']").width());
        $("#previewH").val($("div[data-id='boxId']").height());
        $("#previewX").val($("div[data-id='boxId']").position().left);
        $("#previewY").val($("div[data-id='boxId']").position().top);
        $("#previewColor").val($("div[data-id='boxId']").css("color"));
        $("#previewSize").val($("div[data-id='boxId']").css("font-size"));
        if($("div[data-id='boxId']").attr("backGroupImage") == undefined ){
            $(".roll").find("input[value='0']").prop("checked", true);
            $(".focusChange").find("input[value='1']").prop("checked", true);
            $("#previewBG").val("");
        }else{
            $(".roll").find("input[value='"+inpRoll+"']").prop("checked", true);
            $("#previewBG").val($("div[data-id='boxId']").css("background-color"));
            // 多语言content
            var nameReset = JSON.parse($("div[data-id='boxId']").attr("content"));
            var languageName = $(".pmsContent").find("input[type='hidden']");
            languageName.each(function(){
                for(var key in nameReset){
                    if($(this).val() == key){
                        $(this).parent().find(".defaultContent").val(nameReset[key].defalutContent);
                        $(this).parent().find(".customContent").val(nameReset[key].content);
                    }
                }
            });
        }
        // 静态
        publicUploadEcho("backgImage", $("div[data-id='boxId']").attr("backGroupImage"));
        // 聚焦
        publicUploadEcho("focusImage", $("div[data-id='boxId']").attr("focusBGImg"));
        // 面板容器上传图片
        publicUploadEcho("previewBGUpload", $("div[data-id='boxId'").attr("backGroupImage"));
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
        $(".drag").find(".dragBox").removeClass("addDragTo");
        $(this).addClass("addDragTo");
        $(this).css("z-index","99");
        if($(this).find(".columnBox").length < 1 && !$(this).parent().hasClass("speciesBox")){
            $(".dragBox").find(".columnBox").removeClass("addColumnTo");
            $(".drag").find(".speciesBox").removeClass("addSpeciesTo");
            $(".drag").find(".speciesBox").hide();
        }
    });
};
// 上传图片
function publicUpload (){
    $("input[type='file']").on('change', function (e) {
        var _this = $(this);
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
                // console.log(_this.next().attr("type"));
                _this.next().val(data.data.url);
                _this.parent().parent().find("p").remove();
                _this.parent().parent().append('<p class="imgUpload col-xs-8">已上传：<a href="'+data.data.url+'" target="_blank">'+data.data.url+'</a></p>')
            }
        });
    });
}
// 编辑回显图片
function publicUploadEcho(name, nameUpload){
    if(nameUpload != undefined){
        $("."+name).parents(".form-group").find("p").remove();
        $("."+name).find("input[type='file']").val("");
        $("."+name).parents(".form-group").append('<p class="imgUpload col-xs-8">已上传：<a href="'+nameUpload+'" target="_blank">'+nameUpload+'</a></p>')
        $("."+name).find("input[type='hidden']").val(nameUpload);
    }else{
        $("."+name).parents(".form-group").find("p").remove();
        $("."+name).find("input").val("");
    }
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
    $("#accordionPanel,#accordionMenu,#newMenu,#accordionEvent,.pendantInfo,.radius,.leftImage,.rightImage,.weatherNum,.timeFormat").hide();
    $("#accordion,#accordionStyle,.iconEdit,.pendantInfoHide").show();
    $(".recomInfo,.columnInfo").hide();
    if($("div[data-pendantId='pendantId']").attr("type") == "weather"){
        $(".weatherNum").show();
    };
    if($("div[data-pendantId='pendantId']").attr("type") == "time"){
        $(".timeFormat").show();
    };
    if($("div[data-pendantId='pendantId']").attr("type") == "multiLanguage"){
        $("#accordionPanel,.timeFormat,.weatherNum,.iconEdit,.pendantInfoHide").hide();
        $("#accordion,#accordionStyle,.pendantFocusHide,.radius,.leftImage,.rightImage,.pendantInfo").show();
    };
    $("#publicDetail").modal("show");
    modalReset();
};
// 面板双击
function dragBoxDouble(){
    stopBubble();
    $(".dragBox.addDragTo").attr("data-id","boxId");
    $("#accordion,#accordionMenu,#accordionStyle").hide();
    $("#accordionPanel").show();
    $("#publicDetail").modal("show");
    modalReset();
};
//  添加挂件容器等
function panelType(type, name) {
    if(type == "multiLanguage"){
        var addType = $(".drag > div");
        for(var t = 0; t < addType.length; t++){
            if(addType.eq(t).attr("type") == type){
                alert("只能添加一个！");
                return;
            }
        }
    }

    var dragBox = (
        type == "pms"
        ?
        "<div class='dragBox' style='width: 150px;height: 75px;' ondblclick='dragBoxDouble()' type='"+type+"'>" +
        "<div class='downBtn'></div>" +
        "<div class='centerRightBtn'></div>" +
        "<div class='downRightBtn'></div>" +
        "<div type='button' class='move'></div>" +
        "<button type='button' class='close closeEdit'>"+name+"×</button>" +
        "</div>"
        :
        "<div class='pendantChild' style='width: 120px;height: 35px;' ondblclick='pendantDouble()' type='"+type+"'>" +
        "<div class='downBtn'></div>" +
        "<div class='centerRightBtn'></div>" +
        "<div class='downRightBtn'></div>" +
        "<div type='button' class='move'></div>" +
        "<button type='button' class='close closeEdit' style='right: -55px;'>"+name+"×</button>" +
        // "<button type='button' class='close'>×</button>" +
        // "<p>time</p>" +
        "</div>"
    );
    $(".drag").append(dragBox);
    publicCutover();
}
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

$(function(){
    business();
    publicUpload();
    var currentId = window.location.search.split("=");
    // 获取语言
    $.post(base+"/op/ui/content/langauge", {contentId: currentId[currentId.length-1]}, function (data) {
        var language = data.data;
        for(var g = 0; g < language.length; g++){
            $(".customLanguage").append('<input type="hidden" value="'+language[g].language+'" name="'+language[g].language+'">');
            $(".languageColor").append('<label class="col-xs-3 control-label">'+language[g].language+'背景：</label>' +
                '<div class="col-xs-8">' +
                    '<input type="text" name="'+language[g].language+'" id="overallBG'+g+'" data-parsley-required="true" class="form-control" placeholder="例如：#333">' +
                '</div>');
            $(".languagePic").append('<div class="form-group">' +
                '<label class="col-xs-3 control-label">'+language[g].language+'背景图片：</label>' +
                '<div class="col-xs-4 uploadImg" type="'+language[g].language+'">' +
                    '<input type="file" name="pic" accept="image/*" />' +
                    '<input type="hidden" name="picSrc" />' +
                '</div>' +
                '<button type="button" class="col-xs-3 deleteUpload" style="width: 120px;">删除图片</button>' +
                '</div>');
            $(".pmsContent").append('<label class="col-xs-3 control-label">'+language[g].language+'内容：</label>' +
                '<div class="col-xs-8">' +
                    '<textarea rows="1" class="form-control defaultContent" style="margin-bottom: 15px;" placeholder="默认内容"></textarea>' +
                    '<textarea rows="1" class="form-control customContent" placeholder="自定义内容"></textarea>' +
                    '<input type="hidden" value="'+language[g].language+'">' +
                '</div>');
            $(".timeFormat").append('<label class="col-xs-3 control-label">'+language[g].language+'显示格式：</label>' +
                '<div class="col-xs-8">' +
                    '<input type="hidden" value="'+language[g].language+'">' +
                    '<input type="text" class="form-control" placeholder="输入格式" style="width: 70%; display: inline-block">' +
                    '<a href="#" class="prompt" data-toggle="tooltip" ' +
                    'title="推荐格式：\nyyyy-MM-dd HH:mm:ss 2000-01-01 00:00:00\nyyyy年MM月dd 2000年01月01\nHH:mm:ss 00:00:00\nMMM d,yyyy 一月 1,2000">?</a>' +
                    '<select class="form-control" style="width: 20%; display: inline-block;">' +
                        '<option value="">默认</option>' +
                        '<option value="zh">中文</option>' +
                        '<option value="en">英文</option>' +
                    '</select>' +
                '</div>');
        };
        $(".languageColor input").focus(function(){
            console.log("222")
            $("#"+$(this).attr("id")).colpick({
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
        });
        $(".deleteUpload").on("click",function(){
            $(this).prev().find(".imgUpload").empty();
        });
        publicUpload();
    });
    // 颜色设定
    $('#overallColor,#staticBG,#staticColor,#focusBG,#focusColor,#previewBG,#previewColor').colpick({
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
    // 添加各部分挂件，业务容器
    $("#pms").on("click",function(){
        panelType("pms","PMS信息");
    });
    $("#multiLanguage").on("click",function(){
        console.log(window.document.body.height());
        return;
        panelType("multiLanguage","多语言");
    });
    $("#time").on("click",function(){
        panelType("time","时间");
    });
    $("#weather").on("click",function(){
        panelType("weather","天气");
    });
    $("#date").on("click",function(){
        panelType("date","日期");
    });
    $("#area").on("click",function(){
        panelType("area","地区");
    });
    // 整体编辑
    $("#overallEdit").on("click",function(){
        var dragAuth = $(".drag").attr("isAuthorize");
        var dragColor = $(".drag").attr("backGroupColor")=="undefined" || $(".drag").attr("backGroupColor")==undefined ? "" : JSON.parse($(".drag").attr("backGroupColor"));
        var dragPic = $(".drag").attr("backGroupImage")=="undefined" || $(".drag").attr("backGroupImage")==undefined ? "" :JSON.parse($(".drag").attr("backGroupImage"));
        $(".languagePic tr,.languagePic .imgUpload").remove();
        if(dragAuth == undefined){
            $("#overallFont,#overallColor").val("");
            $(".languageColor input").val("");
            $(".allAuthority").find("input[value='0']").prop("checked", true);
        }else{
            $("#overallFont").val($(".drag").css("font-size"));
            $("#overallColor").val($(".drag").css("color"));
            $(".allAuthority").find("input[value='"+dragAuth+"']").prop("checked", true);
        };
        for(var c = 0; c < dragColor.length; c++){
            var totalColor = $(".languageColor input");
            for(var a = 0; a < totalColor.length; a++){
                if(dragColor[c].language == totalColor.eq(a).attr("name")){
                    totalColor.eq(a).val(dragColor[c].color);
                }
            }
        }
        console.log(dragPic);
        for(var d = 0; d < dragPic.length; d++){
            var totalPic = $(".languagePic .uploadImg");
            for(var e = 0; e < totalPic.length; e++){
                console.log(totalPic[e]);
                if(dragPic[d].language == totalPic.eq(e).attr("type") && dragPic[d].src != undefined){
                    totalPic.eq(e).append(
                        '<p class="imgUpload">已上传：' +
                        '<a href="'+dragPic[d].src+'" title="'+dragPic[d].src+'" target="_blank">'+dragPic[d].src+'</a>' +
                        '</p>'
                    );
                }
            }
        }
    });
    // 整体编辑保存
    $("#overall").on("click",function(){
        var languageList = $(".customLanguage input");
        var languageColorData = [];
        var languagePicData = [];
        for(var l = 0; l < languageList.length; l++){
            var languageColorList = {
                language: languageList[l].name,
                color: $(".languageColor").find("input")[l].value,
            };
            languageColorData.push(languageColorList);
            var languagePicList = {
                language: languageList[l].name,
                src: $(".languagePic > div").eq(l).find("input[type='hidden']").val() || $(".languagePic > div").eq(l).find(".imgUpload a").attr("href"),
            };
            languagePicData.push(languagePicList);
        }
        $(".drag").css({"background-image":"url("+languagePicData[0].src+")","background-color": "#"+languageColorData[0].color,"font-size":$("#overallFont").val(),"color": $("#overallColor").val()==""?"":"#"+$("#overallColor").val()});
        $(".drag").attr({"backGroupColor": JSON.stringify(languageColorData), "backGroupImage": JSON.stringify(languagePicData)});
        $(".drag").attr({"authority":$(".allAuthority").find("input[type='radio']:checked").val(),
                         "layout": $(".switchType").find("input[name='switchType']:checked").val(),
                         "layoutStyle": $(".styleTypes").find("input[name='styleTypes']:checked").val() });  // 授权  布局  风格
        $("#overallDetail").modal("hide");
    });
    // modal编辑保存
    $("#publicDetail").on("click","#publicSave",function(){
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
            previewSave();
        }else{
            // 基本宽高判断
            if($("#editW").val() > $(".drag").width()){
                alert("基本宽度不能超出"+ $("#columnId").parent().parent().width());
                return;
            };
            if($("#editH").val() > $(".drag").height()){
                alert("容器高度不能超出"+ $(".drag").height());
                return;
            };
            editSave();
        }
    })
    // 挂件弹出框取消
    $("#publicDetail").on("click","#publicCancel,#publicClose",function(){
        $(".dragBox").removeAttr("data-id");
        $(".pendantChild").removeAttr("data-pendantId");
    });
    // 删除上传
    $(".deleteUpload").on("click",function(){
        $(this).prev().find(".imgUpload").empty();
    });

    // 保存
    $("#save").on("click", function() {
        saveSubmit();
        // 提交
        $.ajax({
            url: base+"/op/ui/content/json?id=" + currentId[currentId.length-1],
            type : "POST",
            dataType : "JSON",
            contentType: "application/json;charset=UTF-8",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(category),
            success: function (data) {
                if (data.success) {
                    alert(data.message);
                    window.parent.location.href = "/#/contentManage/customManage";
                } else {
                    alert(data.message);
                }
            }
        });
    });
    // 返回
    $("#goBack").on("click", function() {
        window.parent.location.href = "/#/contentManage/customManage";
    });
});

// 保存数据
function saveSubmit(){
    var subContainer = [];
    // 挂件
    var pendantList = $(".drag").find(".pendantChild");
    for(var p = 0; p < pendantList.length; p++){
        var pendantSet = {
            "id": pendantList.eq(p).attr("id") || uuid(),
            "style": {
                "width": pendantList.eq(p).width(),          //宽
                "height": pendantList.eq(p).height(),         //高
                "parentLeft": pendantList.eq(p).position().left,     //相对父窗口位置
                "parentTop": pendantList.eq(p).position().top,       //相对父窗口位置
                "fontColor": pendantList.eq(p).css("color"),  //文字颜色
                "fontSize": pendantList.eq(p).css("font-size"),   //字体大小
                "icon": pendantList.eq(p).attr("iconStatic"),   //图标图片
                "iconPosition": pendantList.eq(p).attr("iconStaticPosition"), //图标位置
                "iconWidth": pendantList.eq(p).attr("iconStaticWidth"), //图标宽
                "iconHeight": pendantList.eq(p).attr("iconStaticHeight"), //图标高
                "iconSpacing": pendantList.eq(p).attr("iconStaticSpacing"), //图标间距
                "backGroupColor":  pendantList.eq(p).css("background-color"), //背景颜色
                "backGroupImage":  pendantList.eq(p).attr("backGroupImage") || ""    //背景图片
            },
            "onfocusStyle":{
                "fontSize": pendantList.eq(p).attr("focusSize"),   //字体大小
                "fontColor":  pendantList.eq(p).attr("focusColor"),  //文字颜色
                "backGroupColor":  pendantList.eq(p).attr("focusBG"), //背景颜色
                "backGroupImage":  pendantList.eq(p).attr("focusBGImg"), //背景图片
            },
            "uiClassID": pendantList.eq(p).attr("type"),//挂件类型 time、weather
        };
        // time专用属性
        if(pendantList.eq(p).attr("type") == "time"){
            pendantSet.formate = pendantList.eq(p).attr("formate") == null ? null : JSON.parse(pendantList.eq(p).attr("formate"));
        }
        // weather专用属性
        if(pendantList.eq(p).attr("type") == "weather"){
            pendantSet.num = pendantList.eq(p).attr("num");
        }
        // multiLanguage专用属性
        if(pendantList.eq(p).attr("type") == "multiLanguage"){
            pendantSet.radius = pendantList.eq(p).attr("radius");
            pendantSet.leftImage = pendantList.eq(p).attr("leftImage");
            pendantSet.rightImage = pendantList.eq(p).attr("rightImage");
        }
        subContainer.push(pendantSet);
    };
    // pms  多语言
    var dragBoxList = $(".drag").find(".dragBox");
    for(var b = 0; b < dragBoxList.length; b++){
        var dragBoxDiv = {
            "id":  dragBoxList.eq(b).attr("id") || uuid(),
            "content": dragBoxList.eq(b).attr("content") == null ? null : JSON.parse(dragBoxList.eq(b).attr("content")),
            "style": {
                "width": dragBoxList.eq(b).width(),          //宽
                "height": dragBoxList.eq(b).height(),         //高
                "parentLeft": dragBoxList.eq(b).position().left,     //相对父窗口位置
                "parentTop":  dragBoxList.eq(b).position().top,        //相对父窗口位置
                "fontColor":   dragBoxList.eq(b).css("color"),  //文字颜色
                "fontSize":  dragBoxList.eq(b).css("font-size"),   //字体大小
                "backGroupColor":  dragBoxList.eq(b).css("background-color"), //背景颜色
                "backGroupImage":  dragBoxList.eq(b).attr("backGroupImage") || ""    //背景图片
            },
            "uiClassID":  dragBoxList.eq(b).attr("type")  //面板控件
        };
        // pms专用属性
        if(dragBoxList.eq(b).attr("type") == "pms"){
            dragBoxDiv.roll = dragBoxList.eq(b).attr("roll");
        }
        subContainer.push(dragBoxDiv);
    };
    category = {
        // 整体
        "id": $(".drag").attr("id") || uuid(),
        "text": "", // 容器
        "isAuthorize":$(".drag").attr("authority") || "0", //容器是否向下授权   1是 ，0否
        "layout": $(".drag").attr("layout") || "horizontal",  // 布局
        "layoutStyle": $(".drag").attr("layoutStyle") || "delayering",  // 风格
        "style" : {
            "fontSize": $(".drag").css("font-size"),   //字体大小
            "fontFamily": $(".drag").css("font-family"), //字体样式
            "fontColor": $(".drag").css("color"),  //文字颜色
            "backGroupColor": $(".drag").attr("backGroupColor"), //背景颜色
            "backGroupImage": $(".drag").attr("backGroupImage"), //背景图片
            "width": $(".drag").width(),          //宽 $(".dragging").width()
            "height": $(".drag").height(),        //高
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
    // pms内容
    var pmsList = [];
    for(var i = 0; i < $("#accordionPanel .pmsContent div").length; i++){
        var pms = {};
        pms.key = $("#accordionPanel .pmsContent div").eq(i).find("input[type='hidden']").val();
        pms.defalutContent =  $("#accordionPanel .pmsContent div").eq(i).find("textarea.defaultContent").val();
        pms.content =  $("#accordionPanel .pmsContent div").eq(i).find("textarea.customContent").val();
        pmsList.push(pms);
    }
    var pmsContent = {};
    for(var s = 0; s < pmsList.length; s++){
        var contentList = {"defalutContent":pmsList[s].defalutContent,"content":pmsList[s].content};
        pmsContent[pmsList[s].key] = contentList;
    }
    // console.log(JSON.stringify(pmsContent));
    var previewBGUpload = $(".previewBGUpload").find("input[type='hidden']").val();
    // 面板
    $(".dragBox").each(function(){
        var dragBox = $(this);
        if(dragBox.attr('data-id') == 'boxId'){
            // 静态样式
            dragBox.css({"width": $("#previewW").val() == "" ? dragBox.css("width") : $("#previewW").val(),
                         "height": $("#previewH").val()== "" ? dragBox.css("height") : $("#previewH").val(),
                         "left": $("#previewX").val() == "" ? dragBox.css("left") : $("#previewX").val()+"px",
                         "top": $("#previewY").val() == "" ? dragBox.css("top") : $("#previewY").val()+"px",
                         "background-image":"url("+previewBGUpload+")","background-color": $("#previewBG").val()==""?"":"#"+$("#previewBG").val(),
                         "font-size":$("#previewSize").val(),"color": $("#previewColor").val()==""?"":"#"+$("#previewColor").val() });
            dragBox.attr({"backGroupImage": previewBGUpload,"roll": $(".roll").find("input[name='roll']:checked").val(),"content":JSON.stringify(pmsContent)});
            if(dragPreview == true){
                $("#publicDetail").modal("hide");
                $(".dragBox").removeAttr("data-id");
            }
        }
    });
}

// 挂件保存填充
function editSave(){
    // 时间格式
    var timeList = [];
    for(var i = 0; i < $("#accordion .timeFormat div").length; i++){
        var time = {};
        time.key = $("#accordion .timeFormat div").eq(i).find("input[type='hidden']").val();
        time.formate =  $("#accordion .timeFormat div").eq(i).find("input[type='text']").val();
        time.locale =  $("#accordion .timeFormat div").eq(i).find("select option:selected").val();
        timeList.push(time);
    }
    var timeFormat = {};
    for(var s = 0; s < timeList.length; s++){
        var contentList = {"formate":timeList[s].formate,"locale":timeList[s].locale};
        timeFormat[timeList[s].key] = contentList;
    }
    // console.log(JSON.stringify(timeFormat));
    var iconStatic = $(".iconStatic").find("input[type='hidden']").val();
    var backgImage = $(".backgImage").find("input[type='hidden']").val();
    var focusImage = $(".focusImage").find("input[type='hidden']").val();
    var leftArrow = $(".leftArrow").find("input[type='hidden']").val();
    var rightArrow = $(".rightArrow").find("input[type='hidden']").val();
    // 挂件
    $(".pendantChild").each(function(){
        var pendantSub = $(this);
        if(pendantSub.attr('data-pendantId') == 'pendantId'){
            // 静态样式
            pendantSub.css({"width": $("#editW").val() == "" ? pendantSub.css("width") : $("#editW").val(),
                "height": $("#editH").val() == "" ? pendantSub.css("height") : $("#editH").val(),
                "left": $("#positionX").val() == "" ? pendantSub.css("left") : $("#positionX").val()+"px",
                "top": $("#positionY").val() == "" ? pendantSub.css("top") : $("#positionY").val()+"px",
                "background-image":"url("+backgImage+")","background-color": $("#staticBG").val()==""?"":"#"+$("#staticBG").val(),
                "color": $("#staticColor").val() == "" ? "#fff": "#"+$("#staticColor").val(),"font-size": $("#staticSize").val()});
            pendantSub.attr({"focusBGImg": focusImage,"focusBG": $("#focusBG").val(), "focusColor": $("#focusColor").val(), "focusSize": $("#focusSize").val() });
            pendantSub.attr({"backGroupImage":backgImage,"radius": $("#radius").val(),"leftImage": leftArrow,"rightImage": rightArrow,"num": $("#weatherNum").val(),"formate": JSON.stringify(timeFormat) });
            pendantSub.find("p").css({"font-size":"14px"});
            // 图标
            pendantSub.attr({"iconStatic": iconStatic,"iconStaticPosition": $(".iconStaticPosition").find("option:selected").val(),"iconStaticWidth":$("#iconStaticWidth").val(),"iconStaticHeight":$("#iconStaticHeight").val(),"iconStaticSpacing":$("#iconStaticSpacing").val()});
            if(iconStatic != ""){
                pendantSub.find("img").remove();
                var iconPosition = pendantSub.attr("iconStaticPosition");
                var positionSel;
                switch (iconPosition) {
                    case "top":
                        positionSel = "top: 0;left: 50%;margin-left: -"+parseInt(pendantSub.attr("iconStaticWidth"))/2+"px;";
                        break;
                    case "bottom":
                        positionSel = "bottom: 0;left: 50%;margin-left: -"+parseInt(pendantSub.attr("iconStaticWidth"))/2+"px;";
                        break;
                    case "left":
                        positionSel = "top: 50%;left: 0;margin-top: -"+parseInt(pendantSub.attr("iconStaticHeight"))/2+"px;";
                        break;
                    case "right":
                        positionSel = "top: 50%;right: 0;margin-top: -"+parseInt(pendantSub.attr("iconStaticHeight"))/2+"px;";
                        break;
                };
                pendantSub.append("<img src='"+iconStatic+"' style='width:"+pendantSub.attr("iconStaticWidth")+"px;height:"+pendantSub.attr("iconStaticHeight")+"px;"+positionSel+"' />");
            }else{
                pendantSub.find("p").css({"width":"100%","top":"0","left":"0"});
            };
            if(modalStatic == true && staticIcon == true && modalLeft == true && modalRight == true && modalFocus == true &&  modalStatic == true){
                $("#publicDetail").modal("hide");
                $(".pendantChild").removeAttr("data-pendantId");
            }
        }
    });
}