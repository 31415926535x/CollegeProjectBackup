import $ from 'mdui.jq/es/$';
import 'mdui.jq/es/methods/first';
import 'mdui.jq/es/methods/on';
import mdui from '../../mdui';
import '../../global/mutation';
import { parseOptions } from '../../utils/parseOptions';
import './index';
const customAttr = 'mdui-drawer';
$(() => {
    mdui.mutation(`[${customAttr}]`, function () {
        const $element = $(this);
        const options = parseOptions(this, customAttr);
        const selector = options.target;
        // @ts-ignore
        delete options.target;
        const $drawer = $(selector).first();
        const instance = new mdui.Drawer($drawer, options);
        $element.on('click', () => instance.toggle());
    });
});
