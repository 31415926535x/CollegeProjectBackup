import $ from 'mdui.jq/es/$';
import { isUndefined } from 'mdui.jq/es/utils';
import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/css';
import 'mdui.jq/es/methods/appendTo';
import 'mdui.jq/es/methods/addClass';
import '../methods/reflow';
$.showOverlay = function (zIndex) {
    let $overlay = $('.mdui-overlay');
    if ($overlay.length) {
        $overlay.data('_overlay_is_deleted', false);
        if (!isUndefined(zIndex)) {
            $overlay.css('z-index', zIndex);
        }
    }
    else {
        if (isUndefined(zIndex)) {
            zIndex = 2000;
        }
        $overlay = $('<div class="mdui-overlay">')
            .appendTo(document.body)
            .reflow()
            .css('z-index', zIndex);
    }
    let level = $overlay.data('_overlay_level') || 0;
    return $overlay.data('_overlay_level', ++level).addClass('mdui-overlay-show');
};
