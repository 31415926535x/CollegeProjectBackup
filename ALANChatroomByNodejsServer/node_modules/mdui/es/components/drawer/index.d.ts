/**
 * 在桌面设备上默认显示抽屉栏，不显示遮罩层
 * 在手机和平板设备上默认不显示抽屉栏，始终显示遮罩层，且覆盖导航栏
 */
import { JQ } from 'mdui.jq/es/JQ';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/first';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/off';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/one';
import 'mdui.jq/es/methods/removeClass';
import 'mdui.jq/es/methods/width';
import Selector from 'mdui.jq/es/types/Selector';
import '../../jq_extends/methods/transitionEnd';
import '../../jq_extends/static/hideOverlay';
import '../../jq_extends/static/lockScreen';
import '../../jq_extends/static/showOverlay';
import '../../jq_extends/static/throttle';
import '../../jq_extends/static/unlockScreen';
declare module '../../interfaces/MduiStatic' {
    interface MduiStatic {
        /**
         * Drawer 组件
         *
         * 请通过 `new mdui.Drawer()` 调用
         */
        Drawer: {
            /**
             * 实例化 Drawer 组件
             * @param selector CSS 选择器、或 DOM 元素、或 JQ 对象
             * @param options 配置参数
             */
            new (selector: Selector | HTMLElement | ArrayLike<HTMLElement>, options?: OPTIONS): Drawer;
        };
    }
}
declare type OPTIONS = {
    /**
     * 打开抽屉栏时是否显示遮罩层。该参数只对中等屏幕及以上的设备有效，在超小屏和小屏设备上始终会显示遮罩层。
     */
    overlay?: boolean;
    /**
     * 是否启用滑动手势。
     */
    swipe?: boolean;
};
declare type STATE = 'opening' | 'opened' | 'closing' | 'closed';
declare class Drawer {
    /**
     * drawer 元素的 JQ 对象
     */
    $element: JQ;
    /**
     * 配置参数
     */
    options: OPTIONS;
    /**
     * 当前是否显示着遮罩层
     */
    private overlay;
    /**
     * 抽屉栏的位置
     */
    private position;
    /**
     * 当前抽屉栏状态
     */
    private state;
    constructor(selector: Selector | HTMLElement | ArrayLike<HTMLElement>, options?: OPTIONS);
    /**
     * 是否是桌面设备
     */
    private isDesktop;
    /**
     * 滑动手势支持
     */
    private swipeSupport;
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
     * 是否处于打开状态
     */
    private isOpen;
    /**
     * 打开抽屉栏
     */
    open(): void;
    /**
     * 关闭抽屉栏
     */
    close(): void;
    /**
     * 切换抽屉栏打开/关闭状态
     */
    toggle(): void;
    /**
     * 返回当前抽屉栏的状态。共包含四种状态：`opening`、`opened`、`closing`、`closed`
     */
    getState(): STATE;
}
export {};
