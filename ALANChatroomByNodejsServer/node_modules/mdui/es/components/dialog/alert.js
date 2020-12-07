import extend from 'mdui.jq/es/functions/extend';
import { isFunction, isUndefined } from 'mdui.jq/es/utils';
import mdui from '../../mdui';
import './dialog';
const DEFAULT_OPTIONS = {
    confirmText: 'ok',
    history: true,
    modal: false,
    closeOnEsc: true,
    closeOnConfirm: true,
};
mdui.alert = function (text, title, onConfirm, options) {
    if (isFunction(title)) {
        options = onConfirm;
        onConfirm = title;
        title = '';
    }
    if (isUndefined(onConfirm)) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onConfirm = () => { };
    }
    if (isUndefined(options)) {
        options = {};
    }
    options = extend({}, DEFAULT_OPTIONS, options);
    return mdui.dialog({
        title: title,
        content: text,
        buttons: [
            {
                text: options.confirmText,
                bold: false,
                close: options.closeOnConfirm,
                onClick: onConfirm,
            },
        ],
        cssClass: 'mdui-dialog-alert',
        history: options.history,
        modal: options.modal,
        closeOnEsc: options.closeOnEsc,
    });
};
