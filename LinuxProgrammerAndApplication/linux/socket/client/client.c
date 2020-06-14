#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<errno.h>

// socket(), bind()
#include<sys/types.h>
#include<sys/socket.h>

// sockaddr_in
#include<arpa/inet.h>

// read() write()
#include<unistd.h>

#define SERVER_PORT 2333
#define SERVER_ADDR "127.0.0.1"
void error_print(const char* e){
    perror("Error: ");
    perror(e);
    strerror(errno);
    exit(EXIT_FAILURE);
    return;
}

int main(int avgc, char** avgs){

    struct sockaddr_in server_addr;
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(SERVER_PORT);
    if(!~inet_pton(AF_INET, SERVER_ADDR, &server_addr.sin_addr.s_addr))error_print("server ip...");

    int cfd = socket(AF_INET, SOCK_STREAM, 0);
    if(!~cfd)error_print("client socket...");   

    if(!~connect(cfd, (struct sockaddr*)&server_addr, sizeof(server_addr)))error_print("connect...");

    char buf[BUFSIZ];
    int ret;

    char server_ip[BUFSIZ];
    while(1){
        scanf("%s", buf);
        write(cfd, buf, strlen(buf));
        ret = read(cfd, buf, sizeof(buf));
        printf("server<%s:%d>: %s\n",
            inet_ntop(AF_INET, &server_addr.sin_addr.s_addr, server_ip, sizeof(server_ip)),
            ntohs(server_addr.sin_port), 
            buf);
        if(!strcmp(buf, "CLOSE"))break;
    }

    close(cfd);

    return 0;
}