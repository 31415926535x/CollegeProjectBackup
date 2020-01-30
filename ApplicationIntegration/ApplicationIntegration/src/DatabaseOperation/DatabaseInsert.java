package DatabaseOperation;


public class DatabaseInsert {
	String sql = null;
	DatabaseOperations dbo = null;
	public DatabaseInsert(String sql) {
		dbo = new DatabaseOperations();
		this.sql = sql;
	}
	public int insertNameByCno(String sql) {
		return dbo.executeInsert(sql);
	}
	public int insertCnoByName() {
		return dbo.executeInsert(sql);
	}
	public int insertIDByCno() {
		return dbo.executeInsert(sql);
	}
	public int insertClassByCno() {
		return dbo.executeInsert(sql);
	}
	public int insertSexByCno() {
		return dbo.executeInsert(sql);
	}
	public int insertSexByName() {
		return dbo.executeInsert(sql);
	}

}
