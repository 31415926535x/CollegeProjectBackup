package DatabaseOperation;

public class DatabaseDelete {
	String sql = null;
	Object[] obj = null;
	DatabaseOperations dbo = null;
	public DatabaseDelete(String sql) {
		dbo = new DatabaseOperations();
		this.sql = sql;
	}
	public int deleteNameByCno(String sql) {
		return dbo.executeUpdate(sql, obj);
	}
	public int deleteCnoByName() {
		return dbo.executeUpdate(sql, obj);
	}
	public int deleteIDByCno() {
		return dbo.executeUpdate(sql, obj);
	}
	public int deleteClassByCno() {
		return dbo.executeUpdate(sql, obj);
	}
	public int deleteSexByCno() {
		return dbo.executeUpdate(sql, obj);
	}
	public int deleteSexByName() {
		return dbo.executeUpdate(sql, obj);
	}
}
