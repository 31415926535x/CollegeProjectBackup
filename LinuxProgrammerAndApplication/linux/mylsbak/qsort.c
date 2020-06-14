#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<time.h>

typedef struct NODE
{
    char s[10];
    int a;
}NODE;
NODE node[10];

int cmp(const void* n1, const void* n2){
    // NODE* n11 = (NODE*)n1;
    // NODE* n22 = (NODE*)n2;
    // return strcmp(n11->s, n22->s);
    return strcmp((*(NODE*)n1).s, (*(NODE*)n2).s);
}
int cmp2( const void *a ,const void *b) 
{ 
return (*(NODE *)a).a > (*(NODE *)b).a ? 1 : -1; 
} 
int main(){

    for(int i = 0; i < 5; ++i)node[i].a = rand() % 5;
    srand(time(NULL));
    for(int i = 0; i < 5; ++i){
        int l = rand() % 10;
        for(int j = 0; j < l; ++j)
            node[i].s[j] = (char)('a' + rand() % 26);
    }
    for(int i = 0; i < 5; ++i)printf("%d %s\n", node[i].a, node[i].s);
    qsort(node, 5, sizeof(NODE), cmp);
    puts("");
    for(int i = 0; i < 5; ++i)printf("%d %s\n", node[i].a, node[i].s);
    return 0;
}