package v4;

import java.io.*;
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
    
public class fileSystemOperation {

	

	    
	
	    /**
	    * @Title: mkdir_
	    * @Description: TODO 为每一个正在运行的当前用户创建一个自己的文件夹，路径为 全局路径+id
	    * @param @param fileNameString 要创建的文件夹名
	    * @param @param userOrServer 创建在用户端还是服务器端，true为在用户端，否者在服务器端
	    * @param @return    参数
	    * @return boolean    返回类型
	    * @throws
	    */
	    
	public static boolean mkdir_(String fileNameString, boolean userOrServer) {
		if(userOrServer) {
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
	
	
	public static void transfer(File f1,File f2) throws IOException 
    {                                      //创建文件输入流对象
        FileInputStream  rf = new FileInputStream(f1);
        FileOutputStream  wf = new FileOutputStream(f2);
                                           //创建文件输出流对象
        int count,n=512;
        byte buffer[] = new byte[n];
        count = rf.read(buffer,0,n);       //读取输入流
        while (count != -1)
        {
            wf.write(buffer,0,count);      //写入输出流
            count = rf.read(buffer,0,n);   //继续从文件中读取数据到缓冲区
        }
        System.out.println("CopyFile  "+f2.getName()+" !");
        rf.close();                        //关闭输入流
        wf.close();                        //关闭输出流
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
