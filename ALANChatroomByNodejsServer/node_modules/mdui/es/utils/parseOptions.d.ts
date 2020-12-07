import 'mdui.jq/es/methods/attr';
import PlainObject from 'mdui.jq/es/interfaces/PlainObject';
/**
 * 解析 DATA API 参数
 * @param element 元素
 * @param name 属性名
 */
declare function parseOptions(element: HTMLElement, name: string): PlainObject;
export { parseOptions };
