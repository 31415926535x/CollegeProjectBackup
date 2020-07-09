# -*- coding: UTF-8 -*-

import urllib
import urllib.robotparser
import requests

rp = urllib.robotparser.RobotFileParser()
# useragent = 'Baiduspider'
useragent='Googlebot'

def init(url):
    proto, rest = urllib.request.splittype(url)
    res, rest = urllib.request.splithost(rest)
    url = "https://" + res + "/robots.txt"
    print(url)
    rp.set_url(url)
    rp.read()

def IsCanFetch(url):
    return rp.can_fetch(useragent, url)


if __name__ == '__main__':
    init("https://www.runoob.com/robots.txt")
    if(IsCanFetch("https://www.runoob.com/python/python-lists.html")):
        print("ohhhhhhh")
    else:
        print("emmmm")