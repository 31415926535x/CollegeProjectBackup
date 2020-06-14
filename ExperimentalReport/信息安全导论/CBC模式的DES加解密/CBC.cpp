#include"CBC.h"
#include"DES.h"
#include<cstring>


bool IV[64];
bool plaintext[64];
bool ciphertext[64];
char Hex[32];
void CBC(char* key, char* in, int len_in, bool mode, char* out, int* len_out){
    *len_out = len_in = (len_in + 7) / 8 * 8;
    // cout << len_in << endl;
    if(mode == ENCRYPT){
        for(int i = 0; i < len_in; i += 8){
            // cout << (in + i) << endl;
            ByteToBit(in + i, plaintext, 64, 8);
            // for(int i = 0; i < 64; ++i)cout << plaintext[i];cout << endl;
            // for(int i = 0; i < 64; ++i)cout << IV[i];cout << endl;
            Func_Xor(plaintext, IV, 64);
            // for(int i = 0; i < 64; ++i)cout << plaintext[i];cout << endl;cout << endl;
            DES(key, plaintext, mode);
            BitToByte(plaintext, 64, out + i, 8);
            // for(int j = 0; j < 8; ++j)std::cout << (int)out[8 * i + j];std::cout << std::endl;
            memcpy(IV, plaintext, 64);
        }
    }
    else if(mode == DECRYPT){
        for(int i = 0; i < len_in; i += 8){
            ByteToBit(in + i, ciphertext, 64, 8);
            memcpy(plaintext, ciphertext, 64);
            DES(key, plaintext, mode);
            Func_Xor(plaintext, IV, 64);
            memcpy(IV, ciphertext, 64);
            memcpy(out + (i << 6), plaintext, 64);
            // for(int j = 0; j < 64; ++j)std::cout << plaintext[j];std::cout << std::endl;
            BitToByte(plaintext, 64, out + i, 8);
        }
    }
    return;
}

void CBC_SetIV(const bool *iv){
    memcpy(IV, iv, 64);
}