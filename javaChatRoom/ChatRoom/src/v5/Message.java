package v5;

import java.util.Date;
import com.google.gson.Gson;



    /**
    * @ClassName: Message
    * @Description: TODO 报文类，对于任何一条报文，有两种形式，一种是普通的消息"message"，一种是"file"，前者会存储消息的原文，后者会存储文件的一个数据块；每一条报文都包含发送者、接收者的信息以及发送的时间等信息
    * @author 31415926535x
	* @mail 2509437152wx@gmail.com
    * @date 2019年6月8日下午4:41:24
    *
    */
    
public class Message {
	private String type = "message";			//报文的类型，"message"表示一般的消息类型，"file"表示文件传输的一个数据块
	private String fromAccountId = "000";		//发送者的ID
	private String fromAccountName = null;		//发送者的昵称
	private String toAccountId = "000";			//接收者的ID
	private String toAccountName = null;		//接收者的昵称
	private String message = "";				//消息报文的数据，即发送的消息内容
	private Date date = null;					//发送时的时间信息
	
	private String fileName = null;				//文件名
	private int size = 512;						//当前报文中包含的文件数据量
	private long nowLength = 0;					//当前文件已经传输的大小
	private long totalLength = 0;				//当前文件的原始大小
	private boolean flag = false;				//当前文件是否传送完毕
	private String data = null;					//当前文件的一个传输数据块
		    
	
	    /**
	     * 创建一个新的实例 Message.
	     *
	     * @param fromAccountId		消息的发送者的ID
	     * @param fromAccountName	消息的发送者的昵称
	     * @param toAccountId		消息的接收者的ID
	     * @param toAccountName		消息的接收者的昵称
	     * @param message			消息的内容
	     */
	    
	public Message(String fromAccountId, String fromAccountName, String toAccountId, String toAccountName, String message) {
		this.type = "message";
		this.fromAccountId = fromAccountId;
		this.fromAccountName = fromAccountName;
		this.toAccountId = toAccountId;
		this.toAccountName = toAccountName;
		this.message = message;
		this.date = new Date();
	}
	
	    /**
	     * 创建一个仅为文件的报文，在对文件用byte[]取出数据后，要将其编码转换成ISO-8859-1的字符串，这样才能拼接到文件末尾，保证传输的文件的完整
	     * 具体的流程如下：
	     * buffer 是从文件中获取的一个带传送的数据块
	     * (new String(buffer, "ISO-8859-1)即可以单字节的形式转换成字符串
	     * 然后和message组合编码为UTF型的报文
	     * 接收方通过UTF形式获取报文后，可以通过获取"data"字段的字符串并转换成“ISO-8859-1"的byte[]后拼接到文件末即可
	     * eg: wf.write(jsonObject.get("data").getAsString().getBytes("ISO-8859-1"), 0, n);
	     *
	     * @param fromAccountId			发送者的ID
	     * @param toAccountId			接收者的ID
	     * @param fileName				传输的文件名
	     * @param bufferSize			传输的缓冲区
	     * @param nowLength				传输的当前大小
	     * @param totalLength			文件的总大小
	     * @param data					传输的文件的数据块
	     */
	    
	public Message(String fromAccountId, String fromAccountName, String toAccountId, String toAccountName, Date date, String fileName, int size, long nowLength, long totalLength, String data) {
		// TODO Auto-generated constructor stub
		this(fromAccountId, fromAccountName, toAccountId, toAccountName, "");		//构造器调用另一个重载的构造器必须在第一行
		this.date = date;
		this.type = "file";
		
		this.fileName = fileName;
		this.size = size;
		this.nowLength = nowLength;
		this.totalLength = totalLength;
		this.data = data;
		
		if(nowLength < totalLength) {
			flag = false;
		}
		else {
			flag = true;
		}
	}
	

		/**
	    * @Title: getJsonOfMessage
	    * @Description: TODO 获取一个message类的json字符串，默认为UTF-8编码
	    * @param @return    参数
	    * @return String    返回类型
	    * @throws
	    */
	    
	public String getJsonOfMessage() {
		return (new Gson()).toJson(this);
	}
}
