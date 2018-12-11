var language = {
    oAria: {sSortAscending: ": 以升序排列此列", sSortDescending: ": 以降序排列此列"},
    oPaginate: {sFirst: "首页", sPrevious: "上页", sNext: "下页", sLast: "末页"},
    sEmptyTable: "表中数据为空",
    sInfo: "显示第 _START_ 至 _END_ 条结果，共 _TOTAL_ 条",
    sInfoEmpty: "显示第 0 至 0 条结果，共 0 条",
    sInfoFiltered: "(每页显示 10 条)",
    sInfoPostFix: "",
    sInfoThousands: ",",
    sLengthMenu: "显示 _MENU_ 条结果",
    sLoadingRecords: "载入中...",
    sProcessing: "处理中...",
    sSearch: "搜索:",
    sUrl: "",
    sZeroRecords: "没有匹配结果",
}
// 二级列表页面
var dataTableSecondary;
function initDataTableSecondary() {
    dataTableSecondary = $('.dataTableSecondary').DataTable({
        "dom": '<"toolbar">frtip',
        "searching": false,
        "processing": false,
        "serverSide": true,
        "select": true,
        "ordering": true,
        "language": language,
        "preDrawCallback": function () {
            sublime.showLoadingbar($(".main-content"));
        },
        "drawCallback": function () {
            sublime.closeLoadingbar($(".main-content"));
        },
        "ajax": function (data, callback, settings) {
            $.ajax({
                url: "/op/ui/content/page",
                type: "post",
                data: {
                    size: data.length,
                    page: parseInt(data.start)/10 + 1,
                    type: 'secondary',
                    categoryId: $('#channelId_Secondary').val(),
                    name: $('#resourceName_Secondary').val(),
                },
                success: function (result) {
                    var returnData = {
                        recordsTotal: result.totalPages, //返回数据全部记录
                        recordsFiltered: result.totalRows, //后台不实现过滤功能，每次查询均视作全部结果
                        data: result.data, //返回的数据列表
                    };
                    callback(returnData);
                }
            });
        },
        "order": [[0, ""]],
        "columns": [
            {"data": "name", "bSortable": false},
            {"data": "remarks", "bSortable": false}
        ],
        "columnDefs": []
    });
    dataTableSecondary.on('click', 'tr', function () {
        if(!$(this).hasClass('selected')){
            $("tbody tr").removeClass('selected');
        }
        $(this).toggleClass('selected');
    });
    $("#resourceName_Secondary").on('keyup', function () {
        dataTableSecondary.ajax.reload();
    });
}
// 图片
var dataTableImg;
function initDataTableImg() {
    dataTableImg = $('.dataTableImg').DataTable({
        "dom": '<"toolbar">frtip',
        "searching":false,
        "processing": false,
        "serverSide": true,
        "select": true,
        "ordering": true,
        "language": language,
        "preDrawCallback": function () {
            sublime.showLoadingbar($(".main-content"));
        },
        "drawCallback": function () {
            sublime.closeLoadingbar($(".main-content"));
        },
        "ajax": function (data, callback, settings) {
            $.ajax({
                url: "/op/ui/content/page",
                type: "post",
                data: {
                    size: data.length,
                    page: parseInt(data.start)/10 + 1,
                    type: 'img',
                    categoryId: $('#channelId_img').val(),
                    name: $('#resourceName_img').val(),
                },
                success: function (result) {
                    var returnData = {
                        recordsTotal: result.totalPages, //返回数据全部记录
                        recordsFiltered: result.totalRows, //后台不实现过滤功能，每次查询均视作全部结果
                        data: result.data, //返回的数据列表
                    };
                    callback(returnData);
                }
            });
        },
        "order": [[0, ""]],
        "columns": [
            {"data": "name", "bSortable": false},
            {"data": "content", "bSortable": false}
        ],
        "columnDefs": []
    });
    dataTableImg.on('click', 'tr', function () {
        if(!$(this).hasClass('selected')){
            $("tbody tr").removeClass('selected');
        }
        $(this).toggleClass('selected');
    });
    $("#resourceName_img").on('keyup', function () {
        dataTableImg.ajax.reload();
    });
}
// 图片列表
var dataTableImgCollection;
function initDataTableImgCollection() {
    dataTableImgCollection = $('.dataTableImgCollection').DataTable({
        "dom": '<"toolbar">frtip',
        "searching": false,
        "processing": false,
        "serverSide": true,
        "select": true,
        "ordering": true,
        "language": language,
        "preDrawCallback": function () {
            sublime.showLoadingbar($(".main-content"));
        },
        "drawCallback": function () {
            sublime.closeLoadingbar($(".main-content"));
        },
        "ajax": function (data, callback, settings) {
            $.ajax({
                url: "/op/ui/content/page",
                type: "post",
                data: {
                    size: data.length,
                    page: parseInt(data.start)/10 + 1,
                    type: 'imgCollection',
                    categoryId: $('#channelId_imgList').val(),
                    name: $('#resourceName_imgList').val(),
                },
                success: function (result) {
                    var returnData = {
                        recordsTotal: result.totalPages, //返回数据全部记录
                        recordsFiltered: result.totalRows, //后台不实现过滤功能，每次查询均视作全部结果
                        data: result.data, //返回的数据列表
                    };
                    callback(returnData);
                }
            });
        },
        "order": [[0, ""]],
        "columns": [
            {"data": "name", "bSortable": false},
            {"data": "content", "bSortable": false}
        ],
        "columnDefs": []
    });
    dataTableImgCollection.on('click', 'tr', function () {
        if(!$(this).hasClass('selected')){
            $("tbody tr").removeClass('selected');
        }
        $(this).toggleClass('selected');
    });
    $("#resourceName_imgList").on('keyup', function () {
        dataTableImgCollection.ajax.reload();
    });
}
// 视频
var dataTableVideo;
function initDataTableVideo() {
    dataTableVideo = $('.dataTableVideo').DataTable({
        "dom": '<"toolbar">frtip',
        "searching":false,
        "processing": false,
        "serverSide": true,
        "select": true,
        "ordering": true,
        "language": language,
        "preDrawCallback": function () {
            sublime.showLoadingbar($(".main-content"));
        },
        "drawCallback": function () {
            sublime.closeLoadingbar($(".main-content"));
        },
        "ajax": function (data, callback, settings) {
            $.ajax({
                url: "/op/ui/content/page",
                type: "post",
                data: {
                    size: data.length,
                    page: parseInt(data.start)/10 + 1,
                    type: 'video',
                    categoryId: $('#channelId_video').val(),
                    name: $('#resourceName_video').val(),
                },
                success: function (result) {
                    var returnData = {
                        recordsTotal: result.totalPages, //返回数据全部记录
                        recordsFiltered: result.totalRows, //后台不实现过滤功能，每次查询均视作全部结果
                        data: result.data, //返回的数据列表
                    };
                    callback(returnData);
                }
            });
        },
        "order": [[0, ""]],
        "columns": [
            {"data": "name", "bSortable": false},
            {"data": "remarks", "bSortable": false}
        ],
        "columnDefs": []
    });
    dataTableVideo.on('click', 'tr', function () {
        if(!$(this).hasClass('selected')){
            $("tbody tr").removeClass('selected');
        }
        $(this).toggleClass('selected');
    });
    $("#resourceName_video").on('keyup', function () {
        dataTableVideo.ajax.reload();
    });
}
// 广告
var dataTableAdv;
function initDataTableAdv() {
    dataTableAdv = $('.dataTableAdv').DataTable({
        "dom": '<"toolbar">frtip',
        "searching":false,
        "processing": false,
        "serverSide": true,
        "select": true,
        "ordering": true,
        "language": language,
        "preDrawCallback": function () {
            sublime.showLoadingbar($(".main-content"));
        },
        "drawCallback": function () {
            sublime.closeLoadingbar($(".main-content"));
        },
        "ajax": function (data, callback, settings) {
            $.ajax({
                url: "/op/ui/content/page",
                type: "post",
                data: {
                    size: data.length,
                    page: parseInt(data.start)/10 + 1,
                    type: 'ad',
                    categoryId: $('#channelId_adv').val(),
                    name: $('#resourceName_adv').val(),
                },
                success: function (result) {
                    var returnData = {
                        recordsTotal: result.totalPages, //返回数据全部记录
                        recordsFiltered: result.totalRows, //后台不实现过滤功能，每次查询均视作全部结果
                        data: result.data, //返回的数据列表
                    };
                    callback(returnData);
                }
            });
        },
        "order": [[0, ""]],
        "columns": [
            {"data": "name", "bSortable": false},
            {"data": "fileType", "bSortable": false},
            {"data": "remarks", "bSortable": false}
        ],
        "columnDefs": []
    });
    dataTableAdv.on('click', 'tr', function () {
        if(!$(this).hasClass('selected')){
            $("tbody tr").removeClass('selected');
        }
        $(this).toggleClass('selected');
    });
    $("#resourceName_adv").on('keyup', function () {
        dataTableAdv.ajax.reload();
    });
}
// app
var dataTableApp;
function initDataTableApp() {
    dataTableApp = $('.dataTableApp').DataTable({
        "dom": '<"toolbar">frtip',
        "searching":false,
        "processing": false,
        "serverSide": true,
        "select": true,
        "ordering": true,
        "language": language,
        "preDrawCallback": function () {
            sublime.showLoadingbar($(".main-content"));
        },
        "drawCallback": function () {
            sublime.closeLoadingbar($(".main-content"));
        },
        "ajax": function (data, callback, settings) {
            $.ajax({
                url: "/op/ui/content/page",
                type: "post",
                data: {
                    size: data.length,
                    page: parseInt(data.start)/10 + 1,
                    type: 'app',
                    categoryId: $('#channelId_app').val(),
                    name: $('#resourceName_app').val(),
                },
                success: function (result) {
                    var returnData = {
                        recordsTotal: result.totalPages, //返回数据全部记录
                        recordsFiltered: result.totalRows, //后台不实现过滤功能，每次查询均视作全部结果
                        data: result.data, //返回的数据列表
                    };
                    callback(returnData);
                }
            });
        },
        "order": [[0, ""]],
        "columns": [
            {"data": "name", "bSortable": false},
            {"data": "packageName", "bSortable": false},
            {"data": "action", "bSortable": false},
            {"data": "remarks", "bSortable": false}
        ],
        "columnDefs": []
    });
    dataTableApp.on('click', 'tr', function () {
        if(!$(this).hasClass('selected')){
            $("tbody tr").removeClass('selected');
        }
        $(this).toggleClass('selected');
    });
    $("#resourceName_app").on('keyup', function () {
        dataTableApp.ajax.reload();
    });
}
// 内部网站
var dataTableWebsite_internal;
function initDataTableWebsite_internal() {
    dataTableWebsite_internal = $('.dataTableWebsite_internal').DataTable({
        "dom": '<"toolbar">frtip',
        "searching":false,
        "processing": false,
        "serverSide": true,
        "select": true,
        "ordering": true,
        "language": language,
        "preDrawCallback": function () {
            sublime.showLoadingbar($(".main-content"));
        },
        "drawCallback": function () {
            sublime.closeLoadingbar($(".main-content"));
        },
        "ajax": function (data, callback, settings) {
            $.ajax({
                url: "/op/ui/content/page",
                type: "post",
                data: {
                    size: data.length,
                    page: parseInt(data.start)/10 + 1,
                    type: 'website',
                    websiteType: 'internal',
                    categoryId: $('#channelId_app').val(),
                    name: $('#resourceName_website_internal').val(),
                },
                success: function (result) {
                    var returnData = {
                        recordsTotal: result.totalPages, //返回数据全部记录
                        recordsFiltered: result.totalRows, //后台不实现过滤功能，每次查询均视作全部结果
                        data: result.data, //返回的数据列表
                    };
                    callback(returnData);
                }
            });
        },
        "order": [[0, ""]],
        "columns": [
            {"data": "name", "bSortable": false},
            {"data": "url", "bSortable": false}
        ],
        "columnDefs": []
    });
    dataTableWebsite_internal.on('click', 'tr', function () {
        if(!$(this).hasClass('selected')){
            $("tbody tr").removeClass('selected');
        }
        $(this).toggleClass('selected');
    });
    $("#resourceName_website_internal").on('keyup', function () {
       dataTableWebsite_internal.ajax.reload();
     });
}
// 外部网站
var dataTableWebsite_external;
function initDataTableWebsite_external() {
    dataTableWebsite_external = $('.dataTableWebsite_external').DataTable({
        "dom": '<"toolbar">frtip',
        "searching":false,
        "processing": false,
        "serverSide": true,
        "select": true,
        "ordering": true,
        "language": language,
        "preDrawCallback": function () {
            sublime.showLoadingbar($(".main-content"));
        },
        "drawCallback": function () {
            sublime.closeLoadingbar($(".main-content"));
        },
        "ajax": function (data, callback, settings) {
            $.ajax({
                url: "/op/ui/content/page",
                type: "post",
                data: {
                    size: data.length,
                    page: parseInt(data.start)/10 + 1,
                    type: 'website',
                    websiteType: 'external',
                    categoryId: $('#channelId_app').val(),
                    name: $('#resourceName_website_external').val(),
                },
                success: function (result) {
                    var returnData = {
                        recordsTotal: result.totalPages, //返回数据全部记录
                        recordsFiltered: result.totalRows, //后台不实现过滤功能，每次查询均视作全部结果
                        data: result.data, //返回的数据列表
                    };
                    callback(returnData);
                }
            });
        },
        "order": [[0, ""]],
        "columns": [
            {"data": "name", "bSortable": false},
            {"data": "url", "bSortable": false}
        ],
        "columnDefs": []
    });
    dataTableWebsite_external.on('click', 'tr', function () {
        if(!$(this).hasClass('selected')){
            $("tbody tr").removeClass('selected');
        }
        $(this).toggleClass('selected');
    });
    $("#resourceName_website_external").on('keyup', function () {
       dataTableWebsite_external.ajax.reload();
     });
}
// 自定义媒资
var dataTableMedia;
function initDataTableMedia() {
    dataTableMedia = $('.dataTableMedia').DataTable({
        "dom": '<"toolbar">frtip',
        "searching":false,
        "processing": false,
        "serverSide": true,
        "select": true,
        "ordering": true,
        "language": language,
        "preDrawCallback": function () {
            sublime.showLoadingbar($(".main-content"));
        },
        "drawCallback": function () {
            sublime.closeLoadingbar($(".main-content"));
        },
        "ajax": function (data, callback, settings) {
            $.ajax({
                url: "/op/ui/media/list",
                type: "get",
                data: {
                    size: data.length,
                    page: parseInt(data.start)/10 + 1,
                    subjectName: $('#mediaName_search').val(),
                },
                success: function (result) {
                    var returnData = {
                        recordsTotal: result.totalPages, //返回数据全部记录
                        recordsFiltered: result.totalRows, //后台不实现过滤功能，每次查询均视作全部结果
                        data: result.data, //返回的数据列表
                    };
                    callback(returnData);
                }
            });
        },
        "order": [[0, ""]],
        "columns": [
            {"data": "seriesName", "bSortable": false},
            {"data": "seriesCode", "bSortable": false},
            {"data": "cpName", "bSortable": false},
            {"data": "releaseYear", "bSortable": false},
            {"data": "charge", "bSortable": false}
        ]
    });
    dataTableMedia.on('click', 'tr', function () {
        if(!$(this).hasClass('selected')){
            $("tbody tr").removeClass('selected');
        }
        $(this).toggleClass('selected');
    });
    $("#mediaName_search").on('keyup', function () {
         dataTableMedia.ajax.reload();
    });
}
// 自定义媒资专题
var dataTableMediaSubject;
function initDataTableMediaSubject() {
    dataTableMediaSubject = $('.dataTableMediaSubject').DataTable({
        "dom": '<"toolbar">frtip',
        "searching":false,
        "processing": false,
        "serverSide": true,
        "select": true,
        "ordering": true,
        "language": language,
        "preDrawCallback": function () {
            sublime.showLoadingbar($(".main-content"));
        },
        "drawCallback": function () {
            sublime.closeLoadingbar($(".main-content"));
        },
        "ajax": function (data, callback, settings) {
            $.ajax({
                url: "/op/ui/media/subject",
                type: "get",
                data: {
                    size: data.length,
                    page: parseInt(data.start)/10 + 1,
                    subjectName: $('#subjectName_search').val(),
                },
                success: function (result) {
                    var returnData = {
                        recordsTotal: result.totalPages, //返回数据全部记录
                        recordsFiltered: result.totalRows, //后台不实现过滤功能，每次查询均视作全部结果
                        data: result.data, //返回的数据列表
                    };
                    callback(returnData);
                }
            });
        },
        "order": [[0, ""]],
        "columns": [
            {"data": "subjectName", "bSortable": true},
            {"data": "remarks", "bSortable": true}
        ]
    });
    dataTableMediaSubject.on('click', 'tr', function () {
        if(!$(this).hasClass('selected')){
            $("tbody tr").removeClass('selected');
        }
        $(this).toggleClass('selected');
    });
    $("#subjectName_search").on('keyup', function () {
        dataTableMediaSubject.ajax.reload();
    });
}

$(document).ready(function () {
    initDataTableSecondary();
    initDataTableImg();
    initDataTableImgCollection();
    initDataTableMedia();
    initDataTableVideo();
    initDataTableAdv();
    initDataTableApp();
    initDataTableWebsite_internal();
    initDataTableWebsite_external();
    initDataTableMediaSubject();
});
