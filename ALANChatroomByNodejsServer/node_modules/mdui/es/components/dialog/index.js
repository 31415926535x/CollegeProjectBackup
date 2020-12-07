import mdui from '../../mdui';
import 'mdui.jq/es/methods/on';
import { $document } from '../../utils/dom';
import { currentInst, Dialog } from './class';
// esc 按下时关闭对话框
$document.on('keydown', (event) => {
    if (currentInst &&
        currentInst.options.closeOnEsc &&
        currentInst.state === 'opened' &&
        event.keyCode === 27) {
        currentInst.close();
    }
});
mdui.Dialog = Dialog;
