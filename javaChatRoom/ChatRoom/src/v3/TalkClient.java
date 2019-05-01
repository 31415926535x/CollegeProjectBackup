
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
			BufferedReader sin=new BufferedReader(new InputStreamReader(System.in));
			//由Socket对象得到输出流，并构造PrintWriter对象
			PrintWriter os=new PrintWriter(socket.getOutputStream());
			//由Socket对象得到输入流，并构造相应的BufferedReader对象
			BufferedReader is=new BufferedReader(new InputStreamReader(socket.getInputStream()));
			
			
			os.println(account.conventAccountToString());	//像服务器传递自己的账户信息，记录到在线列表数据库
			os.flush();
			
			System.out.println("Server: " + is.readLine());	//输出登陆成功提示信息
			
			System.out.println("Server: " + is.readLine());	//输出想要与之通信的客户端的提示信息
			
			String theOhterClientString;					//记录当前客户端想要与其通信的另一个客户端名称
			theOhterClientString = sin.readLine();
			
			os.println(theOhterClientString);				//向服务器请求与之通信的另一客户端
			os.flush();
			
			
			String readline;
			readline=sin.readLine(); //从系统标准输入读入一字符串
			while(!readline.equals("bye")){//若从标准输入读入的字符串为 "bye"则停止循环
				//将从系统标准输入读入的字符串输出到Server
				os.println(readline);
				os.flush();//刷新输出流，使Server马上收到该字符串
				//在系统标准输出上打印读入的字符串
				System.out.println("Client: " + readline);
				//从Server读入一字符串，并打印到标准输出上
				System.out.println("Server: " + is.readLine());				
				readline=sin.readLine(); //从系统标准输入读入一字符串
			} //继续循环
			os.close(); //关闭Socket输出流
			is.close(); //关闭Socket输入流
			socket.close(); //关闭Socket
		}catch(Exception e) {
			System.out.println("Error"+e); //出错，则打印出错信息
	    }
	}
}