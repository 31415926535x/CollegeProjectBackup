import { JQStatic } from 'mdui.jq/es/interfaces/JQStatic';
export interface MduiStatic {
    /**
     * mdui.jq
     */
    $: JQStatic;
    [method: string]: any;
}
