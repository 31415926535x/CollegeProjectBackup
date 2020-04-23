(function GetTexByString(){
    var words = ["+", "-", "*", "/", "=", "<>", "<", "<=", ">", ">=", ":=", "(", ")", ",", ";", "."];
    var V = 5;
    var sy = -3;
    words.forEach(str => {
        // console.log(str);
        let sx = 2;
        let draw = [];
        for(let i = 0; i < str.length; ++i){
            if(i != str.length - 1){
                console.log("\\node[V](" + V + ") at(" + sx + ", " + sy + ") {$" + V + "$};");
            }
            else{
                console.log("\\node[T](" + V + ") at(" + sx + ", " + sy + ") {$" + V + "$};");
            }
            if(i == 0){
                draw.push("\\draw (" + (sx - 2) + ", " + sy + ") edge[above]node{$" + str[i] + "$}" + "(" + V + ");");
            }
            else{
                draw.push("\\draw (" + (V - 1) + ") edge[above]node{$" + str[i] + "$}" + "(" + V + ");");
            }
            V += 1;
            sx += 2;
            // console.log(node);
        }
        sy -= 1;
        draw.forEach(s => {
            console.log(s);
        });
        console.log("");
    });
    var path = "\\draw (start) -- (0, -2) "
    for(let i = -3; i > sy; --i){
        path += "-- (0, " + i + ") ";
    }
    console.log(path);
})();