import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/off';
declare module 'mdui.jq/es/JQ' {
    interface JQ<T = HTMLElement> {
        /**
         * 在当前元素上添加 transitionend 事件回调
         * @param callback 回调函数的参数为 `transitionend` 事件对象；`this` 指向当前元素
         * @example
    ```js
    $('.box').transitionEnd(function() {
      alert('.box 元素的 transitionend 事件已触发');
    });
    ```
         */
        transitionEnd(callback: (this: T, e: Event) => void): this;
    }
}
