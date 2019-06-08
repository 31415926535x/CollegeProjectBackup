package v4;

import java.io.BufferedReader;
import java.io.DataInput;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.net.Socket;
import java.util.Date;

import com.sun.org.apache.bcel.internal.generic.NEW;
import com.sun.xml.internal.bind.v2.runtime.unmarshaller.XsiNilLoader.Single;

/**
    * @ClassName: reciveMessageThread
    * @Description: TODO 接收消息线程，与发送消息线程并行处理实现通信的任意性
    * @author 31415926535x
    * @date 2019-05-01下午2:10:02
    *
    */

public class reciveMessageThread extends Thread {
	Socket socket = null;
	private Thread blinker;
	    /**
	    * @Title: reciveMessageThread
	    * @Description: TODO 接收消息的操作线程
	    * @param @param messageString	消息内容
	    * @param @param socket    		等待接收消息一方的套接字（即服务器端的套接字，客户端等待服务器转发的消息）
	    * @throws
	    */
	    
	public reciveMessageThread(Socket socket) {
		// TODO Auto-generated constructor stub
		this.socket = socket;
	}
	
	public void start() {
		blinker = new Thread(this);
		blinker.start();
	}
	
	public void stopThisThread() {
		blinker = null;
	}
	
	public void run() {
		Thread thisThread = Thread.currentThread();
		
		try {
			//由Socket对象得到输入流，并构造相应的BufferedReader对象
			BufferedReader is = new BufferedReader(new InputStreamReader(socket.getInputStream()));
			
			String readlineString;
			
			while(blinker == thisThread) {
				readlineString = is.readLine();
				System.out.println("He said: " + readlineString);
				
				//增加文件的接收
				//当检测到文件传送时
				if(readlineString.equals("<File>")) {
					System.out.println("File start");
					readlineString = is.readLine();								//得到文件名
//					System.out.println("id:" + MultiTalkServer.getAccount(socket).getId());
					System.out.println(readlineString);
																				//得到文件的绝对路径
					readlineString = userGlobalSettingsInfos.getUserDirString()
									+ TalkClient.account.getId() + "\\"
									+ readlineString;
					System.out.println(readlineString);
					
					File file2 = new File(readlineString);						//创建一个文件对象
					
					
					FileOutputStream wf = new FileOutputStream(file2);			//创建文件写入流
					DataInputStream dis = new DataInputStream(socket.getInputStream());	//创建文件接收流
					fileSystemOperation.getInfo(file2);
					
					long length = dis.readLong();								//得到文件大小
					long nowlength = 0;											//当前文件大小
					int count, n = userGlobalSettingsInfos.getUserBufferSize();
					byte buffer[] = new byte[n];
					System.out.println(length + ".......");
					while(nowlength < length) {
						count = dis.read(buffer, 0, n);
						nowlength += count;
						wf.write(buffer, 0, count);
						wf.flush();
						System.out.print(nowlength + " " + length + " ");
						System.out.println(nowlength * 100 / length);			//传输文件进度
					}
					wf.close();
					System.out.println("Tranfer done!");
				}
				
				//
				
			}
			
//			is.close();
			
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("Error: " + e);
		}
	}
}
