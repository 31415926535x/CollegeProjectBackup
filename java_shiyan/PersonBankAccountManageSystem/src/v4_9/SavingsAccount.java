
package v4_9;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.text.NumberFormat;


/**
 * @className SavingsAccount
 * @description SavingsAccount.java
 * @author 31415926535x
 * @date 2019年3月4日 上午11:03:04
 * @tag 
 * @version v4_9
 */
public class SavingsAccount {
	
	/**
	 * @param id 账号
	 * @param balance 余额
	 * @param rate 存款的年利率
	 * @param lastDate 上次变更余额的时期
	 * @param accumulation 余额按日累加之和
	 */
	private int id;					//账号
	private double balance;			//余额
	private double rate;			//存款的年利率
	private int lastDate;			//上次变更余额的时期
	private double accumulation;	//余额按日累加之和
	
	/**
	 * 记录一笔帐
	 * @param date 日期
	 * @param amount 金额
	 */
	private void record(int date, double amount) {
		this.accumulation = accumulate(date);
		this.lastDate = date;
		//amount = Math.floor(amount * 100 + 0.5) / 100;		//保留小数点后两位
		BigDecimal bDecimal = new BigDecimal(amount);
		amount = bDecimal.setScale(2, RoundingMode.HALF_UP).doubleValue();
		this.balance += amount;
		NumberFormat nf = new DecimalFormat("0.##");
		System.out.println(date + "\t#" + id + "\t" + nf.format(amount) + "\t" + nf.format(balance));
	}
	
	/**
	 * 获得到指定日期为止的存款金额按日累积值
	 * @param date
	 * @return accumulation + balance * (date - lastDate)
	 */
	private double accumulate(int date) {
		return accumulation + balance * (date - lastDate);
	}
	
	/**
	 * 构造方法
	 * @param date	日期
	 * @param id	编号
	 * @param rate	利率
	 */
	public SavingsAccount(int date, int id, double rate) {
		// TODO Auto-generated constructor stub
		this.id = id;
		this.balance = 0;
		this.rate = rate;
		this.lastDate = date;
		this.accumulation = 0;
		System.out.println(date + "\t#" + id + " is created");
	}
	
	/**
	 * 返回编号
	 * @return id
	 */
	public int getId() {
		return id;
	}
	
	/**
	 * 返回余额
	 * @return balance
	 */
	public double getBalance() {
		return balance;
	}
	
	/**
	 * 返回存款的年利率
	 * @return rate
	 */
	public double getRate() {
		return rate;
	}
	
	/**
	 * 存入现金
	 * @param date		日期
	 * @param amount	金额
	 */
	public void deposit(int date, double amount) {
		record(date, amount);
	}
	
	/**
	 * 取出现金
	 * @param date		日期
	 * @param amount	金额
	 */
	public void withdraw(int date, double amount) {
		if(amount > getBalance())
			System.out.println("Error: not enough money");
		else {
			record(date, -amount);
		}
	}
	
	/**
	 * 结算利息，每年1月1日调用一次该函数
	 * @param date	日期
	 */
	public void settle(int date) {
		double interest = accumulate(date) * rate / 365;	//计算年息
		if(interest != 0)
			record(date, interest);
		this.accumulation = 0;
	}
	
	/**
	 * 显示账户信息
	 */
	public void show() {
		System.out.print("#" + id + "\tBalance: " + balance);
		System.out.println("#" + id + "   Balance: " + balance);
		System.out.println();
		System.out.println("--------" + balance);
	}
	
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		//建立几个账户
		SavingsAccount sa0 = new SavingsAccount(1, 21325302, 0.015);
		SavingsAccount sa1 = new SavingsAccount(1, 58320212, 0.015);
		
		//几笔账目
		sa0.deposit(5, 5000);
		sa1.deposit(25, 10000);
		sa0.deposit(45, 5500);
		sa1.withdraw(60, 4000);
		
		//开户后第90天到了银行的计息日，结算所有账户的年息
		sa0.settle(90);
		sa1.settle(90);

		//输出各个账户信息
		sa0.show();
		System.out.println();
		sa1.show();	
		System.out.println();
	}

}
