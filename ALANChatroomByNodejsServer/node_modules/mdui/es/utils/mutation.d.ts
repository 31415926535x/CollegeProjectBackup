import PlainObject from 'mdui.jq/es/interfaces/PlainObject';
declare type TYPE_API_INIT = (this: HTMLElement, i: number, element: HTMLElement) => void;
/**
 * CSS 选择器和初始化函数组成的对象
 */
declare const entries: PlainObject<TYPE_API_INIT>;
/**
 * 注册并执行初始化函数
 * @param selector CSS 选择器
 * @param apiInit 初始化函数
 * @param i 元素索引
 * @param element 元素
 */
declare function mutation(selector: string, apiInit: TYPE_API_INIT, i: number, element: HTMLElement): void;
export { TYPE_API_INIT, entries, mutation };
