#include<iostream>
#include"symbolsVT.h"

std::string symbolsVT::getClassName(){
    return "VT";
}
std::string symbolsVT::getWord(){
    return word;
}
std::string symbolsVT::getCode(){
    return code;
}
void symbolsVT::setVar(std::string v){
    var = v;
}
std::string symbolsVT::getVar(){
    return var;
}
void symbolsVT::print(){
    std::cerr << "VT: " << word << " " << code << std::endl;
}
