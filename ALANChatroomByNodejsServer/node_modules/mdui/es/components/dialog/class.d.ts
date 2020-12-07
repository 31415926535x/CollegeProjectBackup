import { JQ } from 'mdui.jq/es/JQ';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/append';
import 'mdui.jq/es/methods/children';
import 'mdui.jq/es/methods/css';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/first';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/height';
import 'mdui.jq/es/methods/hide';
import 'mdui.jq/es/methods/innerHeight';
import 'mdui.jq/es/methods/off';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/remove';
import 'mdui.jq/es/methods/removeClass';
import 'mdui.jq/es/methods/show';
import Selector from 'mdui.jq/es/types/Selector';
import '../../jq_extends/methods/transitionEnd';
import '../../jq_extends/static/hideOverlay';
import '../../jq_extends/static/lockScreen';
import '../../jq_extends/static/showOverlay';
import '../../jq_extends/static/throttle';
import '../../jq_extends/static/unlockScreen';
declare type OPTIONS = {
    /**
     * 打开对话框时是否添加 url hash，若为 `true`，则打开对话框后可用过浏览器的后退按钮或 Android 的返回键关闭对话框。
     */
    history?: boolean;
    /**
     * 打开对话框时是否显示遮罩。
     */
    overlay?: boolean;
    /**
     * 是否模态化对话框。为 `false` 时点击对话框外面的区域时关闭对话框，否则不关闭。
     */
    modal?: boolean;
    /**
     * 按下 Esc 键时是否关闭对话框。
     */
    closeOnEsc?: boolean;
    /**
     * 按下取消按钮时是否关闭对话框。
     */
    closeOnCancel?: boolean;
    /**
     * 按下确认按钮时是否关闭对话框。
     */
    closeOnConfirm?: boolean;
    /**
     * 关闭对话框后是否自动销毁对话框。
     */
    destroyOnClosed?: boolean;
};
declare type STATE = 'opening' | 'opened' | 'closing' | 'closed';
/**
 * 当前显示的对话框实例
 */
declare let currentInst: null | Dialog;
declare class Dialog {
    /**
     * dialog 元素的 JQ 对象
     */
    $element: JQ;
    /**
     * 配置参数
     */
    options: OPTIONS;
    /**
     * 当前 dialog 的状态
     */
    state: STATE;
    /**
     * dialog 元素是否是动态添加的
     */
    private append;
    constructor(selector: Selector | HTMLElement | ArrayLike<HTMLElement>, options?: OPTIONS);
    /**
     * 触发组件事件
     * @param name
     */
    private triggerEvent;
    /**
     * 窗口宽度变化，或对话框内容变化时，调整对话框位置和对话框内的滚动条
     */
    private readjust;
    /**
     * hashchange 事件触发时关闭对话框
     */
    private hashchangeEvent;
    /**
     * 点击遮罩层关闭对话框
     * @param event
     */
    private overlayClick;
    /**
     * 动画结束回调
     */
    private transitionEnd;
    /**
     * 打开指定对话框
     */
    private doOpen;
    /**
     * 当前对话框是否为打开状态
     */
    private isOpen;
    /**
     * 打开对话框
     */
    open(): void;
    /**
     * 关闭对话框
     */
    close(historyBack?: boolean): void;
    /**
     * 切换对话框打开/关闭状态
     */
    toggle(): void;
    /**
     * 获取对话框状态。共包含四种状态：`opening`、`opened`、`closing`、`closed`
     */
    getState(): STATE;
    /**
     * 销毁对话框
     */
    destroy(): void;
    /**
     * 对话框内容变化时，需要调用该方法来调整对话框位置和滚动条高度
     */
    handleUpdate(): void;
}
export { currentInst, OPTIONS, Dialog };
