
    /**  
    * @Title: ServerThread.java
    * @Package v2
    * @Description: TODO
    * @author 31415926535x 
	* @email 2509437152wx@gamil.com
	* @blog cnblogs.com/31415926535x
    * @date 2019年4月30日
    * @version V1.0  
    */
    
package v2;


    /**
    * @ClassName: ServerThread
    * @Description: TODO 实现端对端的通信功能
    * @author 31415926535x
    * @date 2019年4月30日
    *
    */

import java.io.*;
import java.net.*;
public class ServerThread extends Thread{
	Socket socket1 = null; 		//保存与本线程相关的主客户端Socket对象
	Socket socket2 = null; 		//保存主客户端与之通信的客户端的Socket对象
	int clientnum; //保存本进程的客户计数
	public ServerThread(Socket socket,int num) { //构造函数
	     this.socket1=socket; //初始化socket变量
		 clientnum=num+1; //初始化clientnum变量
	}
	public void run() { //线程主体
	    try{
			String line;
			//由客户端1的Socket对象得到输入流，并构造相应的BufferedReader对象
			BufferedReader is1= new BufferedReader(new InputStreamReader(socket1.getInputStream()));
			//由客户端1Socket对象得到输出流，并构造PrintWriter对象
			PrintWriter os1 = new PrintWriter(socket1.getOutputStream());
			
			
			
			String accountString = is1.readLine();						//读入当前客户端的信息

			MultiTalkServer.putAccountIntoDB(accountString, socket1);	//保存信息到上线数据库
			
			os1.println("You are now logging in!");
			os1.flush();
			os1.println("Input the id that you wanna talk to...");
			os1.flush();
			
			String theOtherClientString = is1.readLine();				//得到当前客户端想要通信的客户端id
			
			socket2 = MultiTalkServer.getSocket(theOtherClientString);	//获得要通信的客户端的套接字
			
			BufferedReader is2 = new BufferedReader(new InputStreamReader(socket2.getInputStream()));
			PrintWriter os2 = new PrintWriter(socket2.getOutputStream());
			
			
			
			
			//从标准输入读入一字符串
			line = is1.readLine();
			
			//在标准输出上打印从客户端读入的字符串
			System.out.println("Client1 talk to Client2: " + line);
			
			while(!line.equals("bye")){									//如果该字符串为 "bye"，则停止循环
			   os2.println(line);										//向客户端输出该字符串
			   os2.flush();												//刷新输出流，使Client马上收到该字符串
			   //在系统标准输出上打印该字符串
			   System.out.println("Client1 talk to Client2: " + line);
			   
			   line = is2.readLine();									
			   
			   os1.println(line);
			   os1.flush();
			   
			   System.out.println("Client 2 talk to Client1: " + line);
			   
			   
			   line = is1.readLine();
			}//继续循环
			os1.close(); //关闭Socket输出流
			is1.close(); //关闭Socket输入流
			socket1.close(); //关闭Socket	
			
			os2.close();
			is2.close();
			socket2.close();
		}catch(Exception e){
			System.out.println("Error:"+e);//出错，打印出错信息
		}
	}
}
