import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/on';
import { Dialog } from './class';
import './index';
declare module '../../interfaces/MduiStatic' {
    interface MduiStatic {
        /**
         * 打开一个对话框，标题、内容、按钮等都可以自定义
         * @param options 配置参数
         */
        dialog(options: OPTIONS): Dialog;
    }
}
declare type BUTTON = {
    /**
     * 按钮文本
     */
    text?: string;
    /**
     * 按钮文本是否加粗，默认为 `false`
     */
    bold?: boolean;
    /**
     * 点击按钮后是否关闭对话框，默认为 `true`
     */
    close?: boolean;
    /**
     * 点击按钮的回调函数，参数为对话框的实例
     */
    onClick?: (dialog: Dialog) => void;
};
declare type OPTIONS = {
    /**
     * 对话框的标题
     */
    title?: string;
    /**
     * 对话框的内容
     */
    content?: string;
    /**
     * 按钮数组，每个按钮都是一个带按钮参数的对象
     */
    buttons?: BUTTON[];
    /**
     * 按钮是否垂直排列，默认为 `false`
     */
    stackedButtons?: boolean;
    /**
     * 添加到 `.mdui-dialog` 上的 CSS 类
     */
    cssClass?: string;
    /**
     * 是否监听 `hashchange` 事件，为 `true` 时可以通过 Android 的返回键或浏览器后退按钮关闭对话框，默认为 `true`
     */
    history?: boolean;
    /**
     * 打开对话框后是否显示遮罩层，默认为 `true`
     */
    overlay?: boolean;
    /**
     * 是否模态化对话框。为 `false` 时点击对话框外面的区域时关闭对话框，否则不关闭
     */
    modal?: boolean;
    /**
     * 按下 Esc 键时是否关闭对话框，默认为 `true`
     */
    closeOnEsc?: boolean;
    /**
     * 关闭对话框后是否自动销毁对话框，默认为 `true`
     */
    destroyOnClosed?: boolean;
    /**
     * 打开动画开始时的回调，参数为对话框实例
     */
    onOpen?: (dialog: Dialog) => void;
    /**
     * 打开动画结束时的回调，参数为对话框实例
     */
    onOpened?: (dialog: Dialog) => void;
    /**
     * 关闭动画开始时的回调，参数为对话框实例
     */
    onClose?: (dialog: Dialog) => void;
    /**
     * 关闭动画结束时的回调，参数为对话框实例
     */
    onClosed?: (dialog: Dialog) => void;
};
export {};
