var base = '';
var category;
var currentId = getQueryString('currentId');
$(document).ready(function () {
  // 获取语言
  // $("#secondaryId").val(currentId);
  $.post(base + "/op/ui/content/langauge", {contentId: currentId}, function (data) {
    var language = data.data;
    console.log(language);
    var inputHtml = '';
    var totalTitleHtml = '';
    var tab_titleNameHtml = '';
    var itemTitleHtml = '';
    var itemContentHtml = '';
    for (var g = 0; g < language.length; g++) {
      // hideen input
      inputHtml += '<input type="hidden" class="secondaryLanguage" value="' + language[g].language + '" name="languageList">';
      // 大标题
      totalTitleHtml += '<div class="form-group form-horizontal">' +
        '                     <label class="col-sm-2 control-label">' + language[g].language + '</label>' +
        '                     <div class="col-sm-6">' +
        '                          <input type="text" class="totalTitle" placeholder="大标题">' +
        '                      </div>' +
        '                </div>';
      // 标签名称
      tab_titleNameHtml += '<div class="form-group">' +
        '                        <span>' + language[g].language + '：</span>' +
        '                        <input type="text" class="tabName" placeholder="标签名称">' +
        '                   </div>';

      // 标签内容名称
      itemTitleHtml += '<div class="form-group">' +
        '                       <span>' + language[g].language + '：</span>' +
        '                       <input type="text" class="itemName" placeholder="内容标题">' +
        '               </div>';
      // 标签内容 描述
      itemContentHtml += '<div class="form-group">' +
        '                       <span>' + language[g].language + '：</span>' +
        '                       <input type="text" class="itemInfo" placeholder="内容描述">' +
        '               </div>';
    }
    $("#panelSection").prepend(inputHtml);
    $("#totalTitle").html(totalTitleHtml);
    $(".tab_titleName").html(tab_titleNameHtml);
    $(".itemTitle").html(itemTitleHtml);
    $(".itemContent").html(itemContentHtml);
  });

  // 添加标签
  $("#addTabData").on('click', function () {
    var tabLast = $(".secondaryList .tabContent:last").index();
    var cloneData = $(".cloneTemplate").html();
    cloneData = cloneData.replace(new RegExp("tabImg", "gm"), "tabImg" + parseInt(tabLast + 2));
    // cloneData = cloneData.replace(new RegExp("tabUploadForm","gm"), "tabUploadForm"+ parseInt(tabLast + 2));
    cloneData = cloneData.replace(new RegExp("itemImg", "gm"), "itemImg" + parseInt(tabLast + 2));
    // cloneData = cloneData.replace(new RegExp("itemUploadForm","gm"), "itemUploadForm"+ parseInt(tabLast + 2));
    $(".secondaryList").append(cloneData);
    publicMethod();
  });
  // 添加内容
  $("#addItemData").on('click', function () {
    if ($(".selected").length > 0) {
      var itemLast = $(".selected .tabItem:last").index();
      var tabSelected = $(".secondaryList .selected").index();
      var itemCloneData = $(".cloneTemplate .tabContent li:nth-child(3)").html();
      itemCloneData = itemCloneData.replace(new RegExp("itemImg", "gm"), "itemImg" + tabSelected + parseInt(itemLast + 2));
      // itemCloneData = itemCloneData.replace(new RegExp("itemUploadForm","gm"), "itemUploadForm"+ tabSelected + parseInt(itemLast + 2));
      $(".selected li:nth-child(3)").append(itemCloneData);
      publicMethod();
    } else {
      alert("先选择添加的标签！");
    }
  });
  // 删除标签
  $("#deleteTab").on('click', function () {
    if ($(".secondaryList .tabContent").length < 2) {
      alert("请至少保留一条！");
      return;
    }
    if ($(".selected").length > 0) {
      var dialog = $("#dialogDeleteCheck");
      dialog.modal("show");
      dialog.find("#ok").unbind("click");
      dialog.find("#ok").bind("click", function () {
        $(".selected").remove();
        dialog.modal("hide");
      });
    } else {
      alert("先选择删除的标签！");
    }
  });
  // 保存数据
  $("#save").on("click", function () {
    saveSubmit();
    var sceneSaveVo = {
      id: $("#secondaryId").val(),
      content: category, //JSON.stringify(category)
    };
    // 提交
    $.ajax({
      url: base + "/op/ui/content/json?id=" + currentId,
      type: "POST",
      dataType: "JSON",
      contentType: "application/json;charset=UTF-8",
      data: JSON.stringify(category),
      success: function (data) {
        if (data.success) {
          alert(data.message);
          setTimeout(function () {
            window.parent.location.href = "/#/contentManage/secondaryManage";
          }, 100);
        } else {
          alert(data.msg);
        }
      }
    });
  });
  // 获取回显数据
  $.post(base + "/op/ui/content/echo", {id: currentId}, function (data) {
    var data = data.data;
    if (data) {
      dataEcho(JSON.parse(data));
      // setTimeout(function(){},1000);
    } else {
      $("#addTabData").trigger("click");
    }
  });

  // 返回
  $("#goBack").on("click", function () {
    console.log("fanhui");
    window.parent.location.href = "/#/contentManage/secondaryManage";
  });
  window.parent.innerHeight = 900;
});

function inputOn() {
  // 上传图片
  $("input[type='file']").on('change', function (e) {
    console.log("上传图片");
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
      success : function (result) {
        console.log(_this);
        _this.next().val(result.data.url);

        console.log(_this.parents(".file_div"));

        _this.parents(".file_content").find("p").remove();
        var pHtml = '<p class="imgUpload col-xs-8">' +
          '               <a href="'+result.data.url+'" target="_blank">' +
          '                     <img class="img" src="'+result.data.url+'" alt="'+result.data.url+'">' +
          '               </a>' +
          '               <br>' +
          '               <button type="button" class="deleteUpload">X</button>' +
          '          </p>';
        _this.parents(".file_content").append(pHtml);

        deleteUpload();

      }
    });
  });
}
function publicMethod() {
  $(".secondaryList").on('click', 'ul.tabContent', function () {
    $('ul.tabContent').removeClass('selected');
    $(this).addClass('selected');
  });
  $(".deleteItem").on('click', function () {
    var _this = $(this);
    if (_this.parents("li").find(".tabItem").length > 1) {
      var dialog = $("#dialogDeleteCheck");
      dialog.modal("show");
      dialog.find("#ok").unbind("click");
      dialog.find("#ok").bind("click", function () {
        _this.parent(".tabItem").remove();
        dialog.modal("hide");
      });
    } else {
      alert("请至少保留一条！");
      return;
    }

  });
  inputOn();
  deleteUpload();
  IFrameResize();
};

function deleteUpload() {
  $(".deleteUpload").on('click', function () {
    console.log($(this).parent("p"));
    $(this).parent("p").remove();
  });
}

function saveSubmit() {
  // 语言
  var languageList = $(".secondaryLanguage");
  var languageData = [];
  for (var l = 0; l < languageList.length; l++) {
    // 标签
    var tabList = $(".secondaryList").find(".tabContent");
    var tabData = [];
    for (var t = 0; t < tabList.length; t++) {
      // 内容
      var itemList = tabList.eq(t).find(".tabItem");
      var itemData = [];
      for (var i = 0; i < itemList.length; i++) {
        var itemListData = {
          contentImg: itemList.eq(i).find(".itemUpload input[type='hidden']").attr("name") || itemList.eq(i).find(".itemUpload p a").attr("href"),  // 右侧内容的图片
          content: {   // 右侧内容描述
            title: (itemList.eq(i).find("input.itemName"))[l].value,
            info: (itemList.eq(i).find("input.itemInfo"))[l].value,
          }
        };
        itemData.push(itemListData);
      }
      ;
      var tabListData = {
        itemName: (tabList.eq(t).find("input.tabName"))[l].value, // 左侧标签的名字
        itemImg: tabList.eq(t).find("li:nth-child(1) input[type='hidden']").attr("name") || tabList.eq(t).find("li:nth-child(1) p a").attr("href"),  // 左侧标签的图片
        itemData: itemData,
      };
      tabData.push(tabListData);
    }
    ;
    var languageListData = {
      title: $(".totalTitle input")[l].value, // 整体标题
      language: languageList[l].value,
      data: tabData,
    };
    languageData.push(languageListData);
  }
  category = {
    type: '',// $("#secondaryStyle").val(), // 风格
    languageData: languageData,
  };
  // console.log(category);
}

function dataEcho(data) {
  // console.log(data.languageData);
  function languageEcho(mark, tabIndex, itemIndex) {
    var languageList = data.languageData;
    for (var l = 0; l < languageList.length; l++) {
      if (mark == "title") { // 大标题
        var totalTitle = $(".totalTitle > div");
        for (var a = 0; a < totalTitle.length; a++) {
          if (languageList[l].language == totalTitle.eq(a).find("label").text()) {
            totalTitle.eq(a).find("input").val(languageList[l].title);
          }
        }
      }
      if (mark == "tab") { // 标签
        var tabTitle = $(".secondaryList .tabContent:last").find("li:nth-child(2) > div");
        for (var b = 0; b < tabTitle.length; b++) {
          if (languageList[l].language + "：" == tabTitle.eq(b).find("span").text()) {
            tabTitle.eq(b).find("input").val(languageList[l].data[tabIndex].itemName);
          }
        }
      }
      if (mark == "item") { // 内容
        var itemName = $(".secondaryList .tabContent:last").find(".tabItem:last .itemTitle > div");
        var itemInfo = $(".secondaryList .tabContent:last").find(".tabItem:last .itemContent > div");
        for (var c = 0; c < itemName.length; c++) {
          if (languageList[l].language + "：" == itemName.eq(c).find("span").text()) {
            itemName.eq(c).find("input").val(languageList[l].data[tabIndex].itemData[itemIndex].content.title);
          }
        }
        for (var d = 0; d < itemInfo.length; d++) {
          if (languageList[l].language + "：" == itemInfo.eq(d).find("span").text()) {
            itemInfo.eq(d).find("input").val(languageList[l].data[tabIndex].itemData[itemIndex].content.info);
          }
        }
      }
    }
  }

  languageEcho("title");
  // 标签结构
  var tabContentList = data.languageData[0].data;
  for (var t = 0; t < tabContentList.length; t++) {
    var tabLast = $(".secondaryList .tabContent:last").index();
    var cloneData = $(".cloneTemplate").html();
    cloneData = cloneData.replace(new RegExp("tabImg", "gm"), "tabImg" + parseInt(tabLast + 2));
    cloneData = cloneData.replace(new RegExp("itemImg", "gm"), "itemImg" + parseInt(tabLast + 2));
    $(".secondaryList").append(cloneData);
    $(".secondaryList .tabContent:last").find(".tabItem").remove();
    if (tabContentList[t].itemImg) {
      var pHtmlTile = '<p class="imgUpload col-xs-8">' +
        '               <a href="'+tabContentList[t].itemImg+'" target="_blank">' +
        '                     <img class="img" src="'+tabContentList[t].itemImg+'" alt="'+tabContentList[t].itemImg+'">' +
        '               </a>' +
        '               <br>' +
        '               <button type="button" class="deleteUpload">X</button>' +
        '          </p>';
      $(".secondaryList .tabContent:last").find("li:first").append(pHtmlTile);
      /*
      '<p class="imgUpload">已上传：<br />' +
        '<a href="' + tabContentList[t].itemImg + '" title="' + tabContentList[t].itemImg + '" target="_blank">' + tabContentList[t].itemImg + '</a>' +
        '<br /><button type="button" class="deleteUpload">删除图片</button>' +
        '</p>'
       */

    }
    languageEcho("tab", t);
    // 内容结构
    var itemList = tabContentList[t].itemData;
    for (var i = 0; i < itemList.length; i++) {
      var itemLast = $(".secondaryList .tabContent:last .tabItem:last").index();
      var tabLast = $(".secondaryList .tabContent:last").index();
      var itemCloneData = $(".cloneTemplate .tabContent li:nth-child(3)").html();
      itemCloneData = itemCloneData.replace(new RegExp("itemImg", "gm"), "itemImg" + parseInt(tabLast + 2) + parseInt(itemLast + 2));
      $(".secondaryList .tabContent:last li:nth-child(3)").append(itemCloneData);
      if (itemList[i].contentImg) {
        var pHtmlCont = '<p class="imgUpload col-xs-8">' +
          '               <a href="'+itemList[i].contentImg+'" target="_blank">' +
          '                     <img class="img" src="'+itemList[i].contentImg+'" alt="'+itemList[i].contentImg+'">' +
          '               </a>' +
          '               <br>' +
          '               <button type="button" class="deleteUpload">X</button>' +
          '          </p>';

        $(".secondaryList .tabContent:last").find(".tabItem:last .itemUpload").append(pHtmlCont);
        /*
        '<p class="imgUpload">已上传：<br />' +
          '<a href="' + itemList[i].contentImg + '" title="' + itemList[i].contentImg + '" target="_blank">' + itemList[i].contentImg + '</a>' +
          '<br /><button type="button" class="deleteUpload">删除图片</button>' +
          '</p>'
         */
      }
      languageEcho("item", t, i);
    }
  }
  publicMethod();
}


// 获取URL中参数
// 参数 name 链接中的参数名称
// 返回 参数值
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var queryStr = decodeURI(window.location.search.substr(1));
  var matchStr = queryStr.match(reg);
  if (matchStr != null) {
    return (matchStr[2]);
  }
  return null;
}

function IFrameResize() {
  console.log(this.document.body.scrollHeight); // 弹出当前页面的高度
  var obj = parent.document.getElementById("SecondaryPageChildFrame"); // 取得父页面IFrame对象
  console.log(obj.height); // 弹出父页面中IFrame中设置的高度
  obj.height = this.document.body.scrollHeight; // 调整父页面中IFrame的高度为此页面的高度
}
