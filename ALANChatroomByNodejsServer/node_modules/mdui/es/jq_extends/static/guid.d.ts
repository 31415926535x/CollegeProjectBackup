declare module 'mdui.jq/es/interfaces/JQStatic' {
    interface JQStatic {
        /**
         * 生成一个全局唯一的 ID
         * @param name 当该参数值对应的 guid 不存在时，会生成一个新的 guid，并返回；当该参数对应的 guid 已存在，则直接返回已有 guid
         * @example
    ```js
    $.guid();
    ```
         * @example
    ```js
    $.guid('test');
    ```
         */
        guid(name?: string): string;
    }
}
export {};
