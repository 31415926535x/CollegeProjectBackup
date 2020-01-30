package DatabaseOperation;

import java.sql.ResultSet;

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
	public DatabaseQuery(String sql) {
		dbo = new DatabaseOperations();
		this.sql = sql;
	}

	    
	public ResultSet getNameByCno() {
		return dbo.executeQuery(sql, obj);
	}
	public ResultSet getCnoByName() {
		return dbo.executeQuery(sql, obj);
	}
	public ResultSet getIDByCno() {
		return dbo.executeQuery(sql, obj);
	}
	public ResultSet getClassByCno() {
		return dbo.executeQuery(sql, obj);
	}
	public ResultSet getSexByCno() {
		return dbo.executeQuery(sql, obj);
	}
	public ResultSet getSexByName() {
		return dbo.executeQuery(sql, obj);
	}
}
