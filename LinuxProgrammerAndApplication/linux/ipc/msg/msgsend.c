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
    char buf[BUFSIZ];
    int msgid = msgget((key_t)2333, 0666|IPC_CREAT);
    if(!~msgid)error("msgget error");
    while(flag){
        // 输入内容
        printf("msgsend input: ");
        fgets(buf, BUFSIZ, stdin);

        // 向消息队列发送
        msg.msg_type = 1;
        strcpy(msg.text, buf);

        if(msgsnd(msgid, (void*)&msg, BUFSIZ, 0) == -1)error("msgsnd error");    

        if(!strncmp(buf, "end", 3))flag = 0;
    }
    exit(EXIT_SUCCESS);
    return 0;
}