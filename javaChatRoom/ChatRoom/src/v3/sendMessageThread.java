
    /**  
    * @Title: sendMessageThread.java
    * @Package v3
    * @Description: TODO
    * @author 31415926535x 
	* @email 2509437152wx@gamil.com
	* @blog cnblogs.com/31415926535x
    * @date 2019-05-01下午2:09:36
    * @version v3 
    */
    
package v3;

import java.io.BufferedReader;
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
			
			String readlineString = sin.readLine();
			
			while(blinker == thisThread) {
				os.println(readlineString);
				os.flush();
				System.out.println("You said: " + readlineString);
				if(readlineString.equals("bye")) {
					System.out.println("send Thread stop");
					stopThisThread();
					break;
				}
				readlineString = sin.readLine();
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
