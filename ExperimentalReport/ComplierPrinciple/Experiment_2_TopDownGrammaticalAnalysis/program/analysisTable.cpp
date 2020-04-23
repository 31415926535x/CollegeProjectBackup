
#include<iostream>
#include<string.h>
#include"analysisTable.h"

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