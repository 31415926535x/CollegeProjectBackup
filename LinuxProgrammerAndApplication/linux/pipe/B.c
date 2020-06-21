#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<unistd.h>

// 测试程序B，将每一个字符循环后移一位

int main(int avgc, char **avgs){

    char ch[BUFSIZ];
    // while(~scanf("%s", ch));
    // scanf("%s", ch);
    int len = read(0, ch, sizeof(ch));
    // int len = strlen(ch);
    fprintf(stderr, "The str from A is: %s\n", ch);
    for(int i = 0; i < len; ++i)printf("%c", (char)((ch[i] + 1 - 'a') % 26 + 'a'));
    return 0;
}