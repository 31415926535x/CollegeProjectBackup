import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/append';
import 'mdui.jq/es/methods/attr';
import 'mdui.jq/es/methods/css';
import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/empty';
import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/parent';
import 'mdui.jq/es/methods/remove';
import 'mdui.jq/es/methods/removeClass';
import 'mdui.jq/es/methods/text';
import 'mdui.jq/es/methods/val';
import 'mdui.jq/es/methods/width';
import Selector from 'mdui.jq/es/types/Selector';
declare module '../../interfaces/MduiStatic' {
    interface MduiStatic {
        /**
         * 动态修改了滑块后，需要调用该方法重新初始化滑块
         *
         * 若传入了参数，则只初始化该参数对应的滑块。若没有传入参数，则重新初始化所有滑块。
         * @param selector CSS 选择器、或 DOM 元素、或 DOM 元素组成的数组、或 JQ 对象
         */
        updateSliders(selector?: Selector | HTMLElement | ArrayLike<HTMLElement>): void;
    }
}
