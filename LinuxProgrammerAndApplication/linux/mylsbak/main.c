#include"myls.h"

int main(char avgc, char** avgs){
    
    char path[1024];

    if(avgc == 2 && !(strcmp(avgs[1], "-l")))strcpy(path, "./");
    else strcpy(path, avgs[2]);

    printf("%s--------\n", path);
    struct stat st = {};
    if(!~lstat(path, &st))error_print("lstat...");

    if(S_ISDIR(st.st_mode))dir_print(path);
    else file_print(path, &st);

    return 0;
}