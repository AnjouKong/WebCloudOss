// 二级列表页面
function initSecondaryTreeView() {
    $("#jsTreeUnit_Secondary").jstree({
        plugins: ["wholerow"],
        core: {
            multiple: false,
            data: function(obj, callback) {
                var jsonarray = [];
                $.ajax({
                    type: "post",
                    url: "/op/ui/column/list",
                    dataType: "json",
                    async: false,
                    data: {"type": "secondary"},
                    success: function(result) {
                        var arrays = result.data;
                        for (var i = 0; i < arrays.length; i++) {
                            var arr = {
                                "id": arrays[i].id,
                                "parent": arrays[i].parentId == "0" ? "#" : arrays[i].parentId,
                                "text": arrays[i].name
                            }
                            jsonarray.push(arr);
                        }
                    }
                });
                if(jsonarray.length == 0) return;
                callback.call(this, jsonarray);
            }
        }
    }).on("select_node.jstree", function (node, selected) {
        $("#channelId_Secondary").val(selected.selected);
        if (dataTableSecondary) {
            $(".cd-panel-content").find("input").val("");
            dataTableSecondary.ajax.reload();
        } else {
            initDataTableSecondary();
        }
    });
}
// 图片
function initImgTreeView() {
    $("#jsTreeUnit_img").jstree({
        plugins: ["wholerow"],
        core: {
            multiple: false,
            data: function(obj, callback) {
                var jsonarray = [];
                $.ajax({
                    type: "post",
                    url: "/op/ui/column/list",
                    dataType: "json",
                    async: false,
                    data: {"type": "img"},
                    success: function(result) {
                        var arrays = result.data;
                        for (var i = 0; i < arrays.length; i++) {
                            var arr = {
                                "id": arrays[i].id,
                                "parent": arrays[i].parentId == "0" ? "#" : arrays[i].parentId,
                                "text": arrays[i].name
                            }
                            jsonarray.push(arr);
                        }
                    }
                });
                if(jsonarray.length == 0) return;
                callback.call(this, jsonarray);
            }
        }
    }).on("select_node.jstree", function (node, selected) {
        $("#channelId_img").val(selected.selected);
        if (dataTableImg) {
            $(".cd-panel-content").find("input").val("");
            dataTableImg.ajax.reload();
        } else {
            initDataTableImg();
        }
    });
}
// 图片列表
function initImgListTreeView() {
    $("#jsTreeUnit_imgList").jstree({
        plugins: ["wholerow"],
        core: {
            multiple: false,
            data: function(obj, callback) {
                var jsonarray = [];
                $.ajax({
                    type: "post",
                    url: "/op/ui/column/list",
                    dataType: "json",
                    async: false,
                    data: {"type": "imgCollection"},
                    success: function(result) {
                        var arrays = result.data;
                        for (var i = 0; i < arrays.length; i++) {
                            var arr = {
                                "id": arrays[i].id,
                                "parent": arrays[i].parentId == "0" ? "#" : arrays[i].parentId,
                                "text": arrays[i].name
                            }
                            jsonarray.push(arr);
                        }
                    }
                });
                if(jsonarray.length == 0) return;
                callback.call(this, jsonarray);
            }
        }
    }).on("select_node.jstree", function (node, selected) {
        $("#channelId_imgList").val(selected.selected);
        if (dataTableImgCollection) {
            $(".cd-panel-content").find("input").val("");
            dataTableImgCollection.ajax.reload();
        } else {
            initDataTableImgCollection();
        }
    });
}
// app
function initAppTreeView() {
    $("#jsTreeUnit_app").jstree({
        plugins: ["wholerow"],
        core: {
            multiple: false,
            data: function(obj, callback) {
                var jsonarray = [];
                $.ajax({
                    type: "post",
                    url: "/op/ui/column/list",
                    dataType: "json",
                    async: false,
                    data: {"type": "app"},
                    success: function(result) {
                        var arrays = result.data;
                        for (var i = 0; i < arrays.length; i++) {
                            var arr = {
                                "id": arrays[i].id,
                                "parent": arrays[i].parentId == "0" ? "#" : arrays[i].parentId,
                                "text": arrays[i].name
                            }
                            jsonarray.push(arr);
                        }
                    }
                });
                if(jsonarray.length == 0) return;
                callback.call(this, jsonarray);
            }
        }
    }).on("select_node.jstree", function (node, selected) {
        $("#channelId_app").val(selected.selected);
        if (dataTableApp) {
            $(".cd-panel-content").find("input").val("");
            dataTableApp.ajax.reload();
        } else {
            initDataTableApp();
        }
    });
}
// 视频
function initVideoTreeView() {
    $("#jsTreeUnit_video").jstree({
        plugins: ["wholerow"],
        core: {
            multiple: false,
            data: function(obj, callback) {
                var jsonarray = [];
                $.ajax({
                    type: "post",
                    url: "/op/ui/column/list",
                    dataType: "json",
                    async: false,
                    data: {"type": "video"},
                    success: function(result) {
                        var arrays = result.data;
                        for (var i = 0; i < arrays.length; i++) {
                            var arr = {
                                "id": arrays[i].id,
                                "parent": arrays[i].parentId == "0" ? "#" : arrays[i].parentId,
                                "text": arrays[i].name
                            }
                            jsonarray.push(arr);
                        }
                    }
                });
                if(jsonarray.length == 0) return;
                callback.call(this, jsonarray);
            }
        }
    }).on("select_node.jstree", function (node, selected) {
        $("#channelId_video").val(selected.selected);
        if (dataTableVideo) {
            $(".cd-panel-content").find("input").val("");
            dataTableVideo.ajax.reload();
        } else {
            initDataTableVideo();
        }
    });
}
// 广告
function initAdvTreeView() {
    $("#jsTreeUnit_adv").jstree({
        plugins: ["wholerow"],
        core: {
            multiple: false,
            data: function(obj, callback) {
                var jsonarray = [];
                $.ajax({
                    type: "post",
                    url: "/op/ui/column/list",
                    dataType: "json",
                    async: false,
                    data: {"type": "ad"},
                    success: function(result) {
                        var arrays = result.data;
                        for (var i = 0; i < arrays.length; i++) {
                            var arr = {
                                "id": arrays[i].id,
                                "parent": arrays[i].parentId == "0" ? "#" : arrays[i].parentId,
                                "text": arrays[i].name
                            }
                            jsonarray.push(arr);
                        }
                    }
                });
                if(jsonarray.length == 0) return;
                callback.call(this, jsonarray);
            }
        }
    }).on("select_node.jstree", function (node, selected) {
        $("#channelId_adv").val(selected.selected);
        if (dataTableAdv) {
            $(".cd-panel-content").find("input").val("");
            dataTableAdv.ajax.reload();
        } else {
            initDataTableAdv();
        }
    });
}

$(function () {
    initSecondaryTreeView();
    initImgTreeView();
    initImgListTreeView();
    initAppTreeView();
    initVideoTreeView();
    initAdvTreeView();
});
