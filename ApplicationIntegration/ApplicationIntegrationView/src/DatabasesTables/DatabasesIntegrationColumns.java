package DatabasesTables;

import java.util.ArrayList;

import util.Pair;

public class DatabasesIntegrationColumns {
	private String xmlName = null;
	private String name = null;
	private String isSelect = "false";
	private ArrayList<Pair> colOfDabasesNum = null;
	public DatabasesIntegrationColumns(String xmlName, String name, String isSelect) {
		this.xmlName = xmlName;
		this.name = name;
		this.isSelect = isSelect;
		colOfDabasesNum = new ArrayList<Pair>();
		System.out.println("DatabasesIntegrationColumns loaded: " + xmlName + " " + name + " " + isSelect);
	}
	public void add(int databasesId, int tableId) {
		colOfDabasesNum.add(new Pair("" + databasesId, "" + tableId));
		return;
	}
	public ArrayList<Pair> get(){
		return this.colOfDabasesNum;
	}
	public String getXmlName() {
		return this.xmlName;
	}
	public String getName() {
		return this.name;
	}
	public String getIsSelect() {
		return this.isSelect;
	}
}
