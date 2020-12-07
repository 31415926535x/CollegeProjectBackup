import $ from 'mdui.jq/es/$';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/append';
import 'mdui.jq/es/methods/attr';
import 'mdui.jq/es/methods/css';
import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/empty';
import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/parent';
import 'mdui.jq/es/methods/remove';
import 'mdui.jq/es/methods/removeClass';
import 'mdui.jq/es/methods/text';
import 'mdui.jq/es/methods/val';
import 'mdui.jq/es/methods/width';
import { isUndefined } from 'mdui.jq/es/utils';
import mdui from '../../mdui';
import { $document } from '../../utils/dom';
import { endEvent, isAllow, register, startEvent, unlockEvent, } from '../../utils/touchHandler';
/**
 * 滑块的值改变后修改滑块样式
 * @param $slider
 */
function updateValueStyle($slider) {
    const data = $slider.data();
    const $track = data._slider_$track;
    const $fill = data._slider_$fill;
    const $thumb = data._slider_$thumb;
    const $input = data._slider_$input;
    const min = data._slider_min;
    const max = data._slider_max;
    const isDisabled = data._slider_disabled;
    const isDiscrete = data._slider_discrete;
    const $thumbText = data._slider_$thumbText;
    const value = $input.val();
    const percent = ((value - min) / (max - min)) * 100;
    $fill.width(`${percent}%`);
    $track.width(`${100 - percent}%`);
    if (isDisabled) {
        $fill.css('padding-right', '6px');
        $track.css('padding-left', '6px');
    }
    $thumb.css('left', `${percent}%`);
    if (isDiscrete) {
        $thumbText.text(value);
    }
    percent === 0
        ? $slider.addClass('mdui-slider-zero')
        : $slider.removeClass('mdui-slider-zero');
}
/**
 * 重新初始化滑块
 * @param $slider
 */
function reInit($slider) {
    const $track = $('<div class="mdui-slider-track"></div>');
    const $fill = $('<div class="mdui-slider-fill"></div>');
    const $thumb = $('<div class="mdui-slider-thumb"></div>');
    const $input = $slider.find('input[type="range"]');
    const isDisabled = $input[0].disabled;
    const isDiscrete = $slider.hasClass('mdui-slider-discrete');
    // 禁用状态
    isDisabled
        ? $slider.addClass('mdui-slider-disabled')
        : $slider.removeClass('mdui-slider-disabled');
    // 重新填充 HTML
    $slider.find('.mdui-slider-track').remove();
    $slider.find('.mdui-slider-fill').remove();
    $slider.find('.mdui-slider-thumb').remove();
    $slider.append($track).append($fill).append($thumb);
    // 间续型滑块
    let $thumbText = $();
    if (isDiscrete) {
        $thumbText = $('<span></span>');
        $thumb.empty().append($thumbText);
    }
    $slider.data('_slider_$track', $track);
    $slider.data('_slider_$fill', $fill);
    $slider.data('_slider_$thumb', $thumb);
    $slider.data('_slider_$input', $input);
    $slider.data('_slider_min', $input.attr('min'));
    $slider.data('_slider_max', $input.attr('max'));
    $slider.data('_slider_disabled', isDisabled);
    $slider.data('_slider_discrete', isDiscrete);
    $slider.data('_slider_$thumbText', $thumbText);
    // 设置默认值
    updateValueStyle($slider);
}
const rangeSelector = '.mdui-slider input[type="range"]';
$(() => {
    // 滑块滑动事件
    $document.on('input change', rangeSelector, function () {
        const $slider = $(this).parent();
        updateValueStyle($slider);
    });
    // 开始触摸滑块事件
    $document.on(startEvent, rangeSelector, function (event) {
        if (!isAllow(event)) {
            return;
        }
        register(event);
        if (this.disabled) {
            return;
        }
        const $slider = $(this).parent();
        $slider.addClass('mdui-slider-focus');
    });
    // 结束触摸滑块事件
    $document.on(endEvent, rangeSelector, function (event) {
        if (!isAllow(event)) {
            return;
        }
        if (this.disabled) {
            return;
        }
        const $slider = $(this).parent();
        $slider.removeClass('mdui-slider-focus');
    });
    $document.on(unlockEvent, rangeSelector, register);
    /**
     * 初始化滑块
     */
    mdui.mutation('.mdui-slider', function () {
        reInit($(this));
    });
});
mdui.updateSliders = function (selector) {
    const $elements = isUndefined(selector) ? $('.mdui-slider') : $(selector);
    $elements.each((_, element) => {
        reInit($(element));
    });
};
