/**
 * 
 */
package v6_25;
import v6_25.Date;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.text.NumberFormat;


/**
 * @className SavingsAccount
 * @description SavingsAccount.java
 * @author 31415926535x
 * @date 2019年3月5日 下午12:55:39
 * @tag 
 * @version v6_25
 */

public class SavingsAccount {
	
	/**
	 * @param id 			账号
	 * @param balance 		余额
	 * @param rate 			存款的年利率
	 * @param lastDate 		上次变更余额的时期
	 * @param accumulation	余额按日累加之和
	 * @param total			所有账户的金额
	 */
	private String id;				//账号
	private double balance;			//余额
	private double rate;			//存款的年利率
	private Date lastDate;			//上次变更余额的时期
	private double accumulation;	//余额按日累加之和
	
	static double total = 0;        //所有账户的金额
	
	/**
	 * 记录一笔帐
	 * @param date 		日期
	 * @param amount 	金额
	 * @param desc 		说明
	 */
	private void record(final Date date, double amount, final String desc) {
		this.accumulation = accumulate(date);
		this.lastDate = date;
		//amount = Math.floor(amount * 100 + 0.5) / 100.0;		//保留小数点后两位
		BigDecimal bDecimal = new BigDecimal(amount);
		amount = bDecimal.setScale(2, RoundingMode.HALF_UP).doubleValue();
		this.balance += amount;
		total += amount;
		NumberFormat nf = new DecimalFormat("0.##");
		date.show();
		System.out.println("\t#" + id + "\t" + nf.format(amount) + "\t" + nf.format(balance) + "\t" + desc);
	}
	
	/**
	 * 报告错误信息
	 * @param msg	错误信息
	 */
	private final void error(final String msg) {
		System.out.println("Error(#" + id + "): " + msg);
	}
	
	/**
	 * 获得到指定日期为止的存款金额按日累积值
	 * @param date
	 * @return accumulation + balance * (date - lastDate)
	 */
	private double accumulate(final Date date) {
		return accumulation + balance * date.distance(lastDate);
	}
	
	
	/************************** public *****************************/
	
	
	/**
	 * 构造方法
	 * @param date	日期
	 * @param id	编号
	 * @param rate	利率
	 */
	public SavingsAccount(final Date date, final String id, double rate) {
		// TODO Auto-generated constructor stub
		this.id = id;
		this.balance = 0;
		this.rate = rate;
		this.lastDate = date;
		this.accumulation = 0;
		date.show();
		System.out.println("\t#" + id + " is created");
	}
	
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
	 */
	public void deposit(final Date date, double amount, final String desc) {
		record(date, amount, desc);
	}
	
	/**
	 * 取出现金
	 * @param date		日期
	 * @param amount	金额
	 */
	public void withdraw(final Date date, double amount, final String desc) {
		if(amount > getBalance())
			error("not enough money");
		else {
			record(date, -amount, desc);
		}
	}
	
	/**
	 * 结算利息，每年1月1日调用一次该函数
	 * @param date	日期
	 */
	public void settle(final Date date) {
		double interest = accumulate(date) * rate / date.distance(new Date(date.getYear() - 1, 1, 1));	//计算年息
		if(interest != 0)
			record(date, interest, "interest");
		this.accumulation = 0;
	}
	
	/**
	 * 显示账户信息
	 */
	public void show() {
		System.out.print(id + "\tBalance: " + balance);
	}
	
	
	/**
	 * 显示总金额
	 * @return total
	 */
	public static double getTotal() {
		return total;
	}

}