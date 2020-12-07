import { JQ } from 'mdui.jq/es/JQ';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/attr';
import 'mdui.jq/es/methods/children';
import 'mdui.jq/es/methods/css';
import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/first';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/height';
import 'mdui.jq/es/methods/is';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/parent';
import 'mdui.jq/es/methods/parents';
import 'mdui.jq/es/methods/removeClass';
import 'mdui.jq/es/methods/width';
import Selector from 'mdui.jq/es/types/Selector';
import '../../jq_extends/methods/transformOrigin';
import '../../jq_extends/methods/transitionEnd';
import '../../jq_extends/static/throttle';
declare module '../../interfaces/MduiStatic' {
    interface MduiStatic {
        /**
         * Menu 组件
         *
         * 请通过 `new mdui.Menu()` 调用
         */
        Menu: {
            /**
             * 实例化 Menu 组件
             * @param anchorSelector 触发菜单的元素的 CSS 选择器、或 DOM 元素、或 JQ 对象
             * @param menuSelector 菜单的 CSS 选择器、或 DOM 元素、或 JQ 对象
             * @param options 配置参数
             */
            new (anchorSelector: Selector | HTMLElement | ArrayLike<HTMLElement>, menuSelector: Selector | HTMLElement | ArrayLike<HTMLElement>, options?: OPTIONS): Menu;
        };
    }
}
declare type OPTIONS = {
    /**
     * 菜单相对于触发它的元素的位置，默认为 `auto`。
     * 取值范围包括：
     *   `top`: 菜单在触发它的元素的上方
     *   `bottom`: 菜单在触发它的元素的下方
     *   `center`: 菜单在窗口中垂直居中
     *   `auto`: 自动判断位置。优先级为：`bottom` > `top` > `center`
     */
    position?: 'auto' | 'top' | 'bottom' | 'center';
    /**
     * 菜单与触发它的元素的对其方式，默认为 `auto`。
     * 取值范围包括：
     *   `left`: 菜单与触发它的元素左对齐
     *   `right`: 菜单与触发它的元素右对齐
     *   `center`: 菜单在窗口中水平居中
     *   `auto`: 自动判断位置：优先级为：`left` > `right` > `center`
     */
    align?: 'auto' | 'left' | 'right' | 'center';
    /**
     * 菜单与窗口边框至少保持多少间距，单位为 px，默认为 `16`
     */
    gutter?: number;
    /**
     * 菜单的定位方式，默认为 `false`。
     * 为 `true` 时，菜单使用 fixed 定位。在页面滚动时，菜单将保持在窗口固定位置，不随滚动条滚动。
     * 为 `false` 时，菜单使用 absolute 定位。在页面滚动时，菜单将随着页面一起滚动。
     */
    fixed?: boolean;
    /**
     * 菜单是否覆盖在触发它的元素的上面，默认为 `auto`
     * 为 `true` 时，使菜单覆盖在触发它的元素的上面
     * 为 `false` 时，使菜单不覆盖触发它的元素
     * 为 `auto` 时，简单菜单覆盖触发它的元素。级联菜单不覆盖触发它的元素
     */
    covered?: boolean | 'auto';
    /**
     * 子菜单的触发方式，默认为 `hover`
     * 为 `click` 时，点击时触发子菜单
     * 为 `hover` 时，鼠标悬浮时触发子菜单
     */
    subMenuTrigger?: 'click' | 'hover';
    /**
     * 子菜单的触发延迟时间（单位：毫秒），只有在 `subMenuTrigger: hover` 时，这个参数才有效，默认为 `200`
     */
    subMenuDelay?: number;
};
declare class Menu {
    /**
     * 触发菜单的元素的 JQ 对象
     */
    $anchor: JQ;
    /**
     * 菜单元素的 JQ 对象
     */
    $element: JQ;
    /**
     * 配置参数
     */
    options: OPTIONS;
    /**
     * 当前菜单状态
     */
    private state;
    /**
     * 是否是级联菜单
     */
    private isCascade;
    /**
     * 菜单是否覆盖在触发它的元素的上面
     */
    private isCovered;
    constructor(anchorSelector: Selector | HTMLElement | ArrayLike<HTMLElement>, menuSelector: Selector | HTMLElement | ArrayLike<HTMLElement>, options?: OPTIONS);
    /**
     * 是否为打开状态
     */
    private isOpen;
    /**
     * 触发组件事件
     * @param name
     */
    private triggerEvent;
    /**
     * 调整主菜单位置
     */
    private readjust;
    /**
     * 调整子菜单的位置
     * @param $submenu
     */
    private readjustSubmenu;
    /**
     * 打开子菜单
     * @param $submenu
     */
    private openSubMenu;
    /**
     * 关闭子菜单，及其嵌套的子菜单
     * @param $submenu
     */
    private closeSubMenu;
    /**
     * 切换子菜单状态
     * @param $submenu
     */
    private toggleSubMenu;
    /**
     * 绑定子菜单事件
     */
    private bindSubMenuEvent;
    /**
     * 动画结束回调
     */
    private transitionEnd;
    /**
     * 切换菜单状态
     */
    toggle(): void;
    /**
     * 打开菜单
     */
    open(): void;
    /**
     * 关闭菜单
     */
    close(): void;
}
export {};
