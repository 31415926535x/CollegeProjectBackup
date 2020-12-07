import data from 'mdui.jq/es/functions/data';
/**
 * CSS 选择器和初始化函数组成的对象
 */
const entries = {};
/**
 * 注册并执行初始化函数
 * @param selector CSS 选择器
 * @param apiInit 初始化函数
 * @param i 元素索引
 * @param element 元素
 */
function mutation(selector, apiInit, i, element) {
    let selectors = data(element, '_mdui_mutation');
    if (!selectors) {
        selectors = [];
        data(element, '_mdui_mutation', selectors);
    }
    if (selectors.indexOf(selector) === -1) {
        selectors.push(selector);
        apiInit.call(element, i, element);
    }
}
export { entries, mutation };
