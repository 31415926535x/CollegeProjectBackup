import os

# 读取所有的字典中的词汇，并排序
dicts = []
with open("./dict_example.txt", "r", encoding="utf-8") as dicts_input:
    for word in dicts_input:
        dicts.append(word.split("\n")[0].strip())
dicts.sort(key=lambda i: len(i), reverse=True)
print(dicts)

# 输入句子
sentence = input("input sentence: ")
print(sentence)
word_cut_ans = []       # 分析结果
dicts_word_max_len = len(dicts[0])
sentence_len = len(sentence)
i = 0;
while(sentence_len > 0):
    # s = sentence[0:]
    s = sentence[0:dicts_word_max_len]
    s_len = len(s)
    while(s_len > 0):
        print("s[" + str(i) + "]: " + s)
        i += 1
        if(s in dicts):
            word_cut_ans.append(s)
            break
        elif(s_len == 1):
            word_cut_ans.append(s)
            break
        else:
            s_len -= 1
            s = s[0: s_len]
    sentence = sentence[s_len:]
    sentence_len -= s_len
print(word_cut_ans)

    