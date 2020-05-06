import os

root = os.getcwd()
# for rt, dirs, files in os.walk(root):
#     print("root" + str(rt))
#     print("dirs" + str(dirs))
#     print("files" + str(files))

for rt, dirs, files in os.walk(root):
    for file in files:
        if(file.find(".tex") != -1):
            texfile = rt + "\\" + file
            pdffile = texfile.replace(".tex", ".pdf")
            svgfile = texfile.replace(".tex", ".svg")
            pngfile = texfile.replace(".tex", ".png")
            print(texfile + "\n" + pdffile + "\n" + svgfile + "\n" + pngfile)
            os.system("pdflatex -halt-on-error -output-directory " + rt + " " + texfile)
            os.system("pdf2svg.exe " + pdffile + " " + svgfile)
            os.system("E:\Program\Inkscape\inkscape.com " + svgfile + " -e " + pngfile + " -d 1000 -y 1 -b #ffffff")
            print("E:\Program\Inkscape\inkscape.com " + svgfile + " -e " + pngfile + " -d 1000 -y 1 -b #ffffff")
