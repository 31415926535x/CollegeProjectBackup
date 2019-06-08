import cv2
import os
import dlib
import sys
import random
import shutil

 
 
def make_video(name):
    # 录制视频
    #shutil.rmtree(name)
    """使用opencv录像"""
    cap = cv2.VideoCapture(0)  # 默认的摄像头
    # 指定视频代码
    fourcc = cv2.VideoWriter_fourcc(*"DIVX")
    out = cv2.VideoWriter('233.avi', fourcc, 20.0, (640,480))   # 设置录制的视频的格式
    while(cap.isOpened()):
        ret, frame = cap.read()
        if ret:
            out.write(frame)
            #
            cv2.imshow('frame',frame)
            # 等待按键q操作关闭摄像头
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        else:
            break
    cap.release()                   # 释放摄像头资源
    out.release()                   # 释放文件资源
    cv2.destroyAllWindows()         # 关闭拍摄窗口




# 改变图片的亮度与对比度
def relight(img, light=1, bias=0):
    w = img.shape[1]
    h = img.shape[0]
    #image = []
    for i in range(0,w):
        for j in range(0,h):
            for c in range(3):
                tmp = int(img[j,i,c]*light + bias)
                if tmp > 255:
                    tmp = 255
                elif tmp < 0:
                    tmp = 0
                img[j,i,c] = tmp
    return img

def getDataByDlib(name):
    # 利用dlib来实现
    output_dir = name       # 使用录入的名字作为文件夹的名字
    size = 64               # 相片的大小为64*64

    if not os.path.exists(output_dir):      # 没有文件夹是主动创建一个
        os.makedirs(output_dir)
    #使用dlib自带的frontal_face_detector作为我们的特征提取器
    detector = dlib.get_frontal_face_detector()
    # 打开摄像头 参数为输入流，可以为摄像头或视频文件
    #camera = cv2.VideoCapture(0)
    camera = cv2.VideoCapture("233.avi")    # 相片来自上一步拍摄的视频

    index = 1
    while True:
        if (index <= 200):                  # 每一段视频只取200张
            print('Being processed picture %s' % index) # 显示处理的过程
            # 从摄像头读取照片
            success, img = camera.read()    # 从视频流中读取照片
            # 转为灰度图片
            gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            # 使用detector进行人脸检测
            dets = detector(gray_img, 1)

            if success == False:
                break

            for i, d in enumerate(dets):
                x1 = d.top() if d.top() > 0 else 0
                y1 = d.bottom() if d.bottom() > 0 else 0
                x2 = d.left() if d.left() > 0 else 0
                y2 = d.right() if d.right() > 0 else 0

                face = img[x1:y1,x2:y2]
                # 调整图片的对比度与亮度， 对比度与亮度值都取随机数，这样能增加样本的多样性
                face = relight(face, random.uniform(0.5, 1.5), random.randint(-50, 50))
                # 裁剪出人脸相片，大小为64*64
                face = cv2.resize(face, (size,size))    
                # 显示最后裁剪出的人脸相片
                cv2.imshow('image', face)
                # 保存到文件下，文件名为1 - 200.jpg
                cv2.imwrite(output_dir+'/'+str(index)+'.jpg', face)

                index += 1
            key = cv2.waitKey(30) & 0xff
            if key == 27:
                break
        else:
            print('Finished!')
            break
    # 删除视频
    shutil.rmtree('./233.avi')



def getDataByOpencv2():
    # 利用opencv来实现
    output_dir = './my_faces'
    size = 64
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)                                 
    # 获取分类器
    haar = cv2.CascadeClassifier(r'G:\DIP\Anaconda3\envs\test1\Library\etc\haarcascades\haarcascade_frontalface_default.xml')

    # 打开摄像头 参数为输入流，可以为摄像头或视频文件
    camera = cv2.VideoCapture("233.avi")

    n = 1
    while 1:
        if (n <= 10000):
            print('It`s processing %s image.' % n)
            # 读帧
            success, img = camera.read()

            gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            faces = haar.detectMultiScale(gray_img, 1.3, 5)
            for f_x, f_y, f_w, f_h in faces:
                face = img[f_y:f_y+f_h, f_x:f_x+f_w]
                face = cv2.resize(face, (64,64))
                '''
                if n % 3 == 1:
                    face = relight(face, 1, 50)
                elif n % 3 == 2:
                    face = relight(face, 0.5, 0)
                '''
                face = relight(face, random.uniform(0.5, 1.5), random.randint(-50, 50))
                cv2.imshow('img', face)
                cv2.imwrite(output_dir+'/'+str(n)+'.jpg', face)
                n+=1
            key = cv2.waitKey(30) & 0xff
            if key == 27:
                break
        else:
            break

if __name__ == '__main__':
    name = input('please input yourename: ')        # 获取录入者的名字
    name = os.path.join('./image/trainfaces', name) # 生成保存的文件路径名
    make_video(name)                                # 拍摄视频
    getDataByDlib(name)                             # 利用dlib处理裁剪人脸原始相片