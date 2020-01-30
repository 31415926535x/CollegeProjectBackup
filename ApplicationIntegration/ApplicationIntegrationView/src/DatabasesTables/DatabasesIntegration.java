package DatabasesTables;

import java.sql.Array;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLInput;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.crypto.dsig.XMLObject;

import org.apache.jasper.tagplugins.jstl.core.ForEach;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import DatabaseOperation.DatabaseOperations;
import DatabaseOperation.DatabaseQuery;
import databasesXML.XMLOperation;
import util.Pair;

/**
    * @ClassName: DatabasesIntegratiion
    * @Description: 用于数据库的一个集成
    * @author 31415926535x
    * @date 2019年12月23日
    *
    */
    
public class DatabasesIntegration {
	private Map<String, Integer> xmlNameMap = null;		// xmlName的一个映射
	private ArrayList<DatabasesIntegrationColumns> xmlNameList = null;	// 存储xmlName
	private int xmlNameNum = 0;
	private int tableNum = 0;
	
	public DatabasesIntegration() {
		this.xmlNameMap = new HashMap<String, Integer>();
		this.xmlNameList = new ArrayList<DatabasesIntegrationColumns>();
		this.xmlNameNum = 0;
		this.tableNum = 0;
		this.init();
		System.out.println("DatabasesIntegratiion loaded");
		System.out.println((new Gson()).toJson(this));
	}
	
	
	    /**
	    * @Title: init
	    * @Description: 数据集成的初始化，将每一个xmlname出现的数据库以及表的信息记录
	    * @param     参数
	    * @return void    返回类型
	    * @throws
	    */
	    
	private void init() {
		XMLOperation xmlOperation = new XMLOperation();
		int databasesNum = xmlOperation.getDataBasesSrc().size();
		for(int i = 0; i < databasesNum; ++i) {
			// 遍历每一个数据库
			int tablesNum = new Integer(xmlOperation.getDatabasesPro().get(i).get("databaseTableNum"));
			System.out.println("tableNum " + tablesNum);
			for(int j = 0; j < tablesNum; ++j) {
				// 遍历每一张表中的每一列
				ArrayList<TableColumns> tableColumns = xmlOperation.getTableColumns(i, "" + (j + 1));
				int colNum = tableColumns.size();
				for(int k = 0; k < colNum; ++k) {
					// 对每一个列信息进行集成
					System.out.println(tableColumns.get(k).getXmlName() + "-" + tableColumns.get(k).getName());
					String xmlname = tableColumns.get(k).getXmlName();
					String name = tableColumns.get(k).getName();
					String isSelect = tableColumns.get(k).getIsSelect();
					if(this.xmlNameMap.get(xmlname) == null) {
						// 不存在，分配一个编号，初始化添加
						this.xmlNameMap.put(xmlname, this.xmlNameNum);
						++this.xmlNameNum;
						DatabasesIntegrationColumns xmlcol = new DatabasesIntegrationColumns(xmlname, name, isSelect);
						xmlcol.add(i, tablesNum);
						this.xmlNameList.add(xmlcol);
					}
					else {
						// 存在直接添加所在的数据库的表的编号即可
						this.xmlNameList.get(xmlNameMap.get(xmlname)).add(i, tablesNum);
					}
				}
				++this.tableNum;
			}
		}
	}
	
	
	    /**
	    * @Title: databasesQry
	    * @Description: 根据前台发来的查询条件信息来进行查询，返回集成后满足条件的json数据
	    * @param @param qryCondition
	    * @param @return    参数
	    * @return String    返回类型
	    * @throws
	    */
	    
	public String databasesQry(String qryCondition) {
		System.out.println(qryCondition);
		ArrayList<Pair> qryList = new ArrayList<Pair>();
		Gson gson = new Gson();
		JsonArray jsonElement = (new JsonParser()).parse(qryCondition).getAsJsonArray();
		for(JsonElement ele: jsonElement) {
			qryList.add(gson.fromJson(ele, Pair.class));
		}
		// 不同数据库不同表的sql语句
		Map<String, Boolean> whereMap = new HashMap<String, Boolean>();
		ArrayList<ArrayList<String>> sqlList = new ArrayList<ArrayList<String>>();
		XMLOperation xmlOperation = new XMLOperation();
		int databasesNum = xmlOperation.getDataBasesSrc().size();
		for(int i = 0; i < databasesNum; ++i) {
			int tablesNum = new Integer(xmlOperation.getDatabasesPro().get(i).get("databaseTableNum"));
			sqlList.add(new ArrayList<String>());
			for(int j = 0; j < tablesNum; ++j) {
				String tablename = xmlOperation.getTableProperties(i, "" + (j + 1)).getTableName();
//				sqlList.get(i).set(j, "select * from " + tablename + " ");
				sqlList.get(i).add("select * from " + tablename + " ");
				whereMap.put("" + i + j, false);
			}
		}
		int sum = qryList.size();
		System.out.println(sum);
		// 遍历每一个非空查询条件，对应遍历所有的表，动态构建sql语句
		for(int i = 0; i < sum; ++i) {
			String xmlname = qryList.get(i).name;
			String value = qryList.get(i).value;
			System.out.println(xmlname + " " + value);
			if(value.length() == 0) {
				continue;
			}
			int colMapNum = this.xmlNameMap.get(xmlname);					// 存储该xmlname字段的信息的位置
			DatabasesIntegrationColumns tmp = this.xmlNameList.get(colMapNum);
			int colnum = tmp.get().size();		// 所有该xmlname字段出现的表的个数
//			String name = tmp.getName();
			System.out.println((new Gson()).toJson(tmp));
			for(int j = 0; j < colnum; ++j) {
				// TODO 构建sql
				int dbnum = new Integer(tmp.get().get(j).name);
				int tablenum = new Integer(tmp.get().get(j).value) - 1;
				System.out.println(dbnum + " " + tablenum);
				System.out.println(sqlList.get(dbnum).get(tablenum));
				System.out.println(whereMap.get("" + dbnum + tablenum));
				// 获得真实的列名
				String name = tmp.getName();
				ArrayList<TableColumns> coltmp = xmlOperation.getTableColumns(dbnum, "" + (tablenum + 1));
				for (TableColumns tableColumns : coltmp) {
					if(tableColumns.getXmlName().equals(xmlname)) {
						name = tableColumns.getName();
					}
				}
				// 转化不同表中数据的展现形式
				String newvalue = DataIntegration(xmlname, name, value);
				if(value == null) {
					continue;
				}
				String sql = sqlList.get(dbnum).get(tablenum) + (whereMap.get("" + dbnum + tablenum) == false ? "where " : "") + name + "=\"" + newvalue + "\"" + " and ";
				System.out.println(sql);
				whereMap.put("" + dbnum + tablenum, true);
				sqlList.get(dbnum).set(tablenum, sql);
			}
		}
		System.out.println("--------------------------------------------");
		for(int i = 0; i < sqlList.size(); ++i) {
			for(int j = 0; j < sqlList.get(i).size(); ++j) {
				String sql = sqlList.get(i).get(j);
				if(sql.lastIndexOf(" and ") != -1)sql = sql.substring(0, sql.lastIndexOf(" and ")) + ";";
				sqlList.get(i).set(j, sql);
				System.out.println(sqlList.get(i).get(j));
			}
		}
		System.out.println("--------------------------------------------");

//		// 利用cid来去重
//		Map<String, Integer> cidMap = new HashMap<String, Integer>();
//		int sumtable = 0;
//		for(int i = 0; i < databasesNum; ++i) {
//			int tablenum = sqlList.get(i).size();
//			for(int j = 0; j < tablenum; ++j) {
//				++sumtable;
//				String sql = sqlList.get(i).get(j);
//				System.out.println(sql);
//				ResultSet rs = new DatabaseQuery(sql, i).getResultSet();
//				
//				try {
//					while(rs.next()) {
//						for(int k = 1; k <= 1; ++k) {
//							String cid = (String) rs.getObject(k);
//							if(cidMap.get(cid) == null) {
//								cidMap.put(cid, 1);
//								continue;
//							}
//							cidMap.put(cid, cidMap.get(cid) + 1);
//							System.out.println(cid);
//						}
//					}
//				} catch (SQLException e1) {
//					// TODO Auto-generated catch block
//					e1.printStackTrace();
//				}
//				
////				try {
////					while(rs.next()) {
////						int len = rs.getMetaData().getColumnCount();
////						System.out.println(len);
////						for(int k = 1; k <= len; ++k) {
////							System.out.print(rs.getObject(k) + " ");
////						}
////						System.out.println();
////					}
////				} catch (SQLException e) {
////					// TODO Auto-generated catch block
////					e.printStackTrace();
////				}
//			}
//		}
//		for(Map.Entry<String, Integer> s: cidMap.entrySet()) {
//			System.out.println(s.getKey() + " " + s.getValue());
//		}
		// xmlname 的一个映射
		Map<String, Integer> xmlnameMap = new HashMap<String, Integer>();
		for(int i = 0; i < xmlNameList.size(); ++i) {
			xmlnameMap.put(xmlNameList.get(i).getXmlName(), i);
		}
		ArrayList<List<Map<String, String>>> resArrayList = new ArrayList<List<Map<String,String>>>();
		// 约定第一行是表头信息
		List<Map<String, String>> headList = new ArrayList<Map<String,String>>();
		for(int i = 0; i < xmlNameList.size(); ++i) {
			Map<String, String> head = new HashMap<String, String>();
			head.put("xmlname", xmlNameList.get(i).getXmlName());
			head.put("name", xmlNameList.get(i).getName());
			headList.add(head);
		}
		resArrayList.add(headList);
		
		// 获取数据
		Map<String, Integer> cidMap = new HashMap<String, Integer>();
		int resnum = 1;
		for(int i = 0; i < databasesNum; ++i) {
			int tablenum = sqlList.get(i).size();
			for(int j = 0; j < tablenum; ++j) {
				String sql = sqlList.get(i).get(j);
				System.out.println(sql);
				ResultSet rs = new DatabaseQuery(sql, i).getResultSet();
				ArrayList<TableColumns> tableColumns = xmlOperation.getTableColumns(i, "" + (j + 1));
				try {
					while(rs.next()) {
						String cid = (String) rs.getObject(1);
						System.out.println("cid    " + cid);
						if(cidMap.get(cid) == null) {
							System.out.println(cid);
							cidMap.put(cid, resnum);
							++resnum;
//						if(cidMap.get(cid) == sumtable) {		// 还没有实现结果的合并去重
							List<Map<String, String>> rowArrayList = new ArrayList<Map<String,String>>();
							for(int k = 0; k < xmlNameList.size(); ++k) {
								rowArrayList.add(null);
							}
							int len = rs.getMetaData().getColumnCount();
							for(int k = 1; k <= len; ++k) {
								Map<String, String> data = new HashMap<String, String>();
//								System.out.println(tableColumns.get(k - 1).toJson() + len + " " + tableColumns.size());
								data.put("xmlname", tableColumns.get(k - 1).getXmlName());
								data.put("name", tableColumns.get(k - 1).getName());
								String val = rs.getObject(k).toString();
								data.put("value", val);
//								rowArrayList.add(data);
								rowArrayList.set(xmlnameMap.get(tableColumns.get(k - 1).getXmlName()), data);
							}
							resArrayList.add(rowArrayList);
//						}
						}
						else {
							int id = cidMap.get(cid);
							int len = rs.getMetaData().getColumnCount();
							for(int k = 1; k <= len; ++k) {
								Map<String, String> data = new HashMap<String, String>();
//								System.out.println(tableColumns.get(k - 1).toJson() + len + " " + tableColumns.size());
								data.put("xmlname", tableColumns.get(k - 1).getXmlName());
								data.put("name", tableColumns.get(k - 1).getName());
								String val = rs.getObject(k).toString();
								data.put("value", val);
								System.out.println("233333" + tableColumns.get(k - 1).getXmlName());
								resArrayList.get(id).set(xmlnameMap.get(tableColumns.get(k - 1).getXmlName()), data);
							}
						}
					}
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
//		for (Map<String, String> map : resArrayList) {
//			for(Map.Entry<String, String> m: map.entrySet()) {
//				System.out.println(m.getKey() + " " + m.getValue());
//			}
//		}
//		String resJson = (new Gson()).toJson(resArrayList);
//		System.out.println(resJson);
		return (new Gson()).toJson(resArrayList);
	}
	
	public void databasesDel(String nid) {
		XMLOperation xmlOperation = new XMLOperation();
		int databasesNum = xmlOperation.getDataBasesSrc().size();
		for(int i = 0; i < databasesNum; ++i) {
			int tablesNum = new Integer(xmlOperation.getDatabasesPro().get(i).get("databaseTableNum"));
			System.out.println(databasesNum + " " + tablesNum);
			for(int j = 0; j < tablesNum; ++j) {
				String tablename = xmlOperation.getTableProperties(i, "" + (j + 1)).getTableName();
				DatabaseOperations databaseOperations = new DatabaseOperations(i);
				System.out.println(233);
//				nid = (new Table(i, "" + 0)).getColumns().get(0).getName();
				String cid = xmlOperation.getTableColumns(i, "" + (j + 1)).get(0).getName();
				System.out.println(nid);
				databaseOperations.executeInsert("delete from " + tablename + " where " + cid + "=\"" + nid + "\";");
			}
		}
	}
	
	
	
	
	public String getKeySelect() {
		ArrayList<Map<String, ArrayList<String>>> resArrayList = new ArrayList<Map<String,ArrayList<String>>>();
		return "2333";
	}
	public String DataIntegration(String xmlname, String name, String val) {
		String newval = val;
		if(xmlname.equals("csex")) {
			if(name.equals("性别")) {
				return newval;
			}
			if(val.equals("男")) {
				newval = "M";
			}
			else {
				newval = "F";
			}
		}
		else if(xmlname.equals("cfirstname") || xmlname.equals("clastname")) {
			newval = null;
		}
		return newval;
	}
}
