/**
 * 最终生成的元素结构为：
 *  <select class="mdui-select" mdui-select="{position: 'top'}" style="display: none;"> // $native
 *    <option value="1">State 1</option>
 *    <option value="2">State 2</option>
 *    <option value="3" disabled="">State 3</option>
 *  </select>
 *  <div class="mdui-select mdui-select-position-top" style="" id="88dec0e4-d4a2-c6d0-0e7f-1ba4501e0553"> // $element
 *    <span class="mdui-select-selected">State 1</span> // $selected
 *    <div class="mdui-select-menu" style="transform-origin: center 100% 0px;"> // $menu
 *      <div class="mdui-select-menu-item mdui-ripple" selected="">State 1</div> // $items
 *      <div class="mdui-select-menu-item mdui-ripple">State 2</div>
 *      <div class="mdui-select-menu-item mdui-ripple" disabled="">State 3</div>
 *    </div>
 *  </div>
 */
import { JQ } from 'mdui.jq/es/JQ';
import 'mdui.jq/es/methods/add';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/after';
import 'mdui.jq/es/methods/append';
import 'mdui.jq/es/methods/appendTo';
import 'mdui.jq/es/methods/attr';
import 'mdui.jq/es/methods/css';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/first';
import 'mdui.jq/es/methods/height';
import 'mdui.jq/es/methods/hide';
import 'mdui.jq/es/methods/index';
import 'mdui.jq/es/methods/innerWidth';
import 'mdui.jq/es/methods/is';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/remove';
import 'mdui.jq/es/methods/removeAttr';
import 'mdui.jq/es/methods/removeClass';
import 'mdui.jq/es/methods/show';
import 'mdui.jq/es/methods/text';
import 'mdui.jq/es/methods/trigger';
import 'mdui.jq/es/methods/val';
import Selector from 'mdui.jq/es/types/Selector';
import '../../jq_extends/methods/transitionEnd';
import '../../jq_extends/static/guid';
declare module '../../interfaces/MduiStatic' {
    interface MduiStatic {
        /**
         * 下拉选择组件
         *
         * 请通过 `new mdui.Select()` 调用
         */
        Select: {
            /**
             * 实例化 Select 组件
             * @param selector CSS 选择器、或 DOM 元素、或 JQ 对象
             * @param options 配置参数
             */
            new (selector: Selector | HTMLElement | ArrayLike<HTMLElement>, options?: OPTIONS): Select;
        };
    }
}
declare type OPTIONS = {
    /**
     * 下拉框位置：`auto`、`top`、`bottom`
     */
    position?: 'auto' | 'top' | 'bottom';
    /**
     * 菜单与窗口上下边框至少保持多少间距
     */
    gutter?: number;
};
declare type STATE = 'closing' | 'closed' | 'opening' | 'opened';
declare class Select {
    /**
     * 原生 `<select>` 元素的 JQ 对象
     */
    $native: JQ<HTMLSelectElement>;
    /**
     * 生成的 `<div class="mdui-select">` 元素的 JQ 对象
     */
    $element: JQ;
    /**
     * 配置参数
     */
    options: OPTIONS;
    /**
     * select 的 size 属性的值，根据该值设置 select 的高度
     */
    private size;
    /**
     * 占位元素，显示已选中菜单项的文本
     */
    private $selected;
    /**
     * 菜单项的外层元素的 JQ 对象
     */
    private $menu;
    /**
     * 菜单项数组的 JQ 对象
     */
    private $items;
    /**
     * 当前选中的菜单项的索引号
     */
    private selectedIndex;
    /**
     * 当前选中菜单项的文本
     */
    private selectedText;
    /**
     * 当前选中菜单项的值
     */
    private selectedValue;
    /**
     * 唯一 ID
     */
    private uniqueID;
    /**
     * 当前 select 的状态
     */
    private state;
    constructor(selector: Selector | HTMLElement | ArrayLike<HTMLElement>, options?: OPTIONS);
    /**
     * 调整菜单位置
     */
    private readjustMenu;
    /**
     * select 是否为打开状态
     */
    private isOpen;
    /**
     * 对原生 select 组件进行了修改后，需要调用该方法
     */
    handleUpdate(): void;
    /**
     * 动画结束的回调
     */
    private transitionEnd;
    /**
     * 触发组件事件
     * @param name
     */
    private triggerEvent;
    /**
     * 切换下拉菜单的打开状态
     */
    toggle(): void;
    /**
     * 打开下拉菜单
     */
    open(): void;
    /**
     * 关闭下拉菜单
     */
    close(): void;
    /**
     * 获取当前菜单的状态。共包含四种状态：`opening`、`opened`、`closing`、`closed`
     */
    getState(): STATE;
}
export {};
