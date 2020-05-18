
#include<iostream>
#include"symbolsVN.h"

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
void symbolsVN::print(){
    std::cerr << "VN: " << name << std::endl;
    std::cerr << "ALL production: " << std::endl;
    for(int i = 0; i < num; ++i){
        std::cerr << name << " \\to ";
        p[i]->print();
    }
    std::cerr << std::endl;
}