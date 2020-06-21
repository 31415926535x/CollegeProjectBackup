#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<unistd.h>
#include<sys/types.h>
#include<sys/stat.h>
#include<fcntl.h>
#include<sys/sem.h>
#include<sys/ipc.h>
#include<errno.h>

union sem{
    int v;
    struct semid_ds *buf;
    unsigned short *a;
};
void error(char *e){
    fprintf(stderr, "%s: %d\n", e, errno);
    // exit(EXIT_FAILURE);
}

static int semid = 0;
// 初始化信号量
static int setsemval(){
    union sem s;
    s.v = 1;
    if(!~semctl(semid, 0, SETVAL, s))return 0;
    return 1;
}
// 删除信号量
static void delsemval(){
    union sem s;
    if(!~semctl(semid, 0, IPC_RMID, s))error("fail to delete semval\n");
}
// 对信号量做减一操作，即等待p(sv)
static int sem_p(){
    struct sembuf semb;
    semb.sem_num = 0;
    semb.sem_op = -1;
    semb.sem_flg = SEM_UNDO;
    if(!~semop(semid, &semb, 1)){
        error("sem_p failed\n");
        return 0;
    }
    return 1;
}
// 对信号量做增一操作，即v
static int sem_v(){
    struct sembuf semb;
    semb.sem_num = 0;
    semb.sem_op = 1;
    semb.sem_flg = SEM_UNDO;
    if(!~semop(semid, &semb, 1)){
        error("sem_v failed\n");
        return 0;
    }
    return 1;
}

int main(int argc, char **argv){
    char msg = 'X';
    
    // 创建信号量
    semid = semget((key_t)2333, 1, 0666|IPC_CREAT);

    if(argc > 0){
        // 第一次执行，初始化信号量
        if(!setsemval()){
            error("fail to init sem\n");
            exit(EXIT_FAILURE);
        }

        // 设置要在屏幕中输出的信息，
        msg = argv[1][0];
        sleep(2);
    }

    for(int i = 0; i < 10; ++i){
        // 进入临界区
        if(!sem_p())exit(EXIT_FAILURE);

        // 输出
        printf("%c", msg);
        // 清楚缓冲区，立即显示
        fflush(stdout);

        sleep(rand() % 3);
        // 离开临界区再次输出
        printf("%c", msg + 1);
        fflush(stdout);
        if(!sem_v()){
            exit(EXIT_FAILURE);
        }
        sleep(rand() % 2);
    }
    sleep(10);
    printf("\n%d - finished...\n", getpid());
    if(argc > 1){
        // 第一次调用，在推出前删除信号量
        sleep(3);
        delsemval();
    }
    exit(EXIT_SUCCESS);
    return 0;
}