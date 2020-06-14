import re
s = '''<li><a href="http://news.sina.com.cn/o/2018-11-06/a75.shtml"
target="_blank">进博会</a></li>
<li><a href="http://news.sina.com.cn/o/2018-11-06/a76.shtml"
target="_blank">大数据</a></li>
<li><a href="/o/2018-11-06/a75.shtml" target="_blank">进博会</a></li>'''
urls = re.findall('<a href="[a-zA-Z0-9/\.\-:]+"', s)
print(urls)
for url in urls:
    print(url[9:len(url)-1])
