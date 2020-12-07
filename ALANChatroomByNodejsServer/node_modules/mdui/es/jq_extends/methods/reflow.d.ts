import 'mdui.jq/es/methods/each';
declare module 'mdui.jq/es/JQ' {
    interface JQ<T = HTMLElement> {
        /**
         * 强制重绘当前元素
         *
         * @example
    ```js
    $('.box').reflow();
    ```
         */
        reflow(): this;
    }
}
