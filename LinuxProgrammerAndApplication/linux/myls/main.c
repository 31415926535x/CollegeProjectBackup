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
        else if(!strcmp(avgs[i], "--help")){
            puts("Here is the usage of 'myls': ");
            puts("Usage: ls [OPTiON]...[FILE]...");
            puts("");
            puts("<-l>:\t--list\tuse a long listing format\t输出文件的所有信息");
            puts("<-a>:\t--all\tdo not ignore entries starting with.\t不忽略隐藏文件");
            puts("<-f>:\t\tdo not sort\t不排序");
            puts("<-R>:\t--recursive\tlist subdirectories recursively\t以递归的方式显示所有文件");
            puts("<-C>:\t\tlist entries by columns\t按列的方式输出（默认）");
            puts("<-x>:\t\tlist entries by lines instead of by columns\t按行的方式输出");
            return 0;
        }
        else strcpy(path, avgs[i]);
    }

    myls(path);

    return 0;
}