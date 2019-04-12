/**
 * 
 */
package v8_8;


/**
 * @className Date
 * @description Date.java
 * @author 31415926535x
 * @date 2019年3月5日 下午7:59:46
 * @tag 
 * @version v8_8
 */
public class Date {
	/**
	 * @param year 		年
	 * @param month		月
	 * @param day		日
	 * @param totalDays	该日期是从公元元年1月1日开始的第几天
	 * @param DAYS_BEFORE_MONTH 存储平年中某个月1日之前有多少天，为便于getMaxDay函数的实现，该数组多出一项
	 * @param 
	 */
	private int year;
	private int month;
	private int day;
	private int totalDays;
	
	final int DAYS_BEFORE_MONTH[] = { 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365 };
	
	/**
	 * 用年月日构造日期
	 * @param year	年
	 * @param month	月
	 * @param day	日
	 */
	public Date(int year, int month, int day) {
		this.year = year;
		this.month = month;
		this.day = day;
		if(day <= 0 || day > getMaxDay()) {
			System.out.print("Invalid date: ");
			show();
			System.out.println();
			System.exit(0);
		}
		int years = year - 1;
		totalDays = years * 365 + years / 4 - years / 100 + years / 400 + DAYS_BEFORE_MONTH[month - 1] + day;
		if(isLeapYear() && month > 2)++totalDays;
	}
	
	
	/**
	 * 返回年份
	 * @return year
	 */
	public final int getYear() {
		return year;
	}
	
	/**
	 * 返回月份
	 * @return month
	 */
	public final int getMonth() {
		return month;
	}
	
	/**
	 * 返回第几天
	 * @return day
	 */
	public final int getDay() {
		return day;
	}
	
	/**
	 * 获得当月有多少天
	 * @return day
	 */
	public final int getMaxDay() {
		if(isLeapYear() && month == 2)
			return 29;
		else
			return DAYS_BEFORE_MONTH[month] - DAYS_BEFORE_MONTH[month - 1];
	}
	
	/**
	 * 判断当年是否为闰年
	 * @return true or false
	 */
	public final boolean isLeapYear() {
		return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
	}
	
	/**
	 * 输出当前日期
	 */
	public final void show() {
		System.out.print(getYear() + "-" + getMonth() + "-" + getDay());
	}
	
	/**
	 * 计算两个日期之间差多少天
	 * @param date		日期
	 * @return totalDays - date.totalDays;
	 */
//	public final int distance(final Date date) {
//		return totalDays - date.totalDays;
//	}
	public final int sub(final Date date) {
		return this.totalDays - date.totalDays;
	}
}