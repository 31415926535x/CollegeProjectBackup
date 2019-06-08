import shutil

rootpath = 'G:\\DIP\\mine'

shutil.rmtree(rootpath + '\\checkpoint')
shutil.rmtree(rootpath + '\\image\\trainfaces')
shutil.rmtree(rootpath + '\\tmp')
print("All settings have been inited!")