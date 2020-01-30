package DatabasesTables;

import java.util.ArrayList;

import com.google.gson.Gson;

import databasesXML.XMLOperation;

public class Table {
    private int DatabasesTablesId = 0;
    private String TableId = "1";
    
    private TableProperties properties = null;
    private ArrayList<TableColumns> columns = null;

    public Table(int DatabasesTablesId, String TableId){
        this.DatabasesTablesId = DatabasesTablesId;
        this.TableId = TableId;
        this.getTableProperties();
        this.getTableColumns();
    }
    private void getTableProperties(){
    	this.properties = (new XMLOperation()).getTableProperties(DatabasesTablesId, TableId);
    	return;
    }
    private void getTableColumns(){
    	this.columns = (new XMLOperation()).getTableColumns(DatabasesTablesId, TableId);
    	return;
    }
    public String toJson() {
    	return (new Gson()).toJson(this);
    }
    public Table fromJson(String str) {
    	return (new Gson()).fromJson(str, Table.class);
    }
    public ArrayList<TableColumns> getColumns(){
    	return this.columns;
    }
}
