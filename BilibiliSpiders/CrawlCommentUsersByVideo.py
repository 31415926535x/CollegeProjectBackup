

# 利用接口 ``https://api.bilibili.com/x/v2/reply?pn=**&type=1&oid=***&sort=2`` 爬取av号为 oid 下第 pn 页的评论的信息（sort对应的应该是评论的展示顺序用不到没管
# 看接口返回的数据中，有一个 ``data`` 字段，其中每一页有至多20个用户的评论（不算评论中回复），size表示；count表示该视频下所有的评论数
# 所以每爬取一个数据就增加评论数，直到和size相等停止（不知道访问期间评论增加会怎样）


import requests
import json as JSON
# import sys
# import io

def CrawlCommentUsersByVideo(av, IsComment):
    '''
    av: 要爬取的视频的av号，整形
    IsComment: 是否需要具体的评论信息（如评论内容，点赞数等等信息）
    return users, comments: 返回每条评论的处理信息（用户信息，评论信息等）
    '''

    pn = 1
    commentsCount = 2
    flag = True
    av = str(av)
    id = 0     # 爬取到的用户数量
    users = []      # 获取到的用户
    comments = []   # 对应的评论
    # sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    print("av: " + av + " crawling...")
    while(commentsCount > 1):
        # 貌似这个接口有时返回的评论数会多一个，所以这里判断剩余量小于等于一个停止
        url = "https://api.bilibili.com/x/v2/reply?pn=" + str(pn) + "&type=1&oid=" + av + "&sort=2"
        pn += 1
        response = requests.get(url)
        json = JSON.loads(response.text)['data']

        if(flag):
            # 爬取第一页的评论，得到总评论数
            commentsCount = json['page']['count']
            print("commentsCount: " + str(commentsCount))
            flag = False
        

        replies = json['replies']
        # 有时爬到的评论数和评论总数不一致，导致最后多爬一页，replies为空
        if(replies is None):
            break
        repliesCount = len(replies)
        print(str(pn) + " " + str(repliesCount) + " " + str(commentsCount))
        commentsCount -= repliesCount

        for i in range(0, repliesCount):
            # print(replies[i])
            id += 1
            member = replies[i]['member']
            mid = member['mid']         # b站用户的id
            name = member['uname']      # 用户昵称
            sex = member['sex']         # 用户性别
            sign = member['sign']       # 用户签名
            level = member['level_info']['current_level'] # 用户当前等级
            user = (id, mid, name, sex, sign, level)
            users.append(user)
            # print("id: " + str(id) + "  " + str(user))


            if(IsComment):
                comment = replies[i]['content']['message']    # 具体评论
                like = replies[i]['like']          # 该评论的点赞数
                replyCount = replies[i]['count']   # 该评论下的回复数，该接口仅返回部分的回复，使用 ``https://api.bilibili.com/x/v2/reply?jsonp=jsonp&pn=1&type=1&oid={}&sort=2&_=1558948726737'.format(av_id)`` 可获取具体回复（未测试）
                Comment = (comment, like, replyCount)
                comments.append(Comment)
                # print("id: " + str(id) + "  " + str(Comment))
            # print("-------------------------------------")


    
    print("av: " + av + " crawled!")
    return users, comments
