package v6;

import java.io.DataOutputStream;
import java.net.Socket;

public class communication {
	
	
	    /**
	    * @Title: sendMessage
	    * @Description: TODO 基本的用户端的发送消息类，仅负责消息的发送
	    * @param @param sendMessage
	    * @param @param socket
	    * @param @param accountA
	    * @param @param accountB
	    * @param @return    参数
	    * @return boolean    返回类型
	    * @throws
	    */
	    
	public boolean sendMessage(String sendMessage, Socket socket, Account accountA, Account accountB) {
		
		try {
			
			DataOutputStream dos = new DataOutputStream(socket.getOutputStream());
			//将用户输入的消息内容转换成报文，并使用UTF编码的报文传输
			dos.writeUTF((new Message(accountA.getId(), accountA.getName(), accountB.getId(), accountB.getName(), (new String(sendMessage.getBytes("UTF-8"), "UTF-8")))).getJsonOfMessage());
			dos.flush();
			
			
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("Error in sendMessage: " + e);
			
			return false;
		}
				
		return true;
	}
	
	public boolean sendChatWithOtherAccountId(Account theOtherAccount, Socket socket) {
		try {
			DataOutputStream dos = new DataOutputStream(socket.getOutputStream());
			dos.writeUTF(theOtherAccount.conventAccountToString());
			return true;
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("Error in sendChatWithOtherAccountId: " + e);
			return false;
		}
	}
	
}
