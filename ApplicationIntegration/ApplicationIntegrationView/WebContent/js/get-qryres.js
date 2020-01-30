function getqry(send){
    // 根据查询的要求来获取数据：
    console.log("getqrt" + send);
    $.ajax({
        type: "post",
        // async: true,
        dataType: "json",
        url: "/ApplicationIntegrationView/DatabasesQry",
        data: send,
        success: function(result){
            console.log("get qrt data");
            console.log(result);
            changeTable(result);
            console.log("data has change in table");
        },
        error: function(errorMsg){
            console.log('error' + errorMsg);
        }
    });
}

function changeTable(json){
    // 清空原来的数据表
    var tablediv = document.getElementById("get-qryres");
    tablediv.removeChild(tablediv.getElementsByTagName("table")[0]);

    var $$ = mdui.JQ;
    $$.each(json, function(i, val){
        console.log(i + "::" + val[0].xmlname);
    });
    $$(tablediv).append('<table class="mdui-table mdui-talbe-hoverable"></table>');
    var table = $$(tablediv).find('table')[0];

    // 绘制表头
    $$(table).append('<tr></tr>');
    var tr = $$(table).find('tr')[0];
    // 为删除按钮挪位置
    $$(tr).append('<th>option</th>');
    $$.each(json[0], function(i, val){
        $$(tr).append('<th value="' + val.xmlname + '">' + val.name + '</th>');
    });

    $$(table).append('<tbody></tbody>');
    var tbody = $$(table).find('tbody')[0];

    $$.each(json, function(i, val){
        if(i != 0){
            $$(tbody).append('<tr nid="' + val[0].value + '"></tr>')
            tr = $$(tbody).find('tr')[i - 1];
            // 添加一个删除按钮
            deletebtn(tr);

            $$.each(val, function(j, v){
                let str;
                if(v != null){
                    str = '<td id="' + v.xmlname + '" value="' + v.value + '">' + v.value + '</td>';
                }
                else{
                    str = '<td></td>'                    
                }
                $$(tr).append(str);
            });
        }
    });
    
    function deletebtn(tr){
        let btnstr = '<button class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent" type="button" id="deletebtn">删除</button>';
        $$(tr).append(btnstr);
        let btn = $$(tr).find('button')[0];
        // btn = $$(tr).find('btn')[i];
        $$(btn).on('click', function(e){
            console.log(e);
            console.log('delete');
            console.log($$(btn).parent().attr('nid'));
            Delete($$(btn).parent().attr('nid'));
            // 删除这一行
            $$(btn).parent().remove();
        });
        // let btn = document.createElement("button");
        // btn.innerText = "删除";
        // btn.className = "mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent";
        // btn.onclick = function(){
        //     console.log('delete');
        //     console.log(btn);
        //     console.log(btn.parentElement.getAttribute('nid'));
        // };
        // console.log(btn);
        // $$(tr).append(btn);
        // console.log('append');
    }


    

    function handler(event) {
        console.log(event.type); // log event type
    }
    document.addEventListener("mousewheel", handler, {passive:true});
}