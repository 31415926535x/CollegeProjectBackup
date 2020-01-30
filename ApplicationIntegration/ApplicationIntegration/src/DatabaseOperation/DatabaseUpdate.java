package DatabaseOperation;

public class DatabaseUpdate {
	String sql = null;
	Object[] obj = null;
	DatabaseOperations dbo = null;
	public DatabaseUpdate(String sql) {
		dbo = new DatabaseOperations();
		this.sql = sql;
	}
	public int updateNameByCno(String sql) {
		return dbo.executeUpdate(sql, obj);
	}
	public int updateCnoByName() {
		return dbo.executeUpdate(sql, obj);
	}
	public int updateIDByCno() {
		return dbo.executeUpdate(sql, obj);
	}
	public int updateClassByCno() {
		return dbo.executeUpdate(sql, obj);
	}
	public int updateSexByCno() {
		return dbo.executeUpdate(sql, obj);
	}
	public int updateSexByName() {
		return dbo.executeUpdate(sql, obj);
	}
}
