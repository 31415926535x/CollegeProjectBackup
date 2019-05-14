
    /**  
    * @Title: reciveMessageThread.java
    * @Package v3
    * @Description: TODO
    * @author 31415926535x 
	* @email 2509437152wx@gamil.com
	* @blog cnblogs.com/31415926535x
    * @date 2019-05-01下午2:10:02
    * @version v3 
    */
    
package v3;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.Socket;

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
			BufferedReader is=new BufferedReader(new InputStreamReader(socket.getInputStream()));
			
			String readlineString = is.readLine();
			
			while(blinker == thisThread) {
				System.out.println(readlineString);
				readlineString = is.readLine();
			}
			
//			is.close();
			
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("Error: " + e);
		}
	}
}
