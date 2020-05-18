#include<bits/stdc++.h>
#include"SemanticAnalysisAndIntermediateCodeGeneration.cpp"
typedef long long ll;
const int mod = 1e9 + 7;
const int maxn = 1e2 + 5;
const int inf = 0x3f3f3f3f;


int main(int argc, char *argv[]){
    // freopen("in.in", "r", stdin);
    // freopen("out.out", "w", stdout);
    // SemanticAnalysisAndIntermediateCodeGeneration();
    if(SemanticAnalysisAndIntermediateCodeGeneration()) std::cerr << "Yes,it is correct." << std::endl;
    else std::cerr << "No,it is wrong." << std::endl;

    return 0;
}