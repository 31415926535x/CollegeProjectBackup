package v4;

import java.util.Random;


/**
    * @ClassName: getRandomAccountForTest
    * @Description: TODO(这里用一句话描述这个类的作用)
    * @author 31415926535x
    * @date 2019-05-01上午11:17:36
    *
    */

public class getRandomAccountForTest {
	
	    /**
	    * @Title: getARandomAccountForTest
	    * @Description: TODO 生成一个随机账户用于之后的测试
	    * @param @return    参数
	    * @return Account    返回类型
	    * @throws
	    */
	    
	public static Account getARandomAccountForTest() {
		Random random = new Random();
		int id = random.nextInt(1000);
		int name = random.nextInt(1000);
		return new Account(Integer.toString(id), Integer.toString(name), true);
		//java中使用.toString() 会返回 "类型@字符串" 形式的值
		//return new Account((new Random()).toString(), (new Random()).toString());
	}
}