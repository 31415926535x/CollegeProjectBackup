/**
 * 
 */
package v7_10;

/**
 * @className SavingsAccount
 * @description SavingsAccount.java
 * @author 31415926535x
 * @date 2019年3月5日 下午6:03:15
 * @tag 
 * @version v7_10
 */
public class SavingsAccount extends Account {
	/*********************** private **********************/
	/**
	 * @param acc	辅助计算利息的累加器
	 * @param rate	存款的年利率
	 */
	private Accumulator acc;
	private double rate;
	
	/*********************** public ***********************/
	
	/**
	 * 构造方法
	 * @param date	日期
	 * @param id	编号
	 * @param rate	利率
	 */
	public SavingsAccount(final Date date, final String id, double rate) {
		super(date, id);
		this.rate = rate;
		acc = new Accumulator(date, 0);
	}
	
	/**
	 * 返回存款的年利率
	 * @return rate
	 */
	public final double getRate() {
		return rate;
	}
	
	/**
	 * 存入现金
	 * @param date		日期
	 * @param amount	金额
	 * @param desc		信息
	 */
	public void deposit(final Date date, double amount, final String desc) {
		record(date, amount, desc);
		acc.change(date, getBalance());
	}
	
	/**
	 * 取出现金
	 * @param date		日期
	 * @param amount	金额
	 * @param desc		信息
	 */
	public void withdraw(final Date date, double amount, final String desc) {
		if(amount > getBalance()) {
			error("not enough money");
		}
		else {
			record(date, -amount, desc);
			acc.change(date, getBalance());
		}
	}
	
	/**
	 * 结算利息，每年1月1日调用一次该函数
	 * @param date	日期
	 */
	public void settle(final Date date) {
		double interest = acc.getSum(date) * rate / date.distance(new Date(date.getYear() - 1, 1, 1));	//计算年息
		if(interest != 0) {
			record(date, interest, "interest");
		}
		acc.reset(date, getBalance());
		
	}
}
