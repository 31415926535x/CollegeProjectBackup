package DatabasesTables;

import com.google.gson.Gson;

public class TableColumns {
	private String xmlName = null;
	private String name = null;
	private String type = null;
	private String isSelect = "false";
	public TableColumns(String xmlName, String name, String type, String isSelect) {
		this.xmlName = xmlName;
		this.name = name;
		this.type = type;
		this.isSelect = isSelect;
	}
	public String getXmlName() {
		return this.xmlName;
	}
	public String getName(){
		return this.name;
	}
	public String getType(){
		return this.type;
	}
	public String getIsSelect(){
		return this.isSelect;
	}
	public String toJson(){
		return (new Gson()).toJson(this);
	}
	public TableColumns fromJson(String str){
		return (new Gson()).fromJson(str, TableColumns.class);
	}
	
}
