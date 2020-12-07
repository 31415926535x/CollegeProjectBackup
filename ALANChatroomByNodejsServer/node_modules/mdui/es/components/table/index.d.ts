import 'mdui.jq/es/methods/add';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/eq';
import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/first';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/prependTo';
import 'mdui.jq/es/methods/remove';
import 'mdui.jq/es/methods/removeClass';
import Selector from 'mdui.jq/es/types/Selector';
import '../../global/mutation';
declare module '../../interfaces/MduiStatic' {
    interface MduiStatic {
        /**
         * 动态修改了表格后，需要调用该方法重新初始化表格。
         *
         * 若传入了参数，则只初始化该参数对应的表格。若没有传入参数，则重新初始化所有表格。
         * @param selector CSS 选择器、或 DOM 元素、或 DOM 元素组成的数组、或 JQ 对象
         */
        updateTables(selector?: Selector | HTMLElement | ArrayLike<HTMLElement>): void;
    }
}
