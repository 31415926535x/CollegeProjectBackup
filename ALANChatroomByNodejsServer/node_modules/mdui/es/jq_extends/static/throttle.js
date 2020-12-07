import $ from 'mdui.jq/es/$';
import { isNull } from 'mdui.jq/es/utils';
$.throttle = function (fn, delay = 16) {
    let timer = null;
    return function (...args) {
        if (isNull(timer)) {
            timer = setTimeout(() => {
                fn.apply(this, args);
                timer = null;
            }, delay);
        }
    };
};
