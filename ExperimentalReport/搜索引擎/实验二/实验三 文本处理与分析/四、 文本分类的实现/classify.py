#使用SVM进行分类测试
import jieba,os
from gensim import corpora
from sklearn import svm
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib
from sklearn.metrics import confusion_matrix
from sklearn.metrics import classification_report

#训练svm分类器及词典
def loadmodel(modeldir):            
    svm = joblib.load("svm.model")
    dictionary = corpora.Dictionary.load('classifier.dict')
    return svm,dictionary

#训练svm分类器及词典
def loadmodel_knn(modeldir):            
    knn = joblib.load("knn.model")
    dictionary = corpora.Dictionary.load('classifier_knn.dict')
    return knn,dictionary

'''读取所有文本信息，生成文档列表.
   测试样本位于列表的前面，测试样本个数与label大小一致
   包含训练集，因IDF的计算与训练集有关
'''
def load_data(trainsdir,testdir):
  documents=[]
  label=[]

  #读取每个testdir子目录下的文本文件
  subdirs=os.walk(testdir)
  for d,s,fns in subdirs:
    for fn in fns:
        if fn[-3:]=='txt':
            #print(d+os.sep+fn)
            #根据文件编码指定编码方式:utf-8,gbk,ansi等
            f=open(d+os.sep+fn, "r",encoding="ansi")   
            filecontent=f.read()
            documents.append(filecontent)
            label.append(d[d.rindex("\\")+1:])   #子目录名称作为类别标签
            
  #读取每个trainsdir子目录下的文本文件
  subdirs=os.walk(trainsdir)
  for d,s,fns in subdirs:
    for fn in fns:
        if fn[-3:]=='txt':
            #print(d+os.sep+fn)
            #根据文件编码指定编码方式:utf-8,gbk,ansi等
            f=open(d+os.sep+fn, "r",encoding="ansi")   
            filecontent=f.read()
            documents.append(filecontent)
  return documents,label


#预处理：分词、特征词过滤，生成新的文档列表
def preprocess(documents,dictionary):
    stoplist=open('stopword.txt','r',encoding="utf-8").readlines()
    stoplist = set(w.strip() for w in stoplist)
    dclist=list(dictionary.values())
    
    #分词、去停用词
    texts=[]
    for document in documents:
        doc=[]
        for w in list(jieba.cut(document,cut_all=True)):
            if w in dclist:
                doc.append(w)
        texts.append(doc)
    return texts


#分类
def svm_classify(svm,dataset, dictionary, test_tags):
    data=[]
    testresult=[]
    dlist=list(dictionary.values())
    
    for l in dataset:
       words=""
       for w in l:
         if w in dlist:
            words = words+w+" "
       data.append(words)
            
    #把文档集（由空格隔开的词汇序列组成的文档）转换成为tfidf向量
    v = TfidfVectorizer()
    tdata = v.fit_transform(data)

    correct=0
    #获取测试样本（待分类的眼本），输出分类结果
    for i  in range(len(test_tags)):
        test_X=tdata[i]
        r=svm.predict(test_X) #此处test_X为特征集
        testresult.append(r[0])
        if r[0]==test_tags[i]:
            correct+=1

    #性能评估
    cm=confusion_matrix(test_tags,testresult)
    print(cm)
    target_names = ['class 0', 'class 1', 'class 2']
    print(classification_report(test_tags,testresult, target_names=target_names))
    print("正确率=" + str(correct/len(test_tags)))
    return


#knn分类
def knn_classify(knn,dataset, dictionary, test_tags):
    data=[]
    testresult=[]
    dlist=list(dictionary.values())
    
    for l in dataset:
       words=""
       for w in l:
         if w in dlist:
            words = words+w+" "
       data.append(words)
            
    #把文档集（由空格隔开的词汇序列组成的文档）转换成为tfidf向量
    v = TfidfVectorizer()
    tdata = v.fit_transform(data)

    correct=0
    #获取测试样本（待分类的眼本），输出分类结果
    for i  in range(len(test_tags)):
        test_X=tdata[i]
        # r=svm.predict(test_X) #此处test_X为特征集
        r=knn.predict(test_X) #此处test_X为特征集
        testresult.append(r[0])
        if r[0]==test_tags[i]:
            correct+=1

    #性能评估
    cm=confusion_matrix(test_tags,testresult)
    print(cm)
    target_names = ['class 0', 'class 1', 'class 2']
    print(classification_report(test_tags,testresult, target_names=target_names))
    print("正确率=" + str(correct/len(test_tags)))
    return

if __name__ == '__main__':
    modeldir=input("请输入模型文件的目录：")
    # svm,dictionary=loadmodel(modeldir)
    knn,dictionary=loadmodel_knn(modeldir)

    trainsdir=input("请输入包含训练集的根目录：")
    testdir=input("请输入包含测试集的根目录：")
    documents,label=load_data(trainsdir,testdir);
    
    dataset=preprocess(documents,dictionary)
    # svm_classify(svm,dataset,dictionary,label)
    knn_classify(knn,dataset,dictionary,label)
    print("分类完成！")
