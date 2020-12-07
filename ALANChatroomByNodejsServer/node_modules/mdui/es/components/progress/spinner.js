import $ from 'mdui.jq/es/$';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/html';
import { isUndefined } from 'mdui.jq/es/utils';
import mdui from '../../mdui';
import '../../global/mutation';
/**
 * layer 的 HTML 结构
 * @param index
 */
function layerHTML(index = false) {
    return (`<div class="mdui-spinner-layer ${index ? `mdui-spinner-layer-${index}` : ''}">` +
        '<div class="mdui-spinner-circle-clipper mdui-spinner-left">' +
        '<div class="mdui-spinner-circle"></div>' +
        '</div>' +
        '<div class="mdui-spinner-gap-patch">' +
        '<div class="mdui-spinner-circle"></div>' +
        '</div>' +
        '<div class="mdui-spinner-circle-clipper mdui-spinner-right">' +
        '<div class="mdui-spinner-circle"></div>' +
        '</div>' +
        '</div>');
}
/**
 * 填充 HTML
 * @param spinner
 */
function fillHTML(spinner) {
    const $spinner = $(spinner);
    const layer = $spinner.hasClass('mdui-spinner-colorful')
        ? layerHTML(1) + layerHTML(2) + layerHTML(3) + layerHTML(4)
        : layerHTML();
    $spinner.html(layer);
}
$(() => {
    // 页面加载完后自动填充 HTML 结构
    mdui.mutation('.mdui-spinner', function () {
        fillHTML(this);
    });
});
mdui.updateSpinners = function (selector) {
    const $elements = isUndefined(selector) ? $('.mdui-spinner') : $(selector);
    $elements.each(function () {
        fillHTML(this);
    });
};
