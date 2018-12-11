// JavaScript Document   拖动位置

function movePosition () {
    var move = document.querySelectorAll('.move');
    // console.log(move.length)
    //初始
    var disX = 0;
    var disY = 0;
    var that ;
    for(var i = 0; i < move.length; i++){
        move[i].onmousedown = function (e){
            // console.log(e);
            var e = e || event;
            var preview = e.path[0].parentNode;
            var box = e.path[1].parentNode;
            // console.log(preview);

            disX = e.clientX - preview.offsetLeft;
            disY = e.clientY - preview.offsetTop;
            document.onmousemove = function (e){
                var e = e || event;
                var l = e.clientX-disX;
                var t = e.clientY-disY;
                // console.log(t);
                if(l<0){
                    l=0;
                }else if(l>box.offsetWidth - preview.offsetWidth){
                //     console.log(preview.className== "dragBox")
                    if((preview.parentNode.querySelectorAll(".childBox").length > 0 || preview.parentNode.querySelectorAll(".columnBox").length > 0) && preview.parentNode.className != "drag" ){
                        preview.parentNode.style.overflow = "scroll";
                    }else{
                        l = box.offsetWidth - preview.offsetWidth;
                    }
                };
                if(t<0){
                    t = 0;
                }else if(t>box.offsetHeight - preview.offsetHeight){
                    if((preview.parentNode.querySelectorAll(".childBox").length > 0 || preview.parentNode.querySelectorAll(".columnBox").length > 0) && preview.parentNode.className != "drag" ){
                        preview.parentNode.style.overflow = "scroll";
                    }else{
                        t = box.offsetHeight - preview.offsetHeight;
                    }
                };
                preview.style.left=l+'px';
                preview.style.top=t+'px';
                // 滚动条
                box.onscroll = function () {
                    // 竖向
                    box.querySelector(".downBtn").style.bottom = "-"+box.scrollTop+"px";
                    box.querySelector(".centerRightBtn").style.bottom = "-"+box.scrollTop+"px";
                    box.querySelector(".downRightBtn").style.bottom = "-"+box.scrollTop+"px";
                    box.querySelector(".move").style.top = box.scrollTop+"px";
                    box.querySelector(".close").style.top = box.scrollTop+"px";
                    // 横向
                    box.querySelector(".downBtn").style.left = box.scrollLeft+"px";
                    box.querySelector(".centerRightBtn").style.right = "-"+box.scrollLeft+"px";
                    box.querySelector(".downRightBtn").style.right = "-"+box.scrollLeft+"px";
                    box.querySelector(".move").style.right ="-"+box.scrollLeft+"px";
                    box.querySelector(".close").style.right = "-"+box.scrollLeft+"px";
                }
            }
            document.onmouseup = function(){
                document.onmousemove=null;
                document.onmouseup=null;
            }
        }
    }
};

