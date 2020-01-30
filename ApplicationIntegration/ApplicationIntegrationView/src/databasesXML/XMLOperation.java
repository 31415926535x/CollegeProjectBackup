package databasesXML;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.dom4j.DocumentException;
import org.dom4j.io.SAXReader;
import org.eclipse.jdt.internal.compiler.ast.ThisReference;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import DatabasesTables.TableColumns;
import DatabasesTables.TableProperties;
import sun.tools.jar.resources.jar;

import com.google.gson.Gson;


public class XMLOperation {
	private String serverSettingsSrc = ".//databasesXML//ServerSettings.xml";
	private List<String> databasesSrc = null;
	private List<Map<String, String>> databasesProperties = null;
	
	public XMLOperation() {
		this.loadDatabaseXmlSrc();
		this.databasesProperties = new ArrayList<Map<String,String>>();
		int num = this.databasesSrc.size();
		for(int i = 0; i < num; ++i) {
			this.databasesProperties.add(getDatabaseConfigs(i));
		}
//		System.out.println("Databases Properties was loaded!");
	}
	
	    /**
	    * @Title: loadDatabaseXmlSrc
	    * @Description: 通过一个server的配置文件来获得每一个数据库的xml表的路径，并保存
	    * @param     参数
	    * @return void    返回类型
	    * @throws
	    */
	    
	private void loadDatabaseXmlSrc() {
		Document doc = getDomFromXml(serverSettingsSrc);
		NodeList nodeList = doc.getElementsByTagName("databaseSettingsName");
		int num = nodeList.getLength();
		databasesSrc = new ArrayList<String>();
		for(int i = 0; i < num; ++i) {
			databasesSrc.add(nodeList.item(i).getFirstChild().getNodeValue());
		}
	}
	
	    /**
	    * @Title: getDomFromXml
	    * @Description: 读取一个xml文件，获得其document对象，简化之后的读取初始化操作
	    * @param @param src
	    * @param @return    参数
	    * @return Document    返回类型
	    * @throws
	    */
	    
	private Document getDomFromXml(String src) {
//		System.out.println(Thread.currentThread().getContextClassLoader().getResource("/").getPath());
//		System.out.println(src);
//		File xmlFile = new File(".//src" + src);
		File xmlFile = new File(Thread.currentThread().getContextClassLoader().getResource("/").getPath() + src);
		try {
			DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
			DocumentBuilder builder = factory.newDocumentBuilder();
			Document document = builder.parse(xmlFile);
			return document;
		}catch(Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	
	    /**
	    * @Title: getDatabaseConfigs
	    * @Description: 从指定的一个数据库的xml获得数据库的连接配置信息
	    * @param @param id
	    * @param @return    参数
	    * @return Map<String,String>    返回类型
	    * @throws
	    */
	    
	public Map<String, String> getDatabaseConfigs(int id){
		try {
			if(this.databasesProperties.size() > id) {
				return this.databasesProperties.get(id);
			}
			Map<String, String> resMap = new HashMap<String, String>();
			Document doc = getDomFromXml(this.databasesSrc.get(id));
			NodeList nodeList = doc.getElementsByTagName("properties");
			NodeList childList = nodeList.item(0).getChildNodes();
			int num = childList.getLength();
//			System.out.println(num);
			for(int i = 0; i < num; ++i) {
				if(childList.item(i).getNodeType() == Node.ELEMENT_NODE) {
					resMap.put(childList.item(i).getNodeName(), childList.item(i).getFirstChild().getNodeValue());
//					System.out.println(childList.item(i).getNodeName() + childList.item(i).getFirstChild().getNodeValue());
				}
			}
			return resMap;
		}catch(Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	    /**
	    * @Title: getTableProperties
	    * @Description: 获取某个数据库中某个表的属性
	    * @param @param databasesId
	    * @param @param tableId
	    * @param @return    参数
	    * @return TableProperties    返回类型
	    * @throws
	    */
	    
	public TableProperties getTableProperties(int databasesId, String tableId){
		TableProperties tableProperties = null;
		try {
//			org.dom4j.Document doc = (new SAXReader()).read(new File(".//src" + this.databasesSrc.get(databasesId)));
			org.dom4j.Document doc = (new SAXReader()).read(new File(Thread.currentThread().getContextClassLoader().getResource("/").getPath() + this.databasesSrc.get(databasesId)));
			org.dom4j.Element rootElement = doc.getRootElement();
			List<org.dom4j.Element> tableElements = rootElement.elements("table");
//			System.out.println(tableElements.size());
			for(int i = 0; i < tableElements.size(); ++i) {
				org.dom4j.Element table = tableElements.get(i);
				if(table.attribute("id").getValue().equals(tableId)) {
					org.dom4j.Element pro = table.elements("tableproperties").get(0);
//					System.out.println(pro.elementText("tableName") + pro.elementText("tableColNum"));
					tableProperties = new TableProperties(pro.elementText("tableName"), pro.elementText("tableColNum"));
					break;
				}
			}
		} catch (DocumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return tableProperties;
	}
	
	    /**
	    * @Title: getTableColumns
	    * @Description: 获取某个数据库中某个表的信息
	    * @param @param databasesId
	    * @param @param tableId
	    * @param @return    参数
	    * @return ArrayList<TableColumns>    返回类型
	    * @throws
	    */
	    
	public ArrayList<TableColumns> getTableColumns(int databasesId, String tableId) {
		ArrayList<TableColumns> tableColumns = new ArrayList<TableColumns>();
		try {
//			org.dom4j.Document doc = (new SAXReader()).read(new File(".//src" + this.databasesSrc.get(databasesId)));
			org.dom4j.Document doc = (new SAXReader()).read(new File(Thread.currentThread().getContextClassLoader().getResource("/").getPath() + this.databasesSrc.get(databasesId)));
			org.dom4j.Element rootElement = doc.getRootElement();
			List<org.dom4j.Element> tableElements = rootElement.elements("table");
			for(int i = 0; i < tableElements.size(); ++i) {
				org.dom4j.Element table = tableElements.get(i);
				if(table.attribute("id").getValue().equals(tableId)) {
					List<org.dom4j.Element> cols = table.elements("columns").get(0).elements();
					int sum = cols.size();
					for(int j = 0; j < sum; ++j) {
						org.dom4j.Element col = cols.get(j);
						String xmlName = col.getName();
						String name = col.elementText("name");
						String type = col.elementText("type");
						String isSelect = col.elementText("isSelect");
//						System.out.println(xmlName + name + type + isSelect);
						tableColumns.add(new TableColumns(xmlName, name, type, isSelect));
					}
					break;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return tableColumns;
	}
	
	public List<String> getDataBasesSrc(){
		return this.databasesSrc;
	}
	public List<Map<String, String>> getDatabasesPro(){
		return this.databasesProperties;
	}
	
	public static void main(String[] args) {
		XMLOperation test = new XMLOperation();
//		TableProperties pro = test.getTableProperties(0, "1");
		ArrayList<TableColumns> cols = test.getTableColumns(0, "1");
//		System.out.println(pro.toJson());
		for(int i = 0; i < cols.size(); ++i) {
			System.out.println(cols.get(i).toJson());
		}
	}
}
