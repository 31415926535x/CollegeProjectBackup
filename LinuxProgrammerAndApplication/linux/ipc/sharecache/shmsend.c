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
    
    while(flag){
        // 向共享内存中写数据

        while(shrd_data->flag){
            // 读数据时不能写数据
            sleep(1);
            puts("waiting.....");
        }
        printf("input text: ");
        fgets(buf, BUFSIZ, stdin);
        strncpy(shrd_data->data, buf, BUFSIZ);
        
        // 设置写为读
        shrd_data->flag = 1;
        if(!strncmp(buf, "end", 3))flag = 0;
    }

    if(!~shmdt(shm))error("shmdt failed...\n");
    sleep(2);
    exit(EXIT_SUCCESS);
    return 0;
}