import requests
import json

url = 'https://hotels.ctrip.com/hotel/beijing1'
#以下 payload 数据来自浏览器看到的结果
payload = {"PlatformType":"pc","pageParameter":{"Refer":"","UA":"Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20WOW64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F55.0.2883.87%20Safari%2F537.36","PageID":102002,"VID":"1590400761906.17yfiq"},"marketParameter":{"AID":0,"SID":0},"terminalParameter":{"UserID":"","CityID":0},"pcAuthCodeParamet":{"IsGetAuthCode":"true","AppID":"","Length":4}}
payloadHeader = {'content-type':'application/json'}

# 以 POST 方法发送 URL 请求，同时指定所携带的参数给函数参数 data
res = requests.post(url, data=json.dumps(payload),
headers=payloadHeader)
res.encoding = 'utf-8'
print(res.text) 