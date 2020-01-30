window.onload = function(){
    
    console.log(2333);
    // var xmlHttp = new XMLHttpRequest();
    // xmlHttp.open("POST", "/ApplicationIntegrationView/KeysSelect");
    // xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    // xmlHttp.onreadystatechange = function () {
        //     if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
            //         console.log(xmlHttp.responseText);
            //         console.log()
            //     }
            // }
            // xmlHttp.send();
    $.ajax({
        type: "POST",
        async: true,          
        url: "/ApplicationIntegrationView/KeysSelect",
        dataType : "json",
        success: function(result) {
            console.log(result);
            DrawKeysSelect(result);
        },
        error: function(errorMsg) {
            //请求失败时执行该函数
            console.log("请求数据失败!");
            console.log(errorMsg);
        }
    });
}
        

function DrawKeysSelect(json){
    console.log(233);
    var keyselect = document.getElementById("key-select");
    keyselect.removeChild(keyselect.getElementsByTagName("form")[0]);
    // console.log(json);
    
    var keys = json["cols"];
    // mdui.mutation();
    var $$ = mdui.JQ;
    $$.each(keys, function(i,value){
        console.log(i + ":: " + value.isSelect);
    });
    $$(keyselect).append('<form id="keyselect"><form>');
    var form = $$('form');
    $$(form).append('<table class="mdui-table"></table>');
    // var table = form.children()[0];
    var table = $$(form).find('table')[0];
    // console.log(table);
    // var str = '<thead></thead>';
    // $$(table).append(str);
    // console.log(table);
    // var thead = $$(table).children()[0];
    // var thead = $$(table).find('thead')[0];
    var thead = table;
    str = '<tr></tr>';
    $$(thead).append(str);
    // var tr = $$(thead).children()[0];
    var tr = $$(thead).find('tr')[0];
    $$.each(keys, function(i, v){
        $$(tr).append('<th>' + v.name + '</th>');
    });
    $$(tr).append('<th>Option</th>');


    $$(table).append('<tbody></tbody>');
    var tbody = $$(table).find('tbody')[0];
    $$(tbody).append('<tr></tr>')
    var tr = $$(tbody).find('tr')[0];
    $$.each(keys, function(i, v){
        // var tr = tbody.children(i);
        $$(tr).append('<td></td>');
        var td = $$(tr).find('td')[i];
        $$(td).append('<div></div>');
        var div = $$(td).find('div')[0];
        if(v.isSelect == "true"){
            var selectstr = '<select class="mdui-select" id="' + v.xmlname + '" name="' + v.xmlname + '"></select>';
            $$(div).append(selectstr);
            // var select = form.find('select')[selecti];
            var select = $$(div).find('select')[0];
            for(var key in v.keys){
                // TODO: 未做美化
                var str = '<option value="' + v.keys[key] + '">' + v.keys[key] + '</option>';
                // console.log(str);
                $$(select).append(str);
            }
            // 添加一个空项
            $$(select).append('<option value=""></option>');
        }
        else{
            $$(div).append('<input class="mdui-textfield-input" type="' + v.xmlname + '" name="' + v.xmlname + '"/>');
            console.log(2333);
        }
    });

    // submit btn:
    $$(tr).append('<td></td>');
    var td = $$(tr).find('td')[keys.length];
    var btn = '<button class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent" type="button" id="submitbtn">查询</button>';
    $$(td).append(btn);

    document.getElementById('submitbtn').addEventListener('click', function(){
        console.log('submit');
        var str = $$('form').serializeArray();
        console.log(JSON.stringify(str));
        getqry(JSON.stringify(str));
    });
}