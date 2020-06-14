#include"myls.h"

int main(int avgc, char** avgs){
    
    init();
    char path[1024];
    strcpy(path, "./"); // 默认执行路径为当前路径
    for(int i = 1; i <= avgc - 1; ++i){
        if(!strcmp(avgs[i], "-a"))setCommandIsA();
        else if(!strcmp(avgs[i], "-f"))setCommandIsF();
        else if(!strcmp(avgs[i], "-l"))setCommandIsL();
        else if(!strcmp(avgs[i], "-R"))setCommandIsR();
        else if(!strcmp(avgs[i], "-C"))setCommandIsC();
        else if(!strcmp(avgs[i], "-x"))setCommandISX();
        else strcpy(path, avgs[i]);
    }

    myls(path);

    return 0;
}