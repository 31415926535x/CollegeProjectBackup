import $ from 'mdui.jq/es/$';
import 'mdui.jq/es/methods/each';
$.fn.transformOrigin = function (transformOrigin) {
    return this.each(function () {
        this.style.webkitTransformOrigin = transformOrigin;
        this.style.transformOrigin = transformOrigin;
    });
};
