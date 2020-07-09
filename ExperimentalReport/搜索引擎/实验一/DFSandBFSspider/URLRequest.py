# -*- coding: UTF-8 -*-
# 对于给定的一个链接进行爬取操作，返回爬取到的页面信息

from urllib import request as re
import requests
from requests.exceptions import ReadTimeout, ConnectionError, RequestException

FileDownload = False    # 是否请求非html文件
header = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36'}
def URLRequest(urls):
    """
    urls: 要爬取的页面的链接
    当爬取成功时将返回爬取的页面
    """

    try:
        # 这里不能直接去get链接，有可能时文件下载链接，会下载完后才处理
        # request = requests.get(url=urls, headers=header, timeout=10)
        request = re.urlopen(urls, timeout=10)
        status_code = request.getcode()
    except ReadTimeout:
        # 超时异常
        print('Timeout')
    # 需要把当前的 url 放到任务中，过一段时间再尝试连接
    except ConnectionError:
        # 连接异常
        print('Connection error')
        return None
    except RequestException:
        # 请求异常
        print('Error')
        return None
    except Exception as e:
        print("URLRequest error!!! " + str(e))
    else:
        if(status_code==200):
            print('访问正常！')

            # 根据请求头判断请求的文件类型，对于web文件将返回utf-8编码的内容
            # 对于其他二进制文件，根据设定返回
            if(request.info()["Content-Type"].find("text/html") != -1):
                return request.read().decode('utf-8')
            elif(FileDownload == True):
                return requests.get(url=urls, headers=header, timeout=10).content
            else:
                return None
        if(status_code==404):
            print('页面不存在！')
            return None
        if(status_code==403):
            print('页面禁止访问！')
            return None

# test
if __name__ == '__main__':
    html = URLRequest("https://www.runoob.com/linux/linux-tutorial.html")
    print(html)