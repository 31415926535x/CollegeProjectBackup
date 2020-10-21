 
/*******************************/
// arknights assist script
// author: 31415926535x;
/*******************************/

// MuMu need root to run this script:


function startActionFirstTap(){
    alert("开始行动！！！");
    sleep(1000);
    Tap(1700, 1000, 1000);
}

function startActionSecondTap(){
    alert("开始行动！！！");
    sleep(1000);
    Tap(1653, 769, 1000);
}


for(var i = 1; i <= 1; ++i){
    
    launchApp("com.hypergryph.arknights.bilibili");
    startActionFirstTap();
    startActionSecondTap();
}