#ifndef symbolsVT_h
#define symbolsVT_h
#include<iostream>
#include"symbols.h"
/*
一个终结符
终结符由终结符的值和编码构成

*/
class symbolsVT : public symbols{
private:
    std::string word;   // 终结符的值
    std::string code;   // 词法分析后终结符的标识（编码）
    std::string var;    // 终结符实际的值
public:
    symbolsVT(){}
    symbolsVT(std::string W, std::string C):word(W), code(C) {
        std::cerr<< "V_T: " << word << " " << code << " created..." << std::endl;
    }
    ~symbolsVT() {}
    std::string getClassName();
    std::string getWord();
    std::string getCode();
    void setVar(std::string v);
    std::string getVar();
    void print();
};

#endif /*symbolsVT_h*/