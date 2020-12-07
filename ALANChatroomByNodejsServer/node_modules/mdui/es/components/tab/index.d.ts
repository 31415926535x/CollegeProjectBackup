import { JQ } from 'mdui.jq/es/JQ';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/appendTo';
import 'mdui.jq/es/methods/attr';
import 'mdui.jq/es/methods/children';
import 'mdui.jq/es/methods/css';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/eq';
import 'mdui.jq/es/methods/first';
import 'mdui.jq/es/methods/get';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/hide';
import 'mdui.jq/es/methods/index';
import 'mdui.jq/es/methods/innerWidth';
import 'mdui.jq/es/methods/offset';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/removeClass';
import 'mdui.jq/es/methods/show';
import Selector from 'mdui.jq/es/types/Selector';
import '../../jq_extends/static/throttle';
declare module '../../interfaces/MduiStatic' {
    interface MduiStatic {
        /**
         * Tab 选项卡组件
         *
         * 请通过 `new mdui.Tab()` 调用
         */
        Tab: {
            /**
             * 实例化 Tab 组件
             * @param selector CSS 选择器、或 DOM 元素、或 JQ 对象
             * @param options 配置参数
             */
            new (selector: Selector | HTMLElement | ArrayLike<HTMLElement>, options?: OPTIONS): Tab;
        };
    }
}
declare type OPTIONS = {
    /**
     * 切换选项卡的触发方式。`click`: 点击切换；`hover`: 鼠标悬浮切换
     */
    trigger?: 'click' | 'hover';
    /**
     * 是否启用循环切换，若为 `true`，则最后一个选项激活时调用 `next` 方法将回到第一个选项，第一个选项激活时调用 `prev` 方法将回到最后一个选项。
     */
    loop?: boolean;
};
declare class Tab {
    /**
     * tab 元素的 JQ 对象
     */
    $element: JQ;
    /**
     * 配置参数
     */
    options: OPTIONS;
    /**
     * 当前激活的 tab 的索引号。为 -1 时表示没有激活的选项卡，或不存在选项卡
     */
    activeIndex: number;
    /**
     * 选项数组 JQ 对象
     */
    private $tabs;
    /**
     * 激活状态的 tab 底部的指示符
     */
    private $indicator;
    constructor(selector: Selector | HTMLElement | ArrayLike<HTMLElement>, options?: OPTIONS);
    /**
     * 指定选项卡是否已禁用
     * @param $tab
     */
    private isDisabled;
    /**
     * 绑定在 Tab 上点击或悬浮的事件
     * @param tab
     */
    private bindTabEvent;
    /**
     * 触发组件事件
     * @param name
     * @param $element
     * @param parameters
     */
    private triggerEvent;
    /**
     * 设置激活状态的选项卡
     */
    private setActive;
    /**
     * 设置选项卡指示器的位置
     */
    private setIndicatorPosition;
    /**
     * 切换到下一个选项卡
     */
    next(): void;
    /**
     * 切换到上一个选项卡
     */
    prev(): void;
    /**
     * 显示指定索引号、或指定id的选项卡
     * @param index 索引号、或id
     */
    show(index: number | string): void;
    /**
     * 在父元素的宽度变化时，需要调用该方法重新调整指示器位置
     * 在添加或删除选项卡时，需要调用该方法
     */
    handleUpdate(): void;
}
export {};
