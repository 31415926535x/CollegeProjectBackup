# -*- coding: UTF-8 -*-
# 广度优先搜索BFS

import RobotsParse
import URLRequest
import HTMLParse

urls = []   # 最后爬取到的链接，作为一个队列使用
pagenum = 0 # 要爬取到的页面数量
ISCHECKROBOT = True # 是否检查robots.txt

def init(_URL, _NUM, _ISCHECKROBOT):
    """
    _URL: 深搜的起始点
    _NUM: 要爬取的页面个数
    _ISCHECKROBOT: 是否要检查robots.txt
    """
    global pagenum
    global ISCHECKROBOT
    global urls
    pagenum = _NUM
    ISCHECKROBOT = _ISCHECKROBOT
    urls = []
    urls.append(_URL)
    bfs()

def bfs():
    global urls
    urls_i = 0  # 队列头指针
    while(urls_i < len(urls) and urls_i < pagenum):
        url = urls[urls_i]
        print(str(urls_i) + ": " + url)
        urls_i += 1
        
        if(ISCHECKROBOT == True):
            if(RobotsParse.IsCanFetch(url) == False):
                continue
        
        html = URLRequest.URLRequest(url)
        if(html == None):
            continue
        temp_urls = HTMLParse.HTMLParse(url, html)
        if(temp_urls == None):
            continue
        
        if(len(urls) > pagenum):
            continue
        # 去重
        tmp = []
        for u in temp_urls:
            if(urls.count(u) == 0 and tmp.count(u) == 0):
                tmp.append(u)
                
        # 入队
        urls.extend(tmp)
    urls = urls[0: pagenum]


# test
if __name__ == '__main__':
    init("https://www.runoob.com/python/python-lists.html", 20, False)
    for i in urls:
        print(i)