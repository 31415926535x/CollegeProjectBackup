package v5;


import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.net.Socket;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

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
	private Account accountA;
	private Account accountB;
	
	private volatile Thread blinker;
	private boolean flag = true;


	/**
	* @Title: sendAndReciveOfServerThread
	* @Description: TODO 构造方法，记录下客户端A与B的套接字
	* @param @param clientASocket	A的套接字
	* @param @param clientBSocket   B的套接字
	* @throws
	*/
	    
	public sendAndReciveOfServerThread(Socket clientASocket, Socket clientBSocket, Account accountA, Account accountB) {
		// TODO Auto-generated constructor stub
		this.clientASocket = clientASocket;
		this.clientBSocket = clientBSocket;
		this.accountA = accountA;
		this.accountB = accountB;
		
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
	    * @Description: TODO 实现服务器从客户端A处接收消息并转发到客户端B的功能，以客户端A为主体，其通信可看作 A->服务器->B 以及 B->服务器->A 两个反向的通信，所以服务器端开两个线程就可以了
	    * @param     参数
	    */
	    
	public void run() {
		@SuppressWarnings("static-access")
		Thread thisThread = this.currentThread();
		
		try {
			
//			BufferedReader is1 = new BufferedReader(new InputStreamReader(clientASocket.getInputStream()));		//接收客户端A处的消息
//			PrintWriter os2 = new PrintWriter(clientBSocket.getOutputStream());									//将接收的消息转发到B
			
			DataInputStream dis = new DataInputStream(clientASocket.getInputStream());
			DataOutputStream dos = new DataOutputStream(clientBSocket.getOutputStream());
			
			
//			BufferedReader is2 = new BufferedReader(new InputStreamReader(clientBSocket.getInputStream()));
//			PrintWriter os1 = new PrintWriter(clientASocket.getOutputStream());
			
			String readlineString;
			while(blinker == thisThread) {
				
//				readlineString = is1.readLine();
//				readlineString = dis.readUTF();
//				byte[] readlineByte = new byte[4096];
//				dis.read(readlineByte);
				
				
				//使用UTF编码的形式获取一条报文信息
				readlineString = dis.readUTF();
//				System.out.println(readlineString);
				
//				readlineString = new String(readlineByte, "UTF8");
				
				
				//将字符串形式的报文转换成json类型的实例对象，用于之后的不同key的value获取
				JsonObject jsonObject = (JsonObject) new JsonParser().parse(readlineString);
				
				
				//当当前报文是普通的消息时
				if(jsonObject.get("type").getAsString().equals("message")) {
					
//					dos.writeUTF(readlineString);
//					dos.flush();
//					dos.write(readlineByte);
					
					
					//将这条报文发送到另一个客户端
					dos.writeUTF(readlineString);
					dos.flush();
					
					
//					os2.println(readlineString);
//					os2.flush();
					
					//服务器端显示通信的记录，此处可以将记录保存到数据库
					System.out.println(jsonObject.get("date").getAsString() + " " + jsonObject.get("fromAccountId").getAsString() + "said to " + jsonObject.get("toAccountId").getAsString() + ": " + jsonObject.get("message").getAsString());
					
					//当发现一个用户不再和另一个用户聊天时，断开这一个线程
					if(jsonObject.get("message").getAsString().equals("bye")) {
						System.out.println("stop send and recive thread");
						stopThisThread();
						break;
					}
				}
				else {	//当当前报文是文件传输的报文时
					
					//创建一个在服务器端下的文件，暂存文件
					File file = new File(serverGlobalSettingsInfos.getServerDirString() + accountA.getId() + "\\" + jsonObject.get("fileName").getAsString());
					//打印文件的绝对路径
					System.out.println(serverGlobalSettingsInfos.getServerDirString() + accountA.getId() + "\\" + jsonObject.get("fileName").getAsString());
					//创建一个文件的输出流，true表示写入的方式是在文件末追加数据
					FileOutputStream wf = new FileOutputStream(file, true);
					//由报文获取到当前报文中传输的文件数据的大小，用于之后文件的写入的大小
					int n = jsonObject.get("size").getAsInt();
					
					
					System.out.println(n);
//					System.out.println("data size: " + jsonObject.get("data").getAsString().getBytes("unicode").length);
//					System.out.println("data: " + jsonObject.get("data").getAsString());
//					wf.write(jsonObject.get("data").getAsString().getBytes(serverGlobalSettingsInfos.getEncoding()), 0, n);
//					wf.write(jsonObject.get("data").getAsString().getBytes(), 0, n);
					
					
					//将报文中的数据转码为ISO-8859-1的字节数组，然后写入文件
					wf.write(jsonObject.get("data").getAsString().getBytes("ISO-8859-1"), 0, n);
					wf.flush();
					wf.close();
					System.out.println("now has recived: " + jsonObject.get("nowLength").getAsLong() + " " + jsonObject.get("nowLength").getAsLong() * 100 / jsonObject.get("totalLength").getAsLong());
					
					//如果服务器端已经接收到了全部的文件，开启一个由服务器端传送到另一个客户端文件的传输文件的线程
					if(jsonObject.get("flag").getAsBoolean()) {
						System.out.println("Parpering to send file to client b");
						(new fileTransferThread(accountA, accountB, clientBSocket, serverGlobalSettingsInfos.getServerDirString() + accountA.getId() + "\\" + jsonObject.get("fileName").getAsString())).start();
					}
				}
			}
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("Erroe in sendAndReciveThread: " + e);
		}	
	}
}

