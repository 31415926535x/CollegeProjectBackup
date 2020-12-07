import { JQ } from 'mdui.jq/es/JQ';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/appendTo';
import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/off';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/parents';
import 'mdui.jq/es/methods/remove';
import '../../jq_extends/methods/reflow';
import '../../jq_extends/methods/transform';
import '../../jq_extends/methods/transitionEnd';
declare module '../../interfaces/MduiStatic' {
    interface MduiStatic {
        /**
         * 打开一个 Snackbar
         * @param message Snackbar 的文本
         * @param options 配置参数
         */
        snackbar(message: string, options?: OPTIONS): Snackbar;
        /**
         * 打开一个 Snackbar
         * @param options 配置参数
         */
        snackbar(options: OPTIONS): Snackbar;
    }
}
declare type OPTIONS = {
    /**
     * Snackbar 的文本。通过 `mdui.snackbar(options)` 调用时，该参数不能为空
     */
    message?: string;
    /**
     * 在用户没有操作时多长时间自动隐藏，单位（毫秒）。为 `0` 时表示不自动关闭，默认为 `4000`
     */
    timeout?: number;
    /**
     * Snackbar 的位置，默认为 `bottom`。
     * 取值范围包括：
     *   `bottom`: 下方
     *   `top`: 上方
     *   `left-top`: 左上角
     *   `left-bottom`: 左下角
     *   `right-top`: 右上角
     *   `right-bottom`: 右下角
     */
    position?: 'bottom' | 'top' | 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom';
    /**
     * 按钮的文本
     */
    buttonText?: string;
    /**
     * 按钮的文本颜色，可以是颜色名或颜色值，如 `red`、`#ffffff`、`rgba(255, 255, 255, 0.3)` 等。默认为 `#90CAF9`
     */
    buttonColor?: string;
    /**
     * 点击按钮时是否关闭 Snackbar，默认为 `true`
     */
    closeOnButtonClick?: boolean;
    /**
     * 点击或触摸 Snackbar 以外的区域时是否关闭 Snackbar，默认为 `true`
     */
    closeOnOutsideClick?: boolean;
    /**
     * 在 Snackbar 上点击的回调函数，参数为 Snackbar 的实例
     */
    onClick?: (snackbar: Snackbar) => void;
    /**
     * 点击 Snackbar 上的按钮时的回调函数，参数为 Snackbar 的实例
     */
    onButtonClick?: (snackbar: Snackbar) => void;
    /**
     * Snackbar 开始打开时的回调函数，参数为 Snackbar 的实例
     */
    onOpen?: (snackbar: Snackbar) => void;
    /**
     * Snackbar 打开后的回调函数，参数为 Snackbar 的实例
     */
    onOpened?: (snackbar: Snackbar) => void;
    /**
     * Snackbar 开始关闭时的回调函数，参数为 Snackbar 的实例
     */
    onClose?: (snackbar: Snackbar) => void;
    /**
     * Snackbar 关闭后的回调函数，参数为 Snackbar 的实例
     */
    onClosed?: (snackbar: Snackbar) => void;
};
declare class Snackbar {
    /**
     * Snackbar 元素
     */
    $element: JQ;
    /**
     * 配置参数
     */
    options: OPTIONS;
    /**
     * 当前 Snackbar 的状态
     */
    private state;
    /**
     * setTimeout 的 ID
     */
    private timeoutId;
    constructor(options: OPTIONS);
    /**
     * 点击 Snackbar 外面的区域关闭
     * @param event
     */
    private closeOnOutsideClick;
    /**
     * 设置 Snackbar 的位置
     * @param state
     */
    private setPosition;
    /**
     * 打开 Snackbar
     */
    open(): void;
    /**
     * 关闭 Snackbar
     */
    close(): void;
}
export {};
