package v6;

import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.net.Socket;
import java.util.Date;

public class fileTransferThread extends Thread {
	private Socket socket = null;		//当前传输线程的套接字
	private String fileName = null;		//文件名
	private long length = 0;			//文件的总大小
	private long nowLength = 0;			//当前传输的文件大小
	private Account accountA;			//客户端A（发送者）
	private Account accountB;			//客户端B（接收者）
	private Date date;					//发送时间
	private File file;					//操作的文件
	
	private int n = userGlobalSettingsInfos.getUserBufferSize();	//每一次发送的最大数据量，缓冲区大小
	private int count;					//此次获取的数据量大小
	private byte[] buffer = new byte[n];//缓冲区
	
	
	
	private volatile Thread blinker;
	
	
	
	    /**
	     * 创建一个新的实例 fileTransferThread.由客户端A将本地文件fileDir发送到客户端B（两次发送，每一个发送的套接字为socket）
	     *
	     * @param accountA		发送者
	     * @param accountB		接收者
	     * @param socket		此次发送的套接字
	     * @param fileDir		文件的绝对路径
	     */
	    
	public fileTransferThread(Account accountA, Account accountB, Socket socket, String fileDir) {
		// TODO Auto-generated constructor stub
		System.out.println("fileTransferThread constructoring: " + fileDir);
		this.accountA = accountA;
		this.accountB = accountB;
		this.socket = socket;
		this.date = new Date();
		this.file = new File(fileDir);
		this.length = this.file.length();
		System.out.println("The file's length is: " + length);
		this.fileName = fileDir.substring(fileDir.lastIndexOf("\\") + 1);		//由绝对路径获取文件名
//		this.fileName = this.fileName.substring(this.fileName.lastIndexOf("\\") + 1);
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
			
			DataOutputStream dos = new DataOutputStream(socket.getOutputStream());
//			PrintWriter os = new PrintWriter(socket.getOutputStream());
			FileInputStream rf = new FileInputStream(file);
			
			System.out.println("Now it is starting fileTransferThread");
			fileSystemOperation.getInfo(file);
			
			while(blinker == thisThread) {
				
				nowLength = 0;
				while(nowLength < length) {
					
					System.out.println("Now it is sending the file: " + fileName);
					
					//获取一个数据块
					count = rf.read(buffer, 0, n);
					nowLength += count;
					
//					os.println((new Message(accountA.getId(), accountA.getName(), accountB.getId(), accountB.getName(), date, fileName, count, nowLength, length, (new String(buffer, userGlobalSettingsInfos.getEncoding())))).getJsonOfMessage());
//					os.flush();
//					dos.writeUTF((new Message(accountA.getId(), accountA.getName(), accountB.getId(), accountB.getName(), date, fileName, count, nowLength, length, (new String(buffer, userGlobalSettingsInfos.getEncoding())))).getJsonOfMessage());
//					dos.flush();
					
					//先对数据块转化成单字节的字符串类型，然后以UTF编码的json报文串发送此次的数据块，接收者再转化成单字节的byte[]字节数组，即可追加到文件末
					dos.writeUTF((new Message(accountA.getId(), accountA.getName(), accountB.getId(), accountB.getName(), date, fileName, count, nowLength, length, (new String(buffer, "ISO-8859-1"))).getJsonOfMessage()));
					dos.flush();
				}
				System.out.println(fileName + " has sent");
				rf.close();	
				stopThisThread();
			}
			
			
			
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("Error in fileTransferThread: " + e);
		}
	}
}
