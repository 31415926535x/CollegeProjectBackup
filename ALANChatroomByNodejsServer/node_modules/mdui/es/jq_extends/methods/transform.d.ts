import 'mdui.jq/es/methods/each';
declare module 'mdui.jq/es/JQ' {
    interface JQ<T = HTMLElement> {
        /**
         * 设置当前元素的 transform 属性
         * @param transform
         * @example
    ```js
    $('.box').transform('rotate(90deg)');
    ```
         */
        transform(transform: string): this;
    }
}
