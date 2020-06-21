#include<stdio.h>
#include<stdlib.h>
#include<string.h>

// 测试程序C，将每一个字符变为大写

int main(int avgc, char **avgs){

    char ch[BUFSIZ];
    while(~scanf("%s", ch));
    // scanf("%s", ch);
    int len = strlen(ch);
    fprintf(stderr, "The str from B is: %s\n", ch);
    printf("The str from C is: ");
    for(int i = 0; i < len; ++i)printf("%c", (char)(ch[i] - 'a' + 'A'));
    puts("");
    return 0;
}