from PyPDF2 import PdfFileWriter, PdfFileReader 
filepath = input()
inf = PdfFileReader(filepath, 'rb')
outf = PdfFileWriter()
for i in range(inf.getNumPages()):
    if(i == 0):
        continue
    outf.addPage(inf.getPage(i))
with open("_" + filepath, 'wb') as f:
    outf.write(f)