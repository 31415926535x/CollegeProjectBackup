import $ from 'mdui.jq/es/$';
import { isNumber } from 'mdui.jq/es/utils';
import 'mdui.jq/es/methods/each';
$.fn.transition = function (duration) {
    if (isNumber(duration)) {
        duration = `${duration}ms`;
    }
    return this.each(function () {
        this.style.webkitTransitionDuration = duration;
        this.style.transitionDuration = duration;
    });
};
