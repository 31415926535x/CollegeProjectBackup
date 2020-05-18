#include<iostream>
#include<algorithm>
#include<string.h>
#include"analysisTable.h"

ACTIONTable::ACTIONTable(){
    numofsymbolsvt = 0;
    vtmap.clear();
    std::pair<char, int> init = std::make_pair('e', -1);
    // fill(begin(ACTION), end(ACTION), std::make_pair('e', -1));
    for(int i = 0; i < NUMOFSTATE; ++i)
        for(int j = 0; j < NUMOFVT; ++j)
            ACTION[i][j] = init;
    std::cerr << "ACTIONTable has created..." << std::endl;
}
void ACTIONTable::setNumOfState(int ns){
    numofstate = ns;
}
int ACTIONTable::getVTMap(symbolsVT* vt){
    if(vtmap.find(vt) != vtmap.end())return vtmap[vt];
    return -1;
}
void ACTIONTable::insertVT(symbolsVT* vt){
    vtmap[vt] = numofsymbolsvt++;
}
void ACTIONTable::insertSHIFT(int state, symbolsVT* vt, int numOfPro){
    int nvt = getVTMap(vt);
    if(state < numofstate && ~nvt){
        ACTION[state][nvt] = std::make_pair('s', numOfPro);
    }
}
void ACTIONTable::insertREDUCE(int state, symbolsVT* vt, int numOfPro){
    int nvt = getVTMap(vt);
    if(state < numofstate && ~nvt){
        ACTION[state][nvt] = std::make_pair('r', numOfPro);
    }
}
void ACTIONTable::insertACC(int state, symbolsVT* vt){
    int nvt = getVTMap(vt);
    if(state < numofstate && ~nvt){
        ACTION[state][nvt] = std::make_pair('a', 0x3f3f3f3f);
    }
}
std::pair<char, int> ACTIONTable::getACTION(int state, symbolsVT* vt){
    int nvt = getVTMap(vt);
    if(state < numofstate && ~nvt){
        return ACTION[state][nvt];
    }
    return std::make_pair('e', -1);
}
void ACTIONTable::print(){
    std::cerr << "ACTION:" << std::endl;
    std::cerr << numofsymbolsvt << std::endl;
    std::cerr << "\t";
    // for(auto i: vtmap)std::cerr << i.first->getWord() << "\t";
    for(std::map<symbolsVT*, int>::iterator i = vtmap.begin(); i != vtmap.end(); ++i)std::cerr << i->first->getWord() << "\t";
    std::cerr << std::endl;
    for(int i = 0; i < numofstate; ++i){
        std::cerr << i << ": \t";
        for(int j = 0; j < numofsymbolsvt; ++j){
            if(~ACTION[i][j].second)
                std::cerr << ACTION[i][j].first << ACTION[i][j].second << " \t";
            else
                std::cerr << "   \t";
        }
        std::cerr << std::endl;
    }
    std::cerr << std::endl;
}


GOTOTable::GOTOTable(){
    numofsymbolsvn = 0;
    vnmap.clear();
    memset(GOTO, -1, sizeof GOTO);
    std::cerr << "GOTOTable has created..." << std::endl;
}
void GOTOTable::setNumOfState(int ns){
    numofstate = ns;
}
void GOTOTable::insertVN(symbolsVN* vn){
    vnmap[vn] = numofsymbolsvn++;
}
int GOTOTable::getVNMap(symbolsVN* vn){
    if(vnmap.find(vn) != vnmap.end())return vnmap[vn];
    return -1;
}
void GOTOTable::insert(int state, symbolsVN* vn, int numOfPro){
    int nvn = getVNMap(vn);
    if(state < numofstate && ~nvn){
        GOTO[state][nvn] = numOfPro;
    }
}
int GOTOTable::get(int state, symbolsVN* vn){
    int nvn = getVNMap(vn);
    if(state < numofstate && ~nvn){
        return GOTO[state][nvn];
    }
    return -1;
}
void GOTOTable::print(){
    std::cerr << "GOTO:" << std::endl;
    std::cerr << numofsymbolsvn << std::endl;
    std::cerr << "\t";
    // for(auto i: vnmap)std::cerr << i.first->getName() << "\t";
    for(std::map<symbolsVN*, int>::iterator i = vnmap.begin(); i != vnmap.end(); ++i)std::cerr << i->first->getName() << "\t";
    std::cerr << std::endl;
    for(int i = 0; i < numofstate; ++i){
        std::cerr << i << ": \t";
        for(int j = 0; j < numofsymbolsvn; ++j){
            if(~GOTO[i][j])
                std::cerr << GOTO[i][j] << "\t";
            else
                std::cerr << "   \t";
        }
        std::cerr << std::endl;
    }
    std::cerr << std::endl;
}


analysisTable::analysisTable(int ns):numofstate(ns){
    ACTION.setNumOfState(numofstate);
    GOTO.setNumOfState(numofstate);
    numofpro = 0;
    std::cerr << "An AnalysisTable has created..." << std::endl;
}
void analysisTable::insertSymbols(symbols* s){
    if(s->getClassName() == "VT"){
        ACTION.insertVT((symbolsVT*)(s));
    }
    else if(s->getClassName() == "VN"){
        GOTO.insertVN((symbolsVN*)(s));
    }
}
void analysisTable::insertProduction(production* p){
    productions[numofpro++] = p;
}
production* analysisTable::getProduction(int i){
    if(i < numofpro)return productions[i];
    // return nullptr;
    return NULL;
}
void analysisTable::insert(int state, symbols* s, char ch, int numOfPro){
    if(s->getClassName() == "VT"){
        if(ch == 'a'){
            ACTION.insertACC(state, (symbolsVT*)(s));
        }
        else if(ch == 's'){
            ACTION.insertSHIFT(state, (symbolsVT*)(s), numOfPro);
        }
        else if(ch == 'r'){
            ACTION.insertREDUCE(state, (symbolsVT*)(s), numOfPro);
        }
    }
    else if(s->getClassName() == "VN"){
        GOTO.insert(state, (symbolsVN*)(s), numOfPro);
    }
}
std::pair<char, int> analysisTable::get(int state, symbols* s){
    if(s->getClassName() == "VT"){
        return ACTION.getACTION(state, (symbolsVT*)(s));
    }
    else if(s->getClassName() == "VN"){
        return std::make_pair('g', GOTO.get(state, (symbolsVN*)(s)));
    }
    return std::make_pair('e', -1);
}
void analysisTable::print(){
    std::cerr << "analysisTable: " << std::endl;
    ACTION.print();
    GOTO.print();
    std::cerr << std::endl;
}