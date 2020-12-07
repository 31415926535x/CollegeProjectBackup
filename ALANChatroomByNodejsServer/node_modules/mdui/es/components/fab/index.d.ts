import { JQ } from 'mdui.jq/es/JQ';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/css';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/first';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/last';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/parents';
import 'mdui.jq/es/methods/removeClass';
import Selector from 'mdui.jq/es/types/Selector';
import '../../jq_extends/methods/transitionEnd';
declare module '../../interfaces/MduiStatic' {
    interface MduiStatic {
        /**
         * 浮动操作按钮组件
         *
         * 请通过 `new mdui.Fab()` 调用
         */
        Fab: {
            /**
             * 实例化 Fab 组件
             * @param selector CSS 选择器、或 DOM 元素、或 JQ 对象
             * @param options 配置参数
             */
            new (selector: Selector | HTMLElement | ArrayLike<HTMLElement>, options?: OPTIONS): Fab;
        };
    }
}
declare type OPTIONS = {
    /**
     * 触发方式。`hover`: 鼠标悬浮触发；`click`: 点击触发
     *
     * 默认为 `hover`
     */
    trigger?: 'click' | 'hover';
};
declare type STATE = 'opening' | 'opened' | 'closing' | 'closed';
declare class Fab {
    /**
     * Fab 元素的 JQ 对象
     */
    $element: JQ;
    /**
     * 配置参数
     */
    options: OPTIONS;
    /**
     * 当前 fab 的状态
     */
    private state;
    /**
     * 按钮元素
     */
    private $btn;
    /**
     * 拨号菜单元素
     */
    private $dial;
    /**
     * 拨号菜单内的按钮
     */
    private $dialBtns;
    constructor(selector: Selector | HTMLElement | ArrayLike<HTMLElement>, options?: OPTIONS);
    /**
     * 触发组件事件
     * @param name
     */
    private triggerEvent;
    /**
     * 当前是否为打开状态
     */
    private isOpen;
    /**
     * 打开快速拨号菜单
     */
    open(): void;
    /**
     * 关闭快速拨号菜单
     */
    close(): void;
    /**
     * 切换快速拨号菜单的打开状态
     */
    toggle(): void;
    /**
     * 以动画的形式显示整个浮动操作按钮
     */
    show(): void;
    /**
     * 以动画的形式隐藏整个浮动操作按钮
     */
    hide(): void;
    /**
     * 返回当前快速拨号菜单的打开状态。共包含四种状态：`opening`、`opened`、`closing`、`closed`
     */
    getState(): STATE;
}
export {};
