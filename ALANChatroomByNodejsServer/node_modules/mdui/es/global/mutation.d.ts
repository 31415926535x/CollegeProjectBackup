import 'mdui.jq/es/methods/each';
import '../jq_extends/methods/mutation';
import { TYPE_API_INIT } from '../utils/mutation';
declare module '../interfaces/MduiStatic' {
    interface MduiStatic {
        /**
         * 传入了两个参数时，注册并执行初始化函数
         *
         * 没有传入参数时，执行初始化
         * @param selector CSS 选择器
         * @param apiInit 初始化函数
         * @example
    ```js
    mdui.mutation();
    ```
         * @example
    ```js
    mdui.mutation();
    ```
         */
        mutation(selector?: string, apiInit?: TYPE_API_INIT): void;
    }
}
