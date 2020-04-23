#include<iostream>
#include<cstdio>
#include<string.h>
#include"symbols.h"
#include"symbolsVN.cpp"
#include"symbolsVT.cpp"
#include"production.cpp"
#include"analysisTable.cpp"
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
void init(){
    // 初始化所有变量
	// 根据文法的不同，得到的分析表的结构也不同，此时初始化部分也不同

    // 定义出预测分析表
	// 为预测分析表插入终结符、非终结符
    AnalysisTable.insertVT(PLUS);
    AnalysisTable.insertVT(MINUS);
    AnalysisTable.insertVT(times);
    AnalysisTable.insertVT(slash);
    AnalysisTable.insertVT(lparen);
    AnalysisTable.insertVT(rparen);
    AnalysisTable.insertVT(ident);
    AnalysisTable.insertVT(unsignint);
    AnalysisTable.insertVT(END);

    AnalysisTable.insertVN(E);
    AnalysisTable.insertVN(Edot);
    AnalysisTable.insertVN(T);
    AnalysisTable.insertVN(Tdot);
    AnalysisTable.insertVN(F);

    // 根据文法定义E的三条产生式，同理处理其他的产生式
    for(int i = 0; i < 3; ++i)Eporduction[i] = new production(E);

    Eporduction[0]->push_back(T); Eporduction[0]->push_back(Edot);
    Eporduction[1]->push_back(PLUS); Eporduction[1]->push_back(T); Eporduction[1]->push_back(Edot);
    Eporduction[2]->push_back(MINUS); Eporduction[2]->push_back(T); Eporduction[2]->push_back(Edot);
    Eporduction[0]->print(); Eporduction[1]->print(); Eporduction[2]->print();
    E->insertProduction(Eporduction[0]); E->insertProduction(Eporduction[1]); E->insertProduction(Eporduction[2]);

    
    for(int i = 0; i < 3; ++i)Edotproduction[i] = new production(Edot);
    Edotproduction[0]->push_back(PLUS); Edotproduction[0]->push_back(T); Edotproduction[0]->push_back(Edot);
    Edotproduction[1]->push_back(MINUS); Edotproduction[1]->push_back(T); Edotproduction[1]->push_back(Edot);
    Edotproduction[2]->push_back(epslion);

    
    for(int i = 0; i < 1; ++i)Tproduction[i] = new production(T);
    Tproduction[0]->push_back(F); Tproduction[0]->push_back(Tdot);

    
    for(int i = 0; i < 3; ++i)Tdotproduction[i] = new production(Tdot);
    Tdotproduction[0]->push_back(times); Tdotproduction[0]->push_back(F); Tdotproduction[0]->push_back(Tdot);
    Tdotproduction[1]->push_back(slash); Tdotproduction[1]->push_back(F); Tdotproduction[1]->push_back(Tdot);
    Tdotproduction[2]->push_back(epslion);

    
    for(int i = 0; i < 3; ++i)Fproduction[i] = new production(F);
    Fproduction[0]->push_back(ident);
    Fproduction[1]->push_back(unsignint);
    Fproduction[2]->push_back(lparen); Fproduction[2]->push_back(E); Fproduction[2]->push_back(rparen);

    // 将产生式放入分析表中
    AnalysisTable.insertProduction(E, PLUS, Eporduction[1]); AnalysisTable.insertProduction(E, MINUS, Eporduction[2]); AnalysisTable.insertProduction(E, lparen, Eporduction[0]); AnalysisTable.insertProduction(E, ident, Eporduction[0]); AnalysisTable.insertProduction(E, unsignint, Eporduction[0]);
    AnalysisTable.insertProduction(Edot, PLUS, Edotproduction[0]); AnalysisTable.insertProduction(Edot, MINUS, Edotproduction[1]); AnalysisTable.insertProduction(Edot, rparen, Edotproduction[2]); AnalysisTable.insertProduction(Edot, END, Edotproduction[2]);
    AnalysisTable.insertProduction(T, lparen, Tproduction[0]); AnalysisTable.insertProduction(T, ident, Tproduction[0]); AnalysisTable.insertProduction(T, unsignint, Tproduction[0]);
    AnalysisTable.insertProduction(Tdot, PLUS, Tdotproduction[2]); AnalysisTable.insertProduction(Tdot, MINUS, Tdotproduction[2]); AnalysisTable.insertProduction(Tdot, times, Tdotproduction[0]); AnalysisTable.insertProduction(Tdot, slash, Tdotproduction[1]); AnalysisTable.insertProduction(Tdot, rparen, Tdotproduction[2]); AnalysisTable.insertProduction(Tdot, END, Tdotproduction[2]);
    AnalysisTable.insertProduction(F, lparen, Fproduction[2]); AnalysisTable.insertProduction(F, ident, Fproduction[0]); AnalysisTable.insertProduction(F, unsignint, Fproduction[1]);

    AnalysisTable.print();
	
	// 初始化分析栈
    memset(analysisStack, 0, sizeof analysisStack);
    top = -1;
}
void release(){
	// 释放所有的动态申请的资源
    delete PLUS;
	delete MINUS;
	delete times;
	delete slash;
	delete lparen;
	delete rparen;
	delete ident;
	delete unsignint;
	delete END;
	delete epslion;
    delete E;
	delete Edot;
	delete T;
	delete Tdot;
	delete F;
    for(int i = 0; i < 3; ++i)delete Eporduction[i];
    for(int i = 0; i < 3; ++i)delete Edotproduction[i];
    for(int i = 0; i < 1; ++i)delete Tproduction[i];
    for(int i = 0; i < 3; ++i)delete Tdotproduction[i];
    for(int i = 0; i < 3; ++i)delete Fproduction[i];
}
std::string word, code; 
// char word[10], code[10];
char ch;
symbolsVT* a;
void ADVANCE(){
	// 读入一个词法分析的结果项，同时给出对应的终结符a
    // if(scanf("(%s,%s)", code, word) != -1){
    std::cin >> ch;
    if(!std::cin.eof()){
    // if(scanf("%c", &ch) != -1){
        std::getline(std::cin, code, ',');
        std::getline(std::cin, word);
        word.resize(word.size() - 1);
        // std::cin >> ch;
        std::cerr << word << " " << code << std::endl;
        if(code == "plus")a = PLUS;
        else if(code == "minus") a = MINUS;
        else if(code == "times") a = times;
        else if(code == "slash") a = slash;
        else if(code == "lparen") a = lparen;
        else if(code == "rparen") a = rparen;
        else if(code == "ident") a = ident;
        else if(code == "number") a = unsignint;
    }
    else{ 
        a = END;
    // if(std::cin.eof() == EOF){
        std::cerr << "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh" << std::endl;
    }
    std::cerr << word << "_____________" << code << std::endl;
}
bool predictiveAnalysis(){
	// 预测分析程序的总控程序
    init();
    bool grammer = true;		// 表示句子是否符合一定的文法
    bool flag = true;			// 总控程序的运行标志
    analysisStack[++top] = END;	// 先将句末符加入到#分析栈中
    analysisStack[++top] = E;	// 将文法开始符加入到分析栈中
    symbols* X;					// 定义一个公共变量：符号的指针，这样可以方便的取出栈中的符号，而不用管是终结符还是非终结符
    production *p;				// 定义一个产生式的指针
    ADVANCE();					// 读入一个词法分析的结果项
    while(flag){
        // std::cerr << std::endl << std::endl;
        // std::cerr << "stack: " << std::endl;;
        // for(int i = 0; i <= top; ++i){
        //     std::cerr << "> ";
        //     analysisStack[i]->print();
        // }
        X = analysisStack[top--];	// 得到分析栈的栈顶元素，pop操作
        // std::cerr << X->getClassName() << "----" << top << std::endl;
        if(X->getClassName() == "VT"){	// 如果是终结符
            if(((symbolsVT*)X)->getWord() == a->getWord()){		// 如果分析栈顶的终结符和读入的终结符一样
                if(((symbolsVT*)X)->getWord() == END->getWord()){	// 如果是句末符，此时终止语法分析，语法正确
                    flag = false;
                }
                else{					// 读入下一个词法分析项
                    ADVANCE();
                    continue;
                }
            }
            else{		// 是终结符，但不同，显然语法错误
                grammer = false;
                flag = false;
            }
        }
        else{			// 分析栈顶是非终结符
            // std::cerr << ((symbolsVN*)X)->getName() << " " << a->getWord() << std::endl;
            p = AnalysisTable.getProduction((symbolsVN*)X, a); // 根据分析表的M[X, a]得到存储的产生式，存在即可以规约（替换）
            // p->print(); std::cerr << std::endl;
            if(p != NULL){		// 非空，即为存在产生式，按照产生式替换即可
                int len = p->getLen();
                if(p->getProductionIndexOf(0)->getClassName() == "VT"){ // 特判 X -> epslion 的产生式，此时什么都不做
                    if(((symbolsVT*)p->getProductionIndexOf(0))->getCode() == "epslion"){
                        continue;
                    }
                }
                for(int i = len - 1; i >= 0; --i){			// 将产生式逆序压栈即可
                    analysisStack[++top] = p->getProductionIndexOf(i);
                }
            }
            else{				// 到达分析表不存在的位置，语法错误
                grammer = false;
                flag = false;
            }
        }
    }

    release();		// 释放资源
    return grammer;	// 返回结果，true表示句子符合一定的语法
}
