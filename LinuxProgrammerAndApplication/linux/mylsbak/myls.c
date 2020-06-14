#include "myls.h"

void error_print(const char* e){
    perror("Error: ");
    perror(e);
    exit(EXIT_FAILURE);
    // exit(1);
}

void file_print(const char* filename, const struct stat* st){
    file_type_print(st);
    file_mode_print(st);
    file_nlink_print(st);
    file_user_group_print(st);
    file_size_print(st);
    file_lastchange_time_print(st);
    file_name_print(filename, st);
    puts("");
}
void dir_print(const char* pathname){
    DIR* dir = opendir(pathname);   // 打开目录

    if(dir == NULL)error_print("opendir...");   // 判断该目录是否能打开

    if(!~chdir(pathname))error_print("chdir...");    // 改变工作区，方便stat使用

    struct dirent* dir_next = NULL;             // 目录列表文件的指针

    struct stat st = {};                        // 文件或目录的stat
    while(dir_next = readdir(dir)){
        char* filename = dir_next->d_name;      // 文件或目录名字
        if(!~lstat(filename, &st))error_print(filename);
        file_print(filename, &st);
    }
    return;
}

void file_type_print(const struct stat* st){
    // mode_t mode = (*st).st_mode;
    mode_t mode = st->st_mode;

    if(S_ISREG(mode))printf("-");       // 普通文件
    else if(S_ISDIR(mode))printf("d");  // 目录文件
    else if(S_ISLNK(mode))printf("l");  // 链接文件
    else if(S_ISCHR(mode))printf("c");  // 字符设备文件
    else if(S_ISFIFO(mode))printf("p"); // 管道文件
    else if(S_ISBLK(mode))printf("b");  // 块设备文件
}

void file_mode_print(const struct stat* st){
    mode_t mode = st->st_mode;

    printf("%c", mode & S_IRUSR ? 'r' : '-');
    printf("%c", mode & S_IWUSR ? 'w' : '-');
    printf("%c", mode & S_IWUSR ? 'x' : '-');

    printf("%c", mode & S_IRGRP ? 'r' : '-');
    printf("%c", mode & S_IWGRP ? 'w' : '-');
    printf("%c", mode & S_IXGRP ? 'x' : '-');

    printf("%c", mode & S_IROTH ? 'r' : '-');
    printf("%c", mode & S_IWOTH ? 'w' : '-');
    printf("%c", mode & S_IXOTH ? 'x' : '-');

    printf(" ");
    return;
}

void file_nlink_print(const struct stat* st){
    printf("%ld ", st->st_nlink);
    return;
}

void file_user_group_print(const struct stat* st){
    printf("%s ", getpwuid(st->st_uid)->pw_name);   // 根据文件的用户id获取用户名

    printf("%s ", getpwuid(st->st_gid)->pw_name);   // 根据文件的用户id获取组名
    return;
}

void file_size_print(const struct stat* st){
    printf("%ld ", st->st_size);
    return;
}

void file_lastchange_time_print(const struct stat* st){
    char* mon[] = {"Jan",  "Feb",  "Mar",  "Apr",  "May",  "Jun",
       "Jul",  "Aug", "Sep", "Oct", "Nov", "Dec"};
    struct tm* file_time = localtime(&(st->st_mtime));
    if(file_time == NULL)error_print("localtime...");
    printf("%s %d ", mon[file_time->tm_mon], file_time->tm_mday + 1);
    printf("%0d:%0d ", file_time->tm_hour, file_time->tm_min);
    return;
}

void file_name_print(const char* filename, const struct stat* st){
    printf("%s ", filename);
    if(S_ISLNK(st->st_mode))file_link_print(filename);
    return;
}

void file_link_print(const char* filename){
    char buf[1024];
    if(0 == readlink(filename, buf, sizeof buf))error_print("readlink...");
    printf("-> %s", buf);
    return;
}