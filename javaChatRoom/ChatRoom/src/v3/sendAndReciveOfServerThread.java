
    /**  
    * @Title: sendAndReciveOfServerThread.java
    * @Package v3
    * @Description: TODO
    * @author 31415926535x 
	* @email 2509437152wx@gamil.com
	* @blog cnblogs.com/31415926535x
    * @date 2019-05-01下午8:59:20
    * @version v3 
    */
    
package v3;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

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
	    /**
	    * 
	    * 
		* @Title: run
	    * @Description: TODO 实现服务器从客户端A处接收消息并转发到客户端B的功能，以客户端A为主体，其通信可看作 A->服务器->B 以及 B->服务器->A 两个反向的通信，所以服务器端开两个线程就可以了
	    * @param     参数
	    */
	    
	public void run() {
		try {
			
			BufferedReader is1 = new BufferedReader(new InputStreamReader(clientASocket.getInputStream()));		//接收客户端A处的消息
			PrintWriter os2 = new PrintWriter(clientBSocket.getOutputStream());									//将接收的消息转发到B
			
//			BufferedReader is2 = new BufferedReader(new InputStreamReader(clientBSocket.getInputStream()));
//			PrintWriter os1 = new PrintWriter(clientASocket.getOutputStream());
			
			String readlineString = is1.readLine();
			while(true) {
				os2.println(readlineString);
				os2.flush();
				System.out.println("Client1 talk ot Client2: " + readlineString);
				if(readlineString.equals("bye")) {
					flag = false;
					break;
				}
				readlineString = is1.readLine();
			}
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
