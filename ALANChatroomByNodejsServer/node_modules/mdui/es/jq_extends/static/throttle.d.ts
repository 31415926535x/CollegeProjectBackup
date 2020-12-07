declare module 'mdui.jq/es/interfaces/JQStatic' {
    interface JQStatic {
        /**
         * 函数节流
         * @param fn 执行的函数
         * @param delay 最多多少毫秒执行一次
         * @example
    ```js
    $.throttle(function () {
      console.log('这个函数最多 100ms 执行一次');
    }, 100)
    ```
         */
        throttle(fn: () => void, delay: number): () => void;
    }
}
export {};
