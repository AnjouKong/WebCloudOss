// JavaScript Document
$(function(){
    function getEvent(e) {
        return e || window.event;
    }
    function getLocation(e) {
        return {
            x: e.x || e.clientX,
            y: e.y || e.clientY
        }
    }
    var obj = null; // 当前操作的对象
    var preview = null; // 要处理的对象
    var clickX = 0; // 保留上次的X轴位置
    var clickY = 0; // 保留上次的Y轴位置
    // 鼠标点击
    var onDragDown = function (e, type) {
        e = getEvent(e);
        var location = getLocation(e);
        clickY = location.y;
        clickX = location.x;
        obj = this;
        obj.operateType = type;
        preview = $(e.currentTarget).parents('div')[0];
        return false;
    };
    var onDownBtnDown = function (e) {
        onDragDown(e, "s");
    };
    var onCenterRightBtnDown = function (e) {
        onDragDown(e, "e");
    };
    var onDownRightBtnDown = function (e) {
        onDragDown(e, "se");
    };
    var onDragUp = function () {
        document.body.style.cursor = "pointer";
        obj = null;
    };
    var moveSize = function (operateType, location, preview) {
        // console.log(preview);
        document.body.style.cursor = location + "_resize";
        var max_with = preview.parentNode.offsetWidth - 4,
            max_height = preview.parentNode.offsetHeight - 4;
        // var max_with=$(".bd").width(),max_height=$(".bd").height();
        switch (operateType) {
            case "e":
                var add_lengthX = clickX - location.x;
                clickX = location.x;
                var lengthX = parseInt(preview.style.width) - add_lengthX;
                lengthX = Math.min(lengthX,max_with);
                preview.style.width = lengthX + "px";
                break;
            case "s":
                var add_lengthY = clickY - location.y;
                clickY = location.y;
                var lengthY = parseInt(preview.style.height) - add_lengthY;
                lengthY = Math.min(lengthY,max_height);
                preview.style.height = lengthY + "px";
                break;
        }
    };
    var onDragMove = function (e) {
        if (obj) {
            e = getEvent(e);
            var location = getLocation(e);
            switch (obj.operateType) {
                case "s":
                    moveSize("s", location, preview);
                    break;
                case "e":
                    moveSize("e", location, preview);
                    break;
                case "se":
                    moveSize("s", location, preview);
                    moveSize("e", location, preview);
                    break;
            }
        }
        return false;
    };
    $('.drag').on('mousedown', '.downBtn', onDownBtnDown);
    $('.drag').on('mousedown', '.centerRightBtn', onCenterRightBtnDown);
    $('.drag').on('mousedown', '.downRightBtn', onDownRightBtnDown);
    $(document).on('mousemove', onDragMove);
    $(document).on('mouseup', onDragUp);
})

