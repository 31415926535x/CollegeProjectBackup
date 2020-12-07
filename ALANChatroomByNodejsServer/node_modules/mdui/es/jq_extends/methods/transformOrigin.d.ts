import 'mdui.jq/es/methods/each';
declare module 'mdui.jq/es/JQ' {
    interface JQ<T = HTMLElement> {
        /**
         * 设置当前元素的 transform-origin 属性
         * @param transformOrigin
         * @example
    ```js
    $('.box').transformOrigin('top center');
    ```
         */
        transformOrigin(transformOrigin: string): this;
    }
}
