#include"catch_packets.h"



// 设置过滤规则
int set_pcap_filter(pcap_t *dev, char *packet_filter, bpf_u_int32 mask){
    struct bpf_program  fcode;
    if(!~pcap_compile(dev, &fcode, packet_filter, 1, mask)){
        err_print("Unable to compile the packet filter. Check the syntax.", "");
        return -1;
    }
    if(!~pcap_setfilter(dev, &fcode)){
        err_print("Error setting the filter.", "");
        return -1;
    }
    return 0;
}

typedef struct _argument{
    pcap_t *dev;
    int timeLen;
}args;

// 设定一个计时线程，当到达捕获时间时停止捕获
void *thread_clock(void *argv){
    isCatchDone = false;
    // win下的sleep是以毫秒计时的
    Sleep((((args*)argv)->timeLen) * 1000);
    pcap_breakloop(((args*)argv)->dev);
    isCatchDone = true;
    return NULL;
}

// 回调函数，当捕获到一个数据包时调用该函数
// 在本项目中的作用是将捕获到的数据包存储到内存中（即一个数据包链表）
void packet_handle(u_char *param, const struct pcap_pkthdr *pkthdr, const u_char *packet){
    // printf("\ncatch a pkt...\n");
    add_pkt(pkt_link, pkthdr, packet);
    // printf("insert in pkt_link...\n\n");
    // Sleep(1000);
}

void *catch_packet(void *){
    printf("%s\n", dev->name);
    
    // 检查数据链路层，仅考虑以太网
    if(pcap_datalink(dev_fp) != DLT_EN10MB){
        err_print("\nThis program works only on Ethernet networks.\n", "");
        pcap_freealldevs(dev);
        // return -1;
        return NULL;
    }

    bpf_u_int32 mask;
    if(dev->addresses != NULL){
        // 获得接口的第一个地址掩码
        mask = ((struct sockaddr_in *)(dev->addresses->netmask))->sin_addr.S_un.S_addr;
    }
    else{
        // 没侑地址假设为C类地址
        mask = 0xffffff;
    }

    char packet_filter[BUFSIZ];
    printf("\nInput pcap filter string: ");
    scanf("%s", packet_filter);
    set_pcap_filter(dev_fp, packet_filter, mask);

    args a;
    a.dev = dev_fp;
    printf("\nInput catch packets time: ");
    scanf("%d", &a.timeLen);
    printf("Pcap filter string is: \"%s\", catch time is \"%d\". Start catching...\n", packet_filter, a.timeLen);

    pkt_link = (pkt_linker_heeader*)malloc(sizeof(pkt_linker_heeader));
    init_pkt_link(pkt_link);

    pthread_t ptClock;
    if(pthread_create(&ptClock, NULL, thread_clock, &a)){
        err_print("pthread_create(): Error!!!\n", "");
        // return -1;
        return NULL;
    }
    // if(pthread_create(&ptClock, NULL, analysis_pkt, NULL)){
    //     err_print("pthread_create(): catch_packet: Error!!!\n", "");
    //     return -1;
    // }
    pcap_loop(dev_fp, 0, packet_handle, (u_char*)"");
    printf("catch done!!!\n");
    
    pkt_dump(pkt_link);

    // free_pkt_link(pkt_link);
    // pcap_freealldevs(dev);
    // return 0;
    return NULL;
}