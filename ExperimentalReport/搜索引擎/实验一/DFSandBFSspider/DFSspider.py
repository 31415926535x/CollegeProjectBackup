# -*- coding: UTF-8 -*-
# 深度优先搜索DFS爬虫

import RobotsParse
import URLRequest
import HTMLParse


urls = []    # 最后爬过的链接，这里没有保存每次爬取到的页面信息，可以同步开一个保存页面信息的列表用于其他分析
pagenum = 0 # 要爬取的页面数量
ISCHECKROBOT = True     # 是否检查robots.txt


def init(_URL, _NUM, _ISCHECKROBOT):
    """
    _URL: 深搜的起始点
    _NUM: 要爬取的页面个数
    _ISCHECKROBOT: 是否要检查robots.txt
    """
    global pagenum
    global ISCHECKROBOT
    pagenum = _NUM
    ISCHECKROBOT = _ISCHECKROBOT
    urls = []
    urls.append(_URL)
    dfs(_URL)

def dfs(url):
    global pagenum
    print(str(pagenum) + ": " + url)
    if(pagenum == 0):
        return
    
    if(ISCHECKROBOT == True):
        if(RobotsParse.IsCanFetch(url) == False):
            return
    
    html = URLRequest.URLRequest(url)
    if(html == None):
        return
    temp_urls = HTMLParse.HTMLParse(url, html)
    pagenum = pagenum - 1
    # 保存爬取到的结果
    urls.append(url)

    if(temp_urls == None):
        return

    # 去重
    tmp = []
    for u in temp_urls:
        if(urls.count(u) == 0 and tmp.count(u) == 0):
            tmp.append(u)
    
    # 递归进行dfs
    for u in tmp:
        if(pagenum == 0):
            return
        if(urls.count(u) == 0):
            dfs(u)




# test
if __name__ == '__main__':
    init("https://www.runoob.com/python/python-lists.html", 20, False)
    for i in urls:
        print(i)