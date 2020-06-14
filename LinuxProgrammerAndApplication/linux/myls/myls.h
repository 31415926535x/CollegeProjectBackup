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

// gcc不支持bool
#include<stdbool.h>

// 为了输出的美观，某些命令需要得知当前窗口的宽度
#include<sys/ioctl.h>

void init();
void myls(const char* path);

/****************************** 文件处理部分 *******************************/
// 为了能够实现对某些命令的排序功能，所以不能使用直接输出的方式，先要存下来
typedef struct FILE_NODE{
    char file_type; // 文件类型，包括普通文件、目录文件、链接文件等等
    char file_mode[9]; // 文件的各个权限
    int st_nlink; // 链接文件的个数
    char uname[128]; // 用户名
    char gname[128]; // 组名
    int file_size; // 文件大小
    char date[128]; // 文件的修改日期
    char file_name[128]; // 文件名
    bool islink; // 是否是链接文件
    char file_link[128]; // 链接文件指向的文件名
}FILE_NODE;
FILE_NODE file_node[128];
int file_node_num;  // 文件数

void error_print(const char* e);    // 错误输出
void display(); // 将处理后的按一定的规则输出
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


/*************************** 命令处理部分 **********************************/
#define MYLS_A 1
#define MYLS_L 2
#define MYLS_F 4
#define MYLS_R 8
#define MYLS_X 16
#define MYLS_C 32
unsigned int COMMANDFLAG;
void setCommandIsA();   // 设置 -a  显示文件名，按列适当的以字典序排序
void setCommandIsL();   // 设置 -l 显示文件的所有信息，每行一个，默认以文件名的字典序排序
void setCommandIsF();   // 设置 -f 与 -a 类似，但不排序
void setCommandIsR();   // 对文件夹进行递归显示
void setCommandISX();   // 对文件按列输出，横向排序
void setCommandIsC();   // 对文件按列输出，纵向排序
#endif