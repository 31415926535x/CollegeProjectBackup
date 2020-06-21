#include<stdio.h>
#include<stdlib.h>
#include<sys/types.h>
#include<unistd.h>
#include<wait.h>

// 测试无名管道，实现 A|B|C
// 创建父子孙进程，修改其标准输入输出到管道中即可

int main(void){

    int fd1[2], fd2[2];      // 无名管道
    int status;
    pid_t pid1, pid2;
    char buf[BUFSIZ];
    int ret;
    if(!~pipe(fd1))perror("pipe1....");
    if(!~pipe(fd2))perror("pipe2....");

    // 创建B进程
    if((pid1 = fork()) < 0)perror("Fork B failed...");
    printf("pid1: %d\n", pid1);
    if(pid1 == 0){
        // B 进程
        // 创建 C 进程
        if((pid2 = fork()) < 0)perror("Fork C failed...");
        printf("pid2: %d\n", pid2);
        if(pid2 == 0){
            // A 进程
            // 标准写到管道1的写

            dup2(fd2[1], 1);
            close(fd2[1]);

            close(fd2[0]);
            fprintf(stderr, "A running.............\n");
            execlp("./A", "./A", (char*)0);
            fprintf(stderr, "A done!!!!!!!!!!!!!!!!!!!!!!\n");
            exit(EXIT_SUCCESS);
        }
        else{
            // B 进程
            // 标准读到管道2读，标准写到管道1的写
            // close(1);
            // dup(fd1[1]);
            sleep(1);
            dup2(fd1[1], 1);
            close(fd1[1]);

            close(fd1[0]);

            // close(0);
            // dup(fd2[0]);
            dup2(fd2[0], 0);
            close(fd2[0]);

            close(fd2[1]);
            fprintf(stderr, "B running.............\n");
            execlp("./B", "./B", (char*)0);
            fprintf(stderr, "B done.........\n");
            exit(EXIT_SUCCESS);
        }
    }
    else{
        // C 进程
        // 标准读到管道2的读
        sleep(2);
        dup2(fd1[0], 0);
        close(fd1[0]);
        
        close(fd1[1]);
        fprintf(stderr, "C running.............\n");
        execlp("./C", "./C", (char*)0);
        exit(EXIT_SUCCESS);
    }
    close(fd1[0]); close(fd1[1]);
    close(fd2[0]); close(fd2[1]);
    return 0;
}