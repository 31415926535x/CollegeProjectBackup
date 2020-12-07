import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/removeClass';
import 'mdui.jq/es/methods/remove';
import '../methods/transitionEnd';
declare module 'mdui.jq/es/interfaces/JQStatic' {
    interface JQStatic {
        /**
         * 隐藏遮罩层
         *
         * 如果调用了多次 $.showOverlay() 来显示遮罩层，则也需要调用相同次数的 $.hideOverlay() 才能隐藏遮罩层。可以通过传入参数 true 来强制隐藏遮罩层。
         * @param force 是否强制隐藏遮罩
         * @example
    ```js
    $.hideOverlay();
    ```
         * @example
    ```js
    $.hideOverlay(true);
    ```
         */
        hideOverlay(force?: boolean): void;
    }
}
