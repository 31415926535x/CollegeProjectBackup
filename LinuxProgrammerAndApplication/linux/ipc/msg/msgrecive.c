#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<unistd.h>
#include<sys/msg.h>
#include<errno.h>

struct msg_st{
    long int msg_type;
    char text[BUFSIZ];
}msg;
void error(char *e){
    fprintf(stderr, "%s: %d\n", e, errno);
    exit(EXIT_FAILURE);
}
int main(){
    int flag = 1;
    long int msg_type = 0;
    int msgid = msgget((key_t)2333, 0666|IPC_CREAT);
    if(!~msgid)error("msgget error");
    while(flag){
        if(!~msgrcv(msgid, (void*)&msg, BUFSIZ, msg_type, 0))error("msgrcv error");
        printf("msgrcv: %s\n", msg.text);
        if(!strncmp(msg.text, "end", 3))flag = 0;
    }
    // 删除消息队列
    if(!~msgctl(msgid, IPC_RMID, 0))error("msgctl error");
    exit(EXIT_SUCCESS);
    return 0;
}