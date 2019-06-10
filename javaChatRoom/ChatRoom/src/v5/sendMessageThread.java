package v5;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.Socket;

/**
    * @ClassName: sendMessageThread
    * @Description: TODO 发送消息线程，与接收消息线程并行处理实现通信的任意性
    * @author 31415926535x
    * @date 2019-05-01下午2:09:36
    *
    */

public class sendMessageThread extends Thread {
	Socket socket = null;
	private volatile Thread blinker;
	private boolean flag = true; 
	/**
	* @Title: sendMessageThread
	* @Description: TODO 构造方法，记录当前客户端与服务器通信的套接字（服务器的套接字）
	* @param     参数
	* @throws
	*/

	public sendMessageThread(Socket socket) {
		// TODO Auto-generated constructor stub
		this.socket = socket;
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
	    * @Description: TODO 线程 run() 方法主体，实现从客户端得到一段消息并发送到服务器的功能
	    * @param     参数
		* @return	
	    * @throws
	    */
	    
	public void run() {
		Thread thisThread = Thread.currentThread();

		try {
			
			//由系统标准输入设备构造BufferedReader对象
			BufferedReader sin = new BufferedReader(new InputStreamReader(System.in));
			//由Socket对象得到输出流，并构造PrintWriter对象
//			PrintWriter os = new PrintWriter(socket.getOutputStream());
			DataOutputStream dos = new DataOutputStream(socket.getOutputStream());
			
			String readlineString;
			
			while(blinker == thisThread) {
				
				System.out.print("You said: ");
				readlineString = sin.readLine();
				
				if(readlineString.equals("<File>")) {
					readlineString = sin.readLine();										//获取要传输的文件的绝对路径
					System.out.println("The file that will be sent is: " + readlineString);	//打印要传输的文件的绝对路径
					(new fileTransferThread(TalkClient.account, TalkClient.theOtherAccount, socket, readlineString)).start();	//开启一个文件传输的线程
				}
				else {
//					dos.writeUTF((new Message(TalkClient.account.getId(), TalkClient.account.getName(), TalkClient.theOtherAccount.getId(),TalkClient.theOtherAccount.getName(), readlineString)).getJsonOfMessage());
//					dos.flush();
//					dos.write((new Message(TalkClient.account.getId(), TalkClient.account.getName(), TalkClient.theOtherAccount.getId(),TalkClient.theOtherAccount.getName(), readlineString)).getJsonOfMessage().getBytes("UTF8"));
					
					//将用户输入的消息内容转换成报文，并使用UTF编码的报文传输
					dos.writeUTF((new Message(TalkClient.account.getId(), TalkClient.account.getName(), TalkClient.theOtherAccount.getId(),TalkClient.theOtherAccount.getName(), (new String(readlineString.getBytes("UTF-8"), "UTF-8")))).getJsonOfMessage());
					dos.flush();
					
					
//					os.println((new Message(TalkClient.account.getId(), TalkClient.account.getName(), TalkClient.theOtherAccount.getId(),TalkClient.theOtherAccount.getName(), readlineString)).getJsonOfMessage());
//					os.flush();
					
					//当用户退出当前的聊天时，结束当前的发送消息的线程
					if(readlineString.equals("bye")) {
						System.out.println("send Thread stop");
						stopThisThread();
						break;
					}
				}
			}
			System.out.println("send thread stopped");			
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("Error: --" + e);
		}
	}
}
