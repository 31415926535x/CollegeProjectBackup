#include"CBC.h"
#include<bits/stdc++.h>
using namespace std;


void test(){
    char key[9];
    bool k[64];

    char plaintext[1024];
    char type;

    char IV[9];
    bool iv[64];

    char clipertext[1024];
    char clipertext_hex[2048];
    do{
        cout << "Chose (E)NCRYPT, (D)ECRYPT or E(X)it: ";
        cin >> type;
        if(type == 'X')break;

        cout << "Input DES's key(8 bytes): ";
        cin >> key;
        ByteToBit(key, k, 64, 8);
        cout << "key: ";
        for(int i = 0; i < 64; ++i)cout << k[i]; cout << endl;

        cout << "Input CBC'IV(8 bytes): ";
        cin >> IV;
        ByteToBit(IV, iv, 64, 8);
        CBC_SetIV(iv);
        cout << "IV: ";
        for(int i = 0; i < 64; ++i)cout << iv[i];cout << endl;

        if(type == 'E'){
            cout << "Input Plaintext: ";
            cin >> plaintext;
            int c_len = strlen(plaintext);
            CBC(key, plaintext, c_len, ENCRYPT, clipertext, &c_len);
            ByteToHex(clipertext, c_len, clipertext_hex);
            cout << "clipertext_hex: ";
            c_len <<= 1;
            for(int i = 0; i < c_len; ++i)cout << clipertext_hex[i];cout << endl << endl;
        }
        else{
            cout << "Input Clipertext(Hex): ";
            cin >> clipertext_hex;
            int p_len = strlen(clipertext_hex);
            HexToByte(clipertext_hex, p_len, clipertext);
            p_len >>= 1;
            CBC(key, clipertext, p_len, DECRYPT, plaintext, &p_len);
            cout << "plaintext: ";
            for(int i = 0; i < p_len; ++i)cout << plaintext[i];cout << endl << endl;
        }
    }while(true);
}
int main(){
    
    // freopen("in.in", "r", stdin);
    test();
    // key: aaabbbcc
    // iv: abcdefgh
    // plain: abcdefghijklmnopqrstuvwxyz

    
    return 0;
}
