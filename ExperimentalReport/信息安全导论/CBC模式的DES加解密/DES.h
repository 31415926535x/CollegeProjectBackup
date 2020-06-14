#ifndef DES_H
#define DES_H

// DES加解密的头文件

void DES_SetKey(const char* key);       // 设置密钥key，并初始化出16个子密钥
void DES_GetSubkey();                   // 根据密钥得到16个子密钥，密钥由61位通过PC_1表压缩置换变为56位（即去除校验位），然后分块，循环左移，通过PC_2表压缩置换得到16个子密钥
void RotaleLeft(bool *A, const int len, const int loop);    // 对数组A进行循环左移loop次
void Func_F(bool *R, const bool *Subkey_i); // F轮函数，将32位的数据扩展、与子密钥加密、S盒函数压缩置换得到32位结果
void Func_S(const bool *IN, bool *OUT);     // S盒函数，将48位的数据8位一组分成6组，并取首位两位，以及中间四位作为行列查询S盒表S_Box压缩为4位
void Func_Xor(bool *A, const bool *B, const int len);     // 数组逐位异或函数，将结果保存到A中

void Transform(const bool *IN, bool *OUT, int len, const char *T_Table);  // 压缩置换函数，根据表 T_Table 将输入数据转化压缩

void ByteToBit(const char *IN, bool *OUT, int len, const int base);   // 将字节转化为位
void BitToByte(const bool *IN, int len, char *OUT, const int base);   // 将位转化为字节
void BitToHex(const bool *IN, int len, char *OUT);                      // 将二进制位转化为十六进制
void ByteToHex(const char* IN, int len, char *OUT);                     // 将字节转化成十六进制
void HexToByte(const char* IN, int len, char* OUT);                     // 将字节形式的十六进制字符串转为字节

enum {ENCRYPT,DECRYPT};// ENCRYPT:加密,DECRYPT:解密                              // DES加解密，默认为True加密
void DES(char *key, char *p, bool mode); // DES 入口函数，key为密钥，p为加解密后的明文或密文，由参数mode决定
void DES(char *key, bool *plaintext, bool mode);
void DES_SETKEYFLAG();

#endif