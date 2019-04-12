/**
 * 
 */
package v9_16;

import java.text.DecimalFormat;
import java.text.NumberFormat;


/**
 * @className CreditAccount
 * @description CreditAccount.java
 * @author 31415926535x
 * @date 2019年3月7日 下午1:20:52
 * @tag 
 * @version v9_16
 */
public class CreditAccount extends Account {
	/************************ private ************************/
	/**
	 * @param acc 		辅助计算利息的累加器
	 * @param credit 	信用额度
	 * @param rate		欠款的日利率
	 * @param fee		信用卡年费
	 */
	private Accumulator acc;
	private double credit;
	private double rate;
	private double fee;
	
	
	/**
	 * 获得欠款额
	 * @return balance
	 */
	private final double getDebt() {
		double balance = getBalance();
		return (balance < 0 ? balance : 0);
	}
	
	/*********************** public ************************/
	
	/**
	 * CreditAccount类相关成员函数的实现
	 * @param date		日期
	 * @param id		编号
	 * @param credit	信用额度
	 * @param rate		欠款日利率
	 * @param fee		信用卡年费
	 */
	public CreditAccount(final Date date, final String id, double credit, double rate, double fee) {
		super(date, id);
		this.credit = credit;
		this.rate = rate;
		this.fee = fee;
		this.acc = new Accumulator(date, 0);
	}
	
	/**
	 * 返回信用额度
	 * @return credit
	 */
	public final double getCredit() {
		return credit;
	}
	
	/**
	 * 返回欠款日利率
	 * @return rate
	 */
	public final double getRate() {
		return rate;
	}
	
	/**
	 * 返回信用卡年费
	 * @return fee
	 */
	public final double getFee() {
		return fee;
	}
	
	/**
	 * 获得可用信用
	 * @return credit
	 */
	public final double getAvailableCredit() {
		if(getBalance() < 0) {
			return credit + getBalance();
		}
		else {
			return credit;
		}
	}
	
	/**
	 * 存入现金
	 * @param date		日期
	 * @param amount	金额
	 * @param desc		信息
	 */
	public void deposit(final Date date, double amount, final String desc) {
		record(date, amount, desc);
		acc.change(date, getDebt());
	}
	
	/**
	 * 取出现金
	 * @param date		日期
	 * @param amount	金额
	 * @param desc		信息
	 */
	public void withdraw(final Date date, double amount, final String desc) {
		if(amount - getBalance() > credit) {
			error("not enough credit");
		}
		else {
			record(date, -amount, desc);
			acc.change(date, getDebt());
		}
	}
	
	/**
	 * 结算利息和年费，每月1日调用一次
	 * @param date 日期
	 */
	public void settle(final Date date) {
		double interset = acc.getSum(date) * rate;
		if(interset != 0) {
			record(date, interset, "interest");
		}
		if(date.getMonth() == 1)
			record(date, -fee, "annual fee");
		acc.reset(date, getDebt());
	}
	
	/**
	 * 输出信息
	 */
	public final void show() {
		super.show();
		NumberFormat nf = new DecimalFormat("0.##");
		System.out.print("\tAvailable credit:" + nf.format(getAvailableCredit()));
	}
}
