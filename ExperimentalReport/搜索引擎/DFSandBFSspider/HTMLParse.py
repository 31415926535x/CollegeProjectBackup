# -*- coding: UTF-8 -*-
# 将给定的一个HTNL页面解析出所有的超链接

import re
from urllib.parse import urljoin

def HTMLParse(url, html):
    """
    url: 页面的链接，方便相对路径的解析
    html: 爬取的页面
    返
    回解析到的所有超链接列表，此处仅解析 a 标签中的超链接，包括相对链接
    """
    urls = re.findall('<[a|A] href="[a-zA-Z0-9/\.\-:_]+"', html)
    # print(urls)
    Len = len(urls)
    if(Len == 0):
        return None
    for i in range(Len):
        # print(urls[i])
        urls[i] = urls[i][urls[i].find("href=\"") + 6: -1]
        # print(urls[i])
        if(urls[i].find("javascript:void(0)") != -1):
            continue
        if(urls[i].find("http") == -1):
            # print(url + "-----" + urls[i])
            urls[i] = urljoin(url, urls[i])

        if(urls[i][len(urls[i]) - 1] == '/'):
            urls[i] = urls[i][0: -1]
        
        # if(urls[i].find("http://") != -1):
        #     urls[i] = "https://" + urls[i][7::]
        # print(urls[i])
        # print("")
    return urls

if __name__ == '__main__':
    import URLRequest
    # html = URLRequest.URLRequest("https://baidu.com")
    # print(html)
    # print("-----")
    # HTMLParse("https://baidu.com", html)

    # s='''<li><a href="http://news.sina.com.cn/o/2018-11-06/a75.shtml"target="_blank">进博会</a></li><li><a href="http://news.sina.com.cn/o/2018-11-06/a76.shtml"target="_blank">大数据</a></li><li><a href="/o/2018-11-06/a75.shtml" target="_blank">进博会</a></li>'''
    # HTMLParse("https://news.sina.com.cn/", s)
    html = URLRequest.URLRequest("https://www.runoob.com/w3cnote/ten-sorting-algorithm.html/")
    # print(html)
    print("")
    # HTMLParse("https://www.runoob.com/w3cnote/ten-sorting-algorithm.html/", html)
    for u in HTMLParse("https://www.runoob.com/w3cnote/ten-sorting-algorithm.html/", html):
        print(u)
