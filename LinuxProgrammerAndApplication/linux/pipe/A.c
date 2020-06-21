#include<stdio.h>
#include<stdlib.h>
#include<time.h>

// 测试程序A，随机产生多个小写字母

int main(int avgc, char **avgs){

    srand(time(NULL));
    int n = rand() % 20 + 5;
    while(n--)printf("%c", (char)('a' + rand() % 26));
    return 0;
}