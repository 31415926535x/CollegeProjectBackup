/**
 * 
 */
package v6_25;
/**
 * @className Main
 * @description Main.java
 * @author 31415926535x
 * @date 2019年3月5日 下午1:38:57
 * @tag 
 * @version v6_25
 */
public class Main {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Date date = new Date(2008, 11, 1);
		SavingsAccount account[] = new SavingsAccount[2];
		
		account[0] = new SavingsAccount(date, "S3755217", 0.015);
		account[1] = new SavingsAccount(date, "02342342", 0.015);
		
		final int n= account.length;
		account[0].deposit(new Date(2008, 11, 5), 5000, "salary");
		account[1].deposit(new Date(2008, 11, 25), 10000, "sell stock 0323");
		
		account[0].deposit(new Date(2008, 12, 5), 5500, "salary");
		account[1].withdraw(new Date(2008, 12, 20), 4000, "buy a laptop");
		
		System.out.println();
		
		for(int i = 0; i <= n - 1; ++i) {
			account[i].settle(new Date(2009, 1, 1));
			account[i].show();
			System.out.println();
		}
		System.out.println("Total: " + SavingsAccount.getTotal());
	}

}
