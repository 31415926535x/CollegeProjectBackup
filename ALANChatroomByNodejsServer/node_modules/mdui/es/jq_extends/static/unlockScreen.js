import $ from 'mdui.jq/es/$';
import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/removeClass';
import 'mdui.jq/es/methods/width';
$.unlockScreen = function (force = false) {
    const $body = $('body');
    let level = force ? 1 : $body.data('_lockscreen_level');
    if (level > 1) {
        $body.data('_lockscreen_level', --level);
        return;
    }
    $body.data('_lockscreen_level', 0).removeClass('mdui-locked').width('');
};
