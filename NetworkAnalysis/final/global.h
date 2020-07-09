#ifndef GLOBAL_H
#define GLOBAL_H
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<ws2tcpip.h>
#include<pthread.h>
#define HAVE_REMOTE
#include<pcap.h>
#include"protocol.h"

extern pcap_if_t *dev; // 要捕获的网卡设备
extern pcap_t *dev_fp;  // 网卡描述符
extern bool isCatchDone;   // 是否捕获完毕
extern bool isAnalysisDone; // 是否分析完毕

// 捕获的数据包结构，包头+数据
typedef struct _pkt{
    struct pcap_pkthdr header;
    u_char *pkt_data;
}pkt;

// 数据包链表
typedef struct _pkt_link_node{
    pkt *pkt_node;
    struct _pkt_link_node *next;
}pkt_link_node, *p_pkt_link;

// 数据包链表头信息
typedef struct _pkt_linker_header{
    int pkt_count;
    p_pkt_link link;
    pkt_link_node *back;
}pkt_linker_heeader;

extern pkt_linker_heeader *pkt_link; // 数据包链表

// 初始化一个链表
void init_pkt_link(pkt_linker_heeader *head);

// 将一个捕获的数据包加到链表
void add_pkt(pkt_linker_heeader *head, const struct pcap_pkthdr *pkthdr, const u_char *packet);

// 删除链表
void free_pkt_link(pkt_linker_heeader *head);

// 将数据包导出为pcap文件
void pkt_dump(pkt_linker_heeader *head);


void err_print(const char *e, const char *eb);

#endif