package v6;

import java.io.*;
import java.net.Socket;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
    * @ClassName: fileSystemOperation
    * @Description: TODO 整个聊天室系统的文件处理操作
    * @author 31415926535x
	* @mail 2509437152wx@gmail.com
    * @date 2019年5月14日下午8:27:48
    *
    */
    
public class fileSystemOperation extends Thread{

	

	    
	
	    /**
	    * @Title: mkdir_
	    * @Description: TODO 为每一个正在运行的当前用户创建一个自己的文件夹，路径为 全局路径+id
	    * @param @param fileNameString 要创建的文件夹名
	    * @param @param userOrServer 创建在用户端还是服务器端，true为在用户端，否者在服务器端
	    * @param @return    参数
	    * @return boolean    返回类型
	    * @throws
	    */
	    
	public static boolean mkdir_(String fileNameString, int type) {
		if(type == 0) {
			return true;
		}
		if(type == 1) {
			fileNameString = userGlobalSettingsInfos.getUserDirString() + fileNameString;
		}
		else {
			fileNameString = serverGlobalSettingsInfos.getServerDirString() + fileNameString;
		}
		File dirFile = new File(fileNameString);
		if(!dirFile.exists()) {
			boolean flag = dirFile.mkdirs();
			if(flag) {
				System.out.println(fileNameString + ": has been mkdir!");
			}
			else {
				System.out.println(fileNameString + ": can't be mkdired!");
			}
			try {
				getInfo(dirFile);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return true;
		}
		else {
			System.out.println(fileNameString + ": has been existed! No need to mkdir it again");
			return false;
		}
	}
	
	
	    /**
	    * @Title: getInfo
	    * @Description: TODO 显示给定给定路径下文件的信息
	    * @param @param f1
	    * @param @throws IOException    参数
	    * @return void    返回类型
	    * @throws
	    */
	    
	public static void getInfo(File f1) throws IOException {
        SimpleDateFormat sdf;
        sdf= new SimpleDateFormat("yyyy年MM月dd日hh时mm分");
        if (f1.isFile())
            System.out.println("<File>\t"+f1.getAbsolutePath()+"\t"+
              f1.length()+"\t"+sdf.format(new Date(f1.lastModified())));
        else
        {
            System.out.println("<Dir>\t"+f1.getAbsolutePath());
            File[] files = f1.listFiles();
            for (int i=0;i<files.length;i++)
                getInfo(files[i]);
        }
    }
}
