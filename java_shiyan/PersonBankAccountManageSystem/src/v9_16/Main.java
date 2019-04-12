/**
 * 利用Java自带的ArrayList类来实现各种账户的存储修改等操作
 */
package v9_16;
import java.util.ArrayList;
import java.util.Scanner;

/**
 * @className Main
 * @description Main.java
 * @author 31415926535x
 * @date 2019年3月7日 下午12:16:23
 * @tag 
 * @version v9_16
 */
public class Main {

	/**
	 * @param args
	 */
	@SuppressWarnings("resource")
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Scanner input = new Scanner(System.in);
		
		//起始日期
		Date date = new Date(2008, 11, 1);
		
		//建立账户数组
		ArrayList<Account> accounts = new ArrayList<Account>();
		//ArrayList<Account> accounts = new ArrayList<>();
		
		System.out.println("(a)add account (d)deposit (w)withdraw (s)show (c)change day (n)next month (e)exit");
		
		char cmd;
		
		do {
			//显示日期和总金额
			date.show();
			System.out.print("\tTotal: " + Account.getTotal() + "\tcommand> ");
			
			char type;
			int index, day;
			double amount, credit, rate, fee;
			String id, desc, cmdString;
			Account account;
			
			cmdString = input.next();
			cmd = cmdString.charAt(0);
			
			switch (cmd) {
			case 'a':		//增加账户
				String typeString = input.next();
				type = typeString.charAt(0);
				id = input.next();
				if(type == 's') {
					rate = input.nextDouble();
					account = new SavingsAccount(date, id, rate);
				}
				else {
					credit = input.nextDouble();
					rate = input.nextDouble();
					fee = input.nextDouble();
					account = new CreditAccount(date, id, credit, rate, fee);
				}
				accounts.add(account);
				break;
			case 'd':		//存入现金
				index = input.nextInt();
				amount = input.nextDouble();
				desc = input.nextLine();
				accounts.get(index).deposit(date, amount, desc);
				break;
			case 'w':		//取出现金
				index = input.nextInt();
				amount = input.nextDouble();
				desc = input.nextLine();
				accounts.get(index).withdraw(date, amount, desc);
				break;
			case 's':		//查询各账户信息
				for(int i = 0; i < accounts.size(); ++i) {
					System.out.print("[" + i + "] ");
					accounts.get(i).show();
					System.out.println();
				}
				break;
			case 'c':		//改变日期
				day = input.nextInt();
				if(day < date.getDay()) {
					System.out.print("You cannot specify a previous day");
				}
				else if (day > date.getMaxDay()) {
					System.out.print("Invalid day");
				}
				else {
					date = new Date(date.getYear(), date.getMonth(), day);
				}
				break;
			case 'n':		//进入下个月
				if(date.getMonth() == 12) {
					date = new Date(date.getYear() + 1, 1, 1);
				}
				else {
					date = new Date(date.getYear(), date.getMonth() + 1, 1);
				}
				for(int i = 0; i < accounts.size(); ++i) {
					accounts.get(i).settle(date);
				}
				break;
			}
			
		}while(cmd != 'e');
		
		//清除所有的账户信息，推出程序
		accounts.clear();
	}

}
