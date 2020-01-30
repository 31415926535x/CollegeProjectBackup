package v6;


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

import javafx.application.Application;
import javafx.beans.value.ObservableValue;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXMLLoader;
import javafx.stage.Stage;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.control.ListCell;
import javafx.scene.control.ListView;
import javafx.scene.layout.Priority;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.Font;




public class TalkClient extends Application {
	public static Account account;							//为了接收消息线程能够获取到当前用户的id
	public static Account theOtherAccount;
	public static Socket socket = null;
	public reciveMessageThread recive = null;

	
	
	/********** javafx ****************/


	
	@Override
	public void start(Stage primaryStage) {
		
		initTalkClient();
		System.out.println("initTalkClient run...");
		try {
			//读取fxml文件
            Parent root = FXMLLoader.load(getClass().getResource("/v6/clientScene.fxml"));

            //窗口的标题
            primaryStage.setTitle("TalkClient");
            
            //主窗口加载的场景，场景里面的描述文件
            primaryStage.setScene(new Scene(root));
            
            primaryStage.setResizable(false);
            
            
            //最后就是show time
            primaryStage.show();
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	
	public boolean initTalkClient() {
		
		//TODO: 要实现用户可以自己创建一个用户，也就是说是一个登陆界面
		//得到一个随机的用户
		account = getRandomAccountForTest.getARandomAccountForTest();
		account.show();
		
		try {
			
			socket = new Socket("127.0.0.1", 4700);
			
			
			System.out.println((new Message(account.getId().toString(), account.getName(), "", "", "Send own account's id").getJsonOfMessage()));

			DataOutputStream dos = new DataOutputStream(socket.getOutputStream());
			//因为所有的字符串都规定以UTF来编码发送操作，所以此处用writeUTF()
			dos.writeUTF(account.conventAccountToString());				//像服务器传递自己的账户信息，记录到在线列表数据库
			dos.flush();
		
			//创建收发消息两个线程，实现收发消息的任意性
			recive = new reciveMessageThread(socket);
			recive.start();
			
			BufferedReader sin = new BufferedReader(new InputStreamReader(System.in));
			String theOhterClientString = sin.readLine();
			
			System.out.println(theOhterClientString);										//获取想要与之聊天的用户的Account的json编码字符串
			theOtherAccount = (new Gson()).fromJson(theOhterClientString, Account.class);	//由json字符串创建出对方的实例
			System.out.println(theOtherAccount.getId() + " " + theOtherAccount.getName());	//显示对方的id和名字
			
			
//			theOhterClientString = (new Gson()).toJson(new Message(account.getId().toString(), account.getName(), theOtherAccount.getId(), theOtherAccount.getName(), "Link the other client"));
			System.out.println("send the other client json: " + theOhterClientString);
			
//			os.println(theOhterClientString);				//向服务器请求与之通信的另一客户端，请求的形式另一个客户端Account的json
//			os.flush();
			
			//同上使用UTF发送字符串
			dos.writeUTF(theOhterClientString);												//向服务器请求与之通信的另一客户端，请求的形式另一个客户端Account的json
			dos.flush();
			
			//得到一个字符串，表示用户要联系的人的json或者是exit信息
			//.......
			//当用户点击左侧某一个人时，退出当前的会话，并向服务器请求与另一个人通信
			
			//发送要联系的人的json
			//.......
			
			return true;
			
		}	
		catch (Exception e) {
			// TODO: handle exception
			System.out.println("Error in TalkClient's init: " + e);
			recive.stopThisThread();
			
			return false;
		}
	}

	public static void main(String args[]) {
		launch(args);
	}
	
	
	
	
	public static void oldmain(String args[]) {
//		account = new getRandomAccountForTest().getARandomAccountForTest();
		account = getRandomAccountForTest.getARandomAccountForTest();
		account.show();
		
		
		
		launch(args);
		
		
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