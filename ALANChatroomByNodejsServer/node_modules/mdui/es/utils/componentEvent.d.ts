import { JQ } from 'mdui.jq/es/JQ';
import PlainObject from 'mdui.jq/es/interfaces/PlainObject';
import 'mdui.jq/es/methods/trigger';
/**
 * 触发组件上的事件
 * @param eventName 事件名
 * @param componentName 组件名
 * @param target 在该元素上触发事件
 * @param instance 组件实例
 * @param parameters 事件参数
 */
declare function componentEvent(eventName: string, componentName: string, target: HTMLElement | HTMLElement[] | JQ, instance?: any, parameters?: PlainObject): void;
export { componentEvent };
