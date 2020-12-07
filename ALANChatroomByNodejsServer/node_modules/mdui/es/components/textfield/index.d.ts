import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/appendTo';
import 'mdui.jq/es/methods/attr';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/is';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/outerHeight';
import 'mdui.jq/es/methods/parent';
import 'mdui.jq/es/methods/parents';
import 'mdui.jq/es/methods/remove';
import 'mdui.jq/es/methods/removeClass';
import 'mdui.jq/es/methods/text';
import 'mdui.jq/es/methods/trigger';
import 'mdui.jq/es/methods/val';
import Selector from 'mdui.jq/es/types/Selector';
import '../../global/mutation';
declare module '../../interfaces/MduiStatic' {
    interface MduiStatic {
        /**
         * 动态修改了文本框后，需要调用该方法重新初始化文本框。
         *
         * 若传入了参数，则只初始化该参数对应的文本框。若没有传入参数，则重新初始化所有文本框。
         * @param selector CSS 选择器、或 DOM 元素、或 DOM 元素组成的数组、或 JQ 对象
         */
        updateTextFields(selector?: Selector | HTMLElement | ArrayLike<HTMLElement>): void;
    }
}
