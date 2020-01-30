package DatabaseOperation;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ResourceBundle;


    /**
    * @ClassName: DatabaseOperations
    * @Description: TODO 数据库的基本操作
    * @author 31415926535x
    * @date 2019年10月10日
    *
    */
    
public class DatabaseOperations {
	private static String user;
	private static String pwd;
	public static String className;
	public static String url;
	
	Connection con = null;
	PreparedStatement pstm = null;
	ResultSet ret = null;
	
	static {
		// 加载配置文件，利用bundle
		ResourceBundle bundle = ResourceBundle.getBundle("jdbc");
		user = bundle.getString("jdbc.username");
		pwd = bundle.getString("jdbc.password");
		className = bundle.getString("jdbc.driverClassName");
		url = bundle.getString("jdbc.url");
		
		
//		// 加载配置文件，利用properties对象
//		InputStream is = initDatabase.class.getClassLoader().getResourceAsStream("jdbc.proprties");
//		Properties props = new Properties();
//		try {
//			props.load(is);
//			
//			className = props.getProperty("jdbc.className");
//			url = props.getProperty("jdbc.url");
//			user = props.getProperty("jdbc.user");
//			pwd = props.getProperty("jdbc.password");
//		} catch (IOException e) {
//			// TODO: handle exception
//			e.printStackTrace();
//		}
	}
	
	
	    /**
	    * @Title: getConnection
	    * @Description: TODO 链接数据库
	    * @param @return    参数
	    * @return Connection    返回类型
	    * @throws
	    */
	    
	public Connection getConnection() {
		try {
			con = (Connection) DriverManager.getConnection(url, user, pwd);
		} catch (SQLException e) {
			// TODO: handle exception
			con = null;
			e.printStackTrace();
		}
		return con;
	}
	
	
	
	    /**
	    * @Title: executeQuery
	    * @Description: TODO sql's query
	    * @param @param sql
	    * @param @param obj
	    * @param @return    参数
	    * @return ResultSet    返回类型
	    * @throws
	    */
	    
	public ResultSet executeQuery(String sql, Object[] obj) {
		if(sql != null) {
			con = getConnection();
			if(con != null) {
				try {
					pstm = (PreparedStatement) con.prepareStatement(sql);
					if(obj != null) {
						for(int i = 0; i < obj.length; ++i) {
							pstm.setObject(i + 1, obj[i]);
						}
					}
					ret = pstm.executeQuery();
				} catch (SQLException e) {
					// TODO: handle exception
					e.printStackTrace();
				}
			}
		}
		return ret;
	}
	
	
	    /**
	    * @Title: executeUpdate
	    * @Description: TODO sql's update
	    * @param @param sql
	    * @param @param obj
	    * @param @return    参数
	    * @return int    返回类型
	    * @throws
	    */
	    
	public int executeUpdate(String sql, Object[] obj) {
		int flag = -1;
		if(sql != null && obj != null) {
			con = getConnection();
			if(con != null) {
				try {
					pstm = (PreparedStatement) con.prepareStatement(sql);
					for(int i = 0; i < obj.length; ++i) {
						pstm.setObject(i + 1, obj[i]);
					}
					flag = pstm.executeUpdate();
				} catch (SQLException e) {
					// TODO: handle exception
					e.printStackTrace();
				}
			}
		}
		return flag;
	}
	
	public int executeInsert(String sql) {
		int flag = -1;
		if(sql != null) {
			con = getConnection();
			if(con != null) {
				try {
					Statement stmt = con.createStatement();
					flag = stmt.executeUpdate(sql);
					
				} catch (SQLException e) {
					// TODO: handle exception
					e.printStackTrace();
				}
			}
		}
		return flag;
	}
	
	
	    /**
	    * @Title: queryAll
	    * @Description: TODO sql's queryall
	    * @param @param sql
	    * @param @return    参数
	    * @return ResultSet    返回类型
	    * @throws
	    */
	    
	public ResultSet queryAll(String sql) {
        con = getConnection();
        if(con != null){
            try {
                pstm = (PreparedStatement) con.prepareStatement(sql);
                ret = pstm.executeQuery();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
	    return ret;
	}
	
	
	public void closeAll() {
	    // TODO Auto-generated method stub
	    if (ret != null) {
	        try {
	            ret.close();
	        } catch (SQLException e) {
	            // TODO Auto-generated catch block
	            e.printStackTrace();
	        }
	    }
	    if (pstm != null) {
	        try {
	            pstm.close();
	        } catch (SQLException e) {
	            // TODO Auto-generated catch block
	            e.printStackTrace();
	        }
	        
	    }
	    if (con != null) {
	        try {
	            con.close();
	        } catch (SQLException e) {
	            // TODO Auto-generated catch block
	            e.printStackTrace();
	        }
	    }
	}
	
	
	    /**
	    * @Title: createTable
	    * @Description: TODO new table
	    * @param @param sql
	    * @param @return    参数
	    * @return boolean    返回类型
	    * @throws
	    */
	    
	public boolean createTable(String sql) {
		con = getConnection();
		if(con != null && sql != null) {
			try {
				pstm = (PreparedStatement)con.prepareStatement(sql);
				return pstm.execute(sql);
			} catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
				return false;
			}
		}
		return false;
	}
}
