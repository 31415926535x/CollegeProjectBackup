#include<bits/stdc++.h>
#include"predictiveAnalysis.cpp"
using namespace std;
typedef long long ll;
const int mod = 1e9 + 7;
const int maxn = 1e2 + 5;
const int inf = 0x3f3f3f3f;


int main(){
    freopen("in.in", "r", stdin);
    // freopen("out.out", "w", stdout);

    if(predictiveAnalysis()) cout << "Yes,it is correct." << endl;
    else cout << "No,it is wrong." << endl;

    return 0;
}