#ifndef global_h
#define global_h
#include"symbols.h"
#include"symbolsVN.h"
#include"symbolsVT.h"
#include"production.h"
#include"analysisTable.h"

const int maxnAnalysisStack = 1e2 + 5;
// 定义出文法的所有终结符
symbolsVT* PLUS = new symbolsVT("+", "plus");
symbolsVT* MINUS = new symbolsVT("-", "minus");
symbolsVT* times = new symbolsVT("*", "times");
symbolsVT* slash = new symbolsVT("/", "slash");
symbolsVT* lparen = new symbolsVT("(", "lapren");
symbolsVT* rparen = new symbolsVT(")", "rparen");
symbolsVT* ident = new symbolsVT("i", "ident");
symbolsVT* unsignint = new symbolsVT("u", "unsignint");
symbolsVT* END = new symbolsVT("#", "end");
symbolsVT* epslion = new symbolsVT("e", "epslion");
// 定义出文法的所有非终结符
symbolsVN* E = new symbolsVN("E");
symbolsVN* Edot = new symbolsVN("E'");
symbolsVN* T = new symbolsVN("T");
symbolsVN* Tdot = new symbolsVN("T'");
symbolsVN* F = new symbolsVN("F");

// 构造所有的产生式
production* Eporduction[3];
production* Edotproduction[3];
production* Tproduction[1];
production* Tdotproduction[3];
production* Fproduction[3];

// 定义出预测分析表
analysisTable AnalysisTable;

// 分析栈
symbols* analysisStack[maxnAnalysisStack];
int top;

symbols* X;
production *p;
#endif