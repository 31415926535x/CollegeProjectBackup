import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/width';
declare module 'mdui.jq/es/interfaces/JQStatic' {
    interface JQStatic {
        /**
         * 锁定屏页面，禁止页面滚动
         * @example
    ```js
    $.lockScreen();
    ```
         */
        lockScreen(): void;
    }
}
