import $ from 'mdui.jq/es/$';
import 'mdui.jq/es/methods/each';
$.fn.reflow = function () {
    return this.each(function () {
        return this.clientLeft;
    });
};
