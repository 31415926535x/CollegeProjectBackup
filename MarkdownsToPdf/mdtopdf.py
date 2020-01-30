# coding=utf-8
import os
import sys
import json

# tex的头文件，lstset就是板子的样式
# \documentclass[twocolumn, a4]{article}
TexHead = r"""
\documentclass[twocolumn, a4]{article}
\usepackage[landscape]{geometry}
\usepackage[colorlinks,linkcolor=black]{hyperref}
\usepackage{xeCJK}
\usepackage{fancyhdr}
\usepackage{amsmath, amsthm}
\usepackage{listings,xcolor}
\usepackage{geometry}
\usepackage{fontspec} 
\usepackage{graphicx}
\setsansfont{Consolas}
\setmonofont[Mapping={}]{Consolas}
\newcommand{\HRule}{\rule{\linewidth}{0.5mm}}
\geometry{left=2cm,right=1cm,top=1.5cm,bottom=1.5cm}
"""
"""
\lstset{
    language    = c++,
    numbers     = left,
    numberstyle = \tiny,
    breaklines  = true,
    captionpos  = b,
    tabsize     = 4,
    frame       = shadowbox,
    columns     = fullflexible,
    commentstyle = \color[RGB]{0,128,0},
    keywordstyle = \color[RGB]{0,0,255},
    basicstyle   = \normalsize\ttfamily,
    stringstyle  = \color[RGB]{148,0,209}\ttfamily,
    rulesepcolor = \color{red!20!green!20!blue!20},
    showstringspaces = true,
}
"""
 
# 初始化设置，主要是板子的名字等等
def InitSetting():
    try:
        SettingFile = open('setting.dat')
        SettingData = json.load(SettingFile)
        print (u'读取到保存的设置: ')
        for key in SettingData:
            print ('[%s] %s' % (key, SettingData[key]))
        op = input('是否使用已保存的设置？[Y/n]')
        if not op in ['n', 'N', 'no', 'No', 'NO']:
            global TITLE, SCHOOL, TEAM, FILE
            for key in ['TITLE', 'SCHOOL', 'TEAM', 'FILE']:
                globals()[key] = SettingData[key]
        else:
            NewSetting()
    except:
        print (u'读取设置失败')
        NewSetting()
 
 
# 输入信息，保存到本地
def NewSetting():
    global TITLE, SCHOOL, TEAM, FILE
    TITLE = input('请输入标题: ')
    SCHOOL = input('请输入学校: ')
    TEAM = input('请输入队名: ')
    FILE = input('请输入文件名: ')
    Data = dict()
    for key in ['TITLE', 'SCHOOL', 'TEAM', 'FILE']:
        Data[key] = globals()[key]
    json.dump(Data, open('setting.dat', 'w'))
 
# 删除当前目录下的所有中间临时文件
def Clear():
    for suffix in ['aux', 'log', 'toc', 'out']:
        filename = '%s.%s' % (FILE, suffix)
        if os.path.exists(filename):
            os.remove(filename)
 
# 调用两次生成模板来使 .tex 转为 .pdf
def Generate():
    Clear()
    os.system('xelatex %s.tex -quiet' % FILE)
    os.system('xelatex %s.tex -quiet' % FILE)			# 两到三次的生成才能生成目录https://zhidao.baidu.com/question/1541025230634017307.html
    Clear()
    os.system('open %s.pdf' % FILE)
 
# 对每个板子文件进行读取写入
def ReadCpp(file):
    f = open(file, 'r', encoding='UTF-8')
    # print (file + ' 2333333333333333333333333333')
    Tex = 0
    TargetFile.write('\\begin{lstlisting}\n')
    for line in f:
        if line[:-1] == '// ---':
            Tex = not Tex
            ToWrite = '\\%s{lstlisting}\n' % ('begin', 'end')[Tex]
            TargetFile.write(ToWrite)
            continue
        TargetFile.write(line[(0, 3)[Tex]:])
    TargetFile.write('\\end{lstlisting}\n')
    f.close()
 
# 读入tex文件
def ReadTex(file):
    f = open(file, 'r')
    for line in f:
        TargetFile.write(line)
    f.close()
 
# 递归遍历当前文件夹下的所有文件
def Search(level, pwd, folder=''):
    ls = os.popen('dir /b "%s"' % pwd).read().split('\n')[:-1]
    # for item in ls:
    #     print (item)
    if folder:
        # print (level)
        TargetFile.write(SECTION[level] % folder[0:])
    for item in ls:
        # print (item + '2333' + item[:-3])
        item.replace(' ', '\\ ')
        print(item)
        if '.cpp' in item:
            if not item[:2] == '00':
                TargetFile.write(SECTION[level + 1] % item[:-4])
            ReadCpp(pwd + item)
        elif '.tex' in item:
            continue
            if not item[:2] == '00':
                TargetFile.write(SECTION[level + 1] % item[:-4])
            ReadTex(pwd + item)
        elif 'jpg' in item:
            continue
        elif 'md' in item:
            print("233333333333333333333333")
            os.system('pandoc %s -o %s.tex', item, item)
            continue
        elif 'dat' in item:
            continue
        elif 'py' in item:
            continue
        elif 'txt' in item:
            continue
        elif 'pdf' in item:
            continue
        elif 'PNG' in item:
            continue
        else:
            cd = os.popen('cd "%s%s/"' % (pwd, item)).read()
            if 'Not a directory' in cd or 'No such file or directory' in cd:
                print ('[Unknown File] %s/%s' % (pwd, item))
            else:
                Search(level + 1, pwd + item + '/', item)
def test(file):
    if('.md' in file):
        os.system('pandoc %s -o %s.tex' % (file, file))
    file += '.tex'
    f = open(file, 'r', encoding='UTF-8')
    for line in f:
        TargetFile.write(line)
    # ReadCpp(file)
 
if __name__ == '__main__':
    # 全局设置
    TITLE, SCHOOL, TEAM, FILE = '', '', '', ''
    SECTION = ['', '\\clearpage\\section{%s}\n',
               '\\subsection{%s}\n', '\\subsubsection{%s}\n', '\\paragraph{%s}\n', '\\subparagraph{%s}\n']
 
    InitSetting()
    Clear()

    TargetFile = open('%s.tex' % FILE, 'w', encoding='utf-8')
 
    # Output Head File
    TargetFile.write(TexHead)
    TargetFile.write('\\title{%s}\n' % TITLE)
    TargetFile.write('\\author{%s}\n' % TEAM)
    TargetFile.write('\\pagestyle{fancy}\n\\fancyhf{}\n\\fancyhead[C]{%s}\n' % (TITLE))
    TargetFile.write('\\begin{document}\\small\n')
    TargetFile.write('\\begin{titlepage}\n\\begin{center}\n\\vspace*{0.5cm}\\includegraphics[width=0.75\\textwidth]{logo.jpg} \\\\ [2cm]\n')
    TargetFile.write('\\HRule \\\\ [1cm]\n')
    TargetFile.write('\\textbf{\\Huge{%s}} \\\\ [0.5cm]\n' % TITLE)
    TargetFile.write('\\HRule \\\\ [4cm]\n')
    TargetFile.write('\\textbf{\\Huge{%s}} \\\\ [1cm]\n\\LARGE{%s}\n' % (SCHOOL, TEAM))
    TargetFile.write('\\vfill\n\\Large{\\today}\n\\end{center}\n')
    TargetFile.write('\\clearpage\n\end{titlepage}\n')
    TargetFile.write('\\tableofcontents\\clearpage\n')
    TargetFile.write('\\pagestyle{fancy}\n\\lfoot{}\n\\cfoot{\\thepage}\\rfoot{}\n')
    TargetFile.write('\\setcounter{section}{-1}\n\\setcounter{page}{1}\n')
 
    # Search Files
    # Search(0, './')
    test('./test.md')
 
    # End Output
    TargetFile.write('\n\\end{document}\n')
    TargetFile.close()
 
    # Gen
    Generate()