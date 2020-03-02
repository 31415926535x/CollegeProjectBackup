"""
    数据库的操作，数据量小时可以不是使用数据库，直接扔到文件里也行，，，
"""

import pymysql
import os

class mysql:
    def __init__(self):
        self.conn = pymysql.connect(host='localhost', user='root', passwd='123456', db='minetempsql', charset='utf8')
        self.count = 0
        # powershell 会诈胡，，不用了，，，，
        # cmd ``source 233.sql`` 即可删掉旧表并恢复表结构
        # self.conn.cursor().execute("drop table bilibili if exists bilibili")
        # self.conn.cursor().execute("use minetempsql;")
        # self.conn.commit()
        # self.conn.cursor().execute("source 233.sql")
        # self.conn.commit()
    
    def insert(self, id, mid, name, sex, level):
        try:
            self.conn.cursor().execute('insert into bilibili(id, mid, name, sex, level) values("%s", "%s", "%s", "%s", "%s")' % (id, mid, name, sex, level))
            self.count += 1
            # 多次插入后在提交
            if(self.count == 1000):
                self.conn.commit()
                self.count = 0
        except Exception as e:
            print(e)
    
    def commit(self):
        self.conn.commit()