import $ from 'mdui.jq/es/$';
import extend from 'mdui.jq/es/functions/extend';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/first';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/removeClass';
import { isNumber } from 'mdui.jq/es/utils';
import mdui from '../../mdui';
import '../../jq_extends/methods/transitionEnd';
import { componentEvent } from '../../utils/componentEvent';
import { $window } from '../../utils/dom';
const DEFAULT_OPTIONS = {
    tolerance: 5,
    offset: 0,
    initialClass: 'mdui-headroom',
    pinnedClass: 'mdui-headroom-pinned-top',
    unpinnedClass: 'mdui-headroom-unpinned-top',
};
class Headroom {
    constructor(selector, options = {}) {
        /**
         * 配置参数
         */
        this.options = extend({}, DEFAULT_OPTIONS);
        /**
         * 当前 headroom 的状态
         */
        this.state = 'pinned';
        /**
         * 当前是否启用
         */
        this.isEnable = false;
        /**
         * 上次滚动后，垂直方向的距离
         */
        this.lastScrollY = 0;
        /**
         * AnimationFrame ID
         */
        this.rafId = 0;
        this.$element = $(selector).first();
        extend(this.options, options);
        // tolerance 参数若为数值，转换为对象
        const tolerance = this.options.tolerance;
        if (isNumber(tolerance)) {
            this.options.tolerance = {
                down: tolerance,
                up: tolerance,
            };
        }
        this.enable();
    }
    /**
     * 滚动时的处理
     */
    onScroll() {
        this.rafId = window.requestAnimationFrame(() => {
            const currentScrollY = window.pageYOffset;
            const direction = currentScrollY > this.lastScrollY ? 'down' : 'up';
            const tolerance = this.options.tolerance[direction];
            const scrolled = Math.abs(currentScrollY - this.lastScrollY);
            const toleranceExceeded = scrolled >= tolerance;
            if (currentScrollY > this.lastScrollY &&
                currentScrollY >= this.options.offset &&
                toleranceExceeded) {
                this.unpin();
            }
            else if ((currentScrollY < this.lastScrollY && toleranceExceeded) ||
                currentScrollY <= this.options.offset) {
                this.pin();
            }
            this.lastScrollY = currentScrollY;
        });
    }
    /**
     * 触发组件事件
     * @param name
     */
    triggerEvent(name) {
        componentEvent(name, 'headroom', this.$element, this);
    }
    /**
     * 动画结束的回调
     */
    transitionEnd() {
        if (this.state === 'pinning') {
            this.state = 'pinned';
            this.triggerEvent('pinned');
        }
        if (this.state === 'unpinning') {
            this.state = 'unpinned';
            this.triggerEvent('unpinned');
        }
    }
    /**
     * 使元素固定住
     */
    pin() {
        if (this.state === 'pinning' ||
            this.state === 'pinned' ||
            !this.$element.hasClass(this.options.initialClass)) {
            return;
        }
        this.triggerEvent('pin');
        this.state = 'pinning';
        this.$element
            .removeClass(this.options.unpinnedClass)
            .addClass(this.options.pinnedClass)
            .transitionEnd(() => this.transitionEnd());
    }
    /**
     * 使元素隐藏
     */
    unpin() {
        if (this.state === 'unpinning' ||
            this.state === 'unpinned' ||
            !this.$element.hasClass(this.options.initialClass)) {
            return;
        }
        this.triggerEvent('unpin');
        this.state = 'unpinning';
        this.$element
            .removeClass(this.options.pinnedClass)
            .addClass(this.options.unpinnedClass)
            .transitionEnd(() => this.transitionEnd());
    }
    /**
     * 启用 headroom 插件
     */
    enable() {
        if (this.isEnable) {
            return;
        }
        this.isEnable = true;
        this.state = 'pinned';
        this.$element
            .addClass(this.options.initialClass)
            .removeClass(this.options.pinnedClass)
            .removeClass(this.options.unpinnedClass);
        this.lastScrollY = window.pageYOffset;
        $window.on('scroll', () => this.onScroll());
    }
    /**
     * 禁用 headroom 插件
     */
    disable() {
        if (!this.isEnable) {
            return;
        }
        this.isEnable = false;
        this.$element
            .removeClass(this.options.initialClass)
            .removeClass(this.options.pinnedClass)
            .removeClass(this.options.unpinnedClass);
        $window.off('scroll', () => this.onScroll());
        window.cancelAnimationFrame(this.rafId);
    }
    /**
     * 获取当前状态。共包含四种状态：`pinning`、`pinned`、`unpinning`、`unpinned`
     */
    getState() {
        return this.state;
    }
}
mdui.Headroom = Headroom;
