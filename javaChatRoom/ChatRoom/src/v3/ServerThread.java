
    /**  
    * @Title: ServerThread.java
    * @Package v3
    * @Description: TODO
    * @author 31415926535x 
	* @email 2509437152wx@gamil.com
	* @blog cnblogs.com/31415926535x
    * @date 2019-05-01上午11:16:35
    * @version v3 
    */
    
package v3;


    /**
    * @ClassName: ServerThread
    * @Description: TODO(这里用一句话描述这个类的作用)
    * @author 31415926535x
    * @date 2019-05-01上午11:16:35
    *
    */

import java.io.*;
import java.net.*;
public class ServerThread extends Thread{
	Socket socket1 = null; 		//保存与本线程相关的主客户端Socket对象
	Socket socket2 = null; 		//保存主客户端与之通信的客户端的Socket对象
	int clientnum; 				//保存本进程的客户计数
	public ServerThread(Socket socket,int num) { //构造函数
	     this.socket1 = socket; 	//初始化socket变量
		 clientnum = num+1; 		//初始化clientnum变量
	}
	public void run() { //线程主体
	    try{
			//由客户端1的Socket对象得到输入流，并构造相应的BufferedReader对象
			BufferedReader is1= new BufferedReader(new InputStreamReader(socket1.getInputStream()));
			//由客户端1Socket对象得到输出流，并构造PrintWriter对象
			PrintWriter os1 = new PrintWriter(socket1.getOutputStream());
			
			
			
			String accountString = is1.readLine();						//读入当前客户端的信息

			MultiTalkServer.putAccountIntoDB(accountString, socket1);	//保存信息到上线数据库
			
			os1.println("Server: You logged in!");								//提醒用户连接成功，上线
			os1.flush();
			
			boolean clientIsLogin = true;
			while(clientIsLogin) {
				
				//提示用户输入要与之通信对方的昵称和id
				os1.println("\t\t\t<Tips>: \nServer: Input the id that you wanna talk to..\nOr \"exit\" if you wanna to exit");
				os1.flush();

				//当用户选择离开时终止所有相关操作
				String theOtherClientString = is1.readLine();
				System.out.println(theOtherClientString + "------");
				if(theOtherClientString.equals("exit")) {
					break;
				}
				
				//根据昵称获取对方的套接字
				socket2 = MultiTalkServer.getSocket(theOtherClientString);
				
				//服务器与对方建立一个发消息的线程，用于将从用户收到的消息内容转发到另一用户
				sendAndReciveOfServerThread clientASendMessageToClientB = new sendAndReciveOfServerThread(socket1, socket2);
				clientASendMessageToClientB.start();
				
				//与客户端一样，此时主线程暂停，只执行发消息线程
				Thread thisThread = Thread.currentThread();
				while(clientASendMessageToClientB.getFlag()) {
					thisThread.yield();
				}
				System.out.println("client1 stoped");
			}
			
		}catch(Exception e){
			System.out.println("Error:" + e);//出错，打印出错信息
		}
	}
}

