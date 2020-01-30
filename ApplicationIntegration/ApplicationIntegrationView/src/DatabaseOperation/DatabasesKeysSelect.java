package DatabaseOperation;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.sun.org.apache.bcel.internal.generic.NEW;

import DatabasesTables.Table;
import DatabasesTables.TableColumns;

/**
    * @ClassName: DatabasesKeysSelect
    * @Description: 根据xml表获取每个可选择项的内容
    * @author 31415926535x
    * @date 2019年12月20日
    *
    */
    
public class DatabasesKeysSelect {
	private int databasesId;
	private String tableId;
	
	public DatabasesKeysSelect(int databasedId, String tableId) {
		this.databasesId = databasedId;
		this.tableId = tableId;
	}
	class Res{
		public String xmlname;
		public String name;
		public String isSelect;
		public ArrayList<String> keys = null;
	}
	class Reses{
		public String attri = "keysSelect";
		public ArrayList<Res> cols = new ArrayList<Res>();
		public Reses(ArrayList<Res> cols) {
			this.cols = cols;
		}
		public String toJson() {
			return (new Gson()).toJson(this);
		}
	}
	
	
    /**
    * @Title: getKeysSelect
    * @Description: 以json的形式返回一个可选择项的内容
    * @param @return    参数
    * @return String    返回类型
    * @throws
    */
	    
	public String getKeysSelect() {
		Table table = new Table(databasesId, tableId);
		ArrayList<Res> cols = new ArrayList<Res>();
		int sum = table.getColumns().size();
		for(int i = 0; i < sum; ++i) {
			TableColumns tablecol = table.getColumns().get(i);
			Res res = new Res();
			res.xmlname = tablecol.getXmlName();
			res.name = tablecol.getName();
			res.isSelect = tablecol.getIsSelect();
			res.keys = null;
			if(res.isSelect.equals("true")) {
				DatabaseQuery dq = new DatabaseQuery("select distinct " + res.name + " from student1;", 0);
				ResultSet rs = dq.getResultSet();
				res.keys = new ArrayList<String>();
				try {
					while(rs.next()) {
						res.keys.add(rs.getString(1));
					}
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				Collections.sort(res.keys);
			}
			cols.add(res);
		}
		Reses reses = new Reses(cols);
		return reses.toJson();
//		return (new Gson()).toJson(reses);
	}
}
