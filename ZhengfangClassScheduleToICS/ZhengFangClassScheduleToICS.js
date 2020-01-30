// ==UserScript==
// @name         新版正方教务系统导出课程表
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  通过对新版正方教务系统的课表页面的解析，实现导出一个适用于大部分ics日历的文件，理论使用于所有使用新版正方教务系统（可对 ``include`` 进行一定的修改以适用不同的学校的链接）
// @author       31415926535x
// @supportURL   https://github.com/ipcjs/bilibili-helper/blob/user.js/bilibili_bangumi_area_limit_hack.md
// @compatible   chrome
// @compatible   firefox
// @license      MIT
// @include      *://jwgl.*.edu.cn/kbcx/xskbcx_cxXskbcxIndex.html*
// @run-at       document-start
// ==/UserScript==


(function (){
    
    'use strict';


    // 在课表上方创建一个点击按钮
    // --------------------------------------------------------------------------
    unsafeWindow.addEventListener ("load", pageFullyLoaded);
    //加载完成后运行
    function pageFullyLoaded(){
        console.log("Fucking ZhengFang...");
        let div = document.getElementsByClassName("btn-toolbar pull-right")[0];
        let btn = document.createElement("button");
        btn.className = "btn btn-default";
        btn.id = "exportbtn";
        let sp = document.createElement("span");
        sp.innerText = "生成课表";
        sp.className = "bigger-120 glyphicon glyphicon-file";
        btn.append(sp);

        let dwnbtn = document.createElement("button");
        dwnbtn.className = "btn btn-default";
        sp = document.createElement("span");
        sp.innerText = "选择本学期第一个星期一:";
        sp.className = "bigger-120 glyphicon glyphicon-time";
        dwnbtn.appendChild(sp);
        let StartDate = document.createElement("input");
        StartDate.type = "date";
        StartDate.value = "2020-01-01";
        div.appendChild(btn);
        dwnbtn.appendChild(StartDate);
        
        let a = document.createElement("a");
        a.innerHTML = "下载ics文件";
        a.style.visibility = "hidden";
        a.className = "bigger-120 glyphicon glyphicon-download-alt";
        dwnbtn.appendChild(a);
        div.appendChild(dwnbtn);


        btn.onclick = function(){
            // 获取本学期的第一个星期一
            Calendar.StartDate = StartDate.value;

            // 获取课表
            // let parseTableData = parseTable();
            // console.log(parseTableData);
            // let parseCoursesData = parseCourses(parseTableData);
            // console.log(parseCoursesData);
            // let generateCalendarData = generateCalendar(parseCoursesData);
            
            // let getFixedIcsData = getFixedIcs(generateCalendarData);
            // console.log(getFixedIcsData);
            // exportIcs(getFixedIcsData, a);
            exportIcs(getFixedIcs(generateCalendar(parseCourses(parseTable()))), a);    // 嘿嘿。。
            alert("ics文件已经生成，请点击下载后导入到您所使用的日历文件；Google Calendar需要自行设置课程的颜色。。。");
        }
    }
    // --------------------------------------------------------------------------


    // 全局变量Week的双引射
    // --------------------------------------------------------------------------
    var Week;
    (function (Week) {
        Week[Week["Monday"] = 1] = "Monday";
        Week[Week["TuesDay"] = 2] = "TuesDay";
        Week[Week["Wednesday"] = 3] = "Wednesday";
        Week[Week["ThursDay"] = 4] = "ThursDay";
        Week[Week["Friday"] = 5] = "Friday";
        Week[Week["Saturday"] = 6] = "Saturday";
        Week[Week["Sunday"] = 7] = "Sunday";
    })(Week || (Week = {}));
    // --------------------------------------------------------------------------

    


    // 从页面中获取课程的 div, 返回对应的星期以及div数组
    // --------------------------------------------------------------------------
    function parseTable(){
        let table = document.getElementById("kbgrid_table_0");
        // console.log(table);
        // let tds = table.getElementsByTagName("td");  // 因为 getElementsByTagName() 方法没有foreach 故使用 queryselectorall()
        let tds = table.querySelectorAll("td");
        // console.log(tds);
        let week = new Array();
        let divs = new Array();
        tds.forEach(element => {
            if(element.hasAttribute("id")){
                if(element.hasChildNodes()){
                    let div = Array.from(element.getElementsByTagName("div"));
                    // let div = element.querySelectorAll("div");
                    divs = divs.concat(div);
                    let wk = Week[element.getAttribute("id")[0]];
                    for(let i = 0; i < div.length; ++i){
                        week.push(wk);
                    }
                }
            }
        });
        return {week: week, divs: divs};        
    }
    // --------------------------------------------------------------------------




    // --------------------------------------------------------------------------
    // 全局变量 课程信息类
    class Course{
        constructor(course){
            if(course){
                this.name = course.name;                // 课程名称
                this.week = course.week;                // 该课程具体是星期几
                this.info = course.info;                // 该课程的一个这个时段的信息
                this.startTime = course.startTime;      // 该课程的开始上课时间
                this.endTime = course.endTime;
                this.startWeek = course.startWeek;      // 该课程的持续上课的起始周，为一个数组
                this.endWeek = course.endWeek;
                this.isSingleOrDouble = course.isSingleOrDouble;
                                                        // 改课程是否是间隔上课，间隔为2
                this.location = course.location;        // 该课程的上课地点
                this.teacher = course.teacher;          // 该课程的任课老师
            }
        }
    }
    // --------------------------------------------------------------------------


    // 获取所有的课程信息，存放到一个 courses 数组中
    // --------------------------------------------------------------------------
    function parseCourses(data){
        var courses = new Array();
        for(let i = 0; i < data.divs.length; ++i){
            let course = new Course();
            course.week = data.week[i];
            course.name = data.divs[i].getElementsByTagName("span")[0].getElementsByTagName("font")[0].innerText;
            course.name = course.name.substr(0, course.name.length - 1);
            data.divs[i].querySelectorAll("p").forEach(p => {
                if(p.getElementsByTagName("span")[0].getAttribute("title") == "节/周"){
                    // 进行起始周数以及持续时间的解析
                    (function(str = p.getElementsByTagName("font")[1].innerText){
                        course.info = str;
                        // console.log(str);
                        let time = str.substring(str.indexOf("(") + 1, str.indexOf(")") + 1 - 1);
                        let wk = str.substring(str.indexOf(")") + 1, str.length).split(",");
                        // console.log(time);
                        // console.log(wk);

                        course.startTime = parseInt(time.substring(0, time.indexOf("-")));
                        course.endTime = parseInt(time.substring(time.indexOf("-") + 1, time.indexOf("节")));

                        
                        course.isSingleOrDouble = new Array();
                        course.startWeek = new Array();
                        course.endWeek = new Array();
                        wk.forEach(w => {
                            if(w.indexOf("单") != -1 || w.indexOf("双") != -1){
                                course.isSingleOrDouble.push(2);
                            }
                            else{
                                course.isSingleOrDouble.push(1);
                            }

                            let startWeek, endWeek;
                            if(w.indexOf("-") == -1){
                                startWeek = endWeek = parseInt(w.substring(0, w.indexOf("周")));
                            }
                            else{
                                startWeek = parseInt(w.substring(0, w.indexOf("-")));
                                endWeek = parseInt(w.substring(w.indexOf("-") + 1, w.indexOf("周")));
                            }
                            course.startWeek.push(startWeek);
                            course.endWeek.push(endWeek);
                        });
                    })();
                }
                else if(p.getElementsByTagName("span")[0].getAttribute("title") == "上课地点"){
                    course.location = p.getElementsByTagName("font")[1].innerText;
                }
                else if(p.getElementsByTagName("span")[0].getAttribute("title") == "教师"){
                    course.teacher = p.getElementsByTagName("font")[1].innerText;
                }
            });
            // console.log(course);
            courses.push(course);
        }
        return courses;
    }
    // --------------------------------------------------------------------------


    // --------------------------------------------------------------------------
    // 日历的一些主要参数，如PRODID、VERSION、CALSCALE、是否提醒以及提醒的时间
    var Calendar;
    (function(Calendar){
        Calendar.PRODID = "-//31415926535x//ICalendar Exporter v1.0//CN";
        Calendar.VERSION = "2.0";
        Calendar.CALSCALE = "GREGORIAN";        // 历法，默认是公历
        Calendar.TIMEZONE = "Asia/Shanghai"     // 时区，默认是上海
        Calendar.ISVALARM = true;               // 提醒，默认是开启
        Calendar.VALARM = "-P0DT0H30M0S";       // 提醒，默认半小时
        Calendar.WKST = "SU";                   // 一周开始，默认是周日

        Calendar.StartDate;                     // 这学期开始日期
    })(Calendar || (Calendar = {}));

    // --------------------------------------------------------------------------


    // --------------------------------------------------------------------------
    // 通过节次确定时间， 默认每天上午8点上课，每节课两小时（无休息时间），下午2点上课
    function getTime(num, StartOrEnd){
        if(num <= 4){
            num = 7 + num + StartOrEnd;
        }
        else{
            num = 9 + num + StartOrEnd;
        }

        return "" + getFixedLen("" + num, 2) + "0000";
    }
    function getFixedLen(s, len){
        if(s.length < len){
            return getFixedLen("0" + s, len);
        }
        else if(s.length > len){
            return s.slice(0, len);
        }
        else{
            return s;
        }
    }
    // 通过周数获得具体的日期（相对学期开始的那一周）
    function getDate(num, wk){
        let date = new Date(Calendar.StartDate.toString());
        date.setDate(date.getDate() + (num - 1) * 7 + Week[wk] - 1);
        let res = "";
        res += getFixedLen(date.getUTCFullYear().toString(), 4);
        res += getFixedLen((date.getUTCMonth() + 1).toString(), 2);
        res += getFixedLen(date.getUTCDate().toString(), 2);
        res += "T";
        return res;
    }
    // --------------------------------------------------------------------------

    // --------------------------------------------------------------------------
    // 日历的生成，由处理过的课程信心来得到一个没有处理行长的ics
    var CRLF = "\n";
    var SPACE = " ";
    function generateCalendar(courses){
        let res = new Array();
        // 首先添加日历的头 VCALDENDAR
        res.push("BEGIN:VCALENDAR");
        res.push("VERSION:" + Calendar.VERSION);
        res.push("PRODID:" + Calendar.PRODID);
        res.push("CALSCALE:" + Calendar.CALSCALE);

        // 将每一个课程信息转化为事件 VEVENT 并添加一个提醒
        console.log(courses);
        courses.forEach(course => {
            for(let i = 0; i < course.isSingleOrDouble.length; ++i){
                res.push("BEGIN:VEVENT");
                res.push("DTSTART:" + getDate(course.startWeek[i], course.week) + getTime(course.startTime, 0));
                res.push("DTEND:" + getDate(course.startWeek[i], course.week) + getTime(course.endTime, 1));
                // res.push("DTSTART;TZID=" + Calendar.TIMEZONE + ":" + getDate(course.startWeek[i], course.week) + getTime(course.startTime, 0));
                // res.push("DTEND;TZID="   + Calendar.TIMEZONE + ":" + getDate(course.startWeek[i], course.week) + getTime(course.endTime, 1));
                res.push("RRULE:FREQ=WEEKLY;WKST=" + Calendar.WKST + ";COUNT=" + (course.endWeek[i] - course.startWeek[i] + course.isSingleOrDouble[i]) / course.isSingleOrDouble[i] + ";INTERVAL=" + course.isSingleOrDouble[i] + ";BYDAY=" + course.week.substr(0, 2).toUpperCase());
                res.push("SUMMARY:" + course.name + " " + course.location + " " + course.teacher + " " + course.info);
                
                if(Calendar.ISVALARM){
                    res.push("BEGIN:VALARM");
                    res.push("ACTION:DISPLAY");
                    res.push("DESCRIPTION:This is an event reminder");
                    res.push("TRIGGER:" + Calendar.VALARM);
                    res.push("END:VALARM");
                }

                res.push("END:VEVENT");
                res.push(CRLF)
            }
        });

        // 建立一个周数事件，持续20周
        (function(){
            for(let i = 1; i < 20; ++i){
                res.push("BEGIN:VEVENT");
                res.push("DTSTART:" + getDate(i, Week[1]) + getTime(-1, 0));
                res.push("DTEND:" + getDate(i, Week[1]) + getTime(-1, 1));
                res.push("SUMMARY:" + "第" + i + "周");
                res.push("END:VEVENT");
                res.push(CRLF)
            }
        })();
        
        res.push("END:VCALENDAR");
        // console.log(res);
        return res;
    }
    // --------------------------------------------------------------------------



    // --------------------------------------------------------------------------
    // 对ics进行格式的处理，每行不超过75个字节，换行用CRLF，对于超出的进行换行，下一行行首用空格
    function getFixedIcs(data){
        let res = "";
        data.forEach(line => {
            if(line.length > 60){
                let len = line.length;
                let index = 0;
                while(len > 0){
                    for(let i = 0; i < index; ++i){
                        res += SPACE;
                    }
                    res += line.slice(0, 60) + CRLF;
                    line = line.slice(61);
                    len -= 60;
                    ++index;
                }
                line = line.slice(0, 60);
            }
            res += line + CRLF;
        });
        return res;
    }
    // --------------------------------------------------------------------------


    // --------------------------------------------------------------------------
    // 导出ics
    function exportIcs(ics, a){
        let link = window.URL.createObjectURL(new Blob([ics], {
            type: "text/x-vCalendar"
        }));
        a.style.visibility = "visible";
        a.setAttribute("href", link);
        a.setAttribute("download", "courses.ics");
    }
    // --------------------------------------------------------------------------
})();