import $ from 'mdui.jq/es/$';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/width';
$.lockScreen = function () {
    const $body = $('body');
    // 不直接把 body 设为 box-sizing: border-box，避免污染全局样式
    const newBodyWidth = $body.width();
    let level = $body.data('_lockscreen_level') || 0;
    $body
        .addClass('mdui-locked')
        .width(newBodyWidth)
        .data('_lockscreen_level', ++level);
};
