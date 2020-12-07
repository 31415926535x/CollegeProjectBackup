import { JQ } from 'mdui.jq/es/JQ';
import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/css';
import 'mdui.jq/es/methods/appendTo';
import 'mdui.jq/es/methods/addClass';
import '../methods/reflow';
declare module 'mdui.jq/es/interfaces/JQStatic' {
    interface JQStatic {
        /**
         * 创建并显示遮罩，返回遮罩层的 JQ 对象
         * @param zIndex 遮罩层的 `z-index` 值，默认为 `2000`
         * @example
    ```js
    $.showOverlay();
    ```
         * @example
    ```js
    $.showOverlay(3000);
    ```
         */
        showOverlay(zIndex?: number): JQ;
    }
}
