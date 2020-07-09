#ifndef ANALYSIS_STRUCT_H
#define ANALYSIS_STRUCT_H

#include"global.h"

// timeval 结构
typedef struct _shh_timeval{
    int tv_sec;     
    int tv_usec;
}ssh_timeval;

// pcap_next() 调用后的数据包的头部信息
typedef struct _shh_pkthdr{
    ssh_timeval ts;
    bpf_u_int32 caplen; // 包的实际捕捉到的长度
    bpf_u_int32 len;    // 包应该有长度
}shh_pkthdr;

// 网络信息五元组
typedef struct _net5net{
    u_int       sip;
    u_short     sport;
    u_int       dip;
    u_short     dport;
    u_char      protocol;
}net5set;

// 链表节点
typedef struct _net_link_node{
    net5set nln_5set;       // 五元组
    int     nln_upl_size;   // 上行数据包大小
    int     nln_downl_size; // 下行数据包大小
    int     nln_upl_pkt;    // 上行个数
    int     nln_downl_pkt;  // 下行个数
    u_char  nln_status;     // 该链接的状态
    #define CLOSED      0x00
    #define SYN_SENT    0x01    // client sent SYN
    #define SYN_RECVD   0x02    // recieve SYN, and send SYN ACK
    #define ESTABLISHED 0x03    // client get SYN & ACK, server get ACK

    #define FIN_WAIT_1  0x04    // client send FIN
    #define CLOSE_WAIT  0x05    // server recv FIN, and send ACK
    #define FIN_WAIT_2  0x06    // client recv ACK
    #define LAST_ACK    0x07    // server send FIN
    #define TIME_WAIT   0x08    // client recv FIN
    // CLOSED: client send ACK, server recv ACK
    #define UNDEFINED   0xff
    struct  _net_link_node *next;
}net_link_node, *p_net_link;

// 链表头结构
typedef struct _net_link_header{
    int count_conn;
    int count_upl_pkt;
    int count_downl_pkt;
    int count_upl;
    int count_downl;
    p_net_link link;
}net_link_header;



// 需要三个链表，一个哈希链表，保存处于连接状态的包
// 另两个链表分别保存tcp和udp的流量
extern net_link_header *FLowLink_TCP;
extern net_link_header *FLowLink_UDP;

/* ========== hash table ============= */
#define HASH_TABLE_SIZE 0xffff
extern p_net_link HashTable[HASH_TABLE_SIZE];

void init_flowLink(net_link_header *head);

void add_to_flowLink(net_link_header *head, const net_link_node *theNode);

void clear_flowLink(net_link_header *head);

void parse_flowLink_TCP(FILE *fOutput);

void parse_flowLink_UDP(FILE *fOutput);

u_short get_hash(const net5set *theSet);

void add_to_hashTable(u_short hash, const net_link_node *theNode, u_char flags);

void clear_hashTable();

void *analysis_pkt(void *argv);

#endif