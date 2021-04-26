# 简介


[这个油猴脚本](https://greasyfork.org/zh-CN/scripts/395847-%E6%96%B0%E7%89%88%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%AF%BC%E5%87%BA%E8%AF%BE%E7%A8%8B%E8%A1%A8)的一些主要功能：

+ **课表的导出**：将指定学期导出指定开学日期开始的.ics日历文件，方便导入到一些主流的日历应用，如谷歌日历等
+ **考试信息导出**： 将指定学期的考试信息导出为一个.ics日历文件，
+ **学生评价**：指定一个评价的最高分，然后可以一键给出每一个评价，解放双手，同时随机一个条目为任意分数


# 食用方法

**重要！！一些不能使用的原因就是没有根据自己学校教务系统设置好。。。** 

+ 安装油猴扩展，然后安装脚本
+ 根据自己学校的教务系统链接，修改 ``@include`` （默认是一个大多数学校都使用的链接形式，无需修改）
+ 观察教务功能相关的页面的链接，可能要修改 ``ClassScheduleToICSURL`` ``ExamScheduleToICSURL`` 和 ``StudentEvalutionURL`` 等公共变量，变量形式是链接的主域名后两个路径，到 ``.html`` 即可，主要功能是脚本能够分别出在相应的页面使用相应得功能。


## 课表导出

+ 在使用前进入到要导出课程表的页面，![](https://raw.githubusercontent.com/31415926535x/CollegeProjectBackup/master/ZhengfangClassScheduleToICS/img/1.PNG)

然后确定这学期开学的第一周的周一的日期，![](https://raw.githubusercontent.com/31415926535x/CollegeProjectBackup/master/ZhengfangClassScheduleToICS/img/2.PNG)

点击 ``生成课表`` 然后就会提示导出成功，~~这时点击旁边的 ``下载ics文件`` ~~ ，点击按钮后即可下载 ``course.ics`` 文件，![](https://raw.githubusercontent.com/31415926535x/CollegeProjectBackup/master/ZhengfangClassScheduleToICS/img/3.PNG)

之后怎么使用就看你了，，这样可以不再使用各种 **课程表 等看个课程表还要等半天，看半天广告，而且还占空间。。~~（深受其害.jpg）~~

## 考试信息导出

同课表导出类似，进入考试信息页面，因为默认是最近学期的考试信息，所以脚本会自动查询，此时点击 ``导出ICS`` 即能获得 ``.ics`` 文件。

## 学生评教

+ 进入学生评教系统
+ 有的学校的教务系统会有一个5秒的等待页面，并且后续所有页面都是动态刷新的，所以为了保证脚本能够正确的初始化，建议将 ``setTimeout_`` 根据自己的网络及设备情况进行一定的调整
+ 在页面的上方有一个最高分选择栏，点击 **一键评价** 即可为当前页面教师进行全部评价，并会随机一项取次高分，保证所有的评价不全相同
+ 点击下方的保存、提交即可


# 其他

+ 对于某些学校仍在使用旧版的 正方教务系统 建议可以参考 [某个学长曾经写的脚本](https://github.com/31415926535x/CollegeProjectBackup/blob/master/ZhengfangClassScheduleToICS/ZhengFangClassScheduleToICS_OLD.js) ，该脚本在我的学校仍使用旧版教务系统时不能正常使用，等想要进行一定的研究修改时学校已经更换教务系统，所以这个旧的脚本还有一定的bug，（该脚本的版权属于原作者）。
+ 关于考试信息导出，请务必在导出后检查一下和教务系统的信息是否一致，因为无法确保每一个学校的教务系统是否会根据自己学校做出修改。。。
+ 关于学生评价，这部分只是心血来潮用了一两个小时完成的，在使用完后，没有测试条件进行测试，所以可能还会有一定的bug，请见谅
+ 对于想要自定义上课时间的：（我的建议是默认吧）可以查看油猴评价页面 ``soneston 2020/7/18`` 的反馈中 ``759401524§发于：2020/9/3`` 的一种解决方法，（修改后记得本地保存一份，因为可能后续的更新会覆盖原有修改的代码）
+ **本脚本可能随着时间的变化而不断出现各种bug，而我此后因无法登录教务系统可能不会在修复出现的bug，希望大家有能力的可以交流起来，维护这类脚本，谢谢大家**
+ 对于插件出现的bug等使用上的问题，可以在油猴反馈页面反馈或者[github提issue](https://github.com/31415926535x/CollegeProjectBackup/tree/master/ZhengfangClassScheduleToICS)，对于js并不熟练也没有一定的深入学习，感谢使用。


# TODO

~~有时间将考试信息也加上。。。~~

# 参考

https://gist.github.com/yulanggong/be953ffee1d42df53a1a

# 更新日志

+ 2.0 完成课程表导出功能
+ 3.0 增加学生评价辅助功能，简单优化运行流程
+ 4.0 增加考试信息的导出功能，重写了一部分原代码（将有关日历的操作封装为类，从原来的课表导出分离出来），简化下载流程（直接点击按钮即可下载，去除a标签的显示后才点击的效果）
+ 4.1 修复bug: 添加多种获取到课程名的方式以解决更新后的教务系统对某些“重点课程”使用 ``u`` 标签来表示的情况
+ 4.2 修复bug：对于某些学校，课程名的写法可能不同，增加了多种获取方式，提高脚本健壮性；完善一些提示信息；自动获取日期；

有任何使用问题或者发现代码上的bug欢迎提issues，或者在油猴脚本处反馈也阔以。。

[github: https://github.com/31415926535x/CollegeProjectBackup/tree/master/ZhengfangClassScheduleToICS](https://github.com/31415926535x/CollegeProjectBackup/tree/master/ZhengfangClassScheduleToICS)