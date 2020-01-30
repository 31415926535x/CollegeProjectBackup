package DatabaseOperation;

public class DatabaseUpdate {
	String sql = null;
	Object[] obj = null;
	DatabaseOperations dbo = null;
	public DatabaseUpdate(String sql, int id) {
		dbo = new DatabaseOperations(id);
		this.sql = sql;
	}
	public int update() {
		return dbo.executeUpdate(sql, obj);
	}
}
