"""
    获取一个up主其所有的视频线下所有评论的用户的信息（不包括回复用户）
    使用另外两个爬虫，先获取其所有视频的av号，然后对每一个视频进行获取用户信息等等
"""

import CrawlAllVideosOfAUP
import CrawlCommentUsersByVideo
import SaveDataToMysql

import sys
import io
import threading
import time

def CrawlAllCommentsUserOfAUPsVideos(mid):
    """
        mid: 指定up的id
        return: null 数据将扔到数据库中，根据自己需求改变
    """

    # sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    # id = 0
    # mysql = SaveDataToMysql.mysql()
    videos = CrawlAllVideosOfAUP.CrawlAllVideosOfAUP(mid=mid)
    # i = 0
    # for video in videos:
    #     users, comment = CrawlCommentUsersByVideo.CrawlCommentUsersByVideo(av=video[1], IsComment=False)
    #     print("now crawl " + str(i) + "th video, and crawled " + str(id) + " users...")
    #     i += 1
    #     for user in users:
    #         # print(id, user[2])
    #         # mysql.insert(id, user.mid, user.name, user.sex, user.level)
    #         mysql.insert(id, user[1], user[2], user[3], user[5])
    #         id += 1

    # allUsers = []
    # for video in videos:
    #     users, comment = CrawlCommentUsersByVideo.CrawlCommentUsersByVideo(av=video[1], IsComment=False)
    #     allUsers.append(users)
    #     i += 1
    #     print("get " + str(i) + " th videos....")
    
    # print("all users are " + len(allUsers))
    # for user in allUsers:
    #     print("now crawled " + str(id) + " users...")
    #     mysql.insert(id, user[1], user[2], user[3], user[5])
    #     id += 1

    try:
        print("thread starting!......")
        threading.Thread(target=getUsers, kwargs={"videos":videos}).start()
        threading.Thread(target=saveUser).start()
        print("thread done!......")
    except Exception as e:
        print(e)


isGotUsers = False
def getUsers(videos):
    i = 0
    print(videos)
    for video in videos:
        users, comment = CrawlCommentUsersByVideo.CrawlCommentUsersByVideo(av=video[1], IsComment=False)
        allUsers.extend(users)
        i += 1
        print("get " + str(i) + " th videos....")
        # print("allUsers: " + str(len(allUsers)))
        # time.sleep(3)
    isGotUsers = True

def saveUser():
    id = 0
    while(id == len(allUsers)):
        print(str(id) + " save sleeping.....")
        time.sleep(2)
    while(id < len(allUsers)):
        print("\nnow crawled " + str(id) + "/" + str(len(allUsers)) + " users...\n")
        mysql.insert(id, allUsers[id][1], allUsers[id][2], allUsers[id][3], allUsers[id][5])
        # print("mid: " + str(allUsers[id][1]) + "name: " + str(allUsers[id][2]))
        id += 1
        while(id == len(allUsers)):
            time.sleep(3)
        if(isGotUsers):
            break

mysql = SaveDataToMysql.mysql()
allUsers = []

mid = input()
CrawlAllCommentsUserOfAUPsVideos(mid)
mysql.commit()
print("DONE!!!!!!~~~")