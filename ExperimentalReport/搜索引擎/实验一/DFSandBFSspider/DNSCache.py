# -*- coding: UTF-8 -*-
# 实现对域名和ip的维护，即DNS缓存
# 实现思路：用一个字典来维护即可

import dns.resolver

class DNSCache:
    'DNS缓存类'
    __domain_ip_table = {}

    def __init__(self):
        self.__domain_ip_table = {}

    def dns_parse(self, domain):
        try:
            ret = dns.resolver.query(domain, "A")
            return ret.response.answer[0].items[0].address
        except Exception as e:
            print("dns parse errror!!!" + str(e))
            # self.dns_parse(domain)
            return None

    def dns_push(self, domain):
        try:
            # if(self.__domain_ip_table.has_key(domain) == True):
            if((domain in self.__domain_ip_table) == False):
                ip = self.dns_parse(domain)
                if(ip != None):
                    self.__domain_ip_table[domain] = ip
                    print(str(domain) + " has push in dns cache...")
                else:
                    print(str(domain) + " has not push in dns cache...")
                return
        except Exception as e:
            print("dns push error!!! " + str(e))
            print(23333)
    
    def dns_get(self, domain):
        try:
            # if(self.__domain_ip_table.has_key(domain) == True):
            if(domain in self.__domain_ip_table):
                return self.__domain_ip_table[domain]
        except Exception as identifier:
            print("no this " + str(domain) + " cache..")
            self.dns_push(domain)
            self.dns_get(domain)

