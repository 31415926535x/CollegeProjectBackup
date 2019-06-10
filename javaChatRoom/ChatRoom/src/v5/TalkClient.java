package v5;

/**
* @ClassName: TalkClient
* @Description: TODO(这里用一句话描述这个类的作用)
* @author 31415926535x
* @date 2019年5月1日
*
*/

import java.io.*;
import java.net.*;

import com.google.gson.Gson;


public class TalkClient {
	public static Account account;							//为了接收消息线程能够获取到当前用户的id
	public static Account theOtherAccount;
	public static void main(String args[]) {
//		account = new getRandomAccountForTest().getARandomAccountForTest();
		account = getRandomAccountForTest.getARandomAccountForTest();
		account.show();
		
		try{
			//向本机的4700端口发出客户请求
			Socket socket=new Socket("127.0.0.1", 4700);
			
			//由系统标准输入设备构造BufferedReader对象
			BufferedReader sin = new BufferedReader(new InputStreamReader(System.in));
//			由Socket对象得到输出流，并构造PrintWriter对象
			PrintWriter os = new PrintWriter(socket.getOutputStream());
//			由Socket对象得到输入流，并构造相应的BufferedReader对象
			BufferedReader is = new BufferedReader(new InputStreamReader(socket.getInputStream()));
			DataOutputStream dos = new DataOutputStream(socket.getOutputStream());
			
			
			System.out.println((new Message(account.getId().toString(), account.getName(), "", "", "Send own account's id").getJsonOfMessage()));

			//因为所有的字符串都规定以UTF来编码发送操作，所以此处用writeUTF()
			dos.writeUTF(account.conventAccountToString());				//像服务器传递自己的账户信息，记录到在线列表数据库
			dos.flush();
/* 
 * 以下为解决发送文件数据块string转byte[]数据丢失所作的尝试
//			os.println((new Message(account.getId().toString(), account.getName(), "", "", "Send own account's id").getJsonOfMessage()));	
//			os.println(account.conventAccountToString());				//像服务器传递自己的账户信息，记录到在线列表数据库
//			os.flush();
//			dos.write(account.conventAccountToString().getBytes("UTF8"));
//			dos.flush();
*/	
			
			
			//G:\Backup\clientSendIdToServer.java
			//创建收发消息两个线程，实现收发消息的任意性
			reciveMessageThread recive = new reciveMessageThread(socket);
			recive.start();
			boolean clientIslogin = true;
			while(clientIslogin) {
	
				String theOhterClientString;				//记录当前客户端想要与其通信的另一个客户端名称
				theOhterClientString = sin.readLine();
				
				if(theOhterClientString.equals("exit")) {
					break;
				}
				
				
				System.out.println(theOhterClientString);										//获取想要与之聊天的用户的Account的json编码字符串
				theOtherAccount = (new Gson()).fromJson(theOhterClientString, Account.class);	//由json字符串创建出对方的实例
				System.out.println(theOtherAccount.getId() + " " + theOtherAccount.getName());	//显示对方的id和名字
				
				
//				theOhterClientString = (new Gson()).toJson(new Message(account.getId().toString(), account.getName(), theOtherAccount.getId(), theOtherAccount.getName(), "Link the other client"));
				System.out.println("send the other client json: " + theOhterClientString);
				
//				os.println(theOhterClientString);				//向服务器请求与之通信的另一客户端，请求的形式另一个客户端Account的json
//				os.flush();
				
				//同上使用UTF发送字符串
				dos.writeUTF(theOhterClientString);												//向服务器请求与之通信的另一客户端，请求的形式另一个客户端Account的json
				dos.flush();
				
				
				sendMessageThread send = new sendMessageThread(socket);		//建立一个发送消息的线程，用于向另一个客户端发送消息
				send.start();
	
				
				Thread mainThread = Thread.currentThread();					//利用这个发送消息线程的flag使main线程暂停执行，即保证在通信的这段时间里一直为接发消息
				while(send.getFlag()) {
					mainThread.yield();
				}
	
				System.out.println("You have stopped communiating the other person");
			}
			
			//当前用户下线
			recive.stopThisThread();		//停止接收消息
			os.close();						//关闭各种流
			sin.close();
			is.close();
			dos.close();
	//		System.out.println(23333);
			socket.close();					//关闭套接字
			
			
		}catch(Exception e) {
			System.out.println("Error in TalkClient: "+e); //出错，则打印出错信息
	    }
	}
}