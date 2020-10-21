// ==UserScript==
// @name         weiban.mycourse.cn刷课助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  对weiban.mycourse.cn这个网站上的课程（h5页面）辅助点击，仅需点开要刷的每一节课即可（一般情况下可以直接完成，如果不行，则会尽可能的减少操作次数）
// @author       31415926535x
// @supportURL   https://github.com/31415926535x/CollegeProjectBackup/blob/master/WeibanCourseCheatScript/Readme.md
// @compatible   chrome
// @compatible   firefox
// @license      MIT
// @include      *://*.mycourse.cn/*
// @run-at       document-start
// ==/UserScript==

var List = "list";   // 课程列表
var Detail = "detail";      // 详细的课程页面
var DetailWithoutIframe = "mcwk.mycourse.cn";


var setTimeout_ = 1000;                                          // 设置脚本实际运行的开始时间，网络不好建议时间稍长，1000等于1s
(function (){

    'use strict';

    console.log("Script running.....");
    unsafeWindow.addEventListener("load", main);
    main();
})();

function main(){
    var windowURL = window.location.href;
    console.log(windowURL);
    if(windowURL.indexOf(List) != -1){
        alert("理论上可以直接发送请求完成课程，如果不行，则进行模拟点击等简化操作：\n如果课程是视频，直接拖进度条到最后即可；\n如果是H5页面（需要不停点），等待刷课即可）");
        //var list = document.getElementsByClassName("course");
        //list.forEach(function(item, index){
        //    if(item.getElementsByTagName("i") > 1){
        //        continue;
        //    }
        //    else{
        //        item.click();
        //    }
        //});
    }
    else if(windowURL.indexOf(Detail) != -1){
        var url = document.getElementsByClassName("page-iframe")[0].getAttribute("src");
        console.log(url);
        window.open(url, '_blank').location;
    }
    else if(windowURL.indexOf(DetailWithoutIframe) != -1){
        console.log("start cheat");
        console.log(windowURL);
        finishWxCourse();
        var btn = document.getElementsByClassName("btn-next-end")[0];
        if(btn == null){
            if(document.getElementById("my-video") != null){
                alert("视频");
                console.log("视频");
                myVideo.play();
                sleep(1000).then (() => {
                    myVideo.currentTime = myVideo.duration - 1;
                });
                return;
            }
            else if(document.getElementById("canvas") != null){
                alert("尝试直接请求完成课程");
                finishWxCourse();
            }
            else{
                alert("请等待，页面会自动点击下一步，结束后关闭即可");
                sleep(5000).then (() => {
                    let sz = document.getElementsByClassName("page-item").length;
                    document.getElementsByClassName("page-content-common page-start-btn")[0];
                    var timesRun = 0;
                    setInterval(function (){
                        timesRun += 1;
                        if(timesRun === 30){
                            clearInterval(interval);
                        }
                        document.getElementsByClassName("page-content-common btn-next")[0].click();
                        console.log(233);
                    }, 1000);

                })
            }
            
            return;
        }
        btn.click();

        alert(233);

        btn = document.getElementsByClassName("back-list")[0];
        btn.click();
    }
}
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
