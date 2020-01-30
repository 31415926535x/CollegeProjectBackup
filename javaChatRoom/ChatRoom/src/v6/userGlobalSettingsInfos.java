package v6;


/**
* @ClassName: globalSettingsInfos
* @Description: TODO 聊天室的一些全局的配置信息
* @author 31415926535x
* @mail 2509437152wx@gmail.com
* @date 2019年5月14日下午8:43:29
*
*/

public class userGlobalSettingsInfos {
	private static String usersDirString = "G:\\Backup\\CollegeProjectBackup\\javaChatRoom\\ChatRoom\\src\\v6\\userData\\";
	private static int userBufferSize = 2048;
	private static String encoding = "UTF8";

    /**
    * @Title: setUserDirString
    * @Description: TODO 设置用户的文件存储绝对路经
    * @param @param userDir    参数
    * @return void    返回类型
    * @throws
    */
    
	public static void setUserDirString(String userDir) {
		usersDirString = userDir;
	}
	
	    /**
	    * @Title: getUserDirString
	    * @Description: TODO 获取用户文件存储的绝对路径
	    * @param @return    参数
	    * @return String    返回类型
	    * @throws
	    */
	    
	public static String getUserDirString() {
		return usersDirString;
	}
	
	    /**
	    * @Title: setUserBufferSize
	    * @Description: TODO 设置用户传输文件的缓冲区大小，默认为2048
	    * @param @param bufferSize    参数
	    * @return void    返回类型
	    * @throws
	    */
	    
	public static void setUserBufferSize(int bufferSize) {
		userBufferSize = bufferSize;
	}
	
	    /**
	    * @Title: getUserBufferSize
	    * @Description: TODO 获取文件传输的缓冲区大小
	    * @param     参数
	    * @return int    返回类型
	    * @throws
	    */
	    
	public static int getUserBufferSize() {
		return userBufferSize;
	}
	
	    /**
	    * @Title: getEncoding
	    * @Description: TODO 获取客户端的字符串的编码
	    * @param @return    参数
	    * @return String    返回类型
	    * @throws
	    */
	    
	public static String getEncoding() {
		return encoding;
	}
}
