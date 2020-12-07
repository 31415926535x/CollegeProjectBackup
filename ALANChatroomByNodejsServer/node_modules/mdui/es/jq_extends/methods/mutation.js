import $ from 'mdui.jq/es/$';
import each from 'mdui.jq/es/functions/each';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/is';
import { entries, mutation } from '../../utils/mutation';
$.fn.mutation = function () {
    return this.each((i, element) => {
        const $this = $(element);
        each(entries, (selector, apiInit) => {
            if ($this.is(selector)) {
                mutation(selector, apiInit, i, element);
            }
            $this.find(selector).each((i, element) => {
                mutation(selector, apiInit, i, element);
            });
        });
    });
};
