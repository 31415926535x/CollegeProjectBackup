#!/usr/bin/python
#coding=utf-8
''' common 
get image 
http://blog.csdn.net/sparta_117/article/details/66965760
'''
# pylint: disable=invalid-name

import logging as log
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
import shutil

log.basicConfig(level=log.DEBUG)

def getimgdata(filepath, size=(28, 28)):
    ''' must be 28*28, rgb24bits ./mydrawnum3.bmp '''
    imgfile = Image.open(filepath)
    if imgfile.size != size:
        imgfile = imgfile.resize(size, Image.BICUBIC)
    imgdata = np.asarray(imgfile.convert('L'))

    log.debug('%s : %s', imgdata.shape, imgdata.dtype)
    imgdata = (255.0 - imgdata) / 255.0

    threshold = 0.0
    if threshold != 0.0:
        imgdata[imgdata > threshold] = 1
        imgdata[imgdata <= threshold] = 0

    return imgdata

fig = plt.figure()
plt.ion()

def showkmeansresult(srcdata, center, result, title='title'):
    ''' srcdata is m*n, center is k * n n now is 2
        result is m number list, every value is in [0, k-1]
    '''
    #corlist = ['r', 'g', 'b', 'y', 'c', 'm', 'k']
    fig.clear()
    #color = [corlist[item] for item in result]
    plt.scatter(srcdata[:, 0], srcdata[:, 1], marker='o', c=result, s=30)
    #x = [item[0] for item in center]
    #y = [item[1] for item in center]
    plt.scatter(center[:, 0], center[:, 1], marker='x', c='m', s=60)
    plt.title(title)
    plt.pause(0.1)

def blockplt():
    ''' block plt'''
    plt.ioff()
    plt.show()


if __name__ == '__main__':
    log.debug(getimgdata('number9.jpg'))