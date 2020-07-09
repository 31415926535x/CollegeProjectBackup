import requests
import re

#从浏览器的开发者模式复制 Cookie，保存到文本文件 taobao.txt
f=open(r'taobao.txt','r') #打开所保存的 cookies 内容文件
cookies={} #初始化 cookies 字典变量
for line in f.read().split(';'): #按照字符进行划分读取
    name,value=line.strip().split('=',1)
    cookies[name]=value #为字典 cookies 添加内容

r=requests.get("https://www.taobao.com/",cookies=cookies)
#print(r.text)
rs=re.findall(u'<title>.*</title>',r.text) #<title>淘宝网 -淘！我喜欢</title>
print(rs) 