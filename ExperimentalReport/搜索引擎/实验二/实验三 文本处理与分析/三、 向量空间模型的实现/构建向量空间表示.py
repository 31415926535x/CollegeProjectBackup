import jieba
from gensim.corpora.dictionary import Dictionary
from sklearn.feature_extraction.text import TfidfVectorizer

docs=["新型互联网大数据技术研究",
      "大数据采集技术与应用方法",
      "一种互联网技术研究方法",
      "计算机系统的分析与设计技术"
      ]

#装载停用词列表
stoplist=open('./stopwords.txt','r',encoding="utf-8").readlines()
stoplist = set(w.strip() for w in stoplist)

#加载自定义词典，添加“大数据”
jieba.load_userdict("./userdict.txt")

#分词、去停用词
texts=[]
for d in docs:
   doc=[]
   for w in list(jieba.cut(d,cut_all=False)):
      if len(w)>1 and w not in stoplist:
         doc.append(w)
   texts.append(doc)

#特征选择，假设依据是：词汇至少出现2次，而且词汇所在的段落数/总的段落数<=1.0
#选择符合这两个条件的前10个词汇作为页面内容的代表
dictionary = Dictionary(texts)
dictionary.filter_extremes(no_below=2, no_above=1.0, keep_n=10)
d=dict(dictionary.items())
docwords=set(d.values())
print("维度词汇是：",docwords)

#将texts中的每个文档按照选择出来的维度词汇重新表示文档集,并转换成为TfidfVectorizer的格式
corpus=[]
for text in texts:
   d=""
   for w in text:
      if w in docwords:
         d=d+w+" "
   corpus.append(d)      

print(corpus)

# 计算每个文档中每个词汇的tf-idf值
vectorizer = TfidfVectorizer()
tfidf = vectorizer.fit_transform(corpus)
 
words = vectorizer.get_feature_names()
for i in range(len(corpus)):
    print('----Document %d----' % (i))
    for j in range(len(words)):
       print( words[j], tfidf[i,j])
