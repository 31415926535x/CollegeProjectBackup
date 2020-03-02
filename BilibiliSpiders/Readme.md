心血来潮搞了一个简单的爬虫，主要是想知道某个人的b站账号，但是你知道，b站在搜索一个用户时，如果这个用户没有投过稿，是搜不到的，，，这时就只能想方法搞到对方的mid，，就是 ``space.bilibili.com/9444976`` 后面的那一串数字。偶然看到这个人关注了某个主播，，想到可能这个人会回复主播的视频，于是想着爬到所有up下的视频的评论对应的用户，这样我就可以在数据库里检索昵称得到mid，，，嘿嘿嘿（然而失败了，，不是所有人都像我这么无聊，，，，有些人真的看视频不会回复，，

[项目地址: https://github.com/31415926535x/CollegeProjectBackup/tree/master/BilibiliSpiders](https://github.com/31415926535x/CollegeProjectBackup/tree/master/BilibiliSpiders)

<!-- more -->

这个爬虫的主要功能是爬取某个指定up主下的所有视频中的评论（不包括评论的回复，当然可以实现，但是感觉都差不多，就没考虑这块），最后将爬到的用户数据存到数据库里。[**整个项目只是抱着学习相关内容的心态来完成，不要做大批量的爬取网站(DDOS)及其敏感数据的事，也不要用作商业用途，，（虽然写的很丑，，，）**](https://www.zhihu.com/question/291554395)

# 简要说明

整个项目的分为三个部分，首先是爬取指定mid up的所有视频的av号，即 ``CrawlAllVideosOfAUP.py`` 这个脚本，使用的api是 ``https://api.bilibili.com/x/space/arc/search?mid=mid&ps=30&tid=0&pn=pn&keyword=&order=pubdate&jsonp=jsonp`` 具体的说明见脚本内注释。

之后有了所有的av号，使用 ``CrawlCommentUsersByVideo.py`` 爬取指定av号下的所有评论，使用的api是 ``https://api.bilibili.com/x/v2/reply?pn=**&type=1&oid=***&sort=2`` 爬取av号为 oid 下第 pn 页的评论的信息（sort对应的应该是评论的展示顺序用不到没管。可以爬取到很多的信息，根据自己需求来修改脚本计科。

最后将这两个整合，加一点点细节就行了，，大致是一个能用的脚本（虽然最后没有找到我想要的一个信息，，，，

具体看注释吧，，很简单的一些东西吧，，长见识为主，留印象。。。。

# 总结

之前很早就接触了Python爬虫，，但是只是用一下就扔了，没有自己完全的编写一个，，所以心血来擦写一个练练手，，说不定以后还会遇到这样类似的事，，，

这个脚本最后将爬取到的数据扔到了数据库里，，因为之前看别人的代码，他是获取一条写入一条，，数据量一大就很慢，，（尤其是用了线程一边获取一遍写入时，因为爬虫一次会获得很多的数据，但是如果保存数据库时一条一条的 ``commit`` 些磁盘的io瓶颈就会显露出来，，所以可以加一个 flag ，写入到1000或者某个值时再 ``commit`` 这样就很有效率了，，跑偏了）

大概了解了一下python下的线程的写法，思路都是那个思路，，算是简单的见识一下，，，

关于windows下的mysql数据库：我们通常会备份一个数据库的某些表的结构到一个文件中，例如 ``233.sql`` ，使用的命令可能是 ``mysqldump -uroot -p databases > 233.sql`` 等等类似的，，但是这个命令在windows的 ``PowerShell`` 会有bug，，具体原因没有深究（猜测是编码的锅），导出的文件不能使用 ``source 233.sql`` 导入，，会爆什么 ``'\0'`` 等 ASCII错误，，这时的解决方法就是换 ``cmd`` ，，这个错误第一次见，，而且不好解决，，迷惑性太大，，容易带偏QAQ，，，太浪费时间了，，，

好像没啥了。。。(end)

哦对，加个参考。。。

[这是一个暴力爬所有用户信息的，思路差不多的](https://github.com/airingursb/bilibili-user/blob/master/bilibili_user.py)

[这个也是，简单些的](https://github.com/zhang0peter/bilibili-user-information-spider/blob/master/spider.py)

[user-agents看到一个很全的ua，因为我的数据量不大，所以就没用，记录一下](https://github.com/airingursb/bilibili-user/blob/master/user_agents.txt)