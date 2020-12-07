declare type Func = () => any;
/**
 * 根据队列名，获取队列中所有函数
 * @param name 队列名
 */
declare function queue(name: string): Func[];
/**
 * 写入队列
 * @param name 队列名
 * @param func 函数
 */
declare function queue(name: string, func: Func): void;
/**
 * 从队列中移除第一个函数，并执行该函数
 * @param name 队列满
 */
declare function dequeue(name: string): void;
export { queue, dequeue };
