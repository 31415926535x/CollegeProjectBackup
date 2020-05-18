#ifndef production_h
#define production_h
#include<iostream>
#include"symbols.h"
#include"symbolsVT.h"
#include"symbolsVN.h"
/*
产生式
一个产生式由一个左部的非终结符和一些右部的符号集合构成
*/

const int maxnLen = 10;        // 一个产生式的右部符号的数量
class symbolsVN;
class production
{
private:
    symbolsVN *vn;					// 产生式左部的非终结符
    symbols *pro[maxnLen];			// 产生式，由一些非终结符和终结符构成，故使用符号指针来指引
    int len;

    // 属性文法的一些内容
    void (*attributes) (production *p); // 每一条产生式对应的一些属性文法的操作，用指针函数实现
public:
    production();
    production(symbolsVN *v);
    ~production(){}
    void push_back(symbols *a);		// 为产生式后部插入一个符号
    symbolsVN* getVN();				// 获得左部非终结符符号
    symbols** getProduction();		// 获得产生式指针数组
    int getLen();					// 获得产生式长度
    symbols* getProductionIndexOf(int i); // 获得产生式中第i个位置的符号
    void setAttributesFunction(void (*a)(production* p)){ // 设置属性文法的函数
        attributes = a;
    }
    void (*getAttributesFunction())(production*){ // 获得该产生式对应的语义分析的代码
        return attributes;
    }
    void print();
};

#endif /*production_h*/