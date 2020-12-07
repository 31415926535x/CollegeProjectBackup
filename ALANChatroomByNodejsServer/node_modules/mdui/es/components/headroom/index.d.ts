import { JQ } from 'mdui.jq/es/JQ';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/first';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/removeClass';
import Selector from 'mdui.jq/es/types/Selector';
import '../../jq_extends/methods/transitionEnd';
declare module '../../interfaces/MduiStatic' {
    interface MduiStatic {
        /**
         * Headroom 插件
         *
         * 请通过 `new mdui.Headroom()` 调用
         */
        Headroom: {
            /**
             * 实例化 Headroom 组件
             * @param selector CSS 选择器、或 DOM 元素、或 JQ 对象
             * @param options 配置参数
             */
            new (selector: Selector | HTMLElement | ArrayLike<HTMLElement>, options?: OPTIONS): Headroom;
        };
    }
}
declare type TOLERANCE = {
    /**
     * 滚动条向下滚动多少距离开始隐藏或显示元素
     */
    down: number;
    /**
     * 滚动条向上滚动多少距离开始隐藏或显示元素
     */
    up: number;
};
declare type OPTIONS = {
    /**
     * 滚动条滚动多少距离开始隐藏或显示元素
     */
    tolerance?: TOLERANCE | number;
    /**
     * 在页面顶部多少距离内滚动不会隐藏元素
     */
    offset?: number;
    /**
     * 初始化时添加的类
     */
    initialClass?: string;
    /**
     * 元素固定时添加的类
     */
    pinnedClass?: string;
    /**
     * 元素隐藏时添加的类
     */
    unpinnedClass?: string;
};
declare type STATE = 'pinning' | 'pinned' | 'unpinning' | 'unpinned';
declare class Headroom {
    /**
     * headroom 元素的 JQ 对象
     */
    $element: JQ;
    /**
     * 配置参数
     */
    options: OPTIONS;
    /**
     * 当前 headroom 的状态
     */
    private state;
    /**
     * 当前是否启用
     */
    private isEnable;
    /**
     * 上次滚动后，垂直方向的距离
     */
    private lastScrollY;
    /**
     * AnimationFrame ID
     */
    private rafId;
    constructor(selector: Selector | HTMLElement | ArrayLike<HTMLElement>, options?: OPTIONS);
    /**
     * 滚动时的处理
     */
    private onScroll;
    /**
     * 触发组件事件
     * @param name
     */
    private triggerEvent;
    /**
     * 动画结束的回调
     */
    private transitionEnd;
    /**
     * 使元素固定住
     */
    pin(): void;
    /**
     * 使元素隐藏
     */
    unpin(): void;
    /**
     * 启用 headroom 插件
     */
    enable(): void;
    /**
     * 禁用 headroom 插件
     */
    disable(): void;
    /**
     * 获取当前状态。共包含四种状态：`pinning`、`pinned`、`unpinning`、`unpinned`
     */
    getState(): STATE;
}
export {};
