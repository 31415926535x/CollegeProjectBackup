package DatabasesTables;

import com.google.gson.Gson;

public class TableProperties {
    private String tableName = null;
    private String tableColNum = null;
    public TableProperties(String tableName, String tableColNum){
        this.tableName = tableName;
        this.tableColNum = tableColNum;
    }
    public String getTableName(){
        return this.tableName;
    }
    public String getTableNum() {
        return this.tableColNum;
    }
    public String toJson(){
        return (new Gson()).toJson(this);
    }
    public TableProperties fromJson(String str){
        return (new Gson()).fromJson(str, TableProperties.class);
    }
}
