/**
 * 
 */
package v7_10;

/**
 * @className Accumulator
 * @description Accumulator.java
 * @author 31415926535x
 * @date 2019年3月5日 下午5:37:40
 * @tag 
 * @version v7_10
 */
public class Accumulator {
	/**
	 * @param lastDate	上次变更数值的日期
	 * @param value		数值的当前值
	 * @param sum		数值按日累加之和
	 */
	private Date lastDate;
	double value;
	double sum;
	
	/**
	 * 构造方法，date为开始累加的日期，value为初始值
	 * @param date		日期
	 * @param value		值
	 */
	public Accumulator(final Date date, double value) {
		this.lastDate = date;
		this.value = value;
		this.sum = 0;
	}
	
	/**
	 * 获得到日期date的累加结果	
	 * @param date		日期
	 * @return
	 */
	public final double getSum(final Date date) {
		return sum + value * date.distance(lastDate);
	}
	
	/**
	 * 在date将数值变更为value
	 * @param date		日期
	 * @param value		值
	 */
	public void change(final Date date, double value) {
		this.sum = getSum(date);
		this.lastDate = date;
		this.value = value;
	}
	
	/**
	 * 初始化，将日期变为date，数值变为value，累加器清零
	 * @param date		日期
	 * @param value		值
	 */
	public void reset(final Date date, double value) {
		this.lastDate = date;
		this.value = value;
		this.sum = 0;
	}
}
