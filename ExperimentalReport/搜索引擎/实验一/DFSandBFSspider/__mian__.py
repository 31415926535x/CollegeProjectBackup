# -*- coding: UTF-8 -*-

import RobotsParse
import DFSspider
import BFSspider

PAGEURL = ""    # 要爬取的页面的网址
PAGENUM = 50    # 要爬取的最多的页面个数，默认是50个
ISCHECKROBOTS = True    # 是否在爬取时检查robots.txt，对于一些网站可能都没有这个文件所以可以选择不检查

if __name__ == '__main__':
    PAGEURL = input("要爬取的网址: ")
    PAGENUM = input("要爬取的页面个数: ")
    if((PAGEURL.find("http://") == -1) and (PAGEURL.find("https://") == -1)):
        PAGEURL = "https://" + PAGEURL
    ch = input("是否在爬取时检查robots.txt.[Y/n]: ")
    if(ch == 'Y'):
        ISCHECKROBOTS = True
        RobotsParse.init(PAGEURL)
    else:
        ISCHECKROBOTS = False

    print("======================= dfs ===========================")
    DFSspider.init(PAGEURL, int(PAGENUM), ISCHECKROBOTS)
    for i in range(len(DFSspider.urls)):
        print(str(i) + ": " + DFSspider.urls[i])
    print("")
    print("")
    print("")

    print("======================= bfs ===========================")
    BFSspider.init(PAGEURL, int(PAGENUM), ISCHECKROBOTS)
    for i in range(len(BFSspider.urls)):
        print(str(i) + ": " + BFSspider.urls[i])
    print("")
    print("")
    print("")