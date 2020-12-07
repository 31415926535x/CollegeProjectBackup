import { Dialog } from './class';
import './dialog';
declare module '../../interfaces/MduiStatic' {
    interface MduiStatic {
        /**
         * 打开一个警告框，可以包含标题、内容和一个确认按钮
         * @param text 警告框内容
         * @param title 警告框标题
         * @param onConfirm 点击确认按钮的回调函数，参数为对话框实例
         * @param options 配置参数
         */
        alert(text: string, title: string, onConfirm?: (dialog: Dialog) => void, options?: OPTIONS): Dialog;
        /**
         * 打开一个警告框，可以包含内容，和一个确认按钮
         * @param text 警告框内容
         * @param onConfirm 点击确认按钮的回调函数，参数为对话框实例
         * @param options 配置参数
         */
        alert(text: string, onConfirm?: (dialog: Dialog) => void, options?: OPTIONS): Dialog;
    }
}
declare type OPTIONS = {
    /**
     * 确认按钮的文本
     */
    confirmText?: string;
    /**
     * 是否监听 hashchange 事件，为 `true` 时可以通过 Android 的返回键或浏览器后退按钮关闭对话框，默认为 `true`
     */
    history?: boolean;
    /**
     * 是否模态化对话框。为 `false` 时点击对话框外面的区域时关闭对话框，否则不关闭，默认为 `false`
     */
    modal?: boolean;
    /**
     * 按下 Esc 键时是否关闭对话框，默认为 `true`
     */
    closeOnEsc?: boolean;
    /**
     * 是否在按下确认按钮时是否关闭对话框
     */
    closeOnConfirm?: boolean;
};
export {};
