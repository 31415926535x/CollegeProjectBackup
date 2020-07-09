#include"analysis_struct.h"

// 需要三个链表，一个哈希链表，保存处于连接状态的包
// 另两个链表分别保存tcp和udp的流量
net_link_header *FLowLink_TCP;
net_link_header *FLowLink_UDP;

p_net_link HashTable[HASH_TABLE_SIZE];

// 将整形的ip转为字符型
#define IPTOSBUFFERS    12
static char *iptos(bpf_u_int32 in){
    static char output[IPTOSBUFFERS][3*4+3+1];
    static short which;
    u_char *p;

    p = (u_char *)&in;
    which = (which + 1 == IPTOSBUFFERS ? 0 : which + 1);
    sprintf(output[which], "%d.%d.%d.%d", p[0], p[1], p[2], p[3]);
    return output[which];
}


// 时间转换
char *long2time(long ltime){
    time_t t;
    struct tm *p;
    static char s[100];

    t = ltime;
    p = gmtime(&t);

    strftime(s, sizeof(s), "%Y-%m-%d %H:%M:%S", p);
    return s;
}



void init_flowLink(net_link_header *head){
    head->count_conn        = 0;
    head->count_upl_pkt     = 0;
    head->count_downl_pkt   = 0;
    head->count_upl         = 0;
    head->count_downl       = 0;
    head->link              = NULL;
}

void add_to_flowLink(net_link_header *head, const net_link_node *theNode){
    net_link_node *newNode = (net_link_node *)malloc(sizeof(net_link_node));
    memcpy(newNode, theNode, sizeof(net_link_node));

    head->count_conn ++;
    head->count_upl_pkt     += newNode->nln_upl_pkt;
    head->count_downl_pkt   += newNode->nln_downl_pkt;
    head->count_upl         += newNode->nln_upl_size;
    head->count_downl       += newNode->nln_downl_size;

    newNode->next = head->link;
    head->link = newNode;
}


void clear_flowLink(net_link_header *head){
    if( head->link == NULL ){ return;}

    net_link_node *pTemp1 = NULL;
    net_link_node *pTemp2 = NULL;

    pTemp1 = head->link;
    pTemp2 = pTemp1->next;
    while( pTemp2 != NULL )
    {
        free(pTemp1);
        pTemp1 = pTemp2;
        pTemp2 = pTemp1->next;
    }
    free(pTemp1);

    head->link = NULL;
}

void parse_flowLink_TCP(FILE *fOutput){
    fprintf(fOutput, "TCP连接个数：\t%d\n", FLowLink_TCP->count_conn);
    fprintf(fOutput, "TCP数据包个数：\t%d\n", FLowLink_TCP->count_upl_pkt + FLowLink_TCP->count_upl_pkt);
    fprintf(fOutput, "TCP数据总流量：\t%d bytes\n", FLowLink_TCP->count_upl + FLowLink_TCP->count_downl);
    fprintf(fOutput, "TCP数据上传量：\t%d bytes\n", FLowLink_TCP->count_upl);
    fprintf(fOutput, "TCP数据下载量：\t%d bytes\n", FLowLink_TCP->count_downl);
    fprintf(fOutput, "-----------------------\n");

    net_link_node *pTemp = NULL;
    pTemp = FLowLink_TCP->link;
    while( pTemp != NULL )
    {
        fprintf(fOutput, "%s\t%u\t", iptos(pTemp->nln_5set.sip), pTemp->nln_5set.sport);
        fprintf(fOutput, "==>\t%s\t%u\t", iptos(pTemp->nln_5set.dip), pTemp->nln_5set.dport);
        fprintf(fOutput, "上传包数量：%d\t", pTemp->nln_upl_pkt);
        fprintf(fOutput, "下载包数量：%d\t", pTemp->nln_downl_pkt);
        fprintf(fOutput, "upload：%d bytes\t", pTemp->nln_upl_size);
        fprintf(fOutput, "download：%d bytes\t", pTemp->nln_downl_size);
        fprintf(fOutput, "\n");
        pTemp = pTemp->next;
    }

    clear_flowLink(FLowLink_TCP);

}

void parse_flowLink_UDP(FILE *fOutput){
    fprintf(fOutput, "UDP数据包个数：\t%d\n", FLowLink_UDP->count_upl_pkt + FLowLink_UDP->count_upl_pkt);
    fprintf(fOutput, "UDP数据流量：\t%d bytes\n", FLowLink_UDP->count_upl + FLowLink_UDP->count_downl);
    clear_flowLink(FLowLink_UDP);
}


u_short get_ushort_net(u_short virtu){
    return (u_short)(virtu >> 8 | virtu << 8);
}


u_short get_hash(const net5set *theSet){
    u_int srcIP = theSet->sip;
    u_int desIP = theSet->dip;
    u_int port  = (u_int)(theSet->sport * theSet->dport);
    u_int res   = (srcIP^desIP)^port;
    u_short hash= (u_short)((res & 0x00ff)^(res >> 16));
    return hash;
}


void add_to_hashTable(u_short hash, const net_link_node *theNode, u_char flags){
    net_link_node *HashNode = (net_link_node *)malloc(sizeof(net_link_node));
    memcpy(HashNode, theNode, sizeof(net_link_node));

    if(HashTable[hash] == NULL)    {
        HashTable[hash] = HashNode;
        return;
    }
    net_link_node *pTemp = HashTable[hash];
    net_link_node *pBack = NULL;
    int isSame_up = 0;
    int isSame_down = 0;
    while(pTemp != NULL)    {
        isSame_up = (pTemp->nln_5set.sip == HashNode->nln_5set.sip)
                && (pTemp->nln_5set.dip == HashNode->nln_5set.dip)
                && (pTemp->nln_5set.sport == HashNode->nln_5set.sport)
                && (pTemp->nln_5set.dport == HashNode->nln_5set.dport);

        isSame_down = (pTemp->nln_5set.dip == HashNode->nln_5set.sip)
                && (pTemp->nln_5set.sip == HashNode->nln_5set.dip)
                && (pTemp->nln_5set.dport == HashNode->nln_5set.sport)
                && (pTemp->nln_5set.sport == HashNode->nln_5set.dport);
        if( isSame_up )        {
            pTemp->nln_upl_size += HashNode->nln_upl_size;
            pTemp->nln_upl_pkt ++;
            if(pTemp->nln_status == ESTABLISHED && (flags & TH_FIN) ){
                // 建立连接并完成数据的发送
                pTemp->nln_status = FIN_WAIT_1;
            }
            else if (pTemp->nln_status == TIME_WAIT && (flags & TH_ACK)){
                pTemp->nln_status = CLOSED;
                if(pBack == NULL)
                {
                    HashTable[hash] = NULL;
                }
                else
                {
                    pBack->next = pTemp->next;
                }
                add_to_flowLink(FLowLink_TCP, pTemp);
                free(pTemp);
            }
            else if(pTemp->nln_status == CLOSE_WAIT && (flags & TH_FIN)){
                pTemp->nln_status = LAST_ACK;
            }
            free(HashNode);
            break;
        }
        else if( isSame_down )        {
            pTemp->nln_downl_size += HashNode->nln_upl_size;
            pTemp->nln_downl_pkt ++;
            if(pTemp->nln_status == ESTABLISHED && (flags & TH_FIN)){
                pTemp->nln_status = CLOSE_WAIT;
            }
            else if(pTemp->nln_status == LAST_ACK && (flags & TH_ACK)){
                pTemp->nln_status = CLOSED;
                if(pBack == NULL){
                    HashTable[hash] = NULL;
                }
                else{
                    pBack->next = pTemp->next;
                }
                add_to_flowLink(FLowLink_TCP, pTemp);
                free(pTemp);
            }
            else if(pTemp->nln_status == FIN_WAIT_1 && (flags & TH_ACK)){
                pTemp->nln_status = FIN_WAIT_2;
            }
            else if(pTemp->nln_status == FIN_WAIT_2 && (flags & TH_FIN)){
                pTemp->nln_status = TIME_WAIT;
            }

            free(HashNode);
            break;
        }
        pBack = pTemp;
        pTemp = pTemp->next;
    }
    if(pTemp == NULL){
        pBack->next = HashNode;
    }
}

void clear_hashTable(){
    int i = 0;
    net_link_node *pTemp1 = NULL;
    net_link_node *pTemp2 = NULL;
    for(i = 0; i < HASH_TABLE_SIZE; i++)
    {
        if(HashTable[i] == NULL){ continue;}

        pTemp1 = HashTable[i];
        while(pTemp1 != NULL)
        {
            pTemp2 = pTemp1->next;
            add_to_flowLink(FLowLink_TCP, pTemp1);
            free(pTemp1);
            pTemp1 = pTemp2;
        }
        HashTable[i] = NULL;
    }
}

const char *TCP_FLAG[] = {"FIN", "SYN", "RST", "PSH", "ACK", "URG"};
void *analysis_pkt(void *argv){
    isAnalysisDone = false;
    Sleep(2000);
    printf("analysis.......\n");
    const char *file_output = "result.data";
    FILE *fOutput = fopen(file_output, "w");
    fclose(fOutput);        // clear file
    fOutput = fopen(file_output, "a+");

    const char *filename = "traffic.data";
    fprintf(fOutput, "数据文件：%s\n", filename);

    shh_pkthdr      *pkthdr     = (shh_pkthdr *)malloc(sizeof(shh_pkthdr));
    ether_header    *segEther   = (ether_header*)malloc(sizeof(ether_header));
    ip_header       *segIP      = (ip_header*)malloc(sizeof(ip_header));
    tcp_header      *segTCP     = (tcp_header*)malloc(sizeof(tcp_header));
    udp_header      *segUDP     = (udp_header*)malloc(sizeof(udp_header));
    net5set         *Cur5Set    = (net5set *)malloc(sizeof(net5set));
    net_link_node   *LinkNode   = (net_link_node *)malloc(sizeof(net_link_node));

    FLowLink_TCP = (net_link_header *)malloc(sizeof(net_link_header));
    init_flowLink(FLowLink_TCP);
    FLowLink_UDP = (net_link_header *)malloc(sizeof(net_link_header));
    init_flowLink(FLowLink_UDP);

    long    fileLen     = 0;
    int     pktLen      = 0;    // pktLen = Ether + IP
    int     trailerLen  = 0;
    u_short ipLen_real  = 0;
    u_short ipLen_total = 0;
    u_short tcpLen_real = 0;
    u_short dataLen     = 0;

    int i = 0;
    int pkt_num = 0;
    pkt_link_node *ptmp = pkt_link->link;
    
    int tstamp_start    = ptmp->pkt_node->header.ts.tv_sec;
    int tstamp_offset   = tstamp_start;
    int tstamp_now      = tstamp_start;
    int cycle           = 5;
    cycle = (cycle > 0) ? cycle : 10;
    fprintf(fOutput, "分析周期：%d s\n", cycle);
    
    // 对数据包链表进行处理
    while(ptmp != NULL){
        pktLen = ptmp->pkt_node->header.caplen;
        tstamp_now = ptmp->pkt_node->header.ts.tv_sec;
        if(tstamp_now - tstamp_offset >= cycle){
            fprintf(fOutput, "\n\n>>>>> 时间段：%s", long2time(tstamp_offset));
            fprintf(fOutput, " --> %s\n", long2time(tstamp_offset + cycle));

            fprintf(fOutput, "----------------------\n");
            clear_hashTable();
            parse_flowLink_UDP(fOutput);
            init_flowLink(FLowLink_UDP);

            fprintf(fOutput, "----------------------\n");
            parse_flowLink_TCP(fOutput);
            init_flowLink(FLowLink_TCP);
            tstamp_offset = tstamp_now;
        }
        // 获取以太网的报头
        memcpy(segEther, ptmp->pkt_node->pkt_data, ETHER_LEN);
        if(get_ushort_net(segEther->type) != ETHER_TYPE_IP){
            // 不是数据链路层的数据包跳过
            ptmp = ptmp->next;
            continue;
        }

        // 获取IP数据包的报头
        // 先获取最小的情况，也即是20个字节
        memcpy(segIP, ptmp->pkt_node->pkt_data + ETHER_LEN, IP_LEN_MIN);
        ipLen_real = (segIP->ver_ihl & 0x0f) * 4;   // IP数据报的报头长度单位是4字节，所以取值后乘四
        ipLen_total = get_ushort_net(segIP->tlen);  // IP数据报的总长度
        trailerLen = pktLen - ETHER_LEN - ipLen_total; // 因为链路层的数据帧可能会尾部补齐，所以一个数据包的后面有一些无用数据，不属于IP数据报

        // printf("analysis starting...\n");
        // if(segIP->proto != IP_TCP && segIP->proto != IP_UDP){
        //     // 非TCP、UDP数据报，舍弃
        //     continue;
        // }

        // 设置五元组
        Cur5Set->sip = segIP->saddr;
        Cur5Set->dip = segIP->daddr;
        Cur5Set->protocol = segIP->proto;

        if(segIP->proto == IP_TCP){
            memcpy(segTCP, ptmp->pkt_node->pkt_data + ETHER_LEN + ipLen_real, TCP_LEN_MIN);
            tcpLen_real = (((segTCP->th_len) >> 4) & 0x0f) * 4;
            dataLen = ipLen_total - ipLen_real - tcpLen_real;

            Cur5Set->sport = get_ushort_net(segTCP->th_sport);
            Cur5Set->dport = get_ushort_net(segTCP->th_dport);

            // parse high lavel proto in here
        }
        else if(segIP->proto == IP_UDP){
            memcpy(segUDP, ptmp->pkt_node->pkt_data + ETHER_LEN + ipLen_real, UDP_LEN);
            dataLen = ipLen_total - ipLen_real - UDP_LEN;

            Cur5Set->sport = get_ushort_net(segUDP->uh_sport);
            Cur5Set->dport = get_ushort_net(segUDP->uh_dport);


        }

        printf("\n---------------------- %d -----------------------\n", ++pkt_num);
        printf("%s -- len: %d\n", long2time(tstamp_now), ptmp->pkt_node->header.len);
        printf("%s:%d -> %s:%d\n", iptos(Cur5Set->sip), Cur5Set->sport, iptos(Cur5Set->dip), Cur5Set->dport);
        printf("protocol: ");
        int proto = segIP->proto;
        if(proto == IP_ICMP)puts("ICMP");
        else if(proto == IP_IGMP)puts("IGMP");
        else if(proto == IP_TCP)puts("TCP");
        else if(proto == IP_UDP)puts("UDP");
        else if(proto == IP_IGRP)puts("IGRP");
        else if(proto == IP_OSPF)puts("OSPF");
        else{}

        if(proto == IP_TCP){
            u_char flag = segTCP->th_flags;
            printf("[");
            for(int j = 0; j < 8; ++j){
                if((flag >> j) & 1){
                    printf("%s ", TCP_FLAG[j]);
                }
            }
            printf("], ");
            printf("Seq = %d, Win = %d, Len = %d\n", segTCP->th_seq, segTCP->th_win, segTCP->th_len);

            // 根据端口来判断上层协议DNS、web等等
            // DNS运行于53端口
            // web一般运行于80、8080、443等等端口
            if(Cur5Set->sport == (u_short)53 || Cur5Set->dport == (u_short)53){
                printf("protocol: DNS\n");
            }
            else if(Cur5Set->sport == (u_short)80 || Cur5Set->dport == (u_short)80 || 
                    Cur5Set->sport == (u_short)443 || Cur5Set->dport == (u_short)443 || 
                    Cur5Set->sport == (u_short)8080 || Cur5Set->dport == (u_short)8080){
                        printf("protocol: HTTP\n");
                    }
            else if(Cur5Set->sport == (u_short)23 || Cur5Set->dport == (u_short)23){
                printf("protocol: Telnet\n");
            }
            else if(Cur5Set->sport == (u_short)21 || Cur5Set->dport == (u_short)21 || 
                    Cur5Set->sport == (u_short)20 || Cur5Set->dport == (u_short)20){
                        printf("protocol: FTP\n");
                    }
            else if(Cur5Set->sport == (u_short)25 || Cur5Set->dport == (u_short)25){
                printf("protocol: SMTP\n");
            }
        }
        else if(proto == IP_UDP){
            if(Cur5Set->sport == (u_short)53 || Cur5Set->dport == (u_short)53){
                printf("protocol: DNS\n");
            }
            else if(Cur5Set->sport == (u_short)161 || Cur5Set->dport == (u_short)161){
                printf("protocol: SNMP\n");
            }
        }
        puts("---------------------------------------------\n");

        LinkNode->nln_5set = *Cur5Set;
        LinkNode->nln_upl_size = dataLen;
        LinkNode->nln_downl_size = 0;
        LinkNode->nln_upl_pkt = 1;
        LinkNode->nln_downl_pkt = 0;
        LinkNode->nln_status = ESTABLISHED;
        LinkNode->next = NULL;

        if(segIP->proto == IP_TCP){
            add_to_hashTable(get_hash(Cur5Set), LinkNode, segTCP->th_flags);
        }
        else{
            add_to_flowLink(FLowLink_UDP, LinkNode);
        }
        
        // Sleep(2000);
        while(ptmp->next == NULL && !isCatchDone){
            Sleep(cycle * 10);
        }
        ptmp = ptmp->next;
    }

    fprintf(fOutput, "\n\n>>>>> 时间段：%s", long2time(tstamp_offset));
    fprintf(fOutput, " --> %s\n", long2time(tstamp_offset + cycle));

    fprintf(fOutput, "#----------------------#\n");
    parse_flowLink_UDP(fOutput);

    fprintf(fOutput, "#----------------------#\n");
    parse_flowLink_TCP(fOutput);

    printf("over\n");
    fprintf(fOutput, "\nover...\n");
    free(pkthdr);
    free(segEther);
    free(segIP);
    free(segTCP);
    free(segUDP);
    free(Cur5Set);
    free(LinkNode);
    free(FLowLink_TCP);
    free(FLowLink_UDP);
    fclose(fOutput);

    
    printf("Done!\n");
    isAnalysisDone = true;
    return NULL;
}