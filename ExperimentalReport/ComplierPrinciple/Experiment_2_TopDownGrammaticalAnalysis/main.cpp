#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
const int mod = 1e9 + 7;
const int maxn = 1e2 + 5;
const int inf = 0x3f3f3f3f;

class symbols
{
private:
    /* data */
public:
    symbols(){};
    virtual ~symbols(){};
    virtual std::string getClassName(){
        return "symbols";
    }
    virtual void print(){};
};
class symbolsVT : public symbols{
private:
    std::string word;   //终结符的值
    std::string code;   //词法分析后终结符的标识（编码）
public:
    symbolsVT(){}
    symbolsVT(std::string W, std::string C):word(W), code(C) {
        std::cerr<< "V_T: " << word << " " << code << " created..." << std::endl;
    }
    ~symbolsVT() {}
    std::string getClassName();
    std::string getWord();
    std::string getCode();
    void print();
};
std::string symbolsVT::getClassName(){
    return "VT";
}
std::string symbolsVT::getWord(){
    return word;
}
std::string symbolsVT::getCode(){
    return code;
}
void symbolsVT::print(){
    std::cerr << "VT: " << word << " " << code << std::endl;
}

const int maxnNum = 5;     // 一个终结符所有的产生式的数量



class production;
/*
非终结符
非终结符由其左部的非终结符和有部一个一些产生式构成
产生式即为一些符号的排列，此处存储的是一些产生式的指针
*/

class symbolsVN: public symbols{
private:
    std::string name;
    production *p[maxnNum];
    int num;
public:
    symbolsVN();
    symbolsVN(std::string);
    ~symbolsVN() {}
    std::string getClassName();
    std::string getName();
    void insertProduction(production *newp);
    production* getProductionIndexOf(int i);
    production** getAllProduction();
    void print();
};
symbolsVN::symbolsVN(){
    num = 0;
}
symbolsVN::symbolsVN(std::string n):name(n){
    symbolsVN();
    std::cerr << "V_N: " << name << " created..." << std::endl;
}

std::string symbolsVN::getClassName(){
    return "VN";
}
std::string symbolsVN::getName(){
    return name;
}
void symbolsVN::insertProduction(production *newp){
    p[num++] = newp;
    return;
}
production* symbolsVN::getProductionIndexOf(int i){
    if(i >= num){
        std::cerr << "index overflow..." << std::endl;
        return NULL;
    }
    return p[i];
}
production** symbolsVN::getAllProduction(){
    return p;
}

const int maxnLen = 10;        // 一个产生式的右部符号的数量

class production
{
private:
    symbolsVN *vn;
    symbols *pro[maxnLen];
    int len;
public:
    production();
    production(symbolsVN *v);
    ~production(){}
    void push_back(symbols *a);
    symbolsVN* getVN();
    symbols** getProduction();
    int getLen();
    symbols* getProductionIndexOf(int i);
    void print();
};

production::production(){
    len = 0;
}
production::production(symbolsVN *v){
    vn = v;
    production();
    std::cerr << "A production of " << vn->getName() << " has created..." << std::endl;
}
void production::push_back(symbols *a){
    pro[len++] = a;
}
symbolsVN* production::getVN(){
    return vn;
}
symbols** production::getProduction(){
    return pro;
}
symbols* production::getProductionIndexOf(int i){
    if(i >= len){
        std::cerr << "index Overflow..." << std::endl;
        return NULL;
    }
    return pro[i];
}
int production::getLen(){
    return len;
}
void production::print(){
    std::cerr << vn->getName() << "->";
    for(int i = 0; i < len; ++i){
        if(pro[i]->getClassName() == "VT"){
            std::cerr << ((symbolsVT*)pro[i])->getWord();
        }
        else{
            std::cerr << ((symbolsVN*)pro[i])->getName();
        }
    }
    // std::cerr << std::endl;
}
void symbolsVN::print(){
    std::cerr << "VN: " << name << std::endl;
    std::cerr << "ALL production: " << std::endl;
    for(int i = 0; i < num; ++i){
        std::cerr << name << " \\to ";
        p[i]->print();
    }
    std::cerr << std::endl;
}
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

    int getVTMap(symbolsVT*);
    int getVNMap(symbolsVN*);
public:
    analysisTable();
    analysisTable(int, int);
    ~analysisTable() {}
    void insertVT(symbolsVT*);
    void insertVN(symbolsVN*);
    void insertProduction(symbolsVN*, symbolsVT*, production*);
    production* getProduction(symbolsVN*, symbolsVT*);
    void print();
};

analysisTable::analysisTable(){
    memset(M, 0, sizeof M);
    numofvn = numofvt = 0;
    vtmap.clear();
    vnmap.clear();
}
analysisTable::analysisTable(int nvt, int nvn):numofvt(nvt), numofvn(nvn){
    analysisTable();
    // for(int i = 0; i < numofvn; ++i){
    //     for(int j = 0; j < numofvt; ++j){
    //         M[i][j] = nullptr;
    //     }
    // }
}
void analysisTable::insertVT(symbolsVT* vt){
    vtmap[vt] = numofvt++;
}
void analysisTable::insertVN(symbolsVN* vn){
    vnmap[vn] = numofvn++;
}
int analysisTable::getVTMap(symbolsVT* vt){
    return vtmap[vt];
}
int analysisTable::getVNMap(symbolsVN* vn){
    return vnmap[vn];
}
void analysisTable::insertProduction(symbolsVN* vn, symbolsVT* vt, production* p){
    M[getVNMap(vn)][getVTMap(vt)] = p;
}
production* analysisTable::getProduction(symbolsVN* X, symbolsVT* a){
    return M[getVNMap(X)][getVTMap(a)];
}

void analysisTable::print(){
    std::cerr << numofvn << " " << numofvt << std::endl;
    for(int i = 0; i < numofvn; ++i){
        for(int j = 0; j < numofvt; ++j){
            std::cerr << M[i][j] << "\t";
        }
        std::cerr << std::endl;
    }
    std::cerr << std::endl;
    for(int i = 0; i < numofvn; ++i){
        for(int j = 0; j < numofvt; ++j){
            if(M[i][j] != NULL){
                M[i][j]->print();
            }
            std::cerr << "\t";
        }
        std::cerr << std::endl;
    }
}

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

    // 定义出预测分析表
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

    memset(analysisStack, 0, sizeof analysisStack);
    top = -1;
}
void release(){
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
    else{ a = END;
    // if(std::cin.eof() == EOF){
        std::cerr << "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh" << std::endl;
    }
    std::cerr << word << "_____________" << code << std::endl;
}
bool predictiveAnalysis(){
    init();
    bool grammer = true;
    bool flag = true;
    analysisStack[++top] = END;
    analysisStack[++top] = E;
    symbols* X;
    production *p;
    ADVANCE();
    while(flag){
        std::cerr << std::endl << std::endl;
        std::cerr << "stack: " << std::endl;;
        for(int i = 0; i <= top; ++i){
            std::cerr << "> ";
            analysisStack[i]->print();
        }
        X = analysisStack[top--];
        std::cerr << X->getClassName() << "----" << top << std::endl;
        if(X->getClassName() == "VT"){
            if(((symbolsVT*)X)->getWord() == a->getWord()){
                if(((symbolsVT*)X)->getWord() == END->getWord()){
                    flag = false;
                }
                else{
                    ADVANCE();
                    continue;
                }
            }
            else{
                grammer = false;
                flag = false;
            }
        }
        else{
            std::cerr << ((symbolsVN*)X)->getName() << " " << a->getWord() << std::endl;
            p = AnalysisTable.getProduction((symbolsVN*)X, a);
            // p->print(); std::cerr << std::endl;
            if(p != NULL){
                int len = p->getLen();
                if(p->getProductionIndexOf(0)->getClassName() == "VT"){
                    if(((symbolsVT*)p->getProductionIndexOf(0))->getCode() == "epslion"){
                        continue;
                    }
                }
                for(int i = len - 1; i >= 0; --i){
                    analysisStack[++top] = p->getProductionIndexOf(i);
                }
            }
            else{
                grammer = false;
                flag = false;
            }
        }
    }

    release();
    return grammer;
}


int main(){
    // freopen("in.in", "r", stdin);
    // freopen("out.out", "w", stdout);

    if(predictiveAnalysis()) cout << "Yes,it is correct." << endl;
    else cout << "No,it is wrong." << endl;

    return 0;
}