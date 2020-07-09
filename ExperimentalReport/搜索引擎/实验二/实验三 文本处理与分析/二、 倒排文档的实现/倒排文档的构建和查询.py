import jieba

def mapper(lineNum, list):
    dic = {}
    for item in list:
        key = ''.join([str(lineNum), ':', item])
        if key in dic:
            ll = dic.get(key)
            ll.append(1)
            dic[key] = ll
        else:
            dic[key] = [1]

    return dic

def reducer(dic):
    keys = dic.keys()
    rdic = {}
    for key in keys:
        lineNum, kk = key.split(":")
        ss = ''.join([lineNum, ':', str(dic.get(key))])
        if kk in rdic:
            ll = rdic[kk]
            ll.append(ss)
            rdic[kk] = ll
        else:
            rdic[kk] = [ss]

    return rdic

def combiner(dic):
    keys = dic.keys()
    tdic = {}
    for key in keys:
        valuelist = dic.get(key)
        count = 0
        for i in valuelist:
            count += i
        tdic[key] = count
    return tdic

stopwords = []
def remove_stopwords(word_list):
    if(len(stopwords) == 0):
        with open("./stopwords.txt", "r", encoding="utf-8") as word_input:
            for word in word_input:
                stopwords.append(word.split("\n")[0].strip())
    new_word_list = []
    for word in word_list:
        if(word in stopwords):
            continue
        new_word_list.append(word)
    return new_word_list
    
def get_reverse_index(filepath):
    file = open(filepath, 'r', encoding="utf8")
    lineNum = 0
    rdic_p = {}
    while True:
        lineNum += 1
        line = file.readline()
        if line != '':
            print(lineNum, ' ', line)
        else:
            break
        # 先分词
        word_list = list(jieba.cut(line))
        word_list = remove_stopwords(word_list)
        mdic = mapper(lineNum, word_list)
        cdic = combiner(mdic)
        print(cdic)
        rdic_p.update(cdic)

    rdic = reducer(rdic_p)
    print(rdic)
    return rdic


if __name__ == '__main__':
    # data 文档
    dic = get_reverse_index('./data.txt')
    while(1):
        search_word = input('Please input the word you want to search: ')
        if (search_word in dic):
            print(dic.get(search_word))
        else:
            print(-1)

