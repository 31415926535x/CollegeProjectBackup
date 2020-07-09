from html.parser import HTMLParser

class MyHTMLParser(HTMLParser):  # 继承 HTMLParser 类

    ctag = False  # 当前解析的标签是否为内容所在的标签


    def handle_starttag(self, tag, attrs):
        print('begin a tag:'+tag)
        if tag == 'h1':
            for attr in attrs:
                print(attr[0])
                if attr[1] == 'center':
                    self.ctag = True
                    break
    def handle_data(self, data):
        print('handle a tag')
        if self.ctag == True:
            print("Extracted data :", data)
    def handle_endtag(self, tag):
        print('end a tag:'+tag)
        self.ctag = False


parser = MyHTMLParser()
parser.feed('<html><head><title>Test</title></head>'
            '<body><h1 align="center">Big data news</h1><h1 align="center">'
            'AI news</h1><h1 align="right">2018.8.1</h1></body></html>')
