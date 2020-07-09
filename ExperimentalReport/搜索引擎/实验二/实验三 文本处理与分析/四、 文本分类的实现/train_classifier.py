#训练分类器
import jieba,os
from gensim import corpora
from sklearn import svm
from sklearn import neighbors
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib

#读取所有文本信息，生成文档列表
def load_data(trainsdir):
  documents=[]
  label=[]
  #读取每个子目录下的文本文件
  subdirs=os.walk(trainsdir)
  for d,s,fns in subdirs:
    for fn in fns:
        if fn[-3:]=='txt':
            #print(d+os.sep+fn)
            #根据文件编码指定编码方式:utf-8,gbk,ansi等
            f=open(d+os.sep+fn, "r",encoding="ansi")   
            filecontent=f.read()
            documents.append(filecontent)
            label.append(d[d.rindex("\\")+1:])   #子目录名称作为类别标签
  return documents,label

#预处理：分词、停用词过滤、词频过滤、特征选择
def preprocess(documents):
    stoplist=open('stopword.txt','r',encoding="utf-8").readlines()
    stoplist = set(w.strip() for w in stoplist)
    
    #分词、去停用词
    texts=[]
    for document in documents:
        doc=[]
        for w in list(jieba.cut(document,cut_all=True)):
            if len(w)>1 and w not in stoplist:
                doc.append(w)
        texts.append(doc)

    #生成词典
    dictionary=corpora.Dictionary(texts)
    dictionary.filter_extremes(no_below=3, no_above=1.0,keep_n=1000)
    return texts,dictionary


#训练svm分类器：构造TFIDF矩阵、SVM参数拟合
def train_svm(train_data, dictionary,train_tags):
    traindata=[]
    dlist=list(dictionary.values())
    
    for l in train_data:
       words=""
       for w in l:
         if w in dlist:
            words = words+w+" "
       traindata.append(words)
            
    v = TfidfVectorizer()
    tdata = v.fit_transform(traindata)

    svc = svm.SVC(kernel='rbf',gamma='auto')  
    svc.fit(tdata,train_tags)
    return svc


#训练knn分类器：构造TFIDF矩阵、knn参数拟合
def train_knn(train_data, dictionary, train_tags):
    traindata=[]
    dlist=list(dictionary.values())
    
    for l in train_data:
       words=""
       for w in l:
         if w in dlist:
            words = words+w+" "
       traindata.append(words)
            
    v = TfidfVectorizer()
    tdata = v.fit_transform(traindata)

    knn = neighbors.KNeighborsClassifier(n_neighbors=3, metric='euclidean')
    knn.fit(tdata, train_tags)
    return knn


if __name__ == '__main__':
    newsdir=input("请输入训练集的的根目录：")
    docs,label=load_data(newsdir)
    corpus, dictionary=preprocess(docs)
    
    # svm=train_svm(corpus,dictionary,label)
    knn = train_knn(corpus, dictionary, label)

    dictionary.save("classifier_knn.dict")
    # joblib.dump(svm, "svm.model")
    joblib.dump(knn, "knn.model")
    print("训练完成！")
