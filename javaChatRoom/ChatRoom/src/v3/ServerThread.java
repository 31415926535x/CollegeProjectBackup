
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
			
			os1.println("You logged in!");
			os1.flush();
			
			boolean clientIsLogin = true;
			while(clientIsLogin) {
				os1.println("Input the id that you wanna talk to..Or \"exit\" if you wanna to exit");
				os1.flush();
				System.out.println("--0-0-");
				
				
				
				String theOtherClientString = is1.readLine();
				System.out.println(theOtherClientString + "------");
				if(theOtherClientString.equals("exit")) {
					break;
				}
				System.out.println(theOtherClientString + "------");
				socket2 = MultiTalkServer.getSocket(theOtherClientString);
				
				sendAndReciveOfServerThread clientASendMessageToClientB = new sendAndReciveOfServerThread(socket1, socket2);
				clientASendMessageToClientB.start();
				
				try {
					clientASendMessageToClientB.join();
				} catch (Exception e) {
					// TODO: handle exception
					System.out.println("Error: " + e);
				}
			}
//			os1.println("Input the id that you wanna talk to...");
//			os1.flush();
//			
//			String theOtherClientString = is1.readLine();				//得到当前客户端想要通信的客户端id
//			
//			socket2 = MultiTalkServer.getSocket(theOtherClientString);	//获得要通信的客户端的套接字
			
			
//			//创建两个反向的线程，用于实现客户端A的发送与接收功能
//			sendAndReciveOfServerThread clientASendMessageToClientB = new sendAndReciveOfServerThread(socket1, socket2);
//			sendAndReciveOfServerThread clientAReciveMessageFromClientB = new sendAndReciveOfServerThread(socket2, socket1);
//			
//			clientASendMessageToClientB.start();	
//			clientAReciveMessageFromClientB.start();
//			
//			while(clientAReciveMessageFromClientB.isAlive() && clientASendMessageToClientB.isAlive()) {
//				if(!clientAReciveMessageFromClientB.isAlive() || !clientASendMessageToClientB.isAlive()) {
//					os1.close();
//					is1.close();
//					socket1.close();
//					socket2.close();
//				}
//			}
			
//			sendAndReciveOfServerThread clientASendMessageToClientB = new sendAndReciveOfServerThread(socket1, socket2);
//			clientASendMessageToClientB.start();
//			while(clientASendMessageToClientB.isAlive()) {
//				if(!clientASendMessageToClientB.isAlive()) {
//					break;
//				}
//			}
//			os1.close();
//			is1.close();
//			socket1.close();
//			socket2.close();
			
		}catch(Exception e){
			System.out.println("Error:" + e);//出错，打印出错信息
		}
	}
}

