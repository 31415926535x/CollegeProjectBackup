/** protocol.h
structs of ethernet, ip, tcp, udp
*/

#define PCAP_HEADER_LEN 24
#define PACKET_HEADER_LEN 16

/* ============= Ethernet ============ */
#define ETHER_LEN           14
#define ETHER_ADDR_LEN      6
#define ETHER_TYPE_LEN      2

#define ETHER_DEST_OFFSET   (0 * ETHER_ADDR_LEN)
#define ETHER_SRC_OFFSET    (1 * ETHER_ADDR_LEN)
#define ETHER_TYPE_OFFSET   (2 * ETHER_ADDR_LEN)

typedef struct _ether_header{
    u_char host_dest[ETHER_ADDR_LEN];
    u_char host_src[ETHER_ADDR_LEN];
    u_short type;
#define ETHER_TYPE_MIN      0x0600
#define ETHER_TYPE_IP       0x0800
#define ETHER_TYPE_ARP      0x0806
#define ETHER_TYPE_8021Q    0x8100
#define ETHER_TYPE_BRCM     0x886c
#define ETHER_TYPE_802_1X   0x888e
#define ETHER_TYPE_802_1X_PREAUTH 0x88c7
}ether_header;



/*============== IP ================*/

typedef struct ip_address{
    u_char byte1;
    u_char byte2;
    u_char byte3;
    u_char byte4;
}ip_address;


#define IP_LEN_MIN 20

/* IPv4 header */
typedef struct _ip_header{
    u_char  ver_ihl;        // Version (4 bits) + Internet header length (4 bits)
    u_char  tos;            // Type of service
    u_short tlen;           // Total length
    u_short ident;          // Identification
    u_short flags_fo;       // Flags (3 bits) + Fragment offset (13 bits)
    u_char  ttl;            // Time to live
    u_char  proto;          // Protocol
    #define IP_ICMP     1
    #define IP_IGMP     2
    #define IP_TCP      6
    #define IP_UDP      17
    #define IP_IGRP     88
    #define IP_OSPF     89
    u_short crc;            // Header checksum
    u_int   saddr;          // Source address
    u_int   daddr;          // Destination address
}ip_header;


/*=============== TCP ================*/
#define TCP_LEN_MIN 20
typedef struct _tcp_header
{
    u_short th_sport;          // source port
    u_short th_dport;          // destination port
    u_int   th_seq;            // sequence number field
    u_int   th_ack;            // acknowledgement number field
    u_char  th_len:4;		   // header length
    u_char  th_x2:4;		   // unused
    u_char  th_flags;
    #define TH_FIN	0x01
    #define TH_SYN	0x02
    #define TH_RST	0x04
    #define TH_PSH	0x08
    #define TH_ACK	0x10
    #define TH_URG	0x20
    u_short th_win;		    /* window */
    u_short th_sum;		    /* checksum */
    u_short th_urp;		    /* urgent pointer */
}tcp_header;  //*/

/*================ UDP ==================*/
#define UDP_LEN 8
typedef struct _udp_header{
    u_short uh_sport;          // Source port
    u_short uh_dport;          // Destination port
    u_short uh_len;            // Datagram length
    u_short uh_sum;            // Checksum
}udp_header;






