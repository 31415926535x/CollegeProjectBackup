import $ from 'mdui.jq/es/$';
import contains from 'mdui.jq/es/functions/contains';
import extend from 'mdui.jq/es/functions/extend';
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
import '../../jq_extends/methods/transitionEnd';
import '../../jq_extends/static/hideOverlay';
import '../../jq_extends/static/lockScreen';
import '../../jq_extends/static/showOverlay';
import '../../jq_extends/static/throttle';
import '../../jq_extends/static/unlockScreen';
import { componentEvent } from '../../utils/componentEvent';
import { $window } from '../../utils/dom';
import { dequeue, queue } from '../../utils/queue';
const DEFAULT_OPTIONS = {
    history: true,
    overlay: true,
    modal: false,
    closeOnEsc: true,
    closeOnCancel: true,
    closeOnConfirm: true,
    destroyOnClosed: false,
};
/**
 * 当前显示的对话框实例
 */
let currentInst = null;
/**
 * 队列名
 */
const queueName = '_mdui_dialog';
/**
 * 窗口是否已锁定
 */
let isLockScreen = false;
/**
 * 遮罩层元素
 */
let $overlay;
class Dialog {
    constructor(selector, options = {}) {
        /**
         * 配置参数
         */
        this.options = extend({}, DEFAULT_OPTIONS);
        /**
         * 当前 dialog 的状态
         */
        this.state = 'closed';
        /**
         * dialog 元素是否是动态添加的
         */
        this.append = false;
        this.$element = $(selector).first();
        // 如果对话框元素没有在当前文档中，则需要添加
        if (!contains(document.body, this.$element[0])) {
            this.append = true;
            $('body').append(this.$element);
        }
        extend(this.options, options);
        // 绑定取消按钮事件
        this.$element.find('[mdui-dialog-cancel]').each((_, cancel) => {
            $(cancel).on('click', () => {
                this.triggerEvent('cancel');
                if (this.options.closeOnCancel) {
                    this.close();
                }
            });
        });
        // 绑定确认按钮事件
        this.$element.find('[mdui-dialog-confirm]').each((_, confirm) => {
            $(confirm).on('click', () => {
                this.triggerEvent('confirm');
                if (this.options.closeOnConfirm) {
                    this.close();
                }
            });
        });
        // 绑定关闭按钮事件
        this.$element.find('[mdui-dialog-close]').each((_, close) => {
            $(close).on('click', () => this.close());
        });
    }
    /**
     * 触发组件事件
     * @param name
     */
    triggerEvent(name) {
        componentEvent(name, 'dialog', this.$element, this);
    }
    /**
     * 窗口宽度变化，或对话框内容变化时，调整对话框位置和对话框内的滚动条
     */
    readjust() {
        if (!currentInst) {
            return;
        }
        const $element = currentInst.$element;
        const $title = $element.children('.mdui-dialog-title');
        const $content = $element.children('.mdui-dialog-content');
        const $actions = $element.children('.mdui-dialog-actions');
        // 调整 dialog 的 top 和 height 值
        $element.height('');
        $content.height('');
        const elementHeight = $element.height();
        $element.css({
            top: `${($window.height() - elementHeight) / 2}px`,
            height: `${elementHeight}px`,
        });
        // 调整 mdui-dialog-content 的高度
        $content.innerHeight(elementHeight -
            ($title.innerHeight() || 0) -
            ($actions.innerHeight() || 0));
    }
    /**
     * hashchange 事件触发时关闭对话框
     */
    hashchangeEvent() {
        if (window.location.hash.substring(1).indexOf('mdui-dialog') < 0) {
            currentInst.close(true);
        }
    }
    /**
     * 点击遮罩层关闭对话框
     * @param event
     */
    overlayClick(event) {
        if ($(event.target).hasClass('mdui-overlay') &&
            currentInst) {
            currentInst.close();
        }
    }
    /**
     * 动画结束回调
     */
    transitionEnd() {
        if (this.$element.hasClass('mdui-dialog-open')) {
            this.state = 'opened';
            this.triggerEvent('opened');
        }
        else {
            this.state = 'closed';
            this.triggerEvent('closed');
            this.$element.hide();
            // 所有对话框都关闭，且当前没有打开的对话框时，解锁屏幕
            if (!queue(queueName).length && !currentInst && isLockScreen) {
                $.unlockScreen();
                isLockScreen = false;
            }
            $window.off('resize', $.throttle(this.readjust, 100));
            if (this.options.destroyOnClosed) {
                this.destroy();
            }
        }
    }
    /**
     * 打开指定对话框
     */
    doOpen() {
        currentInst = this;
        if (!isLockScreen) {
            $.lockScreen();
            isLockScreen = true;
        }
        this.$element.show();
        this.readjust();
        $window.on('resize', $.throttle(this.readjust, 100));
        // 打开消息框
        this.state = 'opening';
        this.triggerEvent('open');
        this.$element
            .addClass('mdui-dialog-open')
            .transitionEnd(() => this.transitionEnd());
        // 不存在遮罩层元素时，添加遮罩层
        if (!$overlay) {
            $overlay = $.showOverlay(5100);
        }
        // 点击遮罩层时是否关闭对话框
        if (this.options.modal) {
            $overlay.off('click', this.overlayClick);
        }
        else {
            $overlay.on('click', this.overlayClick);
        }
        // 是否显示遮罩层，不显示时，把遮罩层背景透明
        $overlay.css('opacity', this.options.overlay ? '' : 0);
        if (this.options.history) {
            // 如果 hash 中原来就有 mdui-dialog，先删除，避免后退历史纪录后仍然有 mdui-dialog 导致无法关闭
            // 包括 mdui-dialog 和 &mdui-dialog 和 ?mdui-dialog
            let hash = window.location.hash.substring(1);
            if (hash.indexOf('mdui-dialog') > -1) {
                hash = hash.replace(/[&?]?mdui-dialog/g, '');
            }
            // 后退按钮关闭对话框
            if (hash) {
                window.location.hash = `${hash}${hash.indexOf('?') > -1 ? '&' : '?'}mdui-dialog`;
            }
            else {
                window.location.hash = 'mdui-dialog';
            }
            $window.on('hashchange', this.hashchangeEvent);
        }
    }
    /**
     * 当前对话框是否为打开状态
     */
    isOpen() {
        return this.state === 'opening' || this.state === 'opened';
    }
    /**
     * 打开对话框
     */
    open() {
        if (this.isOpen()) {
            return;
        }
        // 如果当前有正在打开或已经打开的对话框,或队列不为空，则先加入队列，等旧对话框开始关闭时再打开
        if ((currentInst &&
            (currentInst.state === 'opening' || currentInst.state === 'opened')) ||
            queue(queueName).length) {
            queue(queueName, () => this.doOpen());
            return;
        }
        this.doOpen();
    }
    /**
     * 关闭对话框
     */
    close(historyBack = false) {
        // historyBack 是否需要后退历史纪录，默认为 `false`。该参数仅内部使用
        // 为 `false` 时是通过 js 关闭，需要后退一个历史记录
        // 为 `true` 时是通过后退按钮关闭，不需要后退历史记录
        // setTimeout 的作用是：
        // 当同时关闭一个对话框，并打开另一个对话框时，使打开对话框的操作先执行，以使需要打开的对话框先加入队列
        setTimeout(() => {
            if (!this.isOpen()) {
                return;
            }
            currentInst = null;
            this.state = 'closing';
            this.triggerEvent('close');
            // 所有对话框都关闭，且当前没有打开的对话框时，隐藏遮罩
            if (!queue(queueName).length && $overlay) {
                $.hideOverlay();
                $overlay = null;
                // 若仍存在遮罩，恢复遮罩的 z-index
                $('.mdui-overlay').css('z-index', 2000);
            }
            this.$element
                .removeClass('mdui-dialog-open')
                .transitionEnd(() => this.transitionEnd());
            if (this.options.history && !queue(queueName).length) {
                if (!historyBack) {
                    window.history.back();
                }
                $window.off('hashchange', this.hashchangeEvent);
            }
            // 关闭旧对话框，打开新对话框。
            // 加一点延迟，仅仅为了视觉效果更好。不加延时也不影响功能
            setTimeout(() => {
                dequeue(queueName);
            }, 100);
        });
    }
    /**
     * 切换对话框打开/关闭状态
     */
    toggle() {
        this.isOpen() ? this.close() : this.open();
    }
    /**
     * 获取对话框状态。共包含四种状态：`opening`、`opened`、`closing`、`closed`
     */
    getState() {
        return this.state;
    }
    /**
     * 销毁对话框
     */
    destroy() {
        if (this.append) {
            this.$element.remove();
        }
        if (!queue(queueName).length && !currentInst) {
            if ($overlay) {
                $.hideOverlay();
                $overlay = null;
            }
            if (isLockScreen) {
                $.unlockScreen();
                isLockScreen = false;
            }
        }
    }
    /**
     * 对话框内容变化时，需要调用该方法来调整对话框位置和滚动条高度
     */
    handleUpdate() {
        this.readjust();
    }
}
export { currentInst, Dialog };
