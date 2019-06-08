package v4;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutput;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

import com.sun.org.apache.bcel.internal.generic.NEW;

/**
    * @ClassName: sendAndReciveOfServerThread
    * @Description: TODO 服务器端完成的功能是 收客户端A消息再发送到客户端B的功能，即转发功能
    * @author 31415926535x
    * @date 2019-05-01下午8:59:20
    *
    */

public class sendAndReciveOfServerThread extends Thread {
	private Socket clientASocket = null;
	private Socket clientBSocket = null;
	private volatile Thread blinker;
	private boolean flag = true;
	/**
	* @Title: sendAndReciveOfServerThread
	* @Description: TODO(这里用一句话描述这个方法的作用)
	* @param     参数
	* @throws
	*/

	/**
	* @Title: sendAndReciveOfServerThread
	* @Description: TODO 构造方法，记录下客户端A与B的套接字
	* @param @param clientASocket	A的套接字
	* @param @param clientBSocket   B的套接字
	* @throws
	*/
	    
	public sendAndReciveOfServerThread(Socket clientASocket, Socket clientBSocket) {
		// TODO Auto-generated constructor stub
		this.clientASocket = clientASocket;
		this.clientBSocket = clientBSocket;
	}
	public boolean getFlag() {
		return flag;
	}
	public void start() {
		blinker = new Thread(this);
		blinker.start();
	}
	public void stopThisThread() {
		blinker = null;
		flag = false;
	}
	
	    /**
	    * 
	    * 
		* @Title: run
	    * @Description: TODO 实现服务器从客户端A处接收消息并转发到客户端B的功能，以客户端A为主体，其通信可看作 A->服务器->B 以及 B->服务器->A 两个反向的通信，所以服务器端开两个线程就可以了
	    * @param     参数
	    */
	    
	public void run() {
		Thread thisThread = this.currentThread();
		
		try {
			
			BufferedReader is1 = new BufferedReader(new InputStreamReader(clientASocket.getInputStream()));		//接收客户端A处的消息
			PrintWriter os2 = new PrintWriter(clientBSocket.getOutputStream());									//将接收的消息转发到B
			
//			BufferedReader is2 = new BufferedReader(new InputStreamReader(clientBSocket.getInputStream()));
//			PrintWriter os1 = new PrintWriter(clientASocket.getOutputStream());
			
			String readlineString = is1.readLine();
			while(blinker == thisThread) {
				os2.println(readlineString);
				os2.flush();
				System.out.println("Client1 talk ot Client2: " + readlineString);
				
				
				
				//增加文件的接收
				//当检测到文件传输时：
				if(readlineString.equals("<File>")) {
					readlineString = is1.readLine();													//读入对方文件的路径
					readlineString = readlineString.substring(readlineString.lastIndexOf("\\") + 1);	//得到文件名
					readlineString = serverGlobalSettingsInfos.getServerDirString()
									+ MultiTalkServer.getAccount(clientASocket).getId()
									+ "\\" + readlineString;											//得到服务器端保存的文件的绝对路径
					System.out.println(readlineString);													//显示得到的绝对路径
					File file2 = new File(readlineString);												//创建文件的对象
					FileOutputStream wf = new FileOutputStream(file2);									//创建文件的写入流
					DataInputStream dis1 = new DataInputStream(clientASocket.getInputStream());			//创建文件的接受数据流
					int n = serverGlobalSettingsInfos.getServerBufferSize(), count;																	//创建文件的缓冲区
					long length = dis1.readLong();														//读入文件的大小，当读入的数据大小等于此大小时，不再读入数据，转为读入消息
					long nowLength = 0;
					byte buffer[] = new byte[n];
//					readlineString = is1.readLine();
					fileSystemOperation.getInfo(file2);													//显示创建的文件的信息
					
					while(nowLength < length) {																//读入文件，并放到文件中，当当前读入的文件累计大小与传送前发送的值相等时便不再接收文件，认为文件接收完毕
						count = dis1.read(buffer, 0, n);												//得到一部分的文件，以及读入的大小
						wf.write(buffer, 0, count);														//写文件(当前写入的大小为count)
						wf.flush();
						nowLength += count;
//						System.out.print(new String(buffer));
						System.out.print(nowLength + " ");
						System.out.println(nowLength * 100 /length);
					}					
					System.out.println("tranfer done!");
					
					wf.close();																			//关闭文件写入流
					
					//增加文件的发送
					
					
					
					
					FileInputStream rf = new FileInputStream(file2);									//打开刚才暂存的文件
					DataOutputStream dos2 = new DataOutputStream(clientBSocket.getOutputStream());		//打开一个数据传输流
					
					readlineString = readlineString.substring(readlineString.lastIndexOf("\\") + 1);	//传输文件名
					os2.println(readlineString);
					os2.flush();
					
					dos2.writeLong(file2.length());														//传输文件大小
					dos2.flush();
					
					nowLength = 0;
					while(nowLength < length) {															//传送文件
						count = rf.read(buffer, 0, n);
						nowLength += count;
						dos2.write(buffer, 0, count);
						dos2.flush();
					}
					wf.close();
					rf.close();
					System.out.println("File tranfer has done!");
				}
				
				
				if(readlineString.equals("bye")) {
					System.out.println("stoppppppppppppp");
					stopThisThread();
					break;
				}
				readlineString = is1.readLine();
			}
			
//因为流关闭会导致套接字的关闭，所以这里不管
//			is1.close();
//			os2.close();
//			clientASocket.close();
//			clientBSocket.close();
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("Erroe: " + e);
		}	
	}
}
