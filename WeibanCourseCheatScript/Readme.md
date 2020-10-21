对微伴http://weiban.mycourse.cn/#/ 上的课程尽可能的快速刷完。

# 食用方法：

+ 安装脚本
+ 进入课程列表页面，可能的链接格式为： http://weiban.mycourse.cn/#/course/list? 此时会弹出提示框（没有的话，刷新即可）
+ 手动点击进入每一个课程，正常情况下，脚本会自动在新标签页打开课程的实际网页，并直接调用完成课程请求，此时会弹出课程完成的提示框（课程网页自带的）；如果没有弹出，脚本会尽可能针对性的减少操作次数：如需要不断点击下一页的课程将会跳转到倒数几个页面位置或者自动点击下一页、视频内容尽可能地的直接拖动进度条到末尾（原网页的视频不可拖动）。
+ 直到所有的课程点击完毕即可。


（本脚本仅针对编写时的情况，可能随着网站的更新，脚本会失效）



# 进一步的操作（可以不看）

观察网页中的 ``wx.js`` 中的 ``finsihWxCousre()`` 函数，显然是完成课程后的请求调用函数，本脚本首先尝试调用该函数来完成课程（但在某些可能页面无效）

理论上一种更加好的刷课方法如下：直接使用python等爬虫获取课程列表所有信息，主要获取课程的 ``userid`` 和 ``jiaoxuejihuaid`` ，即： 

```js
var userid = getQueryString("userCourseId");
var jiaoxuejihuaid = getQueryString("tenantCode");
```

向接口 ``finishWxUrl`` 发送请求即可完成刷课。

```js
function finishWxCourse() {
	try{console.log(exportRoot.currentFrame)}catch(e){}
    try {
        var userid = getQueryString("userCourseId");
        var jiaoxuejihuaid = getQueryString("tenantCode");
        var finishWxHost = document.referrer.replace("http://","").replace("https://","").split("/")[0];
		if(document.referrer=="" || document.referrer==null || document.referrer==undefined){
			finishWxHost = "weiban.mycourse.cn"
		}

        var webUrl = window.location.href;
		var finishWxUrl=getRecordUrl(webUrl);
		if(finishWxHost.indexOf("****") > 0){
            //finishWxUrl = "http://"+finishWxHost+"/pharos/usercourse/finish.do";
			finishWxUrl = "https://"+finishWxHost+"/pharos/usercourse/finish.do";
        }
			 
		var finishData = {"userCourseId": userid, "tenantCode": jiaoxuejihuaid};
        	
        $.ajax({
            async: false,
            url: finishWxUrl,
            type: "GET",
            dataType: "jsonp",
            data: finishData,
            timeout: 5000,

            success : function (data) {
                if (data.msg == "ok") {
                    alert("恭喜，您已完成本微课的学习");
                } else {
                    alert("发送完成失败");
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    } catch (e) {
        alert("报了啥错误" + e)
    }
}
```