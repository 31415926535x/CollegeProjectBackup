"""

    利用接口 ``https://api.bilibili.com/x/space/arc/search?mid=mid&ps=30&tid=0&pn=pn&keyword=&order=pubdate&jsonp=jsonp``
    来获取一个up（id为mid）的所有视频的av号
    其中用pn参数来获取每一页的视频信息，每一页的视频的个数最多为ps个，这里的ps的默认取值是30，我发现它貌似最大能取100，所以为了效率就去100来爬
    如爬取评论一样，利用总的视频数和当前爬到的视频数来控制爬虫的结束与否，一个up所投稿的总视频数在 ``json['data']['page']['count']``
    视频的详细信息在 ``json['data']['list']['vlist']``
    av号即aid，还有时长、描述、播放量、评论量以及视频封面链接等信息（提取视频的封面的方法应该就是直接访问的这个api，这样可以用js写一个请求就可以搞定）
    我这里只需要av号，根据使用情况来添加参数即可

"""

import requests
import json as JSON 

def CrawlAllVideosOfAUP(mid, ps = 100):
    """
        mid: 一个up的id，理论上发过视频的up都可以通过另一个api找到它的mid，这里假定手动获取到了mid
        ps: 一次爬取的视频的最大个数，不超过100
        return videos: 返回所有的投稿视频的信息（根据自己所需添加信息，我这里只有一串av号）
    """

    print("Getting all videos...")
    videosCount = 1
    videosID = 0
    flag = True
    mid = str(mid)
    videos = []
    pn = 1
    if(ps > 100):
        ps = 100
    ps = str(ps)
    while(videosID < videosCount):
        url = "https://api.bilibili.com/x/space/arc/search?mid=" + mid + "&ps=" + ps + "&tid=0&pn=" + str(pn) + "&keyword=&order=pubdate&jsonp=jsonp"
        response = requests.get(url)
        data = JSON.loads(response.text)['data']

        if(flag):
            videosCount = data['page']['count']
            flag = False
        
        pn += 1

        vlist = data['list']['vlist']
        vlistCount = len(vlist)
        for i in range(0, vlistCount):
            # video = vlist[i]
            # aid = video['aid']
            # pic = video['pic']
            # des = video['description']
            # title = video['title']
            # length = video['length']
            aid = vlist[i]['aid']
            videosID += 1
            # print(str(videosID) + " av" + str(aid))
            # v = (videosID, aid, pic, des, title, length)
            v = (videosID, aid)
            videos.append(v)
    
    print("Got all " + mid + " 's videos")
    return videos
