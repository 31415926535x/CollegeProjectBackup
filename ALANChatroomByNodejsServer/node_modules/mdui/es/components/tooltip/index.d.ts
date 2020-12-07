import { JQ } from 'mdui.jq/es/JQ';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/appendTo';
import 'mdui.jq/es/methods/attr';
import 'mdui.jq/es/methods/css';
import 'mdui.jq/es/methods/first';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/height';
import 'mdui.jq/es/methods/html';
import 'mdui.jq/es/methods/offset';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/removeClass';
import 'mdui.jq/es/methods/width';
import Selector from 'mdui.jq/es/types/Selector';
import '../../jq_extends/methods/transformOrigin';
import '../../jq_extends/methods/transitionEnd';
import '../../jq_extends/static/guid';
declare module '../../interfaces/MduiStatic' {
    interface MduiStatic {
        /**
         * Tooltip 组件
         *
         * 请通过 `new mdui.Tooltip()` 调用
         */
        Tooltip: {
            /**
             * 实例化 Tooltip 组件
             * @param selector CSS 选择器、或 DOM 元素、或 JQ 对象
             * @param options 配置参数
             */
            new (selector: Selector | HTMLElement | ArrayLike<HTMLElement>, options?: OPTIONS): Tooltip;
        };
    }
}
declare type POSITION = 'auto' | 'bottom' | 'top' | 'left' | 'right';
declare type OPTIONS = {
    /**
     * Tooltip 的位置。取值范围包括 `auto`、`bottom`、`top`、`left`、`right`。
     * 为 `auto` 时，会自动判断位置。默认在下方。优先级为 `bottom` > `top` > `left` > `right`。
     * 默认为 `auto`
     */
    position?: POSITION;
    /**
     * 延时触发，单位毫秒。默认为 `0`，即没有延时。
     */
    delay?: number;
    /**
     * Tooltip 的内容
     */
    content?: string;
};
declare type STATE = 'opening' | 'opened' | 'closing' | 'closed';
declare class Tooltip {
    /**
     * 触发 tooltip 元素的 JQ 对象
     */
    $target: JQ;
    /**
     * tooltip 元素的 JQ 对象
     */
    $element: JQ;
    /**
     * 配置参数
     */
    options: OPTIONS;
    /**
     * 当前 tooltip 的状态
     */
    private state;
    /**
     * setTimeout 的返回值
     */
    private timeoutId;
    constructor(selector: Selector | HTMLElement | ArrayLike<HTMLElement>, options?: OPTIONS);
    /**
     * 元素是否已禁用
     * @param element
     */
    private isDisabled;
    /**
     * 是否是桌面设备
     */
    private isDesktop;
    /**
     * 设置 Tooltip 的位置
     */
    private setPosition;
    /**
     * 触发组件事件
     * @param name
     */
    private triggerEvent;
    /**
     * 动画结束回调
     */
    private transitionEnd;
    /**
     * 当前 tooltip 是否为打开状态
     */
    private isOpen;
    /**
     * 执行打开 tooltip
     */
    private doOpen;
    /**
     * 打开 Tooltip
     * @param options 允许每次打开时设置不同的参数
     */
    open(options?: OPTIONS): void;
    /**
     * 关闭 Tooltip
     */
    close(): void;
    /**
     * 切换 Tooltip 的打开状态
     */
    toggle(): void;
    /**
     * 获取 Tooltip 状态。共包含四种状态：`opening`、`opened`、`closing`、`closed`
     */
    getState(): STATE;
}
export {};
