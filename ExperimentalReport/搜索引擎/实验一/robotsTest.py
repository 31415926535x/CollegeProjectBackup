import urllib.robotparser
import requests
# 读取 robots.txt 文件
rp = urllib.robotparser.RobotFileParser()
rp.set_url("https://taobao.com/robots.txt")
rp.read()
# 模拟 Googlebot
useragent='Baiduspider'
url='https://item.taobao.com/item.htm?spm=a310p.7395781.1998038982.1&id=16041384170'
if rp.can_fetch(useragent, url):
    print("允许抓取")
    file=requests.get(url)
    data=file.content # 读取全部
    fb=open("bd-html","wb") # 将爬取的网页保存在本地
    fb.write(data)
    fb.close()
else:
    print("不允许抓取")