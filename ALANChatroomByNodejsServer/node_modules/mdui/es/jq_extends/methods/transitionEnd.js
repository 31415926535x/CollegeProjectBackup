import $ from 'mdui.jq/es/$';
import each from 'mdui.jq/es/functions/each';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/off';
$.fn.transitionEnd = function (callback) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const events = ['webkitTransitionEnd', 'transitionend'];
    function fireCallback(e) {
        if (e.target !== this) {
            return;
        }
        // @ts-ignore
        callback.call(this, e);
        each(events, (_, event) => {
            that.off(event, fireCallback);
        });
    }
    each(events, (_, event) => {
        that.on(event, fireCallback);
    });
    return this;
};
