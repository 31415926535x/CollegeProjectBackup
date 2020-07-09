#include"get_devs.h"

int get_devs(char *devs){
    pcap_if_t *alldevs, *d;
    char errbuf[PCAP_ERRBUF_SIZE];

    if(!~pcap_findalldevs_ex(PCAP_SRC_IF_STRING, NULL, &alldevs, errbuf)){
        err_print("Error in pcap_findalldevs_ex(): ", errbuf);
        return -1;
    }

    int i = 0;
    for(d = alldevs; d != NULL; d = d->next){
        printf("%d. %s", ++i, d->name);
        if(d->description)printf(" (%s)\n", d->description);
        else printf(" (No description abailable\n");
    }
    if(!i){
        printf("\n No interface found!, Make sure winpcap is installed. \n");
        return -1;
    }
    printf("Enter the interface number(1-%d): ", i);
    int inum = i;
    scanf("%d", &inum);
    if(inum < 1 || inum > i){
        printf("\n Interface number out of range.\n");
        pcap_freealldevs(alldevs);
        return -1;
    }

    for(d = alldevs, i = 0; i < inum - 1; d = d->next, ++i);
    memcpy(devs, d->name, strlen(d->name) + 1);
    dev = (pcap_if_t*)malloc(sizeof(pcap_if_t));
    memcpy(dev, d, sizeof(pcap_if_t));
    if((dev_fp = pcap_open(d->name,  // 设备名
                             65536,     // 要捕捉的数据包的部分 
                                        // 65535保证能捕获到不同数据链路层上的每个数据包的全部内容
                             PCAP_OPENFLAG_PROMISCUOUS,         // 混杂模式
                             1000,      // 读取超时时间
                             NULL,      // 远程机器验证
                             errbuf     // 错误缓冲池
                             ) ) == NULL)
    {
        err_print("Unable to open the adapter. It is not supported by WinPcap\n", errbuf);
        /* 释放设备列表 */
        pcap_freealldevs(alldevs);
        return -1;
    }
    pcap_freealldevs(alldevs);
    return 0;
}
