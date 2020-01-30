
    /**  
    * @Title: initDatabase.java
    * @Package InitDatabase
    * @Description: TODO
    * @author 31415926535x 
	* @email 2509437152wx@gamil.com
	* @blog cnblogs.com/31415926535x
    * @date 2019年9月24日
    * @version V1.0  
    */
    
package InitDatabase;

import java.io.File;
import java.io.FileInputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Random;
import java.util.ResourceBundle;
import java.util.Scanner;

/**
    * @ClassName: initDatabase
    * @Description: TODO 初始化两个数据库的表，两表的结构语义不同，同时生成随机数据
    * @author 31415926535x
    * @date 2019年9月24日
    *
    */

public class initDatabase {
	
	static int maxn = 2;
	private static String[] user = new String[maxn];
	private static String[] pwd = new String[maxn];
	public static String[] className = new String[maxn];
	public static String[] url = new String[maxn];
	
	Connection[] con = new Connection[maxn];
	PreparedStatement[] pstm = new PreparedStatement[maxn]; 
	ResultSet ret[] = new ResultSet[maxn];
	
	static {
		// 加载配置文件，利用bundle
		ResourceBundle[] bundle = new ResourceBundle[maxn];
		bundle[0] = ResourceBundle.getBundle("jdbc1");
		user[0] = bundle[0].getString("jdbc.username");
		pwd[0] = bundle[0].getString("jdbc.password");
		className[0] = bundle[0].getString("jdbc.driverClassName");
		url[0] = bundle[0].getString("jdbc.url");
		
		bundle[1] = ResourceBundle.getBundle("jdbc2");
		user[1] = bundle[1].getString("jdbc.username");
		pwd[1] = bundle[1].getString("jdbc.password");
		className[1] = bundle[1].getString("jdbc.driverClassName");
		url[1] = bundle[1].getString("jdbc.url");
		
		
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
	    
	public Connection getConnection(int i) {
		try {
			con[i] = (Connection) DriverManager.getConnection(url[i], user[i], pwd[i]);
		} catch (SQLException e) {
			// TODO: handle exception
			con = null;
			e.printStackTrace();
		}
		return con[i];
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
	    
	public ResultSet executeQuery(String sql, Object[] obj, int id) {
		if(sql != null) {
			con[id] = getConnection(id);
			if(con[id] != null) {
				try {
					pstm[id] = (PreparedStatement) con[id].prepareStatement(sql);
					if(obj != null) {
						for(int i = 0; i < obj.length; ++i) {
							pstm[id].setObject(i + 1, obj[i]);
						}
					}
					ret[id] = pstm[id].executeQuery();
				} catch (SQLException e) {
					// TODO: handle exception
					e.printStackTrace();
				}
			}
		}
		return ret[id];
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
	    
	public int executeUpdate(String sql, Object[] obj, int id) {
		int flag = -1;
		if(sql != null && obj != null) {
			con[id] = getConnection(id);
			if(con[id] != null) {
				try {
					pstm[id] = (PreparedStatement) con[id].prepareStatement(sql);
					for(int i = 0; i < obj.length; ++i) {
						pstm[id].setObject(i + 1, obj[i]);
					}
					flag = pstm[id].executeUpdate();
				} catch (SQLException e) {
					// TODO: handle exception
					e.printStackTrace();
				}
			}
		}
		return flag;
	}
	
	public int executeInsert(String sql, int id) {
		int flag = -1;
		if(sql != null) {
			con[id] = getConnection(id);
			if(con[id] != null) {
				try {
					Statement stmt = con[id].createStatement();
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
	    
	public ResultSet queryAll(String sql, int id) {
        con[id] = getConnection(id);
        if(con[id] != null){
            try {
                pstm[id] = (PreparedStatement) con[id].prepareStatement(sql);
                ret[id] = pstm[id].executeQuery();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
	    return ret[id];
	}
	
	
	public void closeAll(int id) {
	    // TODO Auto-generated method stub
	    if (ret[id] != null) {
	        try {
	            ret[id].close();
	        } catch (SQLException e) {
	            // TODO Auto-generated catch block
	            e.printStackTrace();
	        }
	    }
	    if (pstm[id] != null) {
	        try {
	            pstm[id].close();
	        } catch (SQLException e) {
	            // TODO Auto-generated catch block
	            e.printStackTrace();
	        }
	        
	    }
	    if (con[id] != null) {
	        try {
	            con[id].close();
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
	    
	public boolean createTable(String sql, int id) {
		con[id] = getConnection(id);
		if(con[id] != null && sql != null) {
			try {
				pstm[id] = (PreparedStatement)con[id].prepareStatement(sql);
				return pstm[id].execute(sql);
			} catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
				return false;
			}
		}
		return false;
	}
	
	
	/******************* init new table ****************/
	
	public boolean createDataBase1() {
		try {
			
			String name = null;
			String firstName = null;
			String SecondName = null;
			
			String sex = null;
			
			String birth = null;
			
			String nid = null;
			
			String id = null;
			
			String className = null;
			
			String classId = null;
			
			File file = new File("G:\\Backup\\CollegeProjectBackup\\ApplicationIntegration\\ApplicationIntegration\\src\\InitDatabase\\name.txt");
			FileInputStream rf = new FileInputStream(file);
			
			Scanner io = new Scanner(file);
			
			this.createTable("drop table student1;", 0); this.createTable("drop table student2;", 0);
			this.createTable("drop table student1;", 1); this.createTable("drop table student2;", 1);
			
//			String sql = "create table student1 (nid char(13), name varchar(10), sex char(4), birth integer(8), id char(20), class varchar(30));";
			String sql = "create table student1 (学号 char(13), 姓名 varchar(10), 性别 char(4), 身份证号 char(20), 班级 varchar(30));";
			this.createTable(sql, 0);
			System.out.println(sql);
			sql = "create table student2 (nid char(13), FirstName varchar(4), LastName varchar(10), sex char(2), year char(4), month char(2), day char(2), startyear integer(4), GPA float(3));";
			this.createTable(sql, 1);
			System.out.println(sql);
			
			int num = 1;
			while(io.hasNext() && num <= 20) {
//				name = io.next();
				firstName = io.next();
				SecondName = io.next();
				name = SecondName + firstName;
				sex = io.next();
//				System.out.println(name + " " + sex);
				++num;
				
				Random rnd = new Random();
				
				int year = rnd.nextInt(5) + 1995;
				int month = rnd.nextInt(12) + 1;
				int day = rnd.nextInt(30);
				
				birth = String.valueOf(year * 10000 + month * 100 + day);
				
				nid = String.valueOf(rnd.nextInt(1000) + Long.parseLong("2017317210000"));
				
//				class nextLong{
//					long nextLong() {
//						Random rng = new Random();
//						long n = Long.parseLong("10000000000000000");
//						long bits, val;
//						do {
//							bits = (rng.nextLong() << 1) >>> 1;
//							val = bits % n;
//						} while (bits - val + (n - 1) < 0L);
//						return bits;
//					}
//				}
//				id = String.valueOf((new nextLong()).nextLong());
				id = String.valueOf(rnd.nextInt(999999)) + birth + String.valueOf(rnd.nextInt(9999));
				
				String[] classname = {"计科1701", "计科1702", "计科1703", "计科1704", "生信1701", "生信1702"};
				System.out.println(classname.length);
				int classNum = classname.length;
				
				int classid = rnd.nextInt(classNum);
				className = classname[classid];
				classId = String.valueOf(1700 + classid + 1);
				
				System.out.println(name + " " + sex + " " + birth + " " + nid + " " + id + " " + className + " " + classId);
				
				
				int startyear = (rnd.nextInt(100) < 10 ? 1 : 0) + 2017;
				double gpa = rnd.nextDouble() * (rnd.nextInt(100) <= 10 ? -1 : 1) + 3.0;
				
				// create table1
				
				String sql1 = "insert into student1 values (";
				
				sql = null;
				sql = sql1 + "\'" + nid + "\', " + "\'" + name + "\', " + "\'" + sex + "\', " + "\'" + id + "\', " + "\'" + className + "\');";
				System.out.println(sql);
				
				int probaility = rnd.nextInt(100);
				if(probaility > 10) {
					this.executeInsert(sql, 0);					
				}
				
				
				
				// create table2
				if(sex.equals("男")) {
					sex = "M";
				}
				else {
					sex = "F";
				}
				String sql2 = "insert into student2 values (";
				sql = null;
				sql = sql2 + "\'" + nid + "\', " + "\'" + firstName + "\', " + "\'" + SecondName + "\', " + "\'" + sex + "\', " + "\'" + year + "\', " + "\'" + month + "\', " + "\'" + day + "\', " + "\'" + startyear + "\', " + "\'" + gpa + "\');";
				System.out.println(sql);
				if(probaility > 20 || probaility <= 10) {
					this.executeInsert(sql, 1);					
				}
				
			}
			
			
			
		io.close();
		rf.close();
			
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	
	
	/**
	    * @Title: main
	    * @Description: TODO 生成一个数据库
	    * @param @param args    参数
	    * @return void    返回类型
	    * @throws
	    */

	public static void main(String[] args) throws SQLException {
		// TODO Auto-generated method stub
//		initDatabase iDatabase = new initDatabase();
//		String sqlString = "select * from customers";
//		Object[] obj = null;
//		ResultSet retResultSet = iDatabase.executeQuery(sqlString, obj);
//		while(retResultSet.next()) {
//			System.out.println(retResultSet.getObject("cno") + " " + retResultSet.getObject("csex") + " " + retResultSet.getObject("cname"));
//		}
		initDatabase init = new initDatabase();
		init.createDataBase1();
	}
	
	

}
