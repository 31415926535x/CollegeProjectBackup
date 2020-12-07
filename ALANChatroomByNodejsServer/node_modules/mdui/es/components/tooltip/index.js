import $ from 'mdui.jq/es/$';
import extend from 'mdui.jq/es/functions/extend';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/appendTo';
import 'mdui.jq/es/methods/attr';
import 'mdui.jq/es/methods/css';
import 'mdui.jq/es/methods/first';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/height';
import 'mdui.jq/es/methods/html';
import 'mdui.jq/es/methods/offset';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/removeClass';
import 'mdui.jq/es/methods/width';
import mdui from '../../mdui';
import '../../jq_extends/methods/transformOrigin';
import '../../jq_extends/methods/transitionEnd';
import '../../jq_extends/static/guid';
import { componentEvent } from '../../utils/componentEvent';
import { $window } from '../../utils/dom';
import { isAllow, register, unlockEvent } from '../../utils/touchHandler';
const DEFAULT_OPTIONS = {
    position: 'auto',
    delay: 0,
    content: '',
};
class Tooltip {
    constructor(selector, options = {}) {
        /**
         * 配置参数
         */
        this.options = extend({}, DEFAULT_OPTIONS);
        /**
         * 当前 tooltip 的状态
         */
        this.state = 'closed';
        /**
         * setTimeout 的返回值
         */
        this.timeoutId = null;
        this.$target = $(selector).first();
        extend(this.options, options);
        // 创建 Tooltip HTML
        this.$element = $(`<div class="mdui-tooltip" id="${$.guid()}">${this.options.content}</div>`).appendTo(document.body);
        // 绑定事件。元素处于 disabled 状态时无法触发鼠标事件，为了统一，把 touch 事件也禁用
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;
        this.$target
            .on('touchstart mouseenter', function (event) {
            if (that.isDisabled(this)) {
                return;
            }
            if (!isAllow(event)) {
                return;
            }
            register(event);
            that.open();
        })
            .on('touchend mouseleave', function (event) {
            if (that.isDisabled(this)) {
                return;
            }
            if (!isAllow(event)) {
                return;
            }
            that.close();
        })
            .on(unlockEvent, function (event) {
            if (that.isDisabled(this)) {
                return;
            }
            register(event);
        });
    }
    /**
     * 元素是否已禁用
     * @param element
     */
    isDisabled(element) {
        return (element.disabled ||
            $(element).attr('disabled') !== undefined);
    }
    /**
     * 是否是桌面设备
     */
    isDesktop() {
        return $window.width() > 1024;
    }
    /**
     * 设置 Tooltip 的位置
     */
    setPosition() {
        let marginLeft;
        let marginTop;
        // 触发的元素
        const targetProps = this.$target[0].getBoundingClientRect();
        // 触发的元素和 Tooltip 之间的距离
        const targetMargin = this.isDesktop() ? 14 : 24;
        // Tooltip 的宽度和高度
        const tooltipWidth = this.$element[0].offsetWidth;
        const tooltipHeight = this.$element[0].offsetHeight;
        // Tooltip 的方向
        let position = this.options.position;
        // 自动判断位置，加 2px，使 Tooltip 距离窗口边框至少有 2px 的间距
        if (position === 'auto') {
            if (targetProps.top +
                targetProps.height +
                targetMargin +
                tooltipHeight +
                2 <
                $window.height()) {
                position = 'bottom';
            }
            else if (targetMargin + tooltipHeight + 2 < targetProps.top) {
                position = 'top';
            }
            else if (targetMargin + tooltipWidth + 2 < targetProps.left) {
                position = 'left';
            }
            else if (targetProps.width + targetMargin + tooltipWidth + 2 <
                $window.width() - targetProps.left) {
                position = 'right';
            }
            else {
                position = 'bottom';
            }
        }
        // 设置位置
        switch (position) {
            case 'bottom':
                marginLeft = -1 * (tooltipWidth / 2);
                marginTop = targetProps.height / 2 + targetMargin;
                this.$element.transformOrigin('top center');
                break;
            case 'top':
                marginLeft = -1 * (tooltipWidth / 2);
                marginTop =
                    -1 * (tooltipHeight + targetProps.height / 2 + targetMargin);
                this.$element.transformOrigin('bottom center');
                break;
            case 'left':
                marginLeft = -1 * (tooltipWidth + targetProps.width / 2 + targetMargin);
                marginTop = -1 * (tooltipHeight / 2);
                this.$element.transformOrigin('center right');
                break;
            case 'right':
                marginLeft = targetProps.width / 2 + targetMargin;
                marginTop = -1 * (tooltipHeight / 2);
                this.$element.transformOrigin('center left');
                break;
        }
        const targetOffset = this.$target.offset();
        this.$element.css({
            top: `${targetOffset.top + targetProps.height / 2}px`,
            left: `${targetOffset.left + targetProps.width / 2}px`,
            'margin-left': `${marginLeft}px`,
            'margin-top': `${marginTop}px`,
        });
    }
    /**
     * 触发组件事件
     * @param name
     */
    triggerEvent(name) {
        componentEvent(name, 'tooltip', this.$target, this);
    }
    /**
     * 动画结束回调
     */
    transitionEnd() {
        if (this.$element.hasClass('mdui-tooltip-open')) {
            this.state = 'opened';
            this.triggerEvent('opened');
        }
        else {
            this.state = 'closed';
            this.triggerEvent('closed');
        }
    }
    /**
     * 当前 tooltip 是否为打开状态
     */
    isOpen() {
        return this.state === 'opening' || this.state === 'opened';
    }
    /**
     * 执行打开 tooltip
     */
    doOpen() {
        this.state = 'opening';
        this.triggerEvent('open');
        this.$element
            .addClass('mdui-tooltip-open')
            .transitionEnd(() => this.transitionEnd());
    }
    /**
     * 打开 Tooltip
     * @param options 允许每次打开时设置不同的参数
     */
    open(options) {
        if (this.isOpen()) {
            return;
        }
        const oldOptions = extend({}, this.options);
        if (options) {
            extend(this.options, options);
        }
        // tooltip 的内容有更新
        if (oldOptions.content !== this.options.content) {
            this.$element.html(this.options.content);
        }
        this.setPosition();
        if (this.options.delay) {
            this.timeoutId = setTimeout(() => this.doOpen(), this.options.delay);
        }
        else {
            this.timeoutId = null;
            this.doOpen();
        }
    }
    /**
     * 关闭 Tooltip
     */
    close() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        if (!this.isOpen()) {
            return;
        }
        this.state = 'closing';
        this.triggerEvent('close');
        this.$element
            .removeClass('mdui-tooltip-open')
            .transitionEnd(() => this.transitionEnd());
    }
    /**
     * 切换 Tooltip 的打开状态
     */
    toggle() {
        this.isOpen() ? this.close() : this.open();
    }
    /**
     * 获取 Tooltip 状态。共包含四种状态：`opening`、`opened`、`closing`、`closed`
     */
    getState() {
        return this.state;
    }
}
mdui.Tooltip = Tooltip;
