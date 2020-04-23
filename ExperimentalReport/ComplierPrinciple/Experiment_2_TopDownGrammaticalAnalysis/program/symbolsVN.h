#ifndef symbolsVN_h
#define symbolsVN_h
#include<iostream>
#include"symbols.h"
#include"production.h"
const int maxnNum = 5;     // 一个终结符所有的产生式的数量
class production;
/*
非终结符
非终结符由其左部的非终结符和有部一个一些产生式构成
产生式即为一些符号的排列，此处存储的是一些产生式的指针
*/

class symbolsVN: public symbols{
private:
    std::string name;							// 非终结符左部名称X
    production *p[maxnNum];						// 产生式集合
    int num;
public:
    symbolsVN();
    symbolsVN(std::string);
    ~symbolsVN() {}
    std::string getClassName();
    std::string getName();
    void insertProduction(production *newp);	// 加入一个产生式
    production* getProductionIndexOf(int i);	// 获得第i个产生式
    production** getAllProduction();			// 获得所有的产生式
    void print();
};

#endif /*symbolsVN_h*/