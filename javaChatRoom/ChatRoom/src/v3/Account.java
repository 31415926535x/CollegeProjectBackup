
    /**  
    * @Title: Account.java
    * @Package v3
    * @Description: TODO
    * @author 31415926535x 
	* @email 2509437152wx@gamil.com
	* @blog cnblogs.com/31415926535x
    * @date 2019-05-01上午11:19:13
    * @version v3 
    */
    
package v3;


/**
    * @ClassName: Account
    * @Description: TODO(这里用一句话描述这个类的作用)
    * @author 31415926535x
    * @date 2019-05-01上午11:19:13
    *
    */

public class Account {
	private String id = null;		//账户的id,作为唯一标识码，用于单用户之间的通信
	private String name = null;		//账户的昵称
	
	public Account(String id, String name) {
		this.id = id;
		this.name = name;
	}
	public String getId() {
		return id;
	}
	public String getName() {
		return name;
	}
	public void show() {
		System.out.println(id + "-" + name);
	}
	
	    
	
	    /* (non-Javadoc)
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
	
	
	    /* 
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
	    * @Description: TODO 将一个账户对象转化为一个字符串形式
	    * @param     参数
	    * @return String    返回类型
	    * @throws
	    */
	    
	public String conventAccountToString() {
		String tmpString = this.id + "-" + this.name;
		return tmpString;
	}
	
	    /**
	    * @Title: conventStringToAccount
	    * @Description: TODO 将一个字符串形式的信息转化成一个账户对象
	    * @param @param theOtherClientString
	    * @param @return    参数
	    * @return Account    返回类型
	    * @throws
	    */
	    
	public static Account conventStringToAccount(String theOtherClientString) {
		int begin0 = 0;			//从字符串还原Account
		int end0 = theOtherClientString.indexOf('-');
		int begin1 = end0 + 1;
		int end1 = theOtherClientString.length();
		return new Account(theOtherClientString.substring(begin0, end0), theOtherClientString.substring(begin1, end1));
	}
}