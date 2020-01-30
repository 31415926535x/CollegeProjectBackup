package v6;

public class serverGlobalSettingsInfos {
	private static String serverDirString = "G:\\Backup\\CollegeProjectBackup\\javaChatRoom\\ChatRoom\\src\\v6\\serverData\\";
	private static int serverBufferSize = 2048;
	private static String encoding = "UTF8";
	    /**
	    * @Title: setServerDirString
	    * @Description: TODO 修改服务器默认的文件存储文件的绝对路径
	    * @param @param userDir    参数
	    * @return void    返回类型
	    * @throws
	    */
	    
	public static void setServerDirString(String userDir) {
		serverDirString = userDir;
	}
	
	
	    /**
	    * @Title: getServerDirString
	    * @Description: TODO 获取服务器的存储文件的绝对路径
	    * @param @return    参数
	    * @return String    返回类型
	    * @throws
	    */
	    
	public static String getServerDirString() {
		return serverDirString;
	}
	
	    /**
	    * @Title: setServerBufferSize
	    * @Description: TODO 设置传输文件的缓冲区的大小
	    * @param @param BufferSize    参数
	    * @return void    返回类型
	    * @throws
	    */
	    
	public static void setServerBufferSize(int BufferSize) {
		serverBufferSize = BufferSize;
	}
	
	    /**
	    * @Title: getServerBufferSize
	    * @Description: TODO 设置文件传输的文件缓冲区的大小，默认为2048
	    * @param @return    参数
	    * @return int    返回类型
	    * @throws
	    */
	    
	public static int getServerBufferSize() {
		return serverBufferSize;
	}
	
	    /**
	    * @Title: getEncoding
	    * @Description: TODO 获取服务器端的字符串的编码
	    * @param @return    参数
	    * @return String    返回类型
	    * @throws
	    */
	    
	public static String getEncoding() {
		return encoding;
	}
}

