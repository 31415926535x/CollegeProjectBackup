package v6;

import java.util.List;

import com.google.gson.Gson;

public class accountMessage {
	@SuppressWarnings("unused")
	private final String type = "account";
	private List<Account> accounts;
	public accountMessage(List<Account> accounts) {
		// TODO Auto-generated constructor stub
		this.accounts = accounts;
	}
	
	    
	
	    /**
	    * @Title: getAccountMessageJson
	    * @Description: TODO 从一个accountMessage实例得到一个json
	    * @param @return    参数
	    * @return String    返回类型
	    * @throws
	    */
	    
	public String getAccountMessageJson() {
		return (new Gson()).toJson(this);
	}
	
	    /**
	    * @Title: getAccountsFromJosn
	    * @Description: TODO 从一个accountMessage的json 中获取所有的accounts
	    * @param @param json
	    * @param @return    参数
	    * @return List<Account>    返回类型
	    * @throws
	    */
	    
	public static List<Account> getAccountsFromJosn(String json) {
		return (new Gson().fromJson(json, accountMessage.class)).accounts;
	}
}
