#ifndef symbols_h
#define symbols_h
#include<iostream>
/*
终结符和非终结符的一个共同的基类
这样可以通过基类来引用终结符和非终结符

*/
class symbols
{
private:
    /* data */
    // 属性文法的内容

    std::string place;	// 属性文法中place的值
    int ans;			// 如果是算术表达式，记录其值
public:
    symbols(){};
    virtual ~symbols(){};
    virtual std::string getClassName(){
        return "symbols";
    }
    void print(){};
    void setPlace(std::string p){	设置place的值
        place = p;
    }
    void setAns(int a){
        ans = a;
    }
    std::string getPlace(){
        return place;
    }
    int getAns(){
        return ans;
    }
};

#endif /*symbols_h*/