import $ from 'mdui.jq/es/$';
import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/first';
import 'mdui.jq/es/methods/on';
import mdui from '../../mdui';
import { $document } from '../../utils/dom';
import { parseOptions } from '../../utils/parseOptions';
import './index';
const customAttr = 'mdui-dialog';
const dataName = '_mdui_dialog';
$(() => {
    $document.on('click', `[${customAttr}]`, function () {
        const options = parseOptions(this, customAttr);
        const selector = options.target;
        // @ts-ignore
        delete options.target;
        const $dialog = $(selector).first();
        let instance = $dialog.data(dataName);
        if (!instance) {
            instance = new mdui.Dialog($dialog, options);
            $dialog.data(dataName, instance);
        }
        instance.open();
    });
});
