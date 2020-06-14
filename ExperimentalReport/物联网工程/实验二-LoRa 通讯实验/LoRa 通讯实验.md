
LoRa 通讯实验

# 实验目的

+ 熟悉 Keil4 开发环境的使用
+ 熟悉使用STM32芯片控制LoRa通信过程


# 实验设备

+ 硬件： LoRa节点两个、电脑、J-Link，串口线
+ 软件： Keil4


LoRa节点由 ``LoRa节点底板`` 和 ``LoRa射频板`` 组成，通过IO接口连接：

|STM32的IO管脚|SX1278的管脚|
|---|---|
|PC1|SD0|
|PA1|REST|
|PC3|CE|
|PC2|CKL|
|PC0|SDI|

# 实验步骤

使用两个LoRa节点，其中一个作为 ``Master（主机）`` ，另一个作为 ``Slave（从机）`` ，然后进行如下的流程：

+ 1.上位机发送数据："你好666"给主机Master，主机Master的 ``串口2`` 接收到数据"你好666"以后通过LoRa无线发送给从机Slave
+ 2.从机Slave无线接收到数据"你好666"以后，通过LoRa无线把数据"你好666"原样发送给主机Master
+ 3.主机Master通过LoRa无线接收到数据"你好666"以后，通过串口2将数据"你好666"发送给上位机
+ 实现主机Master和从机Slave之间的数据收发


## 编译下载程序到两个LoRa节点

+ 打开源码 ``\LoRa实验\LoRa-STM32-Master\RVMDK`` 下的 ``LoRa_STM32_Master.uvproj`` 工程，然后编译，JLink连接下载到Master节点
+ 打开源码 ``\LoRa实验\LoRa-STM32-Slave\RVMDK`` 下的 ``LoRa_STM32_Slave.uvproj`` 工程，然后编译，JLink连接下载到Slave节点
+ 串口线连接电脑和主机Master节点，并将三档开关拨至左边（STM32的串口与RS232接口连接）
+ 打开串口助手，选择串口号，串口参数： 9600-8-N-1，不选16进制收发，然后手动发送一些数据，大约2-3秒钟后将会收到从机返回的发送数据，而当从机关闭后将不会收到返回的数据
+ 实验完毕