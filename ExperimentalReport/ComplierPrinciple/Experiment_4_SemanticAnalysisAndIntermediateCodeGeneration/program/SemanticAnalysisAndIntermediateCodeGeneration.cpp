#include<iostream>
#include<cstdio>
#include<string.h>
#include<sstream>
#include"symbols.h"
#include"symbolsVN.cpp"
#include"symbolsVT.cpp"
#include"production.cpp"
#include"analysisTable.cpp"
#include"LexicalAnalysi.cpp"
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
symbolsVN* Sdot = new symbolsVN("S'");
symbolsVN* E = new symbolsVN("E");
symbolsVN* T = new symbolsVN("T");
symbolsVN* F = new symbolsVN("F");

// 构造所有的产生式
production* Sdotproduction[1];
production* Eporduction[5];
production* Tproduction[3];
production* Fproduction[3];

// 定义出预测分析表
analysisTable AnalysisTable(21);

// 分析栈
std::pair<int, symbols*> analysisStack[maxnAnalysisStack];
std::string placeStack[maxnAnalysisStack];
int ansStack[maxnAnalysisStack];
int top;

/******************* some basic function *******************/
std::string to_string(int a){
    std::string s;
    while(a){
        s.push_back((char)(a % 10 + '0'));
        a /= 10;
    }
    s.reserve();
    return s;
}
int _stoi(std::string s){
    int ans = 0;
    for(int i = 0; i < s.size(); ++i){
        ans *= 10;
        ans += s[i] - '0';
    }
    return ans;
}

/******************* some basic function *******************/

// 属性文法的内容
int numofnewtemp;
std::string newtemp(){
    return "t" + std::to_string(numofnewtemp++);
}
std::vector<std::string> IntermediateCode;
void SdotToE(production *p){
    symbolsVN *vn = p->getVN();
    if(Arithmetic){
        vn->setAns(p->getProductionIndexOf(0)->getAns());
    }
    else{
        vn->setPlace(((symbolsVN*)(p->getProductionIndexOf(0)))->getPlace());
    }
}
void EToT(production *p){
    symbolsVN *vn = p->getVN();
    if(Arithmetic){
        vn->setAns(p->getProductionIndexOf(0)->getAns());
    }
    else{
        vn->setPlace(((symbolsVN*)(p->getProductionIndexOf(0)))->getPlace());
    }
}
void EToPlusT(production *p){
    symbolsVN *vn = p->getVN();
    if(Arithmetic){
        vn->setAns(p->getProductionIndexOf(1)->getAns());
    }
    else{
        vn->setPlace(((symbolsVN*)(p->getProductionIndexOf(1)))->getPlace());
    }
}
void EToMinusT(production *p){
    symbolsVN *vn = p->getVN();
    if(Arithmetic){
        vn->setAns(-(p->getProductionIndexOf(1)->getAns()));
    }
    else{
        std::string oldPlace = ((symbolsVN*)(p->getProductionIndexOf(1)))->getPlace();
        vn->setPlace(newtemp());
        IntermediateCode.push_back("(uminus," + oldPlace + ",," + vn->getPlace() + ")");
    }
}
void EToEPlusT(production *p){
    symbolsVN *vn = p->getVN();
    if(Arithmetic){
        vn->setAns(p->getProductionIndexOf(0)->getAns() + p->getProductionIndexOf(2)->getAns());
    }
    else{
        std::string oldPlace = ((symbolsVN*)(p->getProductionIndexOf(0)))->getPlace();
        vn->setPlace(newtemp());
        IntermediateCode.push_back("(+," + oldPlace + "," + ((symbolsVN*)(p->getProductionIndexOf(2)))->getPlace() + "," + vn->getPlace() + ")");
    }
}
void EToEMinusT(production *p){
    symbolsVN *vn = p->getVN();
    if(Arithmetic){
        vn->setAns(p->getProductionIndexOf(0)->getAns() - p->getProductionIndexOf(2)->getAns());
    }
    else{
        std::string oldPlace = ((symbolsVN*)(p->getProductionIndexOf(0)))->getPlace();
        vn->setPlace(newtemp());
        IntermediateCode.push_back("(-," + oldPlace + "," + ((symbolsVN*)(p->getProductionIndexOf(2)))->getPlace() + "," + vn->getPlace() + ")");
    }
}
void TToF(production *p){
    symbolsVN *vn = p->getVN();
    if(Arithmetic){
        vn->setAns(p->getProductionIndexOf(0)->getAns());
    }
    else{
        vn->setPlace(((symbolsVN*)(p->getProductionIndexOf(0)))->getPlace());
    }
}
void TToTTimesF(production *p){
    symbolsVN *vn = p->getVN();
    if(Arithmetic){
        vn->setAns(p->getProductionIndexOf(0)->getAns() * p->getProductionIndexOf(2)->getAns());
    }
    else{
        std::string oldPlace = ((symbolsVN*)(p->getProductionIndexOf(0)))->getPlace();
        vn->setPlace(newtemp());
        IntermediateCode.push_back("(*," + oldPlace + "," + ((symbolsVN*)(p->getProductionIndexOf(2)))->getPlace() + "," + vn->getPlace() + ")");
    }
}
void TToTSlashF(production *p){
    symbolsVN *vn = p->getVN();
    if(Arithmetic){
        vn->setAns(p->getProductionIndexOf(0)->getAns() / p->getProductionIndexOf(2)->getAns());
    }
    else{
        std::string oldPlace = ((symbolsVN*)(p->getProductionIndexOf(0)))->getPlace();
        vn->setPlace(newtemp());
        IntermediateCode.push_back("(/," + oldPlace + "," + ((symbolsVN*)(p->getProductionIndexOf(2)))->getPlace() + "," + vn->getPlace() + ")");
    }
}
void FToi(production *p){
    symbolsVN *vn = p->getVN();
    if(Arithmetic){
        vn->setAns(p->getProductionIndexOf(0)->getAns());
    }
    else{
        vn->setPlace(((symbolsVT*)(p->getProductionIndexOf(0)))->getVar());
    }
}
void FTou(production *p){
    symbolsVN *vn = p->getVN();
    if(Arithmetic){
        vn->setAns(_stoi(placeStack[top])); //???????
    }
    else{
        vn->setPlace(((symbolsVT*)(p->getProductionIndexOf(0)))->getVar());
    }
}
void FToSpanE(production *p){
    symbolsVN *vn = p->getVN();
    if(Arithmetic){
        vn->setAns(p->getProductionIndexOf(1)->getAns());
    }
    else{
        vn->setPlace(((symbolsVN*)(p->getProductionIndexOf(1)))->getPlace());
    }
}
void SemanticAnalysisAndIntermediateCodeGenerationInit(){
    numofnewtemp = 1;
    // 初始化所有变量
	// 根据文法的不同，得到的分析表的结构也不同，此时初始化部分也不同

    // 定义出预测分析表
	// 为预测分析表插入终结符、非终结符
    AnalysisTable.insertSymbols(PLUS);
    AnalysisTable.insertSymbols(MINUS);
    AnalysisTable.insertSymbols(times);
    AnalysisTable.insertSymbols(slash);
    AnalysisTable.insertSymbols(lparen);
    AnalysisTable.insertSymbols(rparen);
    AnalysisTable.insertSymbols(ident);
    AnalysisTable.insertSymbols(unsignint);
    AnalysisTable.insertSymbols(END);

    AnalysisTable.insertSymbols(Sdot);
    AnalysisTable.insertSymbols(E);
    AnalysisTable.insertSymbols(T);
    AnalysisTable.insertSymbols(F);

    // 根据文法定义E的三条产生式，同理处理其他的产生式
    for(int i = 0; i < 1; ++i)Sdotproduction[i] = new production(Sdot);
    Sdotproduction[0]->push_back(E);
    Sdotproduction[0]->setAttributesFunction(SdotToE);
    Sdotproduction[0]->print();


    for(int i = 0; i < 5; ++i)Eporduction[i] = new production(E);

    Eporduction[0]->push_back(T);
    Eporduction[1]->push_back(PLUS); Eporduction[1]->push_back(T);
    Eporduction[2]->push_back(MINUS); Eporduction[2]->push_back(T);
    Eporduction[3]->push_back(E); Eporduction[3]->push_back(PLUS); Eporduction[3]->push_back(T);
    Eporduction[4]->push_back(E); Eporduction[4]->push_back(MINUS); Eporduction[4]->push_back(T);
    for(int i = 0; i < 5; ++i)E->insertProduction(Eporduction[i]);
    Eporduction[0]->setAttributesFunction(EToT);
    Eporduction[1]->setAttributesFunction(EToPlusT);
    Eporduction[2]->setAttributesFunction(EToMinusT);
    Eporduction[3]->setAttributesFunction(EToEPlusT);
    Eporduction[4]->setAttributesFunction(EToEMinusT);
    for(int i = 0; i < 5; ++i)Eporduction[i]->print();
    
    for(int i = 0; i < 3; ++i)Tproduction[i] = new production(T);
    Tproduction[0]->push_back(F);
    Tproduction[1]->push_back(T); Tproduction[1]->push_back(times); Tproduction[1]->push_back(F);
    Tproduction[2]->push_back(T); Tproduction[2]->push_back(slash); Tproduction[2]->push_back(F);
    for(int i = 0; i < 3; ++i)T->insertProduction(Tproduction[i]);
    Tproduction[0]->setAttributesFunction(TToF);
    Tproduction[1]->setAttributesFunction(TToTTimesF);
    Tproduction[2]->setAttributesFunction(TToTSlashF);
    for(int i = 0; i < 3; ++i)Tproduction[i]->print();

    
    for(int i = 0; i < 3; ++i)Fproduction[i] = new production(F);
    Fproduction[0]->push_back(ident);
    Fproduction[1]->push_back(unsignint);
    Fproduction[2]->push_back(lparen); Fproduction[2]->push_back(E); Fproduction[2]->push_back(rparen);
    for(int i = 0; i < 3; ++i)F->insertProduction(Fproduction[i]);
    Fproduction[0]->setAttributesFunction(FToi);
    Fproduction[1]->setAttributesFunction(FTou);
    Fproduction[2]->setAttributesFunction(FToSpanE);
    for(int i = 0; i < 3; ++i)Fproduction[i]->print();   

    for(int i = 0; i < 1; ++i)AnalysisTable.insertProduction(Sdotproduction[i]);
    for(int i = 0; i < 5; ++i)AnalysisTable.insertProduction(Eporduction[i]);
    for(int i = 0; i < 3; ++i)AnalysisTable.insertProduction(Tproduction[i]);
    for(int i = 0; i < 3; ++i)AnalysisTable.insertProduction(Fproduction[i]);

    // 给出LR分析表
    AnalysisTable.insert(0, PLUS, 's', 5); AnalysisTable.insert(0, MINUS, 's', 4); AnalysisTable.insert(0, lparen, 's', 8); AnalysisTable.insert(0, ident, 's', 6); AnalysisTable.insert(0, unsignint, 's', 7); AnalysisTable.insert(0, E, ' ', 1); AnalysisTable.insert(0, T, ' ', 2); AnalysisTable.insert(0, F, ' ', 3);
    AnalysisTable.insert(1, PLUS, 's', 9); AnalysisTable.insert(1, MINUS, 's', 10); AnalysisTable.insert(1, END, 'a', -1);
    AnalysisTable.insert(2, PLUS, 'r', 1); AnalysisTable.insert(2, MINUS, 'r', 1); AnalysisTable.insert(2, times, 's', 11); AnalysisTable.insert(2, slash, 's', 12); AnalysisTable.insert(2, rparen, 'r', 1); AnalysisTable.insert(2, END, 'r', 1);
    AnalysisTable.insert(3, PLUS, 'r', 6); AnalysisTable.insert(3, MINUS, 'r', 6); AnalysisTable.insert(3, times, 'r', 6); AnalysisTable.insert(3, slash, 'r', 6); AnalysisTable.insert(3, rparen, 'r', 6); AnalysisTable.insert(3, END, 'r', 6);
    AnalysisTable.insert(4, T, ' ', 13);
    AnalysisTable.insert(5, T, ' ', 14);
    AnalysisTable.insert(6, PLUS, 'r', 9); AnalysisTable.insert(6, MINUS, 'r', 9); AnalysisTable.insert(6, times, 'r', 9); AnalysisTable.insert(6, slash, 'r', 9); AnalysisTable.insert(6, rparen, 'r', 9); AnalysisTable.insert(6, END, 'r', 9);
    AnalysisTable.insert(7, PLUS, 'r', 10); AnalysisTable.insert(7, MINUS, 'r', 10); AnalysisTable.insert(7, times, 'r', 10); AnalysisTable.insert(7, slash, 'r', 10); AnalysisTable.insert(7, rparen, 'r', 10); AnalysisTable.insert(7, END, 'r', 10);
    AnalysisTable.insert(8, PLUS, 's', 5); AnalysisTable.insert(8, MINUS, 's', 4); AnalysisTable.insert(8, lparen, 's', 8); AnalysisTable.insert(8, ident, 's', 6); AnalysisTable.insert(8, unsignint, 's', 7); AnalysisTable.insert(8, E, ' ', 15); AnalysisTable.insert(8, T, ' ', 2); AnalysisTable.insert(8, F, ' ', 3);
    AnalysisTable.insert(9, lparen, 's', 8); AnalysisTable.insert(9, ident, 's', 6); AnalysisTable.insert(9, unsignint, 's', 7); AnalysisTable.insert(9, T, ' ', 16); AnalysisTable.insert(9, F, ' ', 3);
    AnalysisTable.insert(10, lparen, 's', 8); AnalysisTable.insert(10, ident, 's', 6); AnalysisTable.insert(10, unsignint, 's', 7); AnalysisTable.insert(10, T, ' ', 17); AnalysisTable.insert(10, F, ' ', 3);
    AnalysisTable.insert(11, lparen, 's', 8); AnalysisTable.insert(11, ident, 's', 6); AnalysisTable.insert(11, unsignint, 's', 7); AnalysisTable.insert(11, F, ' ', 18);
    AnalysisTable.insert(12, lparen, 's', 8); AnalysisTable.insert(12, ident, 's', 6); AnalysisTable.insert(12, unsignint, 's', 7); AnalysisTable.insert(12, F, ' ', 19);
    AnalysisTable.insert(13, PLUS, 'r', 3); AnalysisTable.insert(13, MINUS, 'r', 3); AnalysisTable.insert(13, rparen, 'r', 3); AnalysisTable.insert(13, END, 'r', 3);
    AnalysisTable.insert(14, PLUS, 'r', 2); AnalysisTable.insert(14, MINUS, 'r', 2); AnalysisTable.insert(14, rparen, 'r', 2); AnalysisTable.insert(14, END, 'r', 2);
    AnalysisTable.insert(15, PLUS, 's', 9); AnalysisTable.insert(15, MINUS, 's', 10); AnalysisTable.insert(15, rparen, 's', 20);
    AnalysisTable.insert(16, PLUS, 'r', 4); AnalysisTable.insert(16, MINUS, 'r', 4); AnalysisTable.insert(16, times, 's', 11); AnalysisTable.insert(16, slash, 's', 12); AnalysisTable.insert(16, rparen, 'r', 4); AnalysisTable.insert(16, END, 'r', 4);
    AnalysisTable.insert(17, PLUS, 'r', 5); AnalysisTable.insert(17, MINUS, 'r', 5); AnalysisTable.insert(17, times, 's', 11); AnalysisTable.insert(17, slash, 's', 12); AnalysisTable.insert(17, rparen, 'r', 5); AnalysisTable.insert(17, END, 'r', 5);
    AnalysisTable.insert(18, PLUS, 'r', 7); AnalysisTable.insert(18, MINUS, 'r', 7); AnalysisTable.insert(18, times, 'r', 7); AnalysisTable.insert(18, slash, 'r', 7); AnalysisTable.insert(18, rparen, 'r', 7); AnalysisTable.insert(18, END, 'r', 7);
    AnalysisTable.insert(19, PLUS, 'r', 8); AnalysisTable.insert(19, MINUS, 'r', 8); AnalysisTable.insert(19, times, 'r', 8); AnalysisTable.insert(19, slash, 'r', 8); AnalysisTable.insert(19, rparen, 'r', 8); AnalysisTable.insert(19, END, 'r', 8);
    AnalysisTable.insert(20, PLUS, 'r', 11); AnalysisTable.insert(20, MINUS, 'r', 11); AnalysisTable.insert(20, times, 'r', 11); AnalysisTable.insert(20, slash, 'r', 11); AnalysisTable.insert(20, rparen, 'r', 11); AnalysisTable.insert(20, END, 'r', 11);
    AnalysisTable.print();
	
	// 初始化分析栈
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
	delete T;
	delete F;
    for(int i = 0; i < 1; ++i)delete Sdotproduction[i];
    for(int i = 0; i < 5; ++i)delete Eporduction[i];
    for(int i = 0; i < 3; ++i)delete Tproduction[i];
    for(int i = 0; i < 3; ++i)delete Fproduction[i];
}
std::string word, code; 
// char word[10], code[10];
char ch;
symbolsVT* a;
std::string LexicalAnalysis;    // 调用词法分析结果
std::stringstream ss(LexicalAnalysis = getAns());               // 将词法分析的结果作为输入流
void ADVANCE(){
    
	// 读入一个词法分析的结果项，同时给出对应的终结符a
    // if(scanf("(%s,%s)", code, word) != -1){
    // std::cin >> ch;
    ss >> ch;
    
    if(!ss.eof()){
    // if(scanf("%c", &ch) != -1){
        std::getline(ss, code, ',');
        std::getline(ss, word);
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
        a->setVar(word);
    }
    else{ 
        a = END;
        a->setVar("#");
    // if(std::cin.eof() == EOF){
        std::cerr << "ADVANCE In End....." << std::endl;
    }
    std::cerr << word << "_____________" << code << std::endl;
}
bool SemanticAnalysisAndIntermediateCodeGeneration(){
	// 预测分析程序的总控程序
    SemanticAnalysisAndIntermediateCodeGenerationInit();
    std::cerr << "Arithmetic: " << Arithmetic << std::endl;
    std::cerr << "LexicalAnalysis: \n" << LexicalAnalysis << std::endl;
    bool grammer = true;		// 表示句子是否符合一定的文法
    bool flag = true;			// 总控程序的运行标志
    analysisStack[++top] = std::make_pair(0, (symbols*)END);  // 初始化栈，将状态0和符号#压入
    std::pair<int, symbols*> X;					// 定义一个公共变量：状态和符号的指针
    production *p;				// 定义一个产生式的指针
    std::pair<char, int> state; // 从分析表中获得的状态信息
    ADVANCE();					// 读入一个词法分析的结果项
    while(flag){

		//************************************************************//
		// 调试信息：状态栈和符号栈的中内容
        std::cerr << std::endl << std::endl;
        std::cerr << "================" << std::endl;
        a->print();
        std::cerr << "stack: " << std::endl;
        std::cerr << "state: \t" ;
        for(int i = 0; i <= top; ++i){
            std::cerr << analysisStack[i].first << " ";            
        }
        std::cerr << std::endl;
        std::cerr << "symbols: \t" ;
        for(int i = 0; i <= top; ++i){
            if(analysisStack[i].second->getClassName() == "VT")std::cerr << ((symbolsVT*)(analysisStack[i].second))->getWord() << " ";
            else std::cerr << ((symbolsVN*)analysisStack[i].second)->getName() << " ";
        }
        std::cerr << std::endl;
        std::cerr << "place: \t" ;
        for(int i = 0; i <= top; ++i){
            std::cerr << placeStack[i] << " ";
        }
        std::cerr << std::endl;
        std::cerr << "ans: \t";
        for(int i = 0; i <= top; ++i){
            std::cerr << ansStack[i] << " ";
        }
        std::cerr << std::endl << "================" << std::endl;
        std::cerr << std::endl;
		//************************************************************//
		

        X = analysisStack[top];	// 得到分析栈的栈顶元素，pop操作
        state = AnalysisTable.get(X.first, a);	// 根据栈顶的状态以及分析表中的变化情况来获得下一转换的状态s_i, r_i, acc, i等等
        std::cerr << state.first << "  " << state.second << std::endl;
        if(state.first == 's'){		// 如果是移进状态
            analysisStack[++top] = std::make_pair(state.second, a);
            placeStack[top] = a->getVar();
            ADVANCE();
            std::cerr << "One SHIFT..." << std::endl << std::endl;;
        }
        else if(state.first == 'r' || state.first == 'a'){	// 如果是规约状态
            if(state.first == 'a')state.second = 0;
            p = AnalysisTable.getProduction(state.second);	// 获得第i个产生式
            p->print();
            int len = p->getLen();
			// 恢复产生式对应到的非终结符的属性文法的值
            for(int i = 0; i < len; ++i)p->getProductionIndexOf(len - i - 1)->setPlace(placeStack[top - i]);
            for(int i = 0; i < len; ++i)p->getProductionIndexOf(len - i - 1)->setAns(ansStack[top - i]);
            p->getAttributesFunction()(p);		// 调用该产生式对应的语义分析函数，实现中间代码生成或者表达式值的计算
            top -= len;					// 将栈顶的符号按照产生式来规约
            X = analysisStack[top];		// 获得此时的栈顶元素，据此来获得GOTO表的下一状态
            analysisStack[++top] = std::make_pair(AnalysisTable.get(X.first, p->getVN()).second, p->getVN());
            placeStack[top] = p->getVN()->getPlace();
            ansStack[top] = p->getVN()->getAns();
            std::cerr << "One REDUCE..." << std::endl << std::endl;
            if(state.first == 'a'){
                std::cerr << "ACC!!!" << std::endl << std::endl;
                flag = false;
            }
        }
        // else if(state.first == 'a'){	// 如果是acc状态
        //     std::cerr << "ACC!!!" << std::endl << std::endl;
        //     flag = false;
        // }
        else{							// 到达分析表的其他状态，错误
            grammer = false;
            flag = false;
        }
    }

    release();		// 释放资源
    if(Arithmetic)std::cout << Sdot->getAns() << std::endl;
    else for(int i = 0; i < IntermediateCode.size(); ++i)std::cout << IntermediateCode[i] << std::endl;
    return grammer;	// 返回结果，true表示句子符合一定的语法
}
