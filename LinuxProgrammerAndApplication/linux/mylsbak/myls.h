#ifndef myls_h
#define myls_h
#include<stdio.h>
#include<stdlib.h>
#include<string.h>


// stat
#include<sys/types.h>
#include<sys/stat.h>
#include<unistd.h> 

// dir
// #include<sys/types.h>
#include<dirent.h>

// pwd
#include<pwd.h>

// time
#include<time.h>

void error_print(const char* e);    // 错误输出

void file_print(const char* filename, const struct stat* st);   // 处理单个文件
void dir_print(const char* pathname);   // 处理一个目录
void file_type_print(const struct stat* st);    // 处理类型，目录或者文件等
void file_mode_print(const struct stat* st);    // 处理权限
void file_nlink_print(const struct stat* st);    // 处理硬链接数量
void file_user_group_print(const struct stat* st);  // 处理用户及组
void file_size_print(const struct stat* st);    // 处理文件大小
void file_lastchange_time_print(const struct stat* st); // 处理文件最后修改时间
void file_name_print(const char* filename, const struct stat* st);    // 处理文件名，如果是链接文件，追加对应链接的文件路径
void file_link_print(const char* filename); // 处理链接的文件
#endif