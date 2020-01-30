function Delete(nid){
    console.log('delete' + nid);
    $.ajax({
        type: "post",
        // async: true,
        dataType: "json",
        url: "/ApplicationIntegrationView/Delete",
        data: nid,
        success: function(result){
            console.log(result);
        },
        error: function(errorMsg){
            console.log('error' + errorMsg);
        }
    });
}