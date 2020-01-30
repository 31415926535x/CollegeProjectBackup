package v6;

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
private Socket socket1 = null; 		//保存与本线程相关的主客户端Socket对象
private Socket socket2 = null; 		//保存主客户端与之通信的客户端的Socket对象
private Account accountA;
private Account accountB;
int clientnum; 				//保存本进程的客户计数
public ServerThread(Socket socket,int num) { //构造函数
     this.socket1 = socket; 	//初始化socket变量
	 clientnum = num+1; 		//初始化clientnum变量
}
public void run() { //线程主体
    try{
		//由客户端1的Socket对象得到输入流，并构造相应的BufferedReader对象
//		BufferedReader is1= new BufferedReader(new InputStreamReader(socket1.getInputStream()));
		//由客户端1Socket对象得到输出流，并构造PrintWriter对象
//		PrintWriter os1 = new PrintWriter(socket1.getOutputStream());
		
		DataOutputStream dos = new DataOutputStream(socket1.getOutputStream());
		DataInputStream dis = new DataInputStream(socket1.getInputStream());
		
//		String accountString = is1.readLine();						//读入当前客户端的信息
		String accountString;
//		byte[] accountByte = new byte[4096];
//		int count = dis.read(accountByte);
		accountString = dis.readUTF();
//		accountString = new String(accountByte, "UTF8");
		System.out.println(accountString);
		accountA = Account.conventStringToAccount(accountString);
		MultiTalkServer.putAccountIntoDB(accountA, socket1);	//保存信息到上线数据库
		
		//向每一个用户发送当前上线的所有用户的信息列表
		String message = (new accountMessage(MultiTalkServer.accounts)).getAccountMessageJson();
		for(Socket socket : MultiTalkServer.sockets) {
			DataOutputStream tmpdos = new DataOutputStream(socket.getOutputStream());
			tmpdos.writeUTF(message);
			tmpdos.flush();
		}
		
//		os1.println((new Message("", "Server", accountA.getId(), accountA.getName(), "You logged in!")).getJsonOfMessage());
////		os1.println("Server: You logged in!");						//提醒用户连接成功，上线
//		os1.flush();
		
//		dos.writeUTF((new Message("", "Server", accountA.getId(), accountA.getName(), "You logged in!")).getJsonOfMessage());
//		dos.flush();
//		dos.write((new Message("", "Server", accountA.getId(), accountA.getName(), "You logged in!")).getJsonOfMessage().getBytes("UTF8"));
		dos.writeUTF((new Message("", "Server", accountA.getId(), accountA.getName(), "You logged in!")).getJsonOfMessage());
		dos.flush();
		
		boolean clientIsLogin = true;
		while(clientIsLogin) {

/*
 *	以下为各种尝试 
//			os1.println("\n\t\t\t<Tips>: \n\nServer: Input the id that you wanna talk to..\nOr \"exit\" if you wanna to exit");
//			os1.println((new Message("", "Server", accountA.getId(), accountA.getName(), "\n\t\t\t<Tips>: \n\nServer: Input the id that you wanna talk to..\nOr \"exit\" if you wanna to exit")).getJsonOfMessage());
//			os1.flush();
			
//			dos.writeUTF((new Message("", "Server", accountA.getId(), accountA.getName(), "\n\t\t\t<Tips>: \n\nServer: Input the id that you wanna talk to..\nOr \"exit\" if you wanna to exit")).getJsonOfMessage());;
//			dos.flush();
//			dos.write((new Message("", "Server", accountA.getId(), accountA.getName(), "\n\t\t\t<Tips>: \n\nServer: Input the id that you wanna talk to..\nOr \"exit\" if you wanna to exit")).getJsonOfMessage().getBytes("UTF8"));
*/
			//提示用户输入要与之通信对方的昵称和id
			dos.writeUTF((new Message("", "Server", accountA.getId(), accountA.getName(), "\n\t\t\t<Tips>: \n\nServer: Input the id that you wanna talk to..\nOr \"exit\" if you wanna to exit")).getJsonOfMessage());
			dos.flush();
			

//			String theOtherClientString = is1.readLine();
//			String theOtherClientString = dis.readUTF();
//			byte[] theOtherClientByte = accountByte;
//			dis.read(theOtherClientByte);
			
			
			//获取另一个客户端的json，或者是退出信息exit
			String theOtherClientString = dis.readUTF();
//			String theOtherClientString = new String(theOtherClientByte, "UTF8");
			System.out.println("the other client's json is: " + theOtherClientString);
//			if(((JsonObject)new JsonParser().parse(theOtherClientString)).get("message").getAsString().equals("exit")) {
//				break;
//			}
			//当用户选择离开时终止所有相关操作
			if(theOtherClientString.equals("exit")) {
				break;
			}
			
			accountB = Account.conventStringToAccount(theOtherClientString);
			
			//根据昵称获取对方的套接字
			socket2 = MultiTalkServer.getSocket(accountB);
			
			//服务器与对方建立一个发消息的线程，用于将从用户收到的消息内容转发到另一用户
			sendAndReciveOfServerThread clientASendMessageToClientB = new sendAndReciveOfServerThread(socket1, socket2, accountA, accountB);
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

