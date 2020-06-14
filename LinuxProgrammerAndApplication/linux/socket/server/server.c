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
#include <unistd.h>


#define SERVER_PORT 2333

void error_print(const char* e){
    perror("Error: ");
    perror(e);
    strerror(errno);
    exit(EXIT_FAILURE);
}
void swap(char *a, char *b){
    char t = *a;
    *a = *b;
    *b = t;
    return;
}
int main(int avgc, char** avgs){

    // 服务器端 socket 建立
    // ipv4, 流式数据包，TCP
    int lfd = socket(AF_INET, SOCK_STREAM, 0);
    if(!~lfd)error_print("server socket...");

    // 将监听的ip和端口与socket绑定
    struct sockaddr_in server_addr;
    server_addr.sin_family = AF_INET;   // ipv4
    server_addr.sin_addr.s_addr = htonl(INADDR_ANY); // 监听本机所有网卡的所有ip
    server_addr.sin_port = htons(SERVER_PORT);  // 端口

    if(!~bind(lfd, (struct sockaddr*)&server_addr, sizeof(server_addr))){
        error_print("server bind...");
    }

    // 设定监听的上限，默认为128 listen
    listen(lfd, 10);

    // 监听 accept
    struct sockaddr_in client_addr; // 与客户端相连的socket
    socklen_t addrlen = sizeof(client_addr);    // 传入传出
    int cfd = accept(lfd, (struct sockaddr*)&client_addr, &addrlen);
    if(!~cfd)error_print("server accept...");

    char buf[BUFSIZ];
    int ret = 0;

    char client_ip[BUFSIZ];
    while(1){
        ret = read(cfd, buf, sizeof(buf));
        printf("client<%s:%d>: %s", 
                inet_ntop(AF_INET, &client_addr.sin_addr.s_addr, client_ip, sizeof(client_ip)),
                ntohs(client_addr.sin_port),
                buf);
        if(!strncmp(buf, "CLOSE", ret - 1))break;
        for(int i = 0; i < (ret >> 1); ++i)swap(&buf[i], &buf[ret - i - 1]);
        write(cfd, buf, ret);
    }
    
    // 关闭连接
    close(cfd);
    close(lfd);

    return 0;
}