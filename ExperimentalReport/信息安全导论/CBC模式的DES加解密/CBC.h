#ifndef CBC_H
#define CBC_H

#include"DES.h"
// CBC 加解密头文件

void CBC(char* key, char* in, int len_in, bool mode, char* out, int* len_out);    // CBC 加解密入口
void CBC_SetIV(const bool *iv);     // 设置IV向量

#endif