package v5;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.net.Socket;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/**
    * @ClassName: reciveMessageThread
    * @Description: TODO 接收消息线程，与发送消息线程并行处理实现通信的任意性
    * @author 31415926535x
    * @date 2019-05-01下午2:10:02
    *
    */

public class reciveMessageThread extends Thread {
	Socket socket = null;
	private Thread blinker;
	    /**
	    * @Title: reciveMessageThread
	    * @Description: TODO 接收消息的操作线程
	    * @param @param messageString	消息内容
	    * @param @param socket    		等待接收消息一方的套接字（即服务器端的套接字，客户端等待服务器转发的消息）
	    * @throws
	    */
	    
	public reciveMessageThread(Socket socket) {
		// TODO Auto-generated constructor stub
		this.socket = socket;
	}
	
	public void start() {
		blinker = new Thread(this);
		blinker.start();
	}
	
	public void stopThisThread() {
		blinker = null;
	}
	
	public void run() {
		Thread thisThread = Thread.currentThread();
		
		try {
			//由Socket对象得到输入流，并构造相应的BufferedReader对象
			BufferedReader is = new BufferedReader(new InputStreamReader(socket.getInputStream()));
			
			DataInputStream dis = new DataInputStream(socket.getInputStream());
			String readlineString;
			
			while(blinker == thisThread) {
				
				//以UTF的形式获取一条报文
				readlineString = dis.readUTF();

				//创建一个jsonObject的对象，用于获取报文中的信息
				JsonObject jsonObject = (JsonObject) new JsonParser().parse(readlineString);
				
//				System.out.println(jsonObject.get("message").getAsString());
				
				//当当前报文是普通的消息时
				if(jsonObject.get("type").getAsString().equals("message")) {
					//本地显示对方发来的信息
					System.out.println(jsonObject.get("date").getAsString() + "\t" + jsonObject.get("fromAccountId").getAsString() + "-" + jsonObject.get("fromAccountName").getAsString() + " said: " + jsonObject.get("message").getAsString());
				}
				else {
					//当当前报文是一个文件传输的数据报文时
					//本地创建一个文件对象
					File file = new File(userGlobalSettingsInfos.getUserDirString() + TalkClient.account.getId() + "\\" + jsonObject.get("fileName").getAsString());
					//创建一个文件输出流
					FileOutputStream wf = new FileOutputStream(file, true);
					//获取当前数据块的大小
					int n = jsonObject.get("size").getAsInt();
					
					
//					wf.write(jsonObject.get("data").getAsString().getBytes(userGlobalSettingsInfos.getEncoding()), 0, n);
//					wf.write(jsonObject.get("data").getAsString().getBytes(), 0, n);
					
					//将数据块转码，获得byte[]类型的数据，写入文件
					wf.write(jsonObject.get("data").getAsString().getBytes("ISO-8859-1"), 0, n);
					wf.flush();
					wf.close();
					System.out.println("recive file");
				}
				
			}
			
			is.close();
			dis.close();
			
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("Error: " + e);
		}
	}
}
