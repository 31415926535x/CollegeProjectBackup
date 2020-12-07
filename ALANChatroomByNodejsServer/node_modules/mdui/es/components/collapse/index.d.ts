import Selector from 'mdui.jq/es/types/Selector';
import { CollapseAbstract, OPTIONS } from './collapseAbstract';
declare module '../../interfaces/MduiStatic' {
    interface MduiStatic {
        /**
         * 折叠内容块组件
         *
         * 请通过 `new mdui.Collapse()` 调用
         */
        Collapse: {
            /**
             * 实例化 Collapse 组件
             * @param selector CSS 选择器或 DOM 元素
             * @param options 配置参数
             */
            new (selector: Selector | HTMLElement | ArrayLike<HTMLElement>, options?: OPTIONS): Collapse;
        };
    }
}
declare class Collapse extends CollapseAbstract {
    protected getNamespace(): string;
}
export {};
