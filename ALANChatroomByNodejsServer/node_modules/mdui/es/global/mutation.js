import $ from 'mdui.jq/es/$';
import 'mdui.jq/es/methods/each';
import mdui from '../mdui';
import '../jq_extends/methods/mutation';
import { isUndefined } from 'mdui.jq/es/utils';
import { entries, mutation } from '../utils/mutation';
mdui.mutation = function (selector, apiInit) {
    if (isUndefined(selector) || isUndefined(apiInit)) {
        $(document).mutation();
        return;
    }
    entries[selector] = apiInit;
    $(selector).each((i, element) => mutation(selector, apiInit, i, element));
};
