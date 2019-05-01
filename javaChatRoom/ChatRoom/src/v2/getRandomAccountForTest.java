
    /**  
    * @Title: getRandomAccountForTest.java
    * @Package v2
    * @Description: TODO
    * @author 31415926535x 
	* @email 2509437152wx@gamil.com
	* @blog cnblogs.com/31415926535x
    * @date 2019年4月30日
    * @version V1.0  
    */
    
package v2;

import java.util.Random;

/**
    * @ClassName: getRandomAccountForTest
    * @Description: TODO 生成一个随机的账户
    * @author 31415926535x
    * @date 2019年4月30日
    *
    */

public class getRandomAccountForTest {
	
	    /**
	    * @Title: getARandomAccountForTest
	    * @Description: TODO 生成一个随机的账户，用于之后的测试
	    * @param @return    参数
	    * @return Account    返回类型
	    * @throws
	    */
	    
	public Account getARandomAccountForTest() {
		Random random = new Random();
		int id = random.nextInt(1000);
		int name = random.nextInt(1000);
		return new Account(Integer.toString(id), Integer.toString(name));
		//java中使用.toString() 会返回 "类型@字符串" 形式的值
		//return new Account((new Random()).toString(), (new Random()).toString());
	}
}
