import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/html';
import Selector from 'mdui.jq/es/types/Selector';
import '../../global/mutation';
declare module '../../interfaces/MduiStatic' {
    interface MduiStatic {
        /**
         * 如果需要修改已有的圆形进度条组件，需要调用该方法来重新初始化组件。
         *
         * 若传入了参数，则只重新初始化该参数对应的圆形进度条。若没有传入参数，则重新初始化所有圆形进度条。
         * @param selector CSS 选择器、或 DOM 元素、或 DOM 元素组成的数组、或 JQ 对象
         */
        updateSpinners(selector?: Selector | HTMLElement | ArrayLike<HTMLElement>): void;
    }
}
