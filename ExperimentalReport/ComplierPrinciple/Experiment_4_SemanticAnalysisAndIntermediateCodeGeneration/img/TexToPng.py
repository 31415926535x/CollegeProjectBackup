import os

root = os.getcwd()
# for rt, dirs, files in os.walk(root):
#     print("root" + str(rt))
#     print("dirs" + str(dirs))
#     print("files" + str(files))

for rt, dirs, files in os.walk(root):
    for file in files:
        if(file.find(".svg") != -1):
            svgfile = rt + "\\" + file
            pngfile = svgfile.replace(".tex", ".png")
            os.system("E:\Program\Inkscape\inkscape.com " + svgfile + " -e " + pngfile + " -d 800 -y 1 -b #ffffff")
            print("E:\Program\Inkscape\inkscape.com " + svgfile + " -e " + pngfile + " -d 1000 -y 1 -b #ffffff")
