import $ from 'mdui.jq/es/$';
import extend from 'mdui.jq/es/functions/extend';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/appendTo';
import 'mdui.jq/es/methods/attr';
import 'mdui.jq/es/methods/children';
import 'mdui.jq/es/methods/css';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/eq';
import 'mdui.jq/es/methods/first';
import 'mdui.jq/es/methods/get';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/hide';
import 'mdui.jq/es/methods/index';
import 'mdui.jq/es/methods/innerWidth';
import 'mdui.jq/es/methods/offset';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/removeClass';
import 'mdui.jq/es/methods/show';
import { isNumber } from 'mdui.jq/es/utils';
import mdui from '../../mdui';
import '../../jq_extends/static/throttle';
import { componentEvent } from '../../utils/componentEvent';
import { $window } from '../../utils/dom';
const DEFAULT_OPTIONS = {
    trigger: 'click',
    loop: false,
};
class Tab {
    constructor(selector, options = {}) {
        /**
         * 配置参数
         */
        this.options = extend({}, DEFAULT_OPTIONS);
        /**
         * 当前激活的 tab 的索引号。为 -1 时表示没有激活的选项卡，或不存在选项卡
         */
        this.activeIndex = -1;
        this.$element = $(selector).first();
        extend(this.options, options);
        this.$tabs = this.$element.children('a');
        this.$indicator = $('<div class="mdui-tab-indicator"></div>').appendTo(this.$element);
        // 根据 url hash 获取默认激活的选项卡
        const hash = window.location.hash;
        if (hash) {
            this.$tabs.each((index, tab) => {
                if ($(tab).attr('href') === hash) {
                    this.activeIndex = index;
                    return false;
                }
                return true;
            });
        }
        // 含 .mdui-tab-active 的元素默认激活
        if (this.activeIndex === -1) {
            this.$tabs.each((index, tab) => {
                if ($(tab).hasClass('mdui-tab-active')) {
                    this.activeIndex = index;
                    return false;
                }
                return true;
            });
        }
        // 存在选项卡时，默认激活第一个选项卡
        if (this.$tabs.length && this.activeIndex === -1) {
            this.activeIndex = 0;
        }
        // 设置激活状态选项卡
        this.setActive();
        // 监听窗口大小变化事件，调整指示器位置
        $window.on('resize', $.throttle(() => this.setIndicatorPosition(), 100));
        // 监听点击选项卡事件
        this.$tabs.each((_, tab) => {
            this.bindTabEvent(tab);
        });
    }
    /**
     * 指定选项卡是否已禁用
     * @param $tab
     */
    isDisabled($tab) {
        return $tab.attr('disabled') !== undefined;
    }
    /**
     * 绑定在 Tab 上点击或悬浮的事件
     * @param tab
     */
    bindTabEvent(tab) {
        const $tab = $(tab);
        // 点击或鼠标移入触发的事件
        const clickEvent = () => {
            // 禁用状态的选项卡无法选中
            if (this.isDisabled($tab)) {
                return false;
            }
            this.activeIndex = this.$tabs.index(tab);
            this.setActive();
        };
        // 无论 trigger 是 click 还是 hover，都会响应 click 事件
        $tab.on('click', clickEvent);
        // trigger 为 hover 时，额外响应 mouseenter 事件
        if (this.options.trigger === 'hover') {
            $tab.on('mouseenter', clickEvent);
        }
        // 阻止链接的默认点击动作
        $tab.on('click', () => {
            if (($tab.attr('href') || '').indexOf('#') === 0) {
                return false;
            }
        });
    }
    /**
     * 触发组件事件
     * @param name
     * @param $element
     * @param parameters
     */
    triggerEvent(name, $element, parameters = {}) {
        componentEvent(name, 'tab', $element, this, parameters);
    }
    /**
     * 设置激活状态的选项卡
     */
    setActive() {
        this.$tabs.each((index, tab) => {
            const $tab = $(tab);
            const targetId = $tab.attr('href') || '';
            // 设置选项卡激活状态
            if (index === this.activeIndex && !this.isDisabled($tab)) {
                if (!$tab.hasClass('mdui-tab-active')) {
                    this.triggerEvent('change', this.$element, {
                        index: this.activeIndex,
                        id: targetId.substr(1),
                    });
                    this.triggerEvent('show', $tab);
                    $tab.addClass('mdui-tab-active');
                }
                $(targetId).show();
                this.setIndicatorPosition();
            }
            else {
                $tab.removeClass('mdui-tab-active');
                $(targetId).hide();
            }
        });
    }
    /**
     * 设置选项卡指示器的位置
     */
    setIndicatorPosition() {
        // 选项卡数量为 0 时，不显示指示器
        if (this.activeIndex === -1) {
            this.$indicator.css({
                left: 0,
                width: 0,
            });
            return;
        }
        const $activeTab = this.$tabs.eq(this.activeIndex);
        if (this.isDisabled($activeTab)) {
            return;
        }
        const activeTabOffset = $activeTab.offset();
        this.$indicator.css({
            left: `${activeTabOffset.left +
                this.$element[0].scrollLeft -
                this.$element[0].getBoundingClientRect().left}px`,
            width: `${$activeTab.innerWidth()}px`,
        });
    }
    /**
     * 切换到下一个选项卡
     */
    next() {
        if (this.activeIndex === -1) {
            return;
        }
        if (this.$tabs.length > this.activeIndex + 1) {
            this.activeIndex++;
        }
        else if (this.options.loop) {
            this.activeIndex = 0;
        }
        this.setActive();
    }
    /**
     * 切换到上一个选项卡
     */
    prev() {
        if (this.activeIndex === -1) {
            return;
        }
        if (this.activeIndex > 0) {
            this.activeIndex--;
        }
        else if (this.options.loop) {
            this.activeIndex = this.$tabs.length - 1;
        }
        this.setActive();
    }
    /**
     * 显示指定索引号、或指定id的选项卡
     * @param index 索引号、或id
     */
    show(index) {
        if (this.activeIndex === -1) {
            return;
        }
        if (isNumber(index)) {
            this.activeIndex = index;
        }
        else {
            this.$tabs.each((i, tab) => {
                if (tab.id === index) {
                    this.activeIndex === i;
                    return false;
                }
            });
        }
        this.setActive();
    }
    /**
     * 在父元素的宽度变化时，需要调用该方法重新调整指示器位置
     * 在添加或删除选项卡时，需要调用该方法
     */
    handleUpdate() {
        const $oldTabs = this.$tabs; // 旧的 tabs JQ对象
        const $newTabs = this.$element.children('a'); // 新的 tabs JQ对象
        const oldTabsElement = $oldTabs.get(); // 旧的 tabs 元素数组
        const newTabsElement = $newTabs.get(); // 新的 tabs 元素数组
        if (!$newTabs.length) {
            this.activeIndex = -1;
            this.$tabs = $newTabs;
            this.setIndicatorPosition();
            return;
        }
        // 重新遍历选项卡，找出新增的选项卡
        $newTabs.each((index, tab) => {
            // 有新增的选项卡
            if (oldTabsElement.indexOf(tab) < 0) {
                this.bindTabEvent(tab);
                if (this.activeIndex === -1) {
                    this.activeIndex = 0;
                }
                else if (index <= this.activeIndex) {
                    this.activeIndex++;
                }
            }
        });
        // 找出被移除的选项卡
        $oldTabs.each((index, tab) => {
            // 有被移除的选项卡
            if (newTabsElement.indexOf(tab) < 0) {
                if (index < this.activeIndex) {
                    this.activeIndex--;
                }
                else if (index === this.activeIndex) {
                    this.activeIndex = 0;
                }
            }
        });
        this.$tabs = $newTabs;
        this.setActive();
    }
}
mdui.Tab = Tab;
