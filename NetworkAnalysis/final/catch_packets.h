#ifndef CATCH_PACKETS
#define CATCH_PACKETS

#include"global.h"
#include"analysis_struct.h"


int set_pcap_filter(pcap_t *dev, char *packet_filter, bpf_u_int32 mask);
// int catch_packet();
void *catch_packet(void *);

#endif