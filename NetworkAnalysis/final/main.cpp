#include"get_devs.h"
#include"catch_packets.h"

int main(){
    char devs[PCAP_BUF_SIZE];
    get_devs(devs);
    pthread_t ptClock;
    isCatchDone = true;
    if(pthread_create(&ptClock, NULL, catch_packet, NULL)){
        err_print("pthread_create(): catch_packet: Error!!!\n", "");
        return -1;
    }
    while(isCatchDone);
    if(pthread_create(&ptClock, NULL, analysis_pkt, NULL)){
        err_print("pthread_create(): catch_packet: Error!!!\n", "");
        return -1;  
    }
    while(!isAnalysisDone){
        Sleep(1000);
    }
    pcap_freealldevs(dev);
    free_pkt_link(pkt_link);
    // catch_packet(NULL);
    // analysis_pkt(NULL);
    return 0;
}