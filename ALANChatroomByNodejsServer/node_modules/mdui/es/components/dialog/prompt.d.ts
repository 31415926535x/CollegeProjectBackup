import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/val';
import '../textfield';
import { Dialog } from './class';
import './dialog';
declare module '../../interfaces/MduiStatic' {
    interface MduiStatic {
        /**
         * 打开一个提示用户输入的对话框，可以包含标题、文本框标签、文本框、一个确认按钮和一个取消按钮
         * @param label 文本框浮动标签的文本
         * @param title 标题
         * @param onConfirm 点击确认按钮的回调。含两个参数，分别为文本框的值和对话框实例
         * @param onCancel 点击取消按钮的回调。含两个参数，分别为文本框的值和对话框实例
         * @param options 配置参数
         */
        prompt(label: string, title: string, onConfirm?: (value: string, dialog: Dialog) => void, onCancel?: (value: string, dialog: Dialog) => void, options?: OPTIONS): Dialog;
        /**
         * 打开一个提示用户输入的对话框，可以包含文本框标签、文本框、一个确认按钮和一个取消按钮
         * @param label 文本框浮动标签的文本
         * @param onConfirm 点击确认按钮的回调。含两个参数，分别为文本框的值和对话框实例
         * @param onCancel 点击取消按钮的回调，含两个参数，分别为文本框的值和对话框实例
         * @param options 配置参数
         */
        prompt(label: string, onConfirm?: (value: string, dialog: Dialog) => void, onCancel?: (value: string, dialog: Dialog) => void, options?: OPTIONS): Dialog;
    }
}
declare type OPTIONS = {
    /**
     * 确认按钮的文本
     */
    confirmText?: string;
    /**
     * 取消按钮的文本
     */
    cancelText?: string;
    /**
     * 是否监听 hashchange 事件，为 `true` 时可以通过 Android 的返回键或浏览器后退按钮关闭对话框，默认为 `true`
     */
    history?: boolean;
    /**
     * 是否模态化对话框。为 `false` 时点击对话框外面的区域时关闭对话框，否则不关闭，默认为 `false`
     */
    modal?: boolean;
    /**
     * 是否在按下 Esc 键时是否关闭对话框，默认为 `true`
     */
    closeOnEsc?: boolean;
    /**
     * 是否在按下取消按钮时是否关闭对话框
     */
    closeOnCancel?: boolean;
    /**
     * 是否在按下确认按钮时是否关闭对话框
     */
    closeOnConfirm?: boolean;
    /**
     * 是否在按下 Enter 键时触发 `onConfirm` 回调函数，默认为 `false`
     */
    confirmOnEnter?: boolean;
    /**
     * 文本框的类型。`text`: 单行文本框； `textarea`: 多行文本框
     */
    type?: 'text' | 'textarea';
    /**
     * 最大输入字符数量，为 0 时表示不限制
     */
    maxlength?: number;
    /**
     * 文本框的默认值
     */
    defaultValue?: string;
};
export {};
