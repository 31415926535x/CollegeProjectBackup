#ifndef analysisTable_h
#define analysisTable_h
#include<map>
#include"symbols.h"
#include"symbolsVN.h"
#include"symbolsVT.h"
#include"production.h"
const int NUMOFVT = 20;
const int NUMOFVN = 20;
const int NUMOFSTATE = 30;
const int NUMOFPRODUCTIONS = 30;
/*
分析表子程序
由前期的分析得到该文法的分析表，由ACTION表和GOTO表构成
*/
class ACTIONTable{
private:
    std::pair<char, int> ACTION[NUMOFSTATE][NUMOFVT];
    int numofstate;						// ACTION表状态的数量
    int numofsymbolsvt;					// ACTION表终结符的数量
    std::map<symbolsVT*, int> vtmap;    // 终结符对应在分析表中的位置
    int getVTMap(symbolsVT*);			// 获得终结符对应的编号
public:
    ACTIONTable();
    ACTIONTable(int);
    ~ACTIONTable(){}
    void setNumOfState(int);			// GOTO状态数量
    void insertVT(symbolsVT*);			// 插入一个终结符以及给一个对应的编号
    void insertSHIFT(int state, symbolsVT* vt, int numOfPro);       // 插入一个移进状态
    void insertREDUCE(int state, symbolsVT* vt, int numOfPro);      // 插入一个规约状态
    void insertACC(int state, symbolsVT* vt);                       // 插入一个acc状态
    std::pair<char, int> getACTION(int state, symbolsVT* vt);       // 获得一个ACTION信息
    void print();
};
class GOTOTable{
private:
    int GOTO[NUMOFSTATE][NUMOFVN];
    int numofstate;						// GOTO状态数量
    int numofsymbolsvn;
    std::map<symbolsVN*, int> vnmap;    // 非终结符对应在分析表中的位置
    int getVNMap(symbolsVN*);			// 获得非终结符对应的编号
public:
    GOTOTable();
    GOTOTable(int);
    ~GOTOTable(){}
    void setNumOfState(int);			// 设置GOTO表的状态数
    void insertVN(symbolsVN*);          // 插入一个非终结符
    void insert(int state, symbolsVN* vn, int numOfPro);    // 插入一个GOTO状态
    int get(int state, symbolsVN* vn);                      // 获得一个GOTO状态
    void print();
};
class analysisTable
{
private:
    ACTIONTable ACTION;                 // ACTION表
    GOTOTable GOTO;                     // GOTO表
    int numofstate;                     // 状态个数I_n
    int numofpro;                       // 产生式数量
    production* productions[NUMOFPRODUCTIONS];  // 产生式数组，下标即为编号
public:
    analysisTable(int ns);
    // analysisTable(int, int, int);
    ~analysisTable() {}
    void insertSymbols(symbols*);		// 插入一个符号
    void insertProduction(production* p);	// 插入一条产生式，自动编号
    production* getProduction(int i);	// 获得第i条产生式
    void insert(int state, symbols* s, char ch, int numOfPro);	// 插入一个状态
    std::pair<char, int> get(int state, symbols* s);	// 获得一个状态
    void print();
};

#endif /*analysisTable_h*/