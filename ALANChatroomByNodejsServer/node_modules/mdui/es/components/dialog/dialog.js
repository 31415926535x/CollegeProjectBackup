import $ from 'mdui.jq/es/$';
import each from 'mdui.jq/es/functions/each';
import extend from 'mdui.jq/es/functions/extend';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/on';
import mdui from '../../mdui';
import './index';
const DEFAULT_BUTTON = {
    text: '',
    bold: false,
    close: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClick: () => { },
};
const DEFAULT_OPTIONS = {
    title: '',
    content: '',
    buttons: [],
    stackedButtons: false,
    cssClass: '',
    history: true,
    overlay: true,
    modal: false,
    closeOnEsc: true,
    destroyOnClosed: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onOpen: () => { },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onOpened: () => { },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClose: () => { },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClosed: () => { },
};
mdui.dialog = function (options) {
    var _a, _b;
    // 合并配置参数
    options = extend({}, DEFAULT_OPTIONS, options);
    each(options.buttons, (i, button) => {
        options.buttons[i] = extend({}, DEFAULT_BUTTON, button);
    });
    // 按钮的 HTML
    let buttonsHTML = '';
    if ((_a = options.buttons) === null || _a === void 0 ? void 0 : _a.length) {
        buttonsHTML = `<div class="mdui-dialog-actions${options.stackedButtons ? ' mdui-dialog-actions-stacked' : ''}">`;
        each(options.buttons, (_, button) => {
            buttonsHTML +=
                '<a href="javascript:void(0)" ' +
                    `class="mdui-btn mdui-ripple mdui-text-color-primary ${button.bold ? 'mdui-btn-bold' : ''}">${button.text}</a>`;
        });
        buttonsHTML += '</div>';
    }
    // Dialog 的 HTML
    const HTML = `<div class="mdui-dialog ${options.cssClass}">` +
        (options.title
            ? `<div class="mdui-dialog-title">${options.title}</div>`
            : '') +
        (options.content
            ? `<div class="mdui-dialog-content">${options.content}</div>`
            : '') +
        buttonsHTML +
        '</div>';
    // 实例化 Dialog
    const instance = new mdui.Dialog(HTML, {
        history: options.history,
        overlay: options.overlay,
        modal: options.modal,
        closeOnEsc: options.closeOnEsc,
        destroyOnClosed: options.destroyOnClosed,
    });
    // 绑定按钮事件
    if ((_b = options.buttons) === null || _b === void 0 ? void 0 : _b.length) {
        instance.$element
            .find('.mdui-dialog-actions .mdui-btn')
            .each((index, button) => {
            $(button).on('click', () => {
                options.buttons[index].onClick(instance);
                if (options.buttons[index].close) {
                    instance.close();
                }
            });
        });
    }
    // 绑定打开关闭事件
    instance.$element
        .on('open.mdui.dialog', () => {
        options.onOpen(instance);
    })
        .on('opened.mdui.dialog', () => {
        options.onOpened(instance);
    })
        .on('close.mdui.dialog', () => {
        options.onClose(instance);
    })
        .on('closed.mdui.dialog', () => {
        options.onClosed(instance);
    });
    instance.open();
    return instance;
};
