
#include<iostream>
#include"production.h"
#include"symbolsVT.h"
#include"symbolsVN.h"

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
    std::cerr << std::endl;
}