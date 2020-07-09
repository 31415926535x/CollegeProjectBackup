url = 'https://search.jd.com/Search'
#以字典存储查询的关键词及属性
qrydata = {
 'keyword':'互联网大数据',
 'enc':'utf-8',
}
lt = []
for k,v in qrydata.items():
    lt.append(k+'='+str(v))
query_string = '&'.join(lt)

url = url + '?'+query_string
print(url) 