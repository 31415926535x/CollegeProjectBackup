package DatabaseOperation;

public class DatabaseDelete {
	String sql = null;
	Object[] obj = null;
	DatabaseOperations dbo = null;
	public DatabaseDelete(String sql, int id) {
		dbo = new DatabaseOperations(id);
		this.sql = sql;
	}
	public int delete() {
		return dbo.executeUpdate(sql, obj);
	}
}
