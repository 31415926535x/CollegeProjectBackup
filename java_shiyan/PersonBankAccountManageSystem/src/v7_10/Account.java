/**
 * 创建Account父类，派生出SavingAccount，CreditAccount类
 */
package v7_10;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.text.NumberFormat;

/**
 * @className Account
 * @description Account.java
 * @author 31415926535x
 * @date 2019年3月5日 下午5:44:04
 * @tag 
 * @version v7_10
 */
public class Account {
	/**
	 * @param id		账号 
	 * @param balance	余额
	 * @param total		所有账户的总金额，初始为0
	 */
	private String id;
	private double balance;
	private static double total = 0;
	
	/**
	 * 供派生类调用的构造方法，id为账户
	 * @param date		日期
	 * @param id		账号
	 */
	protected Account(final Date date, final String id) {
		this.id = id;
		this.balance = 0;
		date.show();
		System.out.println("\t#" + id + " created");
	}
	
	/**
	 * 记录一笔帐
	 * @param date 		日期
	 * @param amount 	金额
	 * @param desc 		说明
	 */
	protected void record(final Date date, double amount, final String desc) {
		//amount = Math.floor(amount * 100 + 0.5) / 100;
		BigDecimal bDecimal = new BigDecimal(amount);
		amount = bDecimal.setScale(2, RoundingMode.HALF_UP).doubleValue();
		this.balance += amount;
		total += amount;
		date.show();
		NumberFormat nf = new DecimalFormat("0.##");
		System.out.println("\t#" + id + "\t" + nf.format(amount) + "\t" + nf.format(balance) + "\t" + desc);
	}
	
	/**
	 * 报告错误信息
	 * @param msg	错误信息
	 */
	protected final void error(final String msg) {
		System.out.println("Error(#" + id + "): " + msg);
	}
	
	/******************* public **********************/
	
	/**
	 * 返回id
	 * @return id
	 */
	public final String getId() {
		return id;
	}
	
	/**
	 * 返回余额
	 * @return balance
	 */
	public final double getBalance() {
		return balance;
	}
	
	/**
	 * 显示总金额
	 * @return total
	 */
	public static double getTotal() {
		return total;
	}
	
	/**
	 * 显示账户信息
	 */
	public void show() {
		NumberFormat nf = new DecimalFormat("0.##");
		System.out.print(id + "\tBalance: " + nf.format(balance));
	}
	
}
