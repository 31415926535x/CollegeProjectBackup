#!/usr/bin/python
#coding=utf-8
''' face detect convolution'''
# pylint: disable=invalid-name
import os
import sys
import logging as log
import matplotlib.pyplot as plt
import common
import numpy as np
from tensorflow.examples.tutorials.mnist import input_data
import tensorflow as tf
import cv2
from sklearn.model_selection import train_test_split
import random

SIZE = 64

x = tf.placeholder(tf.float32, [None, SIZE, SIZE, 3])
y_ = tf.placeholder(tf.float32, [None, None])
keep_prob_5 = tf.placeholder(tf.float32)
keep_prob_75 = tf.placeholder(tf.float32)


def weightVariable(shape):
    ''' build weight variable'''
    init = tf.random_normal(shape, stddev=0.01)
    #init = tf.truncated_normal(shape, stddev=0.01)
    return tf.Variable(init)

def biasVariable(shape):
    ''' build bias variable'''
    init = tf.random_normal(shape)
    #init = tf.truncated_normal(shape, stddev=0.01)
    return tf.Variable(init)

def conv2d(x, W):
    ''' conv2d by 1, 1, 1, 1'''
    return tf.nn.conv2d(x, W, strides=[1, 1, 1, 1], padding='SAME')

def maxPool(x):
    ''' max pooling'''
    return tf.nn.max_pool(x, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME')

def dropout(x, keep):
    ''' drop out'''
    return tf.nn.dropout(x, keep)

def batch_norm_layer(value,is_training=False,name='batch_norm'):
    '''
    批量归一化  返回批量归一化的结果
    
    args:
        value:代表输入，第一个维度为batch_size
        is_training:当它为True，代表是训练过程，这时会不断更新样本集的均值与方差。当测试时，要设置成False，这样就会使用训练样本集的均值和方差。
              默认测试模式
        name：名称。
    '''
    if is_training is True:
        #训练模式 使用指数加权函数不断更新均值和方差
        return tf.contrib.layers.batch_norm(inputs=value,decay=0.9,updates_collections=None,is_training = True)
    else:
        #测试模式 不更新均值和方差，直接使用
        return tf.contrib.layers.batch_norm(inputs=value,decay=0.9,updates_collections=None,is_training = False)


def cnnLayer(classnum, isTrue):
    ''' create cnn layer'''
    # 第一层
    W1 = weightVariable([3, 3, 3, 32]) # 卷积核大小(3,3)， 输入通道(3)， 输出通道(32)
    b1 = biasVariable([32])
    conv1 = tf.nn.relu(batch_norm_layer(conv2d(x, W1) + b1, isTrue))
    pool1 = maxPool(conv1)
    # 减少过拟合，随机让某些权重不更新
    drop1 = dropout(pool1, keep_prob_5) # 32 * 32 * 32 多个输入channel 被filter内积掉了

    # 第二层
    W2 = weightVariable([3, 3, 32, 64])
    b2 = biasVariable([64])
    conv2 = tf.nn.relu(batch_norm_layer(conv2d(drop1, W2) + b2, isTrue))
    pool2 = maxPool(conv2)
    drop2 = dropout(pool2, keep_prob_5) # 64 * 16 * 16

    # 第三层
    W3 = weightVariable([3, 3, 64, 64])
    b3 = biasVariable([64])
    conv3 = tf.nn.relu(conv2d(drop2, W3) + b3)
    pool3 = maxPool(conv3)
    drop3 = dropout(pool3, keep_prob_5) # 64 * 8 * 8
        
    # 全连接层
    Wf = weightVariable([8*8*64,512])
    bf = biasVariable([512])
    drop3_flat = tf.reshape(drop3, [-1, 8*8*64])
    dense = tf.nn.relu(tf.matmul(drop3_flat, Wf) + bf)
    dropf = dropout(dense, keep_prob_75)

    # 输出层
    Wout = weightVariable([512, classnum])
    bout = weightVariable([classnum])
    #out = tf.matmul(dropf, Wout) + bout
    out = tf.add(tf.matmul(dropf, Wout), bout)
    return out

    # # 第三层
    # W3 = weightVariable([3, 3, 64, 128])
    # b3 = biasVariable([128])
    # conv3 = tf.nn.relu(batch_norm_layer(conv2d(drop2, W3) + b3, True))
    # pool3 = maxPool(conv3)
    # drop3 = dropout(pool3, keep_prob_5) # 128 * 8 * 8

    # # 第四层
    # W4 = weightVariable([3, 3, 128, 512])
    # b4 = biasVariable([512])
    # conv4 = tf.nn.relu(batch_norm_layer(conv2d(drop3, W4) + b4, True))
    # pool4 = maxPool(conv4)
    # drop4 = dropout(pool4, keep_prob_5) # 512 * 4 * 4

    # # 第五层
    # W5 = weightVariable([3, 3, 512, 1024])
    # b5 = biasVariable([1024])
    # conv5 = tf.nn.relu(batch_norm_layer(conv2d(drop4, W5) + b5, True))
    # pool5 = maxPool(conv5)
    # drop5 = dropout(pool5, keep_prob_5) # 1024 * 2 * 2

    # # 第六层
    # W6 = weightVariable([3, 3, 1024, 1024])
    # b6 = biasVariable([1024])
    # conv6 = tf.nn.relu(conv2d(drop5, W6) + b6)
    # pool6 = maxPool(conv6)
    # drop6 = dropout(pool6, keep_prob_5) # 2048 * 1 * 1




    # # 全连接层
    # Wf = weightVariable([1*1*1024, 2048])
    # bf = biasVariable([2048])
    # drop3_flat = tf.reshape(drop6, [-1, 1*1*1024])
    # dense = tf.nn.relu(tf.matmul(drop3_flat, Wf) + bf)
    # # dense = tf.nn.relu(tf.matmul(max_pool22_flat, Wf) + bf)
    # dropf = dropout(dense, keep_prob_75)

   

    # # 输出层
    # Wout = weightVariable([2048, classnum])
    # bout = weightVariable([classnum])
    # #out = tf.matmul(dropf, Wout) + bout
    # out = tf.add(tf.matmul(dropf, Wout), bout)
    # #return out



def train(train_x, train_y, tfsavepath):
    ''' train'''
    ##### log.debug('train')

    # 随机划分测试集与训练集
    train_x,test_x,train_y,test_y = train_test_split(train_x, train_y, test_size=0.05, random_state=random.randint(0,100))

    # 得到卷积结果
    out = cnnLayer(train_y.shape[1],True)

    # 参数：图片数据的总数，图片的高、宽、通道
    train_x = train_x.reshape(train_x.shape[0], SIZE, SIZE, 3)
    test_x = test_x.reshape(test_x.shape[0], SIZE, SIZE, 3)
    
    print('train size:%s, test size:%s' % (len(train_x), len(test_x)))
    sys.stdout.flush()

    # 图片块，每次取32张图片
    batch_size = 32
    num_batch = len(train_x) // batch_size  

    # 交叉熵
    cross_entropy = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(logits=out, labels=y_))

    # Adam优化器，学习速率：0.001
    train_step = tf.train.AdamOptimizer(0.001).minimize(cross_entropy)
    # train_step = tf.train.AdadeltaOptimizer(0.001).minimize(cross_entropy)

    # 比较标签是否相等，再求的所有数的平均值，tf.cast(强制转换类型)
    # 准确率计算公式
    accuracy = tf.reduce_mean(tf.cast(tf.equal(tf.argmax(out, 1), tf.argmax(y_, 1)), tf.float32))



    # 将loss与accuracy保存以供tensorboard使用
    tf.summary.scalar('loss', cross_entropy)
    tf.summary.scalar('accuracy', accuracy)
    merged_summary_op = tf.summary.merge_all()

    # 数据保存器的初始化
    saver = tf.train.Saver()

    with tf.Session() as sess:

        # tensorflow初始化
        sess.run(tf.global_variables_initializer())
        # tensorboard数据保存
        summary_writer = tf.summary.FileWriter('./tmp', graph=tf.get_default_graph())

        # 迭代80次
        for n in range(80):
            # 每次取32(batch_size)张图片
            for i in range(num_batch):

                # 训练集、测试集分块
                batch_x = train_x[i*batch_size : (i+1)*batch_size]
                batch_y = train_y[i*batch_size : (i+1)*batch_size]
                # 开始训练数据，同时训练三个变量，返回三个数据
                _,loss,summary = sess.run([train_step, cross_entropy, merged_summary_op],
                                                feed_dict={x:batch_x,y_:batch_y, keep_prob_5:0.5,keep_prob_75:0.75})

                # tensorboard记录数据    
                summary_writer.add_summary(summary, n*num_batch+i)

                
                # 打印损失
                print(n*num_batch+i, loss)
                sys.stdout.flush()

        #         if (n*num_batch+i) % batch_size == 0:
        #             # 获取测试数据的准确率
        #             acc = accuracy.eval({x:test_x, y_:test_y, keep_prob_5:1.0, keep_prob_75:1.0})
        #             print(n*num_batch+i, acc, '--', n)
                    
        #             accc = acc

        #             # 准确率大于0.98时保存并退出
        #             if acc > 0.95 and n > 2:
        #                 # saver.save(sess, './train_faces.model', global_step=n*num_batch+i)
        #                 saver.save(sess, tfsavepath)
        #                 # saver.save(sess, tfsavepath)
        #                 sys.exit(0)
        # # saver.save(sess, './train_faces.model', global_step=n*num_batch+i)
        # # saver.save(sess, tfsavepath)
        # print('accuracy less 0.98, exited!')   

        # 准确率计算表达式
        acc = accuracy.eval({x:test_x, y_:test_y, keep_prob_5:1.0, keep_prob_75:1.0})
        print('after 80 times run: accuracy is ', acc)
        sys.stdout.flush()

        # 模型保存
        saver.save(sess, tfsavepath) 

if __name__ == '__main__':
    pass
