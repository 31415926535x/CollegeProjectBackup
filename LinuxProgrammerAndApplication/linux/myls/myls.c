#include "myls.h"


void dir_print_dfs();
void init(){
    COMMANDFLAG = 0;
}
void myls(const char* path){
    struct stat st = {};
    if(!~lstat(path, &st))error_print("lstat...");

    // 递归显示
    if(COMMANDFLAG & MYLS_R){
        dir_print_dfs(path);
        return;
    }

    file_node_num = -1;
    if(S_ISDIR(st.st_mode))dir_print(path);
    else file_print(path, &st);
    display();
    return;
}

void error_print(const char* e){
    perror("Error: ");
    perror(e);
    exit(EXIT_FAILURE);
    // exit(1);
}

int cmp_string(const void* a, const void* b){
    // 结构体字符串排序
    return strcmp((*(FILE_NODE*)a).file_name, (*(FILE_NODE*)b).file_name);
}
int get_max_len(bool sizeOrname){
    // 获取当前文件组中大小最大的那一个的长度
    int len = 0;
    for(int i = 0; i <= file_node_num; ++i){
        len = len < file_node[i].file_size ? file_node[i].file_size : len;
    }
    int ans = 0;
    while(len){
        ++ans;
        len /= 10;
    }
    return ans;
}
int get_winsize_col(){
    // 获取当前控制台的宽度
    struct winsize size;
    ioctl(STDIN_FILENO, TIOCGWINSZ, &size);
    return size.ws_col;
}
void display(){
    // 默认按照文件名的字典序进行输出
    if(!(COMMANDFLAG & MYLS_F))qsort(file_node, file_node_num + 1, sizeof(file_node[0]), cmp_string);
    
    if(COMMANDFLAG & MYLS_L){
        int max_size_len = get_max_len(true);           // 按文件大小最大的格式化输出
        int max_uname_len = 0;
        int max_gnmame_len = 0;
        for(int i = 0; i <= file_node_num; ++i){
            max_uname_len = max_uname_len < strlen(file_node[i].uname) ? strlen(file_node[i].uname) : max_uname_len;
            max_gnmame_len = max_gnmame_len < strlen(file_node[i].gname) ? strlen(file_node[i].gname) : max_gnmame_len;
        }
        for(int i = 0; i <= file_node_num; ++i){
            printf("%c", file_node[i].file_type);
            printf("%s ", file_node[i].file_mode);
            printf("%d ", file_node[i].st_nlink);
            printf("%*s ", max_uname_len, file_node[i].uname);
            printf("%*s ", max_gnmame_len, file_node[i].gname);
            printf("%*d ", max_size_len, file_node[i].file_size);
            printf("%s ", file_node[i].date);
            printf("%-20s", file_node[i].file_name);
            if(file_node[i].islink)printf("%s", file_node[i].file_link);
            puts("");
        }
    }
    else{
        // 确定每一行的缩进长度，以及最后的行数
        int col = get_winsize_col();
        int max_col = 0;
        for(int i = 0; i <= file_node_num; ++i)max_col = max_col < strlen(file_node[i].file_name) ? strlen(file_node[i].file_name) : max_col;
        max_col += 1;
        max_col = col / max_col;
        int max_row = (file_node_num + max_col - 1) / max_col;
        int cols[10];
        memset(cols, 0, sizeof(cols));
        // 获取每一行的最长值
        for(int i = 0; i < max_row; ++i){
            for(int j = 0; j < max_col; ++j){
                if(COMMANDFLAG & MYLS_X){
                    cols[j] = cols[j] < strlen(file_node[i * max_col + j].file_name) ? strlen(file_node[i * max_col + j].file_name) : cols[j];
                }
                else{
                    cols[j] = cols[j] < strlen(file_node[i + j * max_row].file_name) ? strlen(file_node[i + j * max_row].file_name) : cols[j];
                }
            }
        }
        int flag = 100;
        int x;
        for(int i = 0; i < max_row; ++i){
            for(int j = 0; j < max_col; ++j){
                if(COMMANDFLAG & MYLS_X){
                    x = i * max_col + j;
                }
                else{
                    x = i + j * max_row;
                }
                printf("%-*s  ", cols[j], file_node[x].file_name);
                --flag;
                if(flag <= 0)return;
            }
            puts("");
        }
    }
    return;
}
void file_print(const char* filename, const struct stat* st){
    ++file_node_num;
    file_type_print(st);
    file_mode_print(st);
    file_nlink_print(st);
    file_user_group_print(st);
    file_size_print(st);
    file_lastchange_time_print(st);
    file_name_print(filename, st);
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

char paths[100][128];
int path_n;
void dir_print_dfs(const char* path){
    file_node_num = -1;
    strcpy(paths[++path_n], path);
    for(int i = 0; i <= path_n; ++i)printf("%s%c", paths[i], (paths[i][strlen(paths[i]) - 1] == '/' ?  : '/'));
    printf(":\n");
    dir_print(path);
    display();
    puts("");
    // char pathname[1024];
    // strcpy(pathname, sta[top]);
    // char buf[1024];
    // getcwd(buf, 1024);
    // printf("%s\n", buf);
    // printf("%s\n", sta[top]);
    // if(!~chdir(sta[top]))error_print("chdir...");
    // getcwd(buf, 1024);
    // printf("%s\n", buf);
    struct stat st = {};
    char tmp[100][128];
    int num = 0;
    for(int i = 0; i <= file_node_num; ++i){
        if(!~lstat(file_node[i].file_name, &st))error_print(file_node[i].file_name);
        if(S_ISDIR(st.st_mode)){
            strcpy(tmp[num++], file_node[i].file_name);
        }
    }
    for(int i = 0; i < num; ++i){
        dir_print_dfs(tmp[i]);
    }
    if(!~chdir("../"))error_print("chdir...");
    --path_n;
}

void file_type_print(const struct stat* st){
    // mode_t mode = (*st).st_mode;
    mode_t mode = st->st_mode;
    
    if(S_ISREG(mode))file_node[file_node_num].file_type = '-';       // 普通文件
    else if(S_ISDIR(mode))file_node[file_node_num].file_type = 'd';  // 目录文件
    else if(S_ISLNK(mode))file_node[file_node_num].file_type = 'l';  // 链接文件
    else if(S_ISCHR(mode))file_node[file_node_num].file_type = 'c';  // 字符设备文件
    else if(S_ISFIFO(mode))file_node[file_node_num].file_type = 'p'; // 管道文件
    else if(S_ISBLK(mode))file_node[file_node_num].file_type = 'b';  // 块设备文件
}

void file_mode_print(const struct stat* st){
    mode_t mode = st->st_mode;

    file_node[file_node_num].file_mode[0] = (mode & S_IRUSR ? 'r' : '-');
    file_node[file_node_num].file_mode[1] = (mode & S_IWUSR ? 'w' : '-');
    file_node[file_node_num].file_mode[2] = (mode & S_IWUSR ? 'x' : '-');

    file_node[file_node_num].file_mode[3] = (mode & S_IRGRP ? 'r' : '-');
    file_node[file_node_num].file_mode[4] = (mode & S_IWGRP ? 'w' : '-');
    file_node[file_node_num].file_mode[5] = (mode & S_IXGRP ? 'x' : '-');

    file_node[file_node_num].file_mode[6] = (mode & S_IROTH ? 'r' : '-');
    file_node[file_node_num].file_mode[7] = (mode & S_IWOTH ? 'w' : '-');
    file_node[file_node_num].file_mode[8] = (mode & S_IXOTH ? 'x' : '-');

    return;
}

void file_nlink_print(const struct stat* st){
    file_node[file_node_num].st_nlink = st->st_nlink;
    return;
}

void file_user_group_print(const struct stat* st){
    memset(file_node[file_node_num].uname, '\0', sizeof(file_node[file_node_num].uname));
    strcpy(file_node[file_node_num].uname, getpwuid(st->st_uid)->pw_name);   // 根据文件的用户id获取用户名

    memset(file_node[file_node_num].gname, '\0', sizeof(file_node[file_node_num].gname));
    strcpy(file_node[file_node_num].gname, getpwuid(st->st_gid)->pw_name);   // 根据文件的用户id获取组名
    return;
}

void file_size_print(const struct stat* st){
    file_node[file_node_num].file_size = st->st_size;
    return;
}

void file_lastchange_time_print(const struct stat* st){
    char* mon[] = {"Jan",  "Feb",  "Mar",  "Apr",  "May",  "Jun",
       "Jul",  "Aug", "Sep", "Oct", "Nov", "Dec"};
    
    struct tm* file_time = localtime(&(st->st_mtime));
    if(file_time == NULL)error_print("localtime...");
    memset(file_node[file_node_num].date, '\0', sizeof(file_node[file_node_num].date));
    char _mon[6], _day[4], _time[7];
    sprintf(_mon, "%s ", mon[file_time->tm_mon]);
    sprintf(_day, "%02d ", file_time->tm_mday + 1);
    sprintf(_time, "%02d:%02d", file_time->tm_hour, file_time->tm_min);
    strcat(file_node[file_node_num].date, _mon);
    strcat(file_node[file_node_num].date, _day);
    strcat(file_node[file_node_num].date, _time);
    return;
}

void file_name_print(const char* filename, const struct stat* st){
    if(filename[0] == '.'){
        if(!(COMMANDFLAG & MYLS_A) && !(COMMANDFLAG & MYLS_F)){
            --file_node_num;
            return;
        }
    }
    memset(file_node[file_node_num].file_name, '\0', sizeof(file_node[file_node_num].file_name));
    sprintf(file_node[file_node_num].file_name, "%s", filename);
    if(S_ISLNK(st->st_mode))file_link_print(filename);
    return;
}

void file_link_print(const char* filename){
    char buf[1024];
    if(0 == readlink(filename, buf, sizeof buf))error_print("readlink...");
    memset(file_node[file_node_num].file_link, '\0', sizeof(file_node[file_node_num].file_link));
    sprintf(file_node[file_node_num].file_link, "-> %s", buf);
    return;
}



void setCommandIsA(){
    COMMANDFLAG |= MYLS_A;
    return;
}
void setCommandIsL(){
    COMMANDFLAG |= MYLS_L;
    return;
}
void setCommandIsF(){
    COMMANDFLAG |= MYLS_F;
    return;
}
void setCommandIsR(){
    COMMANDFLAG |= MYLS_R;
    return;
}
void setCommandISX(){
    COMMANDFLAG |= MYLS_X;
    return;
}
void setCommandIsC(){
    COMMANDFLAG |= MYLS_C;
    return;
}