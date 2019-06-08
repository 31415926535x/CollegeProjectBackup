package v4;

/**
* @ClassName: MultiTalkServer
* @Description: TODO(这里用一句话描述这个类的作用)
* @author 31415926535x
* @date 2019-05-01上午11:17:07
*
*/

import java.io.*;
import java.net.*;
import java.util.HashMap;
import java.util.Set;

import com.sun.javafx.collections.MappingChange.Map;
public class MultiTalkServer{
static int clientnum=0; //静态成员变量，记录当前客户的个数
static HashMap<Account, Socket> databaseMap = new HashMap<Account, Socket>();


    /**
    * @Title: putAccountIntoDB
    * @Description: TODO 将一个账户以及它当前的套接字作为键值保存到 hashMap 中
    * @param @param accountString	账户信息（用字符串表示）
    * @param @param socket    参数	套接字对象
    * @return void    返回类型
    * @throws
    */
    
public static void putAccountIntoDB(String accountString, Socket socket) {
	databaseMap.put(Account.conventStringToAccount(accountString), socket);		//将当前用户的账户的信息和他的套接字对应保存
}


    /**
    * @Title: getSocket
    * @Description: TODO 寻找到一个账户对象的套接字
    * @param @param theOtherClientString	账户字符串表示
    * @param @return    参数
    * @return Socket    返回类型
    * @throws
    */
    
public static Socket getSocket(String theOtherClientString) {
	return databaseMap.get(Account.conventStringToAccount(theOtherClientString));
}

    /**
    * @Title: getAccount
    * @Description: TODO 寻找一个socket对应的当前用户
    * @param @param theOtherClientSocket
    * @param @return    参数
    * @return Account    返回类型
    * @throws
    */
    
public static Account getAccount(Socket theOtherClientSocket) {
	Set<Account> st = databaseMap.keySet();				//获取当前数据库所有的线上用户
	System.out.println(st.size());
	for(Account account: st) {							//如果该用户的套接字等于待查找的用户的套接字，返回这个用户
		if(databaseMap.get(account).equals(theOtherClientSocket)) {
			return account;
		}
	}
	return null;
}


public static void main(String args[]) throws IOException {
	
	//创建服务器端的数据缓冲文件夹
	fileSystemOperation.mkdir_("", false);
	
	ServerSocket serverSocket=null;
	boolean listening=true;
	try{
		//创建一个ServerSocket在端口4700监听客户请求
		serverSocket=new ServerSocket(4700); 			
	}catch(IOException e) {
		System.out.println("Could not listen on port:4700.");
		//出错，打印出错信息
		System.exit(-1); //退出
	}
	
	while(listening){ //循环监听
	  //监听到客户请求，根据得到的Socket对象和客户计数创建服务线程，并启动之
	  new ServerThread(serverSocket.accept(),clientnum).start();
	  clientnum++; //增加客户计数
	}
	serverSocket.close(); //关闭ServerSocket
}
}
