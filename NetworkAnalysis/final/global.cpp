#include "global.h"


pcap_if_t *dev; // 要捕获的网卡设备
pcap_t *dev_fp;  // 网卡描述符
pkt_linker_heeader *pkt_link;   // 数据包链表
bool isCatchDone;   // 是否捕获完毕
bool isAnalysisDone; // 是否分析完毕

void err_print(const char *e, const char *eb){
    fprintf(stderr, "%s:%s\n", e, eb);
}

// 初始化一个链表
void init_pkt_link(pkt_linker_heeader *head){
    head->back = NULL;
    head->pkt_count = 0;
    head->link = NULL;
    return;
}

// 将一个捕获的数据包加到链表
void add_pkt(pkt_linker_heeader *head, const struct pcap_pkthdr *pkthdr, const u_char *packet){
    pkt_link_node *newnode = (pkt_link_node*)malloc(sizeof(pkt_link_node));
    pkt *newpkt = (pkt*)malloc(sizeof(pkt));
    memcpy(&(newpkt->header), pkthdr, sizeof(pcap_pkthdr));
    newpkt->pkt_data = (u_char*)malloc(pkthdr->caplen); // 不能保证抓取到的就是完整的包，所以用实际捕获长度而非包的真实长度
    memcpy(newpkt->pkt_data, packet, pkthdr->caplen);

    newnode->pkt_node = newpkt;
    newnode->next = NULL;
    if(head->back == NULL){
        head->link = newnode;
        head->back = newnode;
    }
    else{
        head->back->next = newnode;
        head->back = newnode;
    }
    ++(head->pkt_count);
    printf("A pkt add success!!\n");
    return;
}

// 删除链表
void free_pkt_link(pkt_linker_heeader *head){
    if(head->link == NULL)return;

    pkt_link_node *p1, *p2;
    p1 = head->link;
    p2 = p1->next;
    while(p2 != NULL){
        free(p1);
        p1 = p2;
        p2 = p2->next;
    }
    free(p1);
    head->link = NULL;
    return;
}

// 将数据包导出为pcap文件
void pkt_dump(pkt_linker_heeader *head){
    pcap_dumper_t *fp = pcap_dump_open(dev_fp, "traffic.data");
    if(fp == NULL){
        err_print("Error opening output pcap file.\n", "");
        return;
    }

    pkt_link_node *ptmp = head->link;
    int i = 0;
    while(ptmp != NULL){
        // printf("len: %d\n", ptmp->pkt_node->header.len);
        pcap_dump((u_char*)fp, &(ptmp->pkt_node->header), ptmp->pkt_node->pkt_data);
        ptmp = ptmp->next;
    }

    pcap_dump_close(fp);
    printf("\nPcap File dump done!!!\n");
    return;
}