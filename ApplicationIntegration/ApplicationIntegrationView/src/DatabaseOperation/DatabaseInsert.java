package DatabaseOperation;


public class DatabaseInsert {
	String sql = null;
	DatabaseOperations dbo = null;
	public DatabaseInsert(String sql, int id) {
		dbo = new DatabaseOperations(id);
		this.sql = sql;
	}
	public int insert() {
		return dbo.executeInsert(sql);
	}
}
