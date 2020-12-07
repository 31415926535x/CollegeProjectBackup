import $ from 'mdui.jq/es/$';
import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/removeClass';
import 'mdui.jq/es/methods/remove';
import '../methods/transitionEnd';
$.hideOverlay = function (force = false) {
    const $overlay = $('.mdui-overlay');
    if (!$overlay.length) {
        return;
    }
    let level = force ? 1 : $overlay.data('_overlay_level');
    if (level > 1) {
        $overlay.data('_overlay_level', --level);
        return;
    }
    $overlay
        .data('_overlay_level', 0)
        .removeClass('mdui-overlay-show')
        .data('_overlay_is_deleted', true)
        .transitionEnd(() => {
        if ($overlay.data('_overlay_is_deleted')) {
            $overlay.remove();
        }
    });
};
