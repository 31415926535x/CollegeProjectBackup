#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int maxn = 1 << 7;
const int maxm = 1e2 + 5;
const int mod = 1e9 + 7;
const int inf = 0x3f3f3f3f;
//词汇表
const string words[] = {"begin", "call", "const", "do", "end", "if", "odd", "procedure", "read", "then", "var", "while", "write",
                        "+", "-", "*", "/", "=", "<>", "<", "<=", ">", ">=", ":=",
                        "(", ")", ",", ";", "."};
//对应的助记符
const string codes[] = {"beginsym", "callsym", "constsym", "dosym", "endsym", "ifsym", "oddsym", "proceduresym", "readsym", "thensym", "varsym", "whilesym", "writesym",
                        "plus", "minus", "times", "slash", "eql", "neq", "lss", "leq", "gtr", "geq", "becomes",
                        "lparen", "rparen", "comma", "semicolon", "period"};

char ch;										//当前读入的字符
char strToken[maxn];							//当前读入的单词串
int strTokenLen;								//单词串的长度

map<string, int> symbolTable;					//符号表，此处因为没有输出该项，所以没有使用
map<string, int> constTable;					//常数表，此处因为没有输出该项，所以没有使用
map<string, pair<int, string> > reserveWords;	//单词和对应助记符的一个映射表，当发现单词时，将strToken中保存的单词在词汇表查询，存在即返回对应的助记符，不存在既是标识符或常数

int stateTrans[maxm][maxn];						//状态转换矩阵，stateTrans[i, j]表示当前在状态i，读入字符为j时下一个状态的编号
int isAcceptingState[maxm];						//是否是终态数组，isAcceptingState[i]表示状态i是否是终态
int curState;									//当前的状态编号

vector<pair<string, string> > ans;				//最后分析的结果

bool IsLetter(){								//判断一个字符是否为字母
    if((ch >= 'a' && ch <'z') || (ch >= 'A') && (ch <= 'Z'))return true;
    return false;
}
bool IsDigital(){								//判断数字
    if(ch >= '0' && ch <= '9')return true;
    return false;
}
bool IsBlank(){									//判断是否为空白字符
    if(ch == ' ' || ch == '\n' || ch == '\r' || ch == '\t')return true;
    return false;
}
bool FileEnd;									//是否读到文件末
void GetChar(){									//读入一个字符到ch，当读到文件末是scanf返回-1，此时FileEnd的值就为假False
    FileEnd = ~scanf("%c", &ch);
    // ch = getchar();
}
void GetBC(){									//跳过空白符
    GetChar();
    while(FileEnd && IsBlank())GetChar();
}
void Concat(){									//将ch加入到strToken中
    if(strTokenLen < maxn)strToken[strTokenLen++] = ch;
}
pair<int, string> Reserve(){					//根据词汇表的映射返回当前识别到的单词的助记符
    string s = string(strToken);
    if(reserveWords.count(s))return reserveWords[s];
    else if(curState == 2)return make_pair(0, "ident");
    else return make_pair(0, "number");
    return make_pair(0, "");
}
void pushAns(){									//增加结果二元组
    ans.push_back(make_pair(string(strToken), Reserve().second));
}
void InsertId(){								//将识别到的单词插入符号表（此程序未使用）
    symbolTable[string(strToken)] = symbolTable.size() + 1;
}
void InsertConst(){								//将识别到的常数插入常数表（此程序未使用）
    constTable[string(strToken)] = constTable.size() + 1;
}

void init(){									//初始化函数，除了各变量的置空初始化外，根据不同文法的DFA初始化状态转化矩阵
    FileEnd = true;
    ch = ' ';
    symbolTable.clear();
    constTable.clear();
    reserveWords.clear();
    memset(strToken, '\0', sizeof strToken);
    strTokenLen = 0;

    //构造单词表中预定义单词于编码的映射关系
    int len = sizeof(words) / sizeof(words[0]);
    for(int i = 0; i < len; ++i)reserveWords[words[i]] = make_pair(i, codes[i]);

    //构造状态转化矩阵
    //-1 表示未定义状态，即出错
    //inf表示终态，表示识别到一个单词（使用isaccepting来表示
    memset(stateTrans, -1, sizeof stateTrans);
    //对于状态0，读入空白仍为该状态，字母进入状态1，数字进入状态2等等
    stateTrans[0][' '] = stateTrans[0]['\n'] = stateTrans[0]['\r'] = stateTrans[0]['t'] = 0;
    for(int i = 'a'; i <= 'z'; ++i)stateTrans[0][i] = 1;
    for(int i = 'A'; i <= 'Z'; ++i)stateTrans[0][i] = 1;
    for(int i = '0'; i <= '9'; ++i)stateTrans[0][i] = 3;
    stateTrans[0]['+'] = 5;
    stateTrans[0]['-'] = 6;
    stateTrans[0]['*'] = 7;
    stateTrans[0]['/'] = 8;
    stateTrans[0]['='] = 9;
    stateTrans[0]['<'] = 10;
    stateTrans[0]['>'] = 14;
    stateTrans[0][':'] = 17;
    stateTrans[0]['('] = 19;
    stateTrans[0][')'] = 20;
    stateTrans[0][','] = 21;
    stateTrans[0][';'] = 22;
    stateTrans[0]['.'] = 23;

    //对其他状态定义：
    //1:
    for(int i = 0; i < maxn; ++i)stateTrans[1][i] = 2;
    for(int i = 'a'; i <= 'z'; ++i)stateTrans[1][i] = 1;
    for(int i = 'A'; i <= 'Z'; ++i)stateTrans[1][i] = 1;
    for(int i = '0'; i <= '9'; ++i)stateTrans[1][i] = 1;

    //3:
    for(int i = 0; i < maxn; ++i)stateTrans[3][i] = 4;
    for(int i = '0'; i <= '9'; ++i)stateTrans[3][i] = 3;

    //10:
    fill(stateTrans[10], stateTrans[10] + maxn, 13);
    stateTrans[10]['>'] = 11;
    stateTrans[10]['='] = 12;

    //14:
    fill(stateTrans[14], stateTrans[14] + maxn, 13);
    stateTrans[14]['='] = 15;

    //17:
    stateTrans[17]['='] = 18;
    
    //确定终态：
	//0:表示非终态
	//1:表示根据当前读入的字符拼接到strToken后即为一个单词（显然这样下一次单词分析需要再读入新字符）
	//2:表示根据当前读入字符可以判断出strToken中为一个单词（显然此时读入的字符要归入到下一次单词分析）
    fill(isAcceptingState, isAcceptingState + maxm, 1);
    isAcceptingState[0] = isAcceptingState[1] = isAcceptingState[3] = isAcceptingState[10] = isAcceptingState[14] = isAcceptingState[17] = 0;
    isAcceptingState[2] = isAcceptingState[4] = isAcceptingState[13] = isAcceptingState[16] = 2;

    ans.clear();
}


void work(){									//词法分析一般控制过程
    curState = 0;
    GetBC();
    while(~stateTrans[curState][ch]){			//当当前的状态合法时进行分析
        if(!FileEnd)ch = '\0';					//如果是读到文件末，对最后遗留在strToken进行分析后退出子程序
        curState = stateTrans[curState][ch];	//根据当前状态和读入字符进行状态转移
        if(isAcceptingState[curState] == 0){	//非终态，将ch中字符拼接到strToken中，继续读入字符分析过程
            Concat();
            GetChar();
        }
        else if(isAcceptingState[curState] == 1){//识别到一个单词，并且当前读入字符也是单词的一部分
            Concat();							//将读入字符ch拼接
            cerr << "1.find a words: " << strTokenLen << ": " << strToken << endl;
            pushAns();							//调用保存结果函数，查表等获得二元组
            memset(strToken, '\0', sizeof strToken);//清空strToken等，为下一次分析做准备
            strTokenLen = 0;
            GetBC();							//读到下一个非空字符
            curState = 0;
        }
        else if(isAcceptingState[curState] == 2){//识别到一个单词，并且当前读入字符不是单词的一部分时
            cerr << "2.find a words: " << strTokenLen << ": " << strToken << endl;
            pushAns();
            memset(strToken, '\0', sizeof strToken);
            strTokenLen = 0;
            // Concat();						//当前字符要进入下一次分析，所以不拼接到strToken中，也不进行读入新字符的操作（除空白字符外）
            curState = 0;
            if(IsBlank())GetBC();				//如果当前读入的字符是空白符，也就是用空白符分隔所得到的单词时，显然为了下一次分析要不断地读到非空字符
        }
        else{									//未定义的状态，此时读入的字符是文法所为定义的字符，提示报错，退出程序
            cerr << "error!" << endl;
            break;
        }
        if(ch == '\0')break;					//分析到文件末结束分析
    }
}


int main(){
    
    freopen("test.txt", "r", stdin);
    freopen("ans.txt", "w", stdout);

    init();
    work();
    // for(auto i: ans)cout << "(" << i.second << "," << i.first << ")" << endl;
	//输出二元组结果
    for(int i = 0; i < ans.size(); ++i)cout << "(" << ans[i].second << "," << ans[i].first << ")" << endl;

    return 0;
}
