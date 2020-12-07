import $ from 'mdui.jq/es/$';
import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/on';
import mdui from '../../mdui';
import { $document } from '../../utils/dom';
import { parseOptions } from '../../utils/parseOptions';
import './index';
const customAttr = 'mdui-menu';
const dataName = '_mdui_menu';
$(() => {
    $document.on('click', `[${customAttr}]`, function () {
        const $this = $(this);
        let instance = $this.data(dataName);
        if (!instance) {
            const options = parseOptions(this, customAttr);
            const menuSelector = options.target;
            // @ts-ignore
            delete options.target;
            instance = new mdui.Menu($this, menuSelector, options);
            $this.data(dataName, instance);
            instance.toggle();
        }
    });
});
