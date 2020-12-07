$(function(){
    let $$ = mdui.$;

    let username = null;
    let usermessage = null;
    let users = [];
    let userTo = null;
    let msg = null;
    let imgbtn = $("#imgbtn")[0];
    let userList = $$("#userList")[0];

    let socket = io.connect();
    
    // 聊天相关
    function setUsername(){        
        username = $("#regbox")[0].value.trim();
        console.log(username);
        if(username){
            socket.emit('login', {username: username});
        }
    }
    function sendMsg(){
        msg = $("#sendmsg")[0].value.trim();
        if(msg){
            socket.emit('sendMessage', { message: msg, username: username});
            console.log(msg);
        }
        $("#sendmsg")[0].value = "";
    }
    function showMsg(_msg, _user){
        appendMsg(_msg, _user);
    }
    function sendImg(event){
        //检测浏览器是否支持FileRead
        if (typeof FileReader === 'undefined') {
            alert('您的浏览器不支持，该更新了');
            //禁用Button
            // imgbtn.attr('disabled', 'disabled');
        }
        console.log(event);
        let file = event.target.files[0];
        //重置一下form元素，否则如果发同一张图片不会触发change事件
        $("#resetform")[0].reset();
        // console.log(`files: ${event.target.files}`);
        // console.log(file);
        // 可以多个判断，实现视频、音乐等的上传，当然要同时增加响应的页面绘制函数
        if (!/image\/\w+/.test(file.type)) {
            alert('只能选择图片');
            return false;
        }
        let reader = new FileReader();
        // console.log(reader);

        reader.readAsDataURL(file);
        reader.onload = function (e) {
            let _this = this;
            socket.emit('sendImg', { username: username, DataUrl: _this.result });
        }
        console.log(file);
    }
    function showImg(imgBaseUrl, _username){
        appendImg(imgBaseUrl, _username);
        
    }

    function beginChat(data){
        setAUserList(data.userGroup);
        document.getElementById("chatbox").innerHTML = "";
    }

    

    // Events
    // 注册按钮
    document.getElementById("regbtn").onclick = function(){
        setUsername();
        // document.getElementById("regdiv").classList.replace("mdui-dialog-open", "mdui-dialog-close");
        document.getElementById("regdiv").remove();
    }
    document.getElementById("sendbtn").onclick = function(){
        sendMsg();
    };
    document.getElementById("imgbtn").onclick = function(){
        document.getElementById("imginput").click();
    }
    document.getElementById("imginput").onchange = function(event){
        sendImg(event);
    }
    function setImgPreview(img){
        img.onclick = function(){
            let imgUrl = img.getAttribute("src");
            var windowW = $(window).width();//获取当前窗口宽度 
            var windowH = $(window).height();//获取当前窗口高度 
            console.log(windowH);
            console.log(windowW);
            $$("body").append(`<!-- 图片点击放大 -->
            <div id="imgPreview" class="mdui-dialog mdui-dialog-open" style="display: block; padding: 5px; height: ${windowH}; width: ${windowW}">
            <img id="_imgPreview" class="mdui-img-fluid" src="${imgUrl}"/>
            </div>`)
            document.getElementById("imgPreview").onclick = function(){
                document.getElementById("imgPreview").remove();
            }
        };
    }
    // document.getElementById("imgPreview")
    

    // socket.on
    socket.on('loginSuccess', (data) => {
        if(username === data.username){
            // users.push({username: data.username, imgUrl: -1});
            users.push({username: username});
            beginChat(data);
        }
        else{
            showUserLeave(1, data);
            users.push({username: data.username});
            
        }
    });
    socket.on('usernameErr', (data) => {
        $$("#regTextField")[0].addClass('.mdui-textfield-invalid');
    });
    socket.on('receiveMessage', (data) => {
        showMsg(data.message, data.username);
    });
    socket.on('receiveImg', (data) => {
        showImg(data.DataUrl, data.username);
    });
    socket.on('someOneLeave', (data) => {
        showUserLeave(-1, data.username);
        deleteAUserFromList(data.username);
    });
    // sigle chat

    // 工具类

    function appendAUserToList(_username){
        $(userList).append('<li class="mdui-list-item mdui-ripple"><!-- <div class="mdui-list-item-avatar"><img src="avatar1.jpg"/></div> --><i class="mdui-list-item-icon mdui-icon material-icons">account_box</i><div class="mdui-list-item-content">' + _username + '</div><i class="mdui-list-item-icon mdui-icon material-icons">chat_bubble</i></li>')
    }
    function deleteAUserFromList(_username){
        users.forEach(function(user, index){
            if(user.username === _username){
                users.splice(index, 1);
            }
        });
        $(userList).find({username: _username}).remove();
        mdui.snackbar({
            message: _username + '离开了。。。'
        });
    }
    function setAUserList(users){
        for(let user of users){
            if(user.username !== username){
                appendAUserToList(user.username);
            }
        }
    }
    function showUserLeave(flag, _username){
        if(flag == 1){
            appendAUserToList(_username);
        }
        else{
            deleteAUserFromList(_username);
        }
    }
    function appendMsg(_msg, _usr){
        let firstname = _usr.substring(0, 1);
        if(_usr === username){
            $$("#chatbox").append(`<div>
            <div class="chat_user chat_user_send">
                <div class="chat_user_icon">${firstname}</div>
                <div class="chat_user_name">${_usr}</div>
            </div>
            <div class="chatbox chat_send">
                <span class="chat_msg">${_msg}</span>
            </div>    
        </div`)
        }
        else{
            $$("#chatbox").append(`<div>
            <div class="chat_user chat_user_rec">
                <div class="chat_user_icon">${firstname}</div>
                <div class="chat_user_name">${_usr}</div>
            </div>
            <div class="chatbox chat_rec">
                <span class="chat_msg">${_msg}</span>
            </div>    
        </div`)
        }
    }
    function appendImg(imgBaseUrl, _usr){
        let firstname = _usr.substring(0, 1);
        if(_usr === username){
            $$("#chatbox").append(`<div>
            <div class="chat_user chat_user_send">
                <div class="chat_user_icon">${firstname}</div>
                <div class="chat_user_name">${_usr}</div>
            </div>
            <div class="chatbox chat_send">
                <span class="chat_msg">
                    <img class="_img" src="${imgBaseUrl}" style="max-width: 100%"/>
                </span>
            </div>    
        </div`)
        }
        else{
            $$("#chatbox").append(`<div>
            <div class="chat_user chat_user_rec">
                <div class="chat_user_icon">${firstname}</div>
                <div class="chat_user_name">${_usr}</div>
            </div>
            <div class="chatbox chat_rec">
                <span class="chat_msg">
                    <img class="_img" src="${imgBaseUrl}" style="max-width: 100%"/>
                </span>
            </div>    
        </div`)
        }
        let imgs = document.getElementsByClassName("_img");
        setImgPreview(imgs[imgs.length - 1]);
    }
});