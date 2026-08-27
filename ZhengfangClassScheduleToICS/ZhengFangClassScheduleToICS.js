// ==UserScript==
// @name         新版正方教务系统导出课程表（V9.0修复版）
// @namespace    http://tampermonkey.net/
// @version      4.9-fixed
// @description  适配正方V9.0：修复周次正则(1-12周,14-16周错位)；多时段课同格继承课程名；删除"第N周"干扰事件；标题只放课名；自动对齐周一
// @author       31415926535x / fixed by doubao
// @compatible   chrome
// @compatible   firefox
// @license      MIT
// @include      *://jwgl.*.edu.cn/*
// @include      *://xjwgl.*.edu.cn/*
// @run-at       document-start
// ==/UserScript==

var ClassScheduleToICSURL = "kbcx/xskbcx_cxXskbcxIndex.html";
var ExamScheduleToICSURL = "kwgl/kscx_cxXsksxxIndex.html";
var StudentEvalutionURL = "xspjgl/xspj_cxXspjIndex.html";
var setTimeout_ = 4000;

(function (){
    'use strict';
    console.log("[ICS导出脚本] Script running.....");
    unsafeWindow.addEventListener("load", main);
})();

function main(){
    var windowURL = window.location.href;
    if(windowURL.indexOf(ClassScheduleToICSURL) != -1){
        ClassScheduleToICS();
    }
    else if(windowURL.indexOf(ExamScheduleToICSURL) != -1){
        ExamScheduleToICS();
    }
    else if(windowURL.indexOf(StudentEvalutionURL) != -1){
        document.getElementById("btn_yd").onclick = function(){
            window.setTimeout(StudentEvalution, setTimeout_);
        }
    }
}

function ClassScheduleToICS(){
    console.log("[ICS导出脚本] ClassScheduleToICS");
    pageFullyLoaded();

    function pageFullyLoaded(){
        console.log("[ICS导出脚本] Fucking ZhengFang...");

        // 按钮容器加空值检查
        let div = document.getElementsByClassName("btn-toolbar pull-right")[0];
        if(!div){
            div = document.querySelector(".btn-toolbar") || document.querySelector(".pull-right");
        }
        if(!div){
            console.error("[ICS导出脚本] 找不到按钮容器 .btn-toolbar.pull-right");
            return;
        }

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
        sp.innerText = "选择本学期第一个星期一:     ";
        sp.className = "bigger-120 glyphicon glyphicon-time";
        dwnbtn.appendChild(sp);

        let StartDate = document.createElement("input");
        StartDate.type = "date";
        // 手动构造 YYYY-MM-DD，避免 toLocaleDateString 格式不确定
        let now = new Date();
        StartDate.value = now.getFullYear() + "-" +
            String(now.getMonth() + 1).padStart(2, '0') + "-" +
            String(now.getDate()).padStart(2, '0');

        div.appendChild(btn);
        dwnbtn.appendChild(StartDate);
        div.appendChild(dwnbtn);

        // onclick 全包 try-catch
        btn.onclick = function(){
            try{
                let rawDate = StartDate.value;
                if(!rawDate){
                    alert("请先选择本学期第一个星期一的日期！");
                    return;
                }
                // 自动对齐到该周的周一：即使用户选了其他星期，也自动调整
                let d = new Date(rawDate + "T00:00:00");
                let dayOfWeek = d.getDay(); // 0=周日, 1=周一, ..., 6=周六
                let diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                d.setDate(d.getDate() + diffToMonday);
                startDate = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, '0') + "-" + String(d.getDate()).padStart(2, '0');
                if(diffToMonday !== 0){
                    console.log("[ICS导出脚本] 所选日期 " + rawDate + " 不是周一，已自动对齐到该周周一：" + startDate);
                }else{
                    console.log("[ICS导出脚本] 开始日期（周一）：", startDate);
                }

                let tableData = parseTable();
                console.log("[ICS导出脚本] parseTable 结果：divs数量 =", tableData.divs.length);

                let courses = parseCourses(tableData);
                console.log("[ICS导出脚本] 解析到的课程：", courses);

                if(courses.length === 0){
                    alert("未解析到任何课程！\n可能原因：\n1. 课表尚未加载完成（请等课表完全显示后再点）\n2. V9.0页面结构已大幅变更\n请按F12查看Console中的调试信息。");
                    return;
                }

                generateCalendar(courses);
                alert("ics文件已经生成，请导入到您所使用的日历文件；（Google Calendar需要自行设置课程的颜色。。。）\n如果发现获取到的数据有误，请在github上提出issues，\n并尽量使用F12进入开发者模式，附上截屏（含有course的数据以及课程信息页面，注意个人信息）");
            }catch(e){
                console.error("[ICS导出脚本] 课表导出失败：", e);
                alert("课表导出失败！\n错误信息：" + e.message + "\n\n请按F12打开开发者工具，切换到Console（控制台）标签，\n将红色报错信息截图，用于进一步定位问题。");
            }
        }
    }

    var startDate;

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

    // 查找课表所在document（可能在iframe中）
    function getScheduleDocument(){
        if(document.getElementById("kbgrid_table_0")){
            return document;
        }
        let iframes = document.querySelectorAll("iframe");
        for(let i = 0; i < iframes.length; i++){
            try{
                let ifrDoc = iframes[i].contentDocument || iframes[i].contentWindow.document;
                if(ifrDoc && ifrDoc.getElementById("kbgrid_table_0")){
                    console.log("[ICS导出脚本] 在iframe中找到课表");
                    return ifrDoc;
                }
            }catch(e){}
        }
        return null;
    }

    function parseTable(){
        let doc = getScheduleDocument();
        if(!doc){
            throw new Error("找不到课表表格 #kbgrid_table_0！课表可能在跨域iframe中，或V9.0已更改表格ID。");
        }
        let table = doc.getElementById("kbgrid_table_0");
        let tds = table.querySelectorAll("td");
        let week = new Array();
        let divs = new Array();
        let ownerTd = new Array();   // 记录每个div所属的td

        tds.forEach(element => {
            if(element.hasAttribute("id")){
                let div = Array.from(element.getElementsByTagName("div"));
                if(div.length > 0){
                    divs = divs.concat(div);
                    let wk = Week[element.getAttribute("id")[0]];
                    for(let i = 0; i < div.length; ++i){
                        week.push(wk);
                        ownerTd.push(element);
                    }
                }
            }
        });

        if(divs.length === 0){
            console.warn("[ICS导出脚本] 未在td中找到任何课程div");
        }
        return {week: week, divs: divs, ownerTd: ownerTd};
    }

    class Course{
        constructor(course){
            if(course){
                this.name = course.name;
                this.week = course.week;
                this.info = course.info;
                this.startTime = course.startTime;
                this.endTime = course.endTime;
                this.startWeek = course.startWeek;
                this.endWeek = course.endWeek;
                this.isSingleOrDouble = course.isSingleOrDouble;
                this.location = course.location;
                this.teacher = course.teacher;
            }
        }
    }

    function parseCourses(data){
        var courses = new Array();
        // 预处理：记录每个td内第一个有span.title的div的课程名，供无title的div继承
        let tdTitleMap = new Map();
        for(let i = 0; i < data.divs.length; ++i){
            let div = data.divs[i];
            let td = data.ownerTd[i];
            let titleSpan = div.querySelector("span.title");
            if(titleSpan){
                let titleFont = titleSpan.querySelector("font");
                let nm = "";
                if(titleFont && titleFont.innerText.trim()){
                    nm = titleFont.innerText;
                }else if(titleSpan.innerText.trim()){
                    nm = titleSpan.innerText;
                }
                if(nm && !tdTitleMap.has(td)){
                    tdTitleMap.set(td, nm);
                }
            }
        }

        for(let i = 0; i < data.divs.length; ++i){
            let course = new Course();
            course.week = data.week[i];
            let div = data.divs[i];
            let ownerTd = data.ownerTd[i];

            // ===== 课程名获取 =====
            course.name = "";
            // 方式1：本div的span.title
            let titleSpan = div.querySelector("span.title");
            if(titleSpan){
                let titleFont = titleSpan.querySelector("font");
                if(titleFont && titleFont.innerText.trim()){
                    course.name = titleFont.innerText;
                }else if(titleSpan.innerText.trim()){
                    course.name = titleSpan.innerText;
                }
            }
            // 方式2：同一td内前一个有span.title的div的课程名（V9.0多时段课共用一个标题格）
            if(!course.name && ownerTd){
                let inherited = tdTitleMap.get(ownerTd);
                if(inherited) course.name = inherited;
            }
            // 方式3：div纯文本第一行，过滤含"节"/"周"的行
            if(!course.name){
                let rawLines = div.innerText.split('\n');
                for(let _j = 0; _j < rawLines.length; _j++){
                    let trimmed = rawLines[_j].trim();
                    if(trimmed && !trimmed.includes("节") && !trimmed.includes("周") && trimmed.length > 1){
                        course.name = trimmed;
                        break;
                    }
                }
            }
            if(!course.name){
                console.warn("[ICS导出脚本] 第 " + i + " 个课程块未能获取课程名，div内容：", div.innerHTML.substring(0, 200));
            }

            // 清理课程名：去前后空格、去☆、去【调】、去末尾的*号
            course.name = course.name.replace(/^\s+/, '').replace(/\s+$/, '');
            course.name = course.name.replace("☆", "");
            course.name = course.name.replace("【调】", "");
            course.name = course.name.replace(/\*+$/, '');

            // ===== p标签解析 =====
            div.querySelectorAll("p").forEach(p => {
                let pSpan = p.getElementsByTagName("span")[0];
                if(!pSpan) return;
                let title = (pSpan.getAttribute("title") || "").trim();
                let fonts = p.getElementsByTagName("font");

                if(title == "节/周"){
                    if(fonts.length < 2) return;
                    (function(str = fonts[1].innerText){
                        course.info = str;
                        let time = str.substring(str.indexOf("(") + 1, str.indexOf(")"));
                        let wk = str.substring(str.indexOf(")") + 1, str.length).split(",");
                        course.startTime = parseInt(time.substring(0, time.indexOf("-")));
                        course.endTime = parseInt(time.substring(time.indexOf("-") + 1, time.indexOf("节")));

                        course.isSingleOrDouble = new Array();
                        course.startWeek = new Array();
                        course.endWeek = new Array();
                        wk.forEach(w => {
                            w = w.trim();
                            if(!w) return;
                            // 去除"第"字
                            w = w.replace(/^第/, '');
                            if(w.indexOf("单") != -1 || w.indexOf("双") != -1){
                                course.isSingleOrDouble.push(2);
                            }
                            else{
                                course.isSingleOrDouble.push(1);
                            }
                            // ===== 修复：用正则匹配完整"起-止"段，兼容"1-12周,14-16周" =====
                            // 先尝试匹配 "数字-数字"（范围周）
                            let rangeMatch = w.match(/(\d+)\s*-\s*(\d+)/);
                            if(rangeMatch){
                                course.startWeek.push(parseInt(rangeMatch[1]));
                                course.endWeek.push(parseInt(rangeMatch[2]));
                            }else{
                                // 无范围，单周：匹配第一个数字
                                let single = w.match(/\d+/);
                                if(single){
                                    let v = parseInt(single[0]);
                                    course.startWeek.push(v);
                                    course.endWeek.push(v);
                                }else{
                                    console.warn("[ICS导出脚本] 课程 '" + course.name + "' 周次解析失败，原始字符串='" + w + "'，已跳过该时段");
                                    return;
                                }
                            }
                        });
                    })();
                }
                else if(title == "上课地点"){
                    if(fonts.length >= 2) course.location = fonts[1].innerText.trim();
                }
                else if(title == "教师"){
                    if(fonts.length >= 2) course.teacher = fonts[1].innerText.trim();
                }
            });

            courses.push(course);
        }
        return courses;
    }

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

    function getDate(num, wk){
        let date = new Date(startDate.toString());
        date.setDate(date.getDate() + (num - 1) * 7 + Week[wk] - 1);
        let res = "";
        res += getFixedLen(date.getUTCFullYear().toString(), 4);
        res += getFixedLen((date.getUTCMonth() + 1).toString(), 2);
        res += getFixedLen(date.getUTCDate().toString(), 2);
        res += "T";
        return res;
    }

    function generateCalendar(courses){
        let res = new ICS();
        console.log(courses);
        console.log('======================!!!============================')
        console.log('如果出现数据有误等情况，请仔细观察上面获取到的课程信息是否和页面的课程信息一致')

        courses.forEach(course => {
            if(!course.isSingleOrDouble || course.isSingleOrDouble.length === 0){
                console.warn("[ICS导出脚本] 课程 '" + course.name + "' 缺少节/周信息，跳过");
                return;
            }
            // 调试：打印每门课的解析结果
            console.log("[ICS导出脚本] 课程：" + course.name +
                " | 星期：" + course.week +
                " | 节次：" + course.startTime + "-" + course.endTime +
                " | 周次：" + course.startWeek.join(",") + "-" + course.endWeek.join(",") +
                " | 地点：" + course.location +
                " | 教师：" + course.teacher);
            for(let i = 0; i < course.isSingleOrDouble.length; ++i){
                // 双重保险：跳过周次为NaN的时段
                if(isNaN(course.startWeek[i]) || isNaN(course.endWeek[i]) || !course.week){
                    console.warn("[ICS导出脚本] 课程 '" + course.name + "' 第" + i + "个时段周次信息无效(startWeek=" + course.startWeek[i] + ",endWeek=" + course.endWeek[i] + ",week=" + course.week + ")，已跳过");
                    continue;
                }
                let e = new ICSEvent("" + getDate(course.startWeek[i], course.week) + getTime(course.startTime, 0),
                                    "" + getDate(course.startWeek[i], course.week) + getTime(course.endTime, 1),
                                    "" + course.name,
                                    "" + (course.teacher || "") + (course.location ? " | " + course.location : ""));
                e.setRRULE("WEEKLY", res.Calendar.WKST,
                            "" + (course.endWeek[i] - course.startWeek[i] + course.isSingleOrDouble[i]) / course.isSingleOrDouble[i],
                            "" + course.isSingleOrDouble[i],
                            "" + course.week.substr(0, 2).toUpperCase());
                res.pushEvent(e);
            }
        });

        // 不再生成"第N周"独立事件：它们会干扰日历视图，且用户不需要周数标记
        // （原脚本生成20个周标记事件，但没有SUMMARY标题，导致日历显示空卡片）

        res.pushCalendarEnd();
        res.exportIcs();
    }
}

function ExamScheduleToICS(){
    console.log("ExamScheduleToICS");
    pageFullyLoaded();
    function pageFullyLoaded(){
        let div = document.getElementsByClassName("col-sm-12")[1];
        let btn = document.createElement("button");
        btn.className = "btn btn-primary btn-sm";
        btn.id = "exportbtn";
        btn.innerText = "导出ICS文件";
        div.appendChild(btn);
        btn.onclick = function(){
            try{
                generateCalendar();
                alert("ics文件已经生成，请导入到您所使用的日历文件；");
            }catch(e){
                console.error("[ICS导出脚本] 考试导出失败：", e);
                alert("考试导出失败：" + e.message);
            }
        }
        document.getElementById("search_go").click();
    }
    function generateCalendar(){
        let table = document.getElementById("tabGrid");
        let trs = table.getElementsByTagName("tr");
        class EXAM{
            constructor(e){
                if(e){
                    this.course = e.course;
                    this.teacher = e.teacher;
                    this.examNmae = e.examNmae;
                    this.timeS = e.timeS;
                    this.timeT = e.timeE;
                    this.location = e.location;
                }
            }
        }
        let exams = new Array();
        for(let i = 1; i < trs.length; ++i){
            let exam = new EXAM();
            exam.loction = "";
            trs[i].querySelectorAll("td").forEach(tr => {
                let attr = tr.getAttribute("aria-describedby");
                if(attr == "tabGrid_kcmc"){
                    exam.course = tr.innerText;
                }
                else if(attr == "tabGrid_jsxx"){
                    exam.teacher = tr.innerText.substring(tr.innerText.indexOf("/") + 1, tr.innerText.length);
                }
                else if(attr == "tabGrid_ksmc"){
                    exam.examNmae = tr.innerText;
                }
                else if(attr == "tabGrid_kssj"){
                    let time = tr.innerText;
                    let date = "" + time[0] + time[1] + time[2] + time[3] + time[5] + time[6] + time[8] + time[9] + "T";
                    exam.timeS = date + time[11] + time[12] + time[14] + time[15] + "00";
                    exam.timeE = date + time[17] + time[18] + time[20] + time[21] + "00";
                }
                else if(attr == "tabGrid_cdmc"){
                    exam.location = tr.innerText;
                }
                else if(attr == "tabGrid_cdxqmc"){
                    exam.location += " " + tr.innerText;
                }
                else if(attr == "tabGrid_zwh"){
                    exam.location += "  " + tr.innerText;
                }
            });
            exams.push(exam);
        }
        console.log(exams);
        let ics = new ICS();
        exams.forEach(ex => {
            let e = new ICSEvent("" + ex.timeS, "" + ex.timeE, "" + ex.course + " " + ex.examNmae + " " + ex.teacher + " " + ex.location);
            ics.pushEvent(e);
        });
        ics.pushCalendarEnd();
        ics.exportIcs();
    }
}

function StudentEvalution(){
    console.log("done......");
    ModifyHTML();
    function ModifyHTML(){
        console.log("modify...")
        let panel_body1 = document.getElementsByClassName("panel panel-default")[1];
        let panel_body2 = document.getElementsByClassName("panel-body")[3];
        let blockquote = panel_body2.getElementsByTagName("blockquote")[0].cloneNode(true);
        blockquote.getElementsByTagName("p")[0].innerText = "一键评价";
        let table = panel_body2.getElementsByTagName("table")[0].cloneNode(true);
        table.removeAttribute("data-pjzbxm_id"); table.removeAttribute("data-qzz");
        let tbody = table.getElementsByTagName("tbody")[0];
        let tr = tbody.getElementsByTagName("tr")[0];
        while(tbody.getElementsByTagName("tr").length > 1){
            tbody.removeChild(tbody.getElementsByTagName("tr")[1]);
        }
        tr.removeAttribute("data-zsmbmcb_id"); tr.removeAttribute("data-pjzbxm_id"); tr.removeAttribute("data-pfdjdmb_id");
        tr.getElementsByTagName("td")[0].innerText = "选择的最高分:";
        let inputs = tr.getElementsByClassName("radio-pjf");
        for(let i = 0; i < 5; ++i){
            inputs[i].removeAttribute("name");
            inputs[i].removeAttribute("data-pfdjdmxmb_id");
            inputs[i].setAttribute("name", "StudentEvalution");
        }
        inputs[0].setAttribute("checked", "checked");

        let btn = document.createElement("button");
        btn.className = "btn btn-default";
        let sp = document.createElement("span");
        sp.innerText = "一键评价";
        sp.className = "bigger-120 glyphicon glyphicon-ok";
        btn.append(sp);
        btn.setAttribute("id", "btn_StudentEvalution");
        btn.onclick = function(){
            let score = 5;
            let checked = document.getElementsByName("StudentEvalution");
            for(let i = 0; i < checked.length; ++i){
                if(checked[i].checked){
                    score = checked[i].getAttribute("data-dyf")
                }
            }
            console.log("设置的最高分数为: " + score);
            score = 5 - score;
            let inputs = document.getElementsByClassName("panel-body")[3].getElementsByTagName("input");
            let flag = Math.round(Math.random() * (inputs.length / 5));
            console.log(flag);
            for(let i = score; i < inputs.length; i += 5){
                if(Math.round(i / 5) == flag){
                    inputs[i + 1].setAttribute("checked", "checked");
                }
                else{
                    inputs[i].setAttribute("checked", "checked");
                }
            }
        }
        let td = document.createElement("td");
        td.appendChild(btn);
        tr.appendChild(td);
        panel_body1.prepend(table);
        panel_body1.prepend(blockquote);
    }
}

var CRLF = "\r\n";  // ICS规范要求CRLF换行，原脚本用\n导致部分日历应用解析RRULE失败
var SPACE = " ";
class ICS{
    Calendar;
    ics;
    res;
    constructor(){
        (function(Calendar){
            Calendar.PRODID = "-//31415926535x//ICalendar Exporter v1.0//CN";
            Calendar.VERSION = "2.0";
            Calendar.CALSCALE = "GREGORIAN";
            Calendar.TIMEZONE = "Asia/Shanghai"
            Calendar.ISVALARM = true;
            Calendar.VALARM = "-P0DT0H30M0S";
            Calendar.WKST = "SU";
        })(this.Calendar || (this.Calendar = {}));
        this.ics = new Array();
        this.ics.push("BEGIN:VCALENDAR");
        this.ics.push("VERSION:" + this.Calendar.VERSION);
        this.ics.push("PRODID:" + this.Calendar.PRODID);
        this.ics.push("CALSCALE:" + this.Calendar.CALSCALE);
    }
    pushEvent(e){
        this.ics.push("BEGIN:VEVENT");
        this.ics.push(e.getDTSTART());
        this.ics.push(e.getDTEND());
        if(e.isrrule == true)this.ics.push(e.getRRULE());
        this.ics.push(e.getSUMMARY());
        if(e.DESCRIPTION)this.ics.push(e.getDESCRIPTION());
        if(this.Calendar.ISVALARM == true)this.pushAlarm();
        this.ics.push("END:VEVENT");
        this.ics.push(CRLF);
    }
    pushAlarm(){
        this.ics.push("BEGIN:VALARM");
        this.ics.push("ACTION:DISPLAY");
        this.ics.push("DESCRIPTION:This is an event reminder");
        this.ics.push("TRIGGER:" + this.Calendar.VALARM);
        this.ics.push("END:VALARM");
    }
    pushCalendarEnd(){
        this.ics.push("END:VCALENDAR");
    }
    getFixedIcs(){
        this.res = "";
        this.ics.forEach(line => {
            if(line.length <= 60){
                this.res += line + CRLF;
            }else{
                // 第一行不加前导空格
                this.res += line.slice(0, 60) + CRLF;
                line = line.slice(60);
                // 续行每行前加一个空格（ICS规范）
                while(line.length > 0){
                    this.res += SPACE + line.slice(0, 60) + CRLF;
                    line = line.slice(60);
                }
            }
        });
        return this.res;
    }
    exportIcs(){
        this.getFixedIcs();
        let link = window.URL.createObjectURL(new Blob([this.res], {
            type: "text/x-vCalendar"
        }));
        let a = document.createElement("a");
        a.setAttribute("href", link);
        a.setAttribute("download", "courses.ics");
        document.body.appendChild(a);  // Firefox兼容
        a.click();
        document.body.removeChild(a);
        console.log("[ICS导出脚本] ics文件已触发下载，文件大小：" + this.res.length + " 字符");
    }
}

class ICSEvent{
    constructor(DTSTART, DTEND, SUMMARY, DESCRIPTION){
        this.DTSTART = DTSTART;
        this.DTEND = DTEND;
        this.SUMMARY = SUMMARY;
        this.DESCRIPTION = DESCRIPTION || "";
    }
    isrrule = false;
    RRULE;
    setRRULE(FREQ, WKST, COUNT, INTERVAL, BYDAY){
        this.isrrule = true;
        this.RRULE = "RRULE:FREQ=" + FREQ + ";WKST=" + WKST + ";COUNT=" + COUNT + ";INTERVAL=" + INTERVAL + ";BYDAY=" + BYDAY;
    }
    getRRULE(){
        return "" + this.RRULE;
    }
    getDTSTART(){
        return "DTSTART:" + this.DTSTART;
    }
    getDTEND(){
        return "DTEND:" + this.DTEND;
    }
    getSUMMARY(){
        return "SUMMARY:" + this.SUMMARY;
    }
    getDESCRIPTION(){
        return "DESCRIPTION:" + this.DESCRIPTION;
    }
}
