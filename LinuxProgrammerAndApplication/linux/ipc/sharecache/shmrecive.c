#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<sys/shm.h>
#include<errno.h>

void error(char *e){
    fprintf(stderr, "%s: %d\n", e, errno);
    exit(EXIT_FAILURE);
}

struct shared_data{
    int flag;
    char data[BUFSIZ];
};

int main(){
    int flag = 1;
    void *shm = NULL;
    struct shared_data *shrd_data = NULL;
    char buf[BUFSIZ];
    int shmid = shmget((key_t)2333, sizeof(struct shared_data), 0666|IPC_CREAT);
    if(!~shmid)error("shmget failed...\n");

    shm = shmat(shmid, (void*)0, 0);
    if(shm == (void*)-1)error("shmat failed...\n");
    printf("memery attached at %p\n", shm);

    shrd_data = (struct shared_data*)shm;
    
    // 设置读
    shrd_data->flag == 0;
    while(flag){
        // 向共享内存中读数据
        if(shrd_data->flag){
            printf("get shared cache: %s\n", shrd_data->data);
            sleep(rand() % 3);

            // 交出控制权
            shrd_data->flag = 0;
            if(!strncmp(shrd_data->data, "end", 3))flag = 0;
        } 
        else{
            puts("waiting....");
            sleep(1);   
        } 
    }

    if(!~shmdt(shm))error("shmdt failed...\n");
    if(!~shmctl(shmid, IPC_RMID, 0))error("shmctl failed...");
    sleep(2);
    exit(EXIT_SUCCESS);
    return 0;
}