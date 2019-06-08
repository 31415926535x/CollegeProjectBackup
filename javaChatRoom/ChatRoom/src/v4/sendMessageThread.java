package v4;

import java.io.BufferedReader;
import java.io.DataInput;
import java.io.DataInputStream;
import java.io.DataOutput;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

/**
    * @ClassName: sendMessageThread
    * @Description: TODO 发送消息线程，与接收消息线程并行处理实现通信的任意性
    * @author 31415926535x
    * @date 2019-05-01下午2:09:36
    *
    */

public class sendMessageThread extends Thread {
	Socket socket = null;
	private volatile Thread blinker;
	private boolean flag = true; 
	/**
	* @Title: sendMessageThread
	* @Description: TODO 构造方法，记录当前客户端与服务器通信的套接字（服务器的套接字）
	* @param     参数
	* @throws
	*/

	public sendMessageThread(Socket socket) {
		// TODO Auto-generated constructor stub
		this.socket = socket;
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
	    * @Description: TODO 线程 run() 方法主体，实现从客户端得到一段消息并发送到服务器的功能
	    * @param     参数
		* @return	
	    * @throws
	    */
	    
	public void run() {
		Thread thisThread = Thread.currentThread();

		try {
			
			//由系统标准输入设备构造BufferedReader对象
			BufferedReader sin = new BufferedReader(new InputStreamReader(System.in));
			//由Socket对象得到输出流，并构造PrintWriter对象
			PrintWriter os = new PrintWriter(socket.getOutputStream());
			
			String readlineString;
			
			while(blinker == thisThread) {
				System.out.print("You said: ");
				readlineString = sin.readLine();
				os.println(readlineString);
				os.flush();
				
				//增加文件传输
				//当检测到时文件传输时
				if(readlineString.equals("<File>")) {
					readlineString = sin.readLine();										//读入本地要传输的文件的路径（绝对路径）
					os.println(readlineString);												//发送到服务器端
					os.flush();
					File file1 = new File(readlineString);									//创建文件的对象
					fileSystemOperation.getInfo(file1);										//显示文件信息
					FileInputStream rf = new FileInputStream(file1);						//创建读入文件的流
					DataOutputStream dos = new DataOutputStream(socket.getOutputStream());	//创建经过socket的数据发送流
					int count, n = userGlobalSettingsInfos.getUserBufferSize();														//创建一个缓冲区
					byte buffer[] = new byte[n];
					
					System.out.println("File is tranfering...");
					
					//发送文件的大小，当对方读取到这个大小的数据之后就停止接收文件，如果直接关闭流的话，会导致socket的关闭，或者无法第二次进行传输
					dos.writeLong(file1.length());
					dos.flush();
					
					while((count = rf.read(buffer, 0, n)) != -1) {							//读取本地文件，发送，这里可以使用判断是否读到文件末来终止读入发送
						dos.write(buffer, 0, count);
						dos.flush();
//						System.out.println(new String(buffer));
						System.out.println(count);
					}
					
					System.out.println("File End");
//					dos.close();
//					socket.shutdownOutput();												//直接关闭发送流或者关闭所有发送流都无法完成需求
					rf.close();																//关闭问读入流（貌似这个关闭无影响？？）
				}
				
				
				//
				
				if(readlineString.equals("bye")) {
					System.out.println("send Thread stop");
					stopThisThread();
					break;
				}
//				readlineString = sin.readLine();
			}
			System.out.println("send thread stopped");
//			os.close();
//			sin.close();
			
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("Error: --" + e);
		}
	}
}
