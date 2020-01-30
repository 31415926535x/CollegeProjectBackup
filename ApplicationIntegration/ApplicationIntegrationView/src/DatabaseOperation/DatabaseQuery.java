package DatabaseOperation;

import java.sql.ResultSet;
import java.sql.SQLException;

import com.sun.org.apache.regexp.internal.REUtil;

/**
    * @ClassName: DatabaseQuery
    * @Description: TODO 对数据库的查询操作
    * @author 31415926535x
    * @date 2019年10月10日
    *
    */
    
public class DatabaseQuery {
	String sql = null;
	DatabaseOperations dbo = null;
	Object[] obj = null;
	public DatabaseQuery(String sql, int id) {
		dbo = new DatabaseOperations(id);
		this.sql = sql;
	}
	public ResultSet getResultSet() {
		return dbo.executeQuery(sql, obj);
	}
}
