package v5;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

/**
 * @ClassName: Account
 * @Description: TODO 创建一个账户，其中含有的信息又昵称、id、自身文件目录系统
 * @author 31415926535x
 * @date 2019-05-01上午11:19:13
 *
 */

public class Account {
	private String id = null;		//账户的id,作为唯一标识码，用于单用户之间的通信
	private String name = null;		//账户的昵称
	
	
	    /**
	     * 创建一个新的实例 Account.
	     *
	     * @param id
	     * @param name
	     * @param type 				服务器、用户、临时三种Account对象的类型，对应2、1、0
	     */
	    
	public Account(String id, String name, int type) {
		this.id = id;
		this.name = name;
		generateOwnDir(type);
	}
	public String getId() {
		return id;
	}
	public String getName() {
		return name;
	}
	public void show() {
		System.out.println((new Gson()).toJson(this));
	}
	
	    
	
	    /** (non-Javadoc)
	    * 
	    * 
		* @Title: hashCode
	    * @Description: TODO 以类作为hashmap的键时要重载 hashcode() 和 equals()
	    * @param     参数
		* @return	int
	    * @throws
	    */
	    
	@Override
	public int hashCode() {
		final int prime = 1007;
		int ret = 1;
		ret = prime * ret + id.hashCode();
		ret = prime * ret + name.hashCode();
		return ret;
	}
	
	
    /**
    * 
    * 
	* @Title: equals
    * @Description: TODO 以类作为hashmap的键时要重载 hashcode() 和 equals()
    * @param     参数
	* @return	true or flase
    * @throws
    */
	    
	@Override
	public boolean equals(Object obj) {
		if(this == obj)
			return true;
		if(obj == null)
			return false;
		if(getClass() != obj.getClass())
			return false;
		Account otherAccount = (Account)obj;
		if(id == null) {
			if(otherAccount.id != null)
				return false;
		}
		else if(!id.equals(otherAccount.id))
			return false;
		
		if(name == null) {
			if(otherAccount.name != null)
				return false;
		}
		else if(!name.equals(otherAccount.name))
			return false;
		return true;
	}
	
	    /**
	    * @Title: conventAccountToString
	    * @Description: TODO 将一个账户对象转化为一个json字符串形式
	    * @param     参数
	    * @return String    返回类型
	    * @throws
	    */
	    
	public String conventAccountToString() {
		return (new Gson()).toJson(this);
	}
	
	    /**
	    * @Title: conventStringToAccount
	    * @Description: TODO 将一个json字符串形式的信息转化成一个账户对象
	    * @param @param theOtherClientString
	    * @param @return    参数
	    * @return Account    返回类型
	    * @throws
	    */
	    
	public static Account conventStringToAccount(String theOtherClientString) {
		System.out.println("conventStringToAccount");
		JsonObject jsonObject = (JsonObject) new JsonParser().parse(theOtherClientString);
		System.out.println(theOtherClientString);
		System.out.println(jsonObject.get("id").getAsString() + " " + jsonObject.get("name").getAsString());
		return (new Account(jsonObject.get("id").getAsString(), jsonObject.get("name").getAsString(), 2));
	}
	
	
	/*******************v4 新增内容**********************/
	
	
	    /**
	    * @Title: generateOwnDir
	    * @Description: TODO 为用户创建一个文件夹
	    * @param     参数
	    * @return void    返回类型
	    * @throws
	    */
	    
	public void generateOwnDir(int type) {
		if(type == 0) {
			return;
		}
		fileSystemOperation.mkdir_(id, type);
		if(type == 2) {
			System.out.println("\t\t\t<Server>");
		}
		System.out.println();
		System.out.println("User " + id + "'s dir has been mkdired!");
		if(type == 1) {
			System.out.println("Now you can transfer and recive files in this dir!");
		}
		System.out.println();
	}
	
	

}