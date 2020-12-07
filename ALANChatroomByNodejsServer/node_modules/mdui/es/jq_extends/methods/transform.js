import $ from 'mdui.jq/es/$';
import 'mdui.jq/es/methods/each';
$.fn.transform = function (transform) {
    return this.each(function () {
        this.style.webkitTransform = transform;
        this.style.transform = transform;
    });
};
