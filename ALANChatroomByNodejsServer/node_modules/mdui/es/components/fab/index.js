import $ from 'mdui.jq/es/$';
import extend from 'mdui.jq/es/functions/extend';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/css';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/first';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/last';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/parents';
import 'mdui.jq/es/methods/removeClass';
import mdui from '../../mdui';
import '../../jq_extends/methods/transitionEnd';
import { componentEvent } from '../../utils/componentEvent';
import { $document } from '../../utils/dom';
import { startEvent } from '../../utils/touchHandler';
const DEFAULT_OPTIONS = {
    trigger: 'hover',
};
class Fab {
    constructor(selector, options = {}) {
        /**
         * 配置参数
         */
        this.options = extend({}, DEFAULT_OPTIONS);
        /**
         * 当前 fab 的状态
         */
        this.state = 'closed';
        this.$element = $(selector).first();
        extend(this.options, options);
        this.$btn = this.$element.find('.mdui-fab');
        this.$dial = this.$element.find('.mdui-fab-dial');
        this.$dialBtns = this.$dial.find('.mdui-fab');
        if (this.options.trigger === 'hover') {
            this.$btn.on('touchstart mouseenter', () => this.open());
            this.$element.on('mouseleave', () => this.close());
        }
        if (this.options.trigger === 'click') {
            this.$btn.on(startEvent, () => this.open());
        }
        // 触摸屏幕其他地方关闭快速拨号
        $document.on(startEvent, (event) => {
            if ($(event.target).parents('.mdui-fab-wrapper').length) {
                return;
            }
            this.close();
        });
    }
    /**
     * 触发组件事件
     * @param name
     */
    triggerEvent(name) {
        componentEvent(name, 'fab', this.$element, this);
    }
    /**
     * 当前是否为打开状态
     */
    isOpen() {
        return this.state === 'opening' || this.state === 'opened';
    }
    /**
     * 打开快速拨号菜单
     */
    open() {
        if (this.isOpen()) {
            return;
        }
        // 为菜单中的按钮添加不同的 transition-delay
        this.$dialBtns.each((index, btn) => {
            const delay = `${15 * (this.$dialBtns.length - index)}ms`;
            btn.style.transitionDelay = delay;
            btn.style.webkitTransitionDelay = delay;
        });
        this.$dial.css('height', 'auto').addClass('mdui-fab-dial-show');
        // 如果按钮中存在 .mdui-fab-opened 的图标，则进行图标切换
        if (this.$btn.find('.mdui-fab-opened').length) {
            this.$btn.addClass('mdui-fab-opened');
        }
        this.state = 'opening';
        this.triggerEvent('open');
        // 打开顺序为从下到上逐个打开，最上面的打开后才表示动画完成
        this.$dialBtns.first().transitionEnd(() => {
            if (this.$btn.hasClass('mdui-fab-opened')) {
                this.state = 'opened';
                this.triggerEvent('opened');
            }
        });
    }
    /**
     * 关闭快速拨号菜单
     */
    close() {
        if (!this.isOpen()) {
            return;
        }
        // 为菜单中的按钮添加不同的 transition-delay
        this.$dialBtns.each((index, btn) => {
            const delay = `${15 * index}ms`;
            btn.style.transitionDelay = delay;
            btn.style.webkitTransitionDelay = delay;
        });
        this.$dial.removeClass('mdui-fab-dial-show');
        this.$btn.removeClass('mdui-fab-opened');
        this.state = 'closing';
        this.triggerEvent('close');
        // 从上往下依次关闭，最后一个关闭后才表示动画完成
        this.$dialBtns.last().transitionEnd(() => {
            if (this.$btn.hasClass('mdui-fab-opened')) {
                return;
            }
            this.state = 'closed';
            this.triggerEvent('closed');
            this.$dial.css('height', 0);
        });
    }
    /**
     * 切换快速拨号菜单的打开状态
     */
    toggle() {
        this.isOpen() ? this.close() : this.open();
    }
    /**
     * 以动画的形式显示整个浮动操作按钮
     */
    show() {
        this.$element.removeClass('mdui-fab-hide');
    }
    /**
     * 以动画的形式隐藏整个浮动操作按钮
     */
    hide() {
        this.$element.addClass('mdui-fab-hide');
    }
    /**
     * 返回当前快速拨号菜单的打开状态。共包含四种状态：`opening`、`opened`、`closing`、`closed`
     */
    getState() {
        return this.state;
    }
}
mdui.Fab = Fab;
