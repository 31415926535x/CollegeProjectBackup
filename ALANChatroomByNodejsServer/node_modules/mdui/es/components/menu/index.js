import $ from 'mdui.jq/es/$';
import contains from 'mdui.jq/es/functions/contains';
import extend from 'mdui.jq/es/functions/extend';
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
import mdui from '../../mdui';
import '../../jq_extends/methods/transformOrigin';
import '../../jq_extends/methods/transitionEnd';
import '../../jq_extends/static/throttle';
import { componentEvent } from '../../utils/componentEvent';
import { $document, $window } from '../../utils/dom';
const DEFAULT_OPTIONS = {
    position: 'auto',
    align: 'auto',
    gutter: 16,
    fixed: false,
    covered: 'auto',
    subMenuTrigger: 'hover',
    subMenuDelay: 200,
};
class Menu {
    constructor(anchorSelector, menuSelector, options = {}) {
        /**
         * 配置参数
         */
        this.options = extend({}, DEFAULT_OPTIONS);
        /**
         * 当前菜单状态
         */
        this.state = 'closed';
        this.$anchor = $(anchorSelector).first();
        this.$element = $(menuSelector).first();
        // 触发菜单的元素 和 菜单必须是同级的元素，否则菜单可能不能定位
        if (!this.$anchor.parent().is(this.$element.parent())) {
            throw new Error('anchorSelector and menuSelector must be siblings');
        }
        extend(this.options, options);
        // 是否是级联菜单
        this.isCascade = this.$element.hasClass('mdui-menu-cascade');
        // covered 参数处理
        this.isCovered =
            this.options.covered === 'auto' ? !this.isCascade : this.options.covered;
        // 点击触发菜单切换
        this.$anchor.on('click', () => this.toggle());
        // 点击菜单外面区域关闭菜单
        $document.on('click touchstart', (event) => {
            const $target = $(event.target);
            if (this.isOpen() &&
                !$target.is(this.$element) &&
                !contains(this.$element[0], $target[0]) &&
                !$target.is(this.$anchor) &&
                !contains(this.$anchor[0], $target[0])) {
                this.close();
            }
        });
        // 点击不含子菜单的菜单条目关闭菜单
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;
        $document.on('click', '.mdui-menu-item', function () {
            const $item = $(this);
            if (!$item.find('.mdui-menu').length &&
                $item.attr('disabled') === undefined) {
                that.close();
            }
        });
        // 绑定点击或鼠标移入含子菜单的条目的事件
        this.bindSubMenuEvent();
        // 窗口大小变化时，重新调整菜单位置
        $window.on('resize', $.throttle(() => this.readjust(), 100));
    }
    /**
     * 是否为打开状态
     */
    isOpen() {
        return this.state === 'opening' || this.state === 'opened';
    }
    /**
     * 触发组件事件
     * @param name
     */
    triggerEvent(name) {
        componentEvent(name, 'menu', this.$element, this);
    }
    /**
     * 调整主菜单位置
     */
    readjust() {
        let menuLeft;
        let menuTop;
        // 菜单位置和方向
        let position;
        let align;
        // window 窗口的宽度和高度
        const windowHeight = $window.height();
        const windowWidth = $window.width();
        // 配置参数
        const gutter = this.options.gutter;
        const isCovered = this.isCovered;
        const isFixed = this.options.fixed;
        // 动画方向参数
        let transformOriginX;
        let transformOriginY;
        // 菜单的原始宽度和高度
        const menuWidth = this.$element.width();
        const menuHeight = this.$element.height();
        // 触发菜单的元素在窗口中的位置
        const anchorRect = this.$anchor[0].getBoundingClientRect();
        const anchorTop = anchorRect.top;
        const anchorLeft = anchorRect.left;
        const anchorHeight = anchorRect.height;
        const anchorWidth = anchorRect.width;
        const anchorBottom = windowHeight - anchorTop - anchorHeight;
        const anchorRight = windowWidth - anchorLeft - anchorWidth;
        // 触发元素相对其拥有定位属性的父元素的位置
        const anchorOffsetTop = this.$anchor[0].offsetTop;
        const anchorOffsetLeft = this.$anchor[0].offsetLeft;
        // 自动判断菜单位置
        if (this.options.position === 'auto') {
            if (anchorBottom + (isCovered ? anchorHeight : 0) > menuHeight + gutter) {
                // 判断下方是否放得下菜单
                position = 'bottom';
            }
            else if (anchorTop + (isCovered ? anchorHeight : 0) >
                menuHeight + gutter) {
                // 判断上方是否放得下菜单
                position = 'top';
            }
            else {
                // 上下都放不下，居中显示
                position = 'center';
            }
        }
        else {
            position = this.options.position;
        }
        // 自动判断菜单对齐方式
        if (this.options.align === 'auto') {
            if (anchorRight + anchorWidth > menuWidth + gutter) {
                // 判断右侧是否放得下菜单
                align = 'left';
            }
            else if (anchorLeft + anchorWidth > menuWidth + gutter) {
                // 判断左侧是否放得下菜单
                align = 'right';
            }
            else {
                // 左右都放不下，居中显示
                align = 'center';
            }
        }
        else {
            align = this.options.align;
        }
        // 设置菜单位置
        if (position === 'bottom') {
            transformOriginY = '0';
            menuTop =
                (isCovered ? 0 : anchorHeight) +
                    (isFixed ? anchorTop : anchorOffsetTop);
        }
        else if (position === 'top') {
            transformOriginY = '100%';
            menuTop =
                (isCovered ? anchorHeight : 0) +
                    (isFixed ? anchorTop - menuHeight : anchorOffsetTop - menuHeight);
        }
        else {
            transformOriginY = '50%';
            // =====================在窗口中居中
            // 显示的菜单的高度，简单菜单高度不超过窗口高度，若超过了则在菜单内部显示滚动条
            // 级联菜单内部不允许出现滚动条
            let menuHeightTemp = menuHeight;
            // 简单菜单比窗口高时，限制菜单高度
            if (!this.isCascade) {
                if (menuHeight + gutter * 2 > windowHeight) {
                    menuHeightTemp = windowHeight - gutter * 2;
                    this.$element.height(menuHeightTemp);
                }
            }
            menuTop =
                (windowHeight - menuHeightTemp) / 2 +
                    (isFixed ? 0 : anchorOffsetTop - anchorTop);
        }
        this.$element.css('top', `${menuTop}px`);
        // 设置菜单对齐方式
        if (align === 'left') {
            transformOriginX = '0';
            menuLeft = isFixed ? anchorLeft : anchorOffsetLeft;
        }
        else if (align === 'right') {
            transformOriginX = '100%';
            menuLeft = isFixed
                ? anchorLeft + anchorWidth - menuWidth
                : anchorOffsetLeft + anchorWidth - menuWidth;
        }
        else {
            transformOriginX = '50%';
            //=======================在窗口中居中
            // 显示的菜单的宽度，菜单宽度不能超过窗口宽度
            let menuWidthTemp = menuWidth;
            // 菜单比窗口宽，限制菜单宽度
            if (menuWidth + gutter * 2 > windowWidth) {
                menuWidthTemp = windowWidth - gutter * 2;
                this.$element.width(menuWidthTemp);
            }
            menuLeft =
                (windowWidth - menuWidthTemp) / 2 +
                    (isFixed ? 0 : anchorOffsetLeft - anchorLeft);
        }
        this.$element.css('left', `${menuLeft}px`);
        // 设置菜单动画方向
        this.$element.transformOrigin(`${transformOriginX} ${transformOriginY}`);
    }
    /**
     * 调整子菜单的位置
     * @param $submenu
     */
    readjustSubmenu($submenu) {
        const $item = $submenu.parent('.mdui-menu-item');
        let submenuTop;
        let submenuLeft;
        // 子菜单位置和方向
        let position;
        let align;
        // window 窗口的宽度和高度
        const windowHeight = $window.height();
        const windowWidth = $window.width();
        // 动画方向参数
        let transformOriginX;
        let transformOriginY;
        // 子菜单的原始宽度和高度
        const submenuWidth = $submenu.width();
        const submenuHeight = $submenu.height();
        // 触发子菜单的菜单项的宽度高度
        const itemRect = $item[0].getBoundingClientRect();
        const itemWidth = itemRect.width;
        const itemHeight = itemRect.height;
        const itemLeft = itemRect.left;
        const itemTop = itemRect.top;
        // 判断菜单上下位置
        if (windowHeight - itemTop > submenuHeight) {
            // 判断下方是否放得下菜单
            position = 'bottom';
        }
        else if (itemTop + itemHeight > submenuHeight) {
            // 判断上方是否放得下菜单
            position = 'top';
        }
        else {
            // 默认放在下方
            position = 'bottom';
        }
        // 判断菜单左右位置
        if (windowWidth - itemLeft - itemWidth > submenuWidth) {
            // 判断右侧是否放得下菜单
            align = 'left';
        }
        else if (itemLeft > submenuWidth) {
            // 判断左侧是否放得下菜单
            align = 'right';
        }
        else {
            // 默认放在右侧
            align = 'left';
        }
        // 设置菜单位置
        if (position === 'bottom') {
            transformOriginY = '0';
            submenuTop = '0';
        }
        else if (position === 'top') {
            transformOriginY = '100%';
            submenuTop = -submenuHeight + itemHeight;
        }
        $submenu.css('top', `${submenuTop}px`);
        // 设置菜单对齐方式
        if (align === 'left') {
            transformOriginX = '0';
            submenuLeft = itemWidth;
        }
        else if (align === 'right') {
            transformOriginX = '100%';
            submenuLeft = -submenuWidth;
        }
        $submenu.css('left', `${submenuLeft}px`);
        // 设置菜单动画方向
        $submenu.transformOrigin(`${transformOriginX} ${transformOriginY}`);
    }
    /**
     * 打开子菜单
     * @param $submenu
     */
    openSubMenu($submenu) {
        this.readjustSubmenu($submenu);
        $submenu
            .addClass('mdui-menu-open')
            .parent('.mdui-menu-item')
            .addClass('mdui-menu-item-active');
    }
    /**
     * 关闭子菜单，及其嵌套的子菜单
     * @param $submenu
     */
    closeSubMenu($submenu) {
        // 关闭子菜单
        $submenu
            .removeClass('mdui-menu-open')
            .addClass('mdui-menu-closing')
            .transitionEnd(() => $submenu.removeClass('mdui-menu-closing'))
            // 移除激活状态的样式
            .parent('.mdui-menu-item')
            .removeClass('mdui-menu-item-active');
        // 循环关闭嵌套的子菜单
        $submenu.find('.mdui-menu').each((_, menu) => {
            const $subSubmenu = $(menu);
            $subSubmenu
                .removeClass('mdui-menu-open')
                .addClass('mdui-menu-closing')
                .transitionEnd(() => $subSubmenu.removeClass('mdui-menu-closing'))
                .parent('.mdui-menu-item')
                .removeClass('mdui-menu-item-active');
        });
    }
    /**
     * 切换子菜单状态
     * @param $submenu
     */
    toggleSubMenu($submenu) {
        $submenu.hasClass('mdui-menu-open')
            ? this.closeSubMenu($submenu)
            : this.openSubMenu($submenu);
    }
    /**
     * 绑定子菜单事件
     */
    bindSubMenuEvent() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;
        // 点击打开子菜单
        this.$element.on('click', '.mdui-menu-item', function (event) {
            const $item = $(this);
            const $target = $(event.target);
            // 禁用状态菜单不操作
            if ($item.attr('disabled') !== undefined) {
                return;
            }
            // 没有点击在子菜单的菜单项上时，不操作（点在了子菜单的空白区域、或分隔线上）
            if ($target.is('.mdui-menu') || $target.is('.mdui-divider')) {
                return;
            }
            // 阻止冒泡，点击菜单项时只在最后一级的 mdui-menu-item 上生效，不向上冒泡
            if (!$target.parents('.mdui-menu-item').first().is($item)) {
                return;
            }
            // 当前菜单的子菜单
            const $submenu = $item.children('.mdui-menu');
            // 先关闭除当前子菜单外的所有同级子菜单
            $item
                .parent('.mdui-menu')
                .children('.mdui-menu-item')
                .each((_, item) => {
                const $tmpSubmenu = $(item).children('.mdui-menu');
                if ($tmpSubmenu.length &&
                    (!$submenu.length || !$tmpSubmenu.is($submenu))) {
                    that.closeSubMenu($tmpSubmenu);
                }
            });
            // 切换当前子菜单
            if ($submenu.length) {
                that.toggleSubMenu($submenu);
            }
        });
        if (this.options.subMenuTrigger === 'hover') {
            // 临时存储 setTimeout 对象
            let timeout = null;
            let timeoutOpen = null;
            this.$element.on('mouseover mouseout', '.mdui-menu-item', function (event) {
                const $item = $(this);
                const eventType = event.type;
                const $relatedTarget = $(event.relatedTarget);
                // 禁用状态的菜单不操作
                if ($item.attr('disabled') !== undefined) {
                    return;
                }
                // 用 mouseover 模拟 mouseenter
                if (eventType === 'mouseover') {
                    if (!$item.is($relatedTarget) &&
                        contains($item[0], $relatedTarget[0])) {
                        return;
                    }
                }
                // 用 mouseout 模拟 mouseleave
                else if (eventType === 'mouseout') {
                    if ($item.is($relatedTarget) ||
                        contains($item[0], $relatedTarget[0])) {
                        return;
                    }
                }
                // 当前菜单项下的子菜单，未必存在
                const $submenu = $item.children('.mdui-menu');
                // 鼠标移入菜单项时，显示菜单项下的子菜单
                if (eventType === 'mouseover') {
                    if ($submenu.length) {
                        // 当前子菜单准备打开时，如果当前子菜单正准备着关闭，不用再关闭了
                        const tmpClose = $submenu.data('timeoutClose.mdui.menu');
                        if (tmpClose) {
                            clearTimeout(tmpClose);
                        }
                        // 如果当前子菜单已经打开，不操作
                        if ($submenu.hasClass('mdui-menu-open')) {
                            return;
                        }
                        // 当前子菜单准备打开时，其他准备打开的子菜单不用再打开了
                        clearTimeout(timeoutOpen);
                        // 准备打开当前子菜单
                        timeout = timeoutOpen = setTimeout(() => that.openSubMenu($submenu), that.options.subMenuDelay);
                        $submenu.data('timeoutOpen.mdui.menu', timeout);
                    }
                }
                // 鼠标移出菜单项时，关闭菜单项下的子菜单
                else if (eventType === 'mouseout') {
                    if ($submenu.length) {
                        // 鼠标移出菜单项时，如果当前菜单项下的子菜单正准备打开，不用再打开了
                        const tmpOpen = $submenu.data('timeoutOpen.mdui.menu');
                        if (tmpOpen) {
                            clearTimeout(tmpOpen);
                        }
                        // 准备关闭当前子菜单
                        timeout = setTimeout(() => that.closeSubMenu($submenu), that.options.subMenuDelay);
                        $submenu.data('timeoutClose.mdui.menu', timeout);
                    }
                }
            });
        }
    }
    /**
     * 动画结束回调
     */
    transitionEnd() {
        this.$element.removeClass('mdui-menu-closing');
        if (this.state === 'opening') {
            this.state = 'opened';
            this.triggerEvent('opened');
        }
        if (this.state === 'closing') {
            this.state = 'closed';
            this.triggerEvent('closed');
            // 关闭后，恢复菜单样式到默认状态，并恢复 fixed 定位
            this.$element.css({
                top: '',
                left: '',
                width: '',
                position: 'fixed',
            });
        }
    }
    /**
     * 切换菜单状态
     */
    toggle() {
        this.isOpen() ? this.close() : this.open();
    }
    /**
     * 打开菜单
     */
    open() {
        if (this.isOpen()) {
            return;
        }
        this.state = 'opening';
        this.triggerEvent('open');
        this.readjust();
        this.$element
            // 菜单隐藏状态使用使用 fixed 定位。
            .css('position', this.options.fixed ? 'fixed' : 'absolute')
            .addClass('mdui-menu-open')
            .transitionEnd(() => this.transitionEnd());
    }
    /**
     * 关闭菜单
     */
    close() {
        if (!this.isOpen()) {
            return;
        }
        this.state = 'closing';
        this.triggerEvent('close');
        // 菜单开始关闭时，关闭所有子菜单
        this.$element.find('.mdui-menu').each((_, submenu) => {
            this.closeSubMenu($(submenu));
        });
        this.$element
            .removeClass('mdui-menu-open')
            .addClass('mdui-menu-closing')
            .transitionEnd(() => this.transitionEnd());
    }
}
mdui.Menu = Menu;
