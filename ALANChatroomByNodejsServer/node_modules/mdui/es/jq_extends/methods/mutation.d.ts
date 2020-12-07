import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/is';
declare module 'mdui.jq/es/JQ' {
    interface JQ<T = HTMLElement> {
        /**
         * 执行在当前元素及其子元素内注册的初始化函数
         */
        mutation(): this;
    }
}
