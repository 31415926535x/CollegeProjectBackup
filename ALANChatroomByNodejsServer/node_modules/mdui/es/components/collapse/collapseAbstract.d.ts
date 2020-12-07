import { JQ } from 'mdui.jq/es/JQ';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/children';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/eq';
import 'mdui.jq/es/methods/first';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/height';
import 'mdui.jq/es/methods/is';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/parent';
import 'mdui.jq/es/methods/parents';
import 'mdui.jq/es/methods/removeClass';
import Selector from 'mdui.jq/es/types/Selector';
import '../../jq_extends/methods/reflow';
import '../../jq_extends/methods/transition';
import '../../jq_extends/methods/transitionEnd';
declare type OPTIONS = {
    /**
     * 是否启用手风琴效果
     * 为 `true` 时，最多只能有一个面板项处于打开状态，打开一个面板项时会关闭其他面板项
     * 为 `false` 时，可同时打开多个面板项
     */
    accordion?: boolean;
};
declare abstract class CollapseAbstract {
    /**
     * collapse 元素的 JQ 对象
     */
    $element: JQ;
    /**
     * 配置参数
     */
    options: OPTIONS;
    /**
     * item 的 class 名
     */
    private classItem;
    /**
     * 打开状态的 item 的 class 名
     */
    private classItemOpen;
    /**
     * item-header 的 class 名
     */
    private classHeader;
    /**
     * item-body 的 class 名
     */
    private classBody;
    /**
     * 获取继承的组件名称
     */
    protected abstract getNamespace(): string;
    constructor(selector: Selector | HTMLElement | ArrayLike<HTMLElement>, options?: OPTIONS);
    /**
     * 绑定事件
     */
    private bindEvent;
    /**
     * 指定 item 是否处于打开状态
     * @param $item
     */
    private isOpen;
    /**
     * 获取所有 item
     */
    private getItems;
    /**
     * 获取指定 item
     * @param item
     */
    private getItem;
    /**
     * 触发组件事件
     * @param name 事件名
     * @param $item 事件触发的目标 item
     */
    private triggerEvent;
    /**
     * 动画结束回调
     * @param $content body 元素
     * @param $item item 元素
     */
    private transitionEnd;
    /**
     * 打开指定面板项
     * @param item 面板项的索引号、或 CSS 选择器、或 DOM 元素、或 JQ 对象
     */
    open(item: number | Selector | HTMLElement | ArrayLike<HTMLElement>): void;
    /**
     * 关闭指定面板项
     * @param item 面板项的索引号、或 CSS 选择器、或 DOM 元素、或 JQ 对象
     */
    close(item: number | Selector | HTMLElement | ArrayLike<HTMLElement>): void;
    /**
     * 切换指定面板项的打开状态
     * @param item 面板项的索引号、或 CSS 选择器、或 DOM 元素、或 JQ 对象
     */
    toggle(item: number | Selector | HTMLElement | ArrayLike<HTMLElement>): void;
    /**
     * 打开所有面板项
     */
    openAll(): void;
    /**
     * 关闭所有面板项
     */
    closeAll(): void;
}
export { OPTIONS, CollapseAbstract };
