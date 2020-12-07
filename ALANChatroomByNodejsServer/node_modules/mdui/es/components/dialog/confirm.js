import extend from 'mdui.jq/es/functions/extend';
import { isFunction, isUndefined } from 'mdui.jq/es/utils';
import mdui from '../../mdui';
import './dialog';
const DEFAULT_OPTIONS = {
    confirmText: 'ok',
    cancelText: 'cancel',
    history: true,
    modal: false,
    closeOnEsc: true,
    closeOnCancel: true,
    closeOnConfirm: true,
};
mdui.confirm = function (text, title, onConfirm, onCancel, options) {
    if (isFunction(title)) {
        options = onCancel;
        onCancel = onConfirm;
        onConfirm = title;
        title = '';
    }
    if (isUndefined(onConfirm)) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onConfirm = () => { };
    }
    if (isUndefined(onCancel)) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onCancel = () => { };
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
                text: options.cancelText,
                bold: false,
                close: options.closeOnCancel,
                onClick: onCancel,
            },
            {
                text: options.confirmText,
                bold: false,
                close: options.closeOnConfirm,
                onClick: onConfirm,
            },
        ],
        cssClass: 'mdui-dialog-confirm',
        history: options.history,
        modal: options.modal,
        closeOnEsc: options.closeOnEsc,
    });
};
