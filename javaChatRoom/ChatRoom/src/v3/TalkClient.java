
    /**  
    * @Title: TalkClient.java
    * @Package v3
    * @Description: TODO
    * @author 31415926535x 
	* @email 2509437152wx@gamil.com
	* @blog cnblogs.com/31415926535x
    * @date 2019-05-01上午11:14:43
    * @version v3 
    */
    
package v3;


    /**
    * @ClassName: TalkClient
    * @Description: TODO(这里用一句话描述这个类的作用)
    * @author 31415926535x
    * @date 2019年5月1日
    *
    */

import java.io.*;
import java.net.*;


public class TalkClient {
	public static void main(String args[]) {
		Account account = new getRandomAccountForTest().getARandomAccountForTest();
		account.show();
		
		
		try{
			//向本机的4700端口发出客户请求
			Socket socket=new Socket("127.0.0.1", 4700);
			
			//由系统标准输入设备构造BufferedReader对象
			BufferedReader sin = new BufferedReader(new InputStreamReader(System.in));
			//由Socket对象得到输出流，并构造PrintWriter对象
			PrintWriter os = new PrintWriter(socket.getOutputStream());
			//由Socket对象得到输入流，并构造相应的BufferedReader对象
			BufferedReader is = new BufferedReader(new InputStreamReader(socket.getInputStream()));
			
			
			os.println(account.conventAccountToString());	//像服务器传递自己的账户信息，记录到在线列表数据库
			os.flush();
			
			System.out.println("Server: " + is.readLine());	//输出登陆成功提示信息
			
			
			//创建收发消息两个线程，实现收发消息的任意性
			reciveMessageThread recive = new reciveMessageThread(socket);
			recive.start();
			
			boolean clientIslogin = true;
			while(clientIslogin) {
				
//				System.out.println("Server: " + is.readLine());	//输出想要与之通信的客户端的提示信息
//				
//				String theOhterClientString;					//记录当前客户端想要与其通信的另一个客户端名称
//				theOhterClientString = sin.readLine();
//				
//				os.println(theOhterClientString);				//向服务器请求与之通信的另一客户端
//				os.flush();
				
				clientSendIdToServer client = new clientSendIdToServer(socket);
				client.join();
				
				sendMessageThread send = new sendMessageThread(socket);
				send.start();
				
//				if(theOhterClientString.equals("exit")) {
//					send.stopThisThread();
//					break;
//				}
				
//				send.start();
				
				try {
					send.join();
				} catch (Exception e) {
					// TODO: handle exception
					System.out.println("Error: --" + e);
				}
			}
			
			
			recive.stopThisThread();
			os.close();
			is.close();
			sin.close();
			System.out.println(23333);
			socket.close();
			
			
			
			
		}catch(Exception e) {
			System.out.println("Error"+e); //出错，则打印出错信息
	    }
	}
}