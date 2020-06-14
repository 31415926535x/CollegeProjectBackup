import math
import urllib.robotparser
import requests
from bs4 import BeautifulSoup
import jieba
from gensim.corpora.dictionary import Dictionary
import os
import re

#保存文件


def savefile(file_dir, content, seq):
   file_path = file_dir + os.sep + str(seq)+'.html'
   f = open(file_path, "wb")
   f.write(content.encode("utf-8"))  # 编码成字节
   f.close()


#设置http头部属性
useragent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0'
http_headers = {
    'User-Agent': useragent,
    'Accept': 'text/html'
}

#使用关键词集合方式来定义
topicwords = {"网络", "安全", "法案", "预警", "设施", "互联网"}

website = 'http://roll.news.sina.com.cn/'
url = 'http://roll.news.sina.com.cn/news/gnxw/gdxw1/index.shtml'
file_dir = 'd:\\'  # 保存文件的地址

rp = urllib.robotparser.RobotFileParser()
rp.set_url(website+"robots.txt")
rp.read()

#确保Robots中许可访问
if rp.can_fetch(useragent, url):
        page = requests.get(url, headers=http_headers)
        page.encoding = 'gb2312'
        content = page.text

        #装载停用词列表
        stoplist = open('./stopword.txt', 'r', encoding="utf-8").readlines()
        stoplist = set(w.strip() for w in stoplist)

        #提取形如 href="http://news.sina.com.cn/o/2018-11-06/doc-ihmutuea7351575.shtml" 的字符串
        ulist = re.findall('href="http://[a-z0-9/.\-]+\.shtml', content)
        i = 1
        for u in ulist:
            u = u[6:]
            print(u)
            page = requests.get(u, headers=http_headers)
            page.encoding = 'utf-8'
            content = page.text

            bs = BeautifulSoup(content, 'lxml')
            ps = bs.select('div#article > p')
            ptext = ''
            # print(ps)
            doc = []
            for p in ps:
                p = p.text.strip("\n")
                if p != "":
                    d = []

                    #词汇切分、过滤
                    for w in list(jieba.cut(p, cut_all=True)):
                        # print(w)
                        if len(w) > 1 and w not in stoplist:
                            d.append(w)
                    doc.append(d)
            #print(doc)

            #特征选择，假设依据是：词汇至少出现2次，而且词汇出现在总文档中的比例<=1.0
            #选择符合这两个条件的前10个词汇作为页面内容的代表
            dictionary = Dictionary(doc)
            dictionary.filter_extremes(no_below=2, no_above=1.0, keep_n=10)
            d = dict(dictionary.items())
            docwords = set(d.values())

            #相关度计算: topicwords和docwords集合的相似度
            commwords = topicwords.intersection(docwords)
            sim = len(commwords)/(len(topicwords)+len(docwords)-len(commwords))

            try:
                # 余弦相似度计算
                commwords = topicwords.intersection(docwords)
                cossim = len(commwords) / (math.sqrt(float(len(topicwords)))
                                            * math.sqrt(float(len(docwords))))
            except Exception as e:
                print(e)


            #如果相似度满足设定的要求，则认为主题相关，可以保存到文件。
            if sim > 0.2:
                print(docwords)
                print("sim=", sim)
                savefile(file_dir, content, i)

            i = i+1
else:
   print('不允许抓取！')
