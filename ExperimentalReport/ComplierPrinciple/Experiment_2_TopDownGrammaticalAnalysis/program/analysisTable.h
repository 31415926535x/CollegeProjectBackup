#ifndef analysisTable_h
#define analysisTable_h
#include<map>
#include"symbols.h"
#include"symbolsVN.h"
#include"symbolsVT.h"
#include"production.h"
const int NUMOFVT = 10;
const int NUMOFVN = 10;
/*
分析表子程序
由前期的分析得到该文法的预测分析表M[X, a]及其相关的操作

*/

class analysisTable
{
private:
    production* M[NUMOFVN][NUMOFVT];    // 预测分析表M[A, a]
    int numofvt;                        // 终结符的数量
    int numofvn;                        // 非终结符的数量

    std::map<symbolsVT*, int> vtmap;    // 终结符对应在分析表中的位置
    std::map<symbolsVN*, int> vnmap;    // 非终结符对应在分析表中的位置

    int getVTMap(symbolsVT*);			// 获得终结符对应的编号
    int getVNMap(symbolsVN*);			// 获得非终结符对应的编号
public:
    analysisTable();
    analysisTable(int, int);
    ~analysisTable() {}
    void insertVT(symbolsVT*);			// 插入一个终结符以及给一个对应的编号
    void insertVN(symbolsVN*);			// 插入一个非终结符以及给一个对应的编号
    void insertProduction(symbolsVN*, symbolsVT*, production*); // 在分析表中的某一行某一列插入一条产生式
    production* getProduction(symbolsVN*, symbolsVT*);	// 获得某一行某一列的产生式，不存在为空
    void print();
};

#endif /*analysisTable_h*/