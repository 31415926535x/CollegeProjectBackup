/*!
 * mdui.jq 2.0.1 (https://github.com/zdhxiong/mdui.jq#readme)
 * Copyright 2018-2020 zdhxiong
 * Licensed under MIT
 */
function isFunction(target) {
    return typeof target === 'function';
}
function isString(target) {
    return typeof target === 'string';
}
function isNumber(target) {
    return typeof target === 'number';
}
function isBoolean(target) {
    return typeof target === 'boolean';
}
function isUndefined(target) {
    return typeof target === 'undefined';
}
function isNull(target) {
    return target === null;
}
function isWindow(target) {
    return target instanceof Window;
}
function isDocument(target) {
    return target instanceof Document;
}
function isElement(target) {
    return target instanceof Element;
}
function isNode(target) {
    return target instanceof Node;
}
/**
 * 是否是 IE 浏览器
 */
function isIE() {
    // @ts-ignore
    return !!window.document.documentMode;
}
function isArrayLike(target) {
    if (isFunction(target) || isWindow(target)) {
        return false;
    }
    return isNumber(target.length);
}
function isObjectLike(target) {
    return typeof target === 'object' && target !== null;
}
function toElement(target) {
    return isDocument(target) ? target.documentElement : target;
}
/**
 * 把用 - 分隔的字符串转为驼峰（如 box-sizing 转换为 boxSizing）
 * @param string
 */
function toCamelCase(string) {
    return string
        .replace(/^-ms-/, 'ms-')
        .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
/**
 * 把驼峰法转为用 - 分隔的字符串（如 boxSizing 转换为 box-sizing）
 * @param string
 */
function toKebabCase(string) {
    return string.replace(/[A-Z]/g, (replacer) => '-' + replacer.toLowerCase());
}
/**
 * 获取元素的样式值
 * @param element
 * @param name
 */
function getComputedStyleValue(element, name) {
    return window.getComputedStyle(element).getPropertyValue(toKebabCase(name));
}
/**
 * 检查元素的 box-sizing 是否是 border-box
 * @param element
 */
function isBorderBox(element) {
    return getComputedStyleValue(element, 'box-sizing') === 'border-box';
}
/**
 * 获取元素的 padding, border, margin 宽度（两侧宽度的和，单位为px）
 * @param element
 * @param direction
 * @param extra
 */
function getExtraWidth(element, direction, extra) {
    const position = direction === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'];
    return [0, 1].reduce((prev, _, index) => {
        let prop = extra + position[index];
        if (extra === 'border') {
            prop += 'Width';
        }
        return prev + parseFloat(getComputedStyleValue(element, prop) || '0');
    }, 0);
}
/**
 * 获取元素的样式值，对 width 和 height 进行过处理
 * @param element
 * @param name
 */
function getStyle(element, name) {
    // width、height 属性使用 getComputedStyle 得到的值不准确，需要使用 getBoundingClientRect 获取
    if (name === 'width' || name === 'height') {
        const valueNumber = element.getBoundingClientRect()[name];
        if (isBorderBox(element)) {
            return `${valueNumber}px`;
        }
        return `${valueNumber -
            getExtraWidth(element, name, 'border') -
            getExtraWidth(element, name, 'padding')}px`;
    }
    return getComputedStyleValue(element, name);
}
/**
 * 获取子节点组成的数组
 * @param target
 * @param parent
 */
function getChildNodesArray(target, parent) {
    const tempParent = document.createElement(parent);
    tempParent.innerHTML = target;
    return [].slice.call(tempParent.childNodes);
}
/**
 * 始终返回 false 的函数
 */
function returnFalse() {
    return false;
}
/**
 * 数值单位的 CSS 属性
 */
const cssNumber = [
    'animationIterationCount',
    'columnCount',
    'fillOpacity',
    'flexGrow',
    'flexShrink',
    'fontWeight',
    'gridArea',
    'gridColumn',
    'gridColumnEnd',
    'gridColumnStart',
    'gridRow',
    'gridRowEnd',
    'gridRowStart',
    'lineHeight',
    'opacity',
    'order',
    'orphans',
    'widows',
    'zIndex',
    'zoom',
];

function each(target, callback) {
    if (isArrayLike(target)) {
        for (let i = 0; i < target.length; i += 1) {
            if (callback.call(target[i], i, target[i]) === false) {
                return target;
            }
        }
    }
    else {
        const keys = Object.keys(target);
        for (let i = 0; i < keys.length; i += 1) {
            if (callback.call(target[keys[i]], keys[i], target[keys[i]]) === false) {
                return target;
            }
        }
    }
    return target;
}

/**
 * 为了使用模块扩充，这里不能使用默认导出
 */
class JQ {
    constructor(arr) {
        this.length = 0;
        if (!arr) {
            return this;
        }
        each(arr, (i, item) => {
            // @ts-ignore
            this[i] = item;
        });
        this.length = arr.length;
        return this;
    }
}

function get$() {
    const $ = function (selector) {
        if (!selector) {
            return new JQ();
        }
        // JQ
        if (selector instanceof JQ) {
            return selector;
        }
        // function
        if (isFunction(selector)) {
            if (/complete|loaded|interactive/.test(document.readyState) &&
                document.body) {
                selector.call(document, $);
            }
            else {
                document.addEventListener('DOMContentLoaded', () => selector.call(document, $), false);
            }
            return new JQ([document]);
        }
        // String
        if (isString(selector)) {
            const html = selector.trim();
            // 根据 HTML 字符串创建 JQ 对象
            if (html[0] === '<' && html[html.length - 1] === '>') {
                let toCreate = 'div';
                const tags = {
                    li: 'ul',
                    tr: 'tbody',
                    td: 'tr',
                    th: 'tr',
                    tbody: 'table',
                    option: 'select',
                };
                each(tags, (childTag, parentTag) => {
                    if (html.indexOf(`<${childTag}`) === 0) {
                        toCreate = parentTag;
                        return false;
                    }
                    return;
                });
                return new JQ(getChildNodesArray(html, toCreate));
            }
            // 根据 CSS 选择器创建 JQ 对象
            const isIdSelector = selector[0] === '#' && !selector.match(/[ .<>:~]/);
            if (!isIdSelector) {
                return new JQ(document.querySelectorAll(selector));
            }
            const element = document.getElementById(selector.slice(1));
            if (element) {
                return new JQ([element]);
            }
            return new JQ();
        }
        if (isArrayLike(selector) && !isNode(selector)) {
            return new JQ(selector);
        }
        return new JQ([selector]);
    };
    $.fn = JQ.prototype;
    return $;
}
const $ = get$();

$.fn.each = function (callback) {
    return each(this, callback);
};

/**
 * 检查 container 元素内是否包含 contains 元素
 * @param container 父元素
 * @param contains 子元素
 * @example
```js
contains( document, document.body ); // true
contains( document.getElementById('test'), document ); // false
contains( $('.container').get(0), $('.contains').get(0) ); // false
```
 */
function contains(container, contains) {
    return container !== contains && toElement(container).contains(contains);
}

/**
 * 把第二个数组的元素追加到第一个数组中，并返回合并后的数组
 * @param first 第一个数组
 * @param second 该数组的元素将被追加到第一个数组中
 * @example
```js
merge( [ 0, 1, 2 ], [ 2, 3, 4 ] )
// [ 0, 1, 2, 2, 3, 4 ]
```
 */
function merge(first, second) {
    each(second, (_, value) => {
        first.push(value);
    });
    return first;
}

$.fn.get = function (index) {
    return index === undefined
        ? [].slice.call(this)
        : this[index >= 0 ? index : index + this.length];
};

$.fn.find = function (selector) {
    const foundElements = [];
    this.each((_, element) => {
        merge(foundElements, $(element.querySelectorAll(selector)).get());
    });
    return new JQ(foundElements);
};

// 存储事件
const handlers = {};
// 元素ID
let mduiElementId = 1;
/**
 * 为元素赋予一个唯一的ID
 */
function getElementId(element) {
    const key = '_mduiEventId';
    // @ts-ignore
    if (!element[key]) {
        // @ts-ignore
        element[key] = ++mduiElementId;
    }
    // @ts-ignore
    return element[key];
}
/**
 * 解析事件名中的命名空间
 */
function parse(type) {
    const parts = type.split('.');
    return {
        type: parts[0],
        ns: parts.slice(1).sort().join(' '),
    };
}
/**
 * 命名空间匹配规则
 */
function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
}
/**
 * 获取匹配的事件
 * @param element
 * @param type
 * @param func
 * @param selector
 */
function getHandlers(element, type, func, selector) {
    const event = parse(type);
    return (handlers[getElementId(element)] || []).filter((handler) => handler &&
        (!event.type || handler.type === event.type) &&
        (!event.ns || matcherFor(event.ns).test(handler.ns)) &&
        (!func || getElementId(handler.func) === getElementId(func)) &&
        (!selector || handler.selector === selector));
}
/**
 * 添加事件监听
 * @param element
 * @param types
 * @param func
 * @param data
 * @param selector
 */
function add(element, types, func, data, selector) {
    const elementId = getElementId(element);
    if (!handlers[elementId]) {
        handlers[elementId] = [];
    }
    // 传入 data.useCapture 来设置 useCapture: true
    let useCapture = false;
    if (isObjectLike(data) && data.useCapture) {
        useCapture = true;
    }
    types.split(' ').forEach((type) => {
        if (!type) {
            return;
        }
        const event = parse(type);
        function callFn(e, elem) {
            // 因为鼠标事件模拟事件的 detail 属性是只读的，因此在 e._detail 中存储参数
            const result = func.apply(elem, 
            // @ts-ignore
            e._detail === undefined ? [e] : [e].concat(e._detail));
            if (result === false) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
        function proxyFn(e) {
            // @ts-ignore
            if (e._ns && !matcherFor(e._ns).test(event.ns)) {
                return;
            }
            // @ts-ignore
            e._data = data;
            if (selector) {
                // 事件代理
                $(element)
                    .find(selector)
                    .get()
                    .reverse()
                    .forEach((elem) => {
                    if (elem === e.target ||
                        contains(elem, e.target)) {
                        callFn(e, elem);
                    }
                });
            }
            else {
                // 不使用事件代理
                callFn(e, element);
            }
        }
        const handler = {
            type: event.type,
            ns: event.ns,
            func,
            selector,
            id: handlers[elementId].length,
            proxy: proxyFn,
        };
        handlers[elementId].push(handler);
        element.addEventListener(handler.type, proxyFn, useCapture);
    });
}
/**
 * 移除事件监听
 * @param element
 * @param types
 * @param func
 * @param selector
 */
function remove(element, types, func, selector) {
    const handlersInElement = handlers[getElementId(element)] || [];
    const removeEvent = (handler) => {
        delete handlersInElement[handler.id];
        element.removeEventListener(handler.type, handler.proxy, false);
    };
    if (!types) {
        handlersInElement.forEach((handler) => removeEvent(handler));
    }
    else {
        types.split(' ').forEach((type) => {
            if (type) {
                getHandlers(element, type, func, selector).forEach((handler) => removeEvent(handler));
            }
        });
    }
}

$.fn.trigger = function (type, extraParameters) {
    const event = parse(type);
    let eventObject;
    const eventParams = {
        bubbles: true,
        cancelable: true,
    };
    const isMouseEvent = ['click', 'mousedown', 'mouseup', 'mousemove'].indexOf(event.type) > -1;
    if (isMouseEvent) {
        // Note: MouseEvent 无法传入 detail 参数
        eventObject = new MouseEvent(event.type, eventParams);
    }
    else {
        eventParams.detail = extraParameters;
        eventObject = new CustomEvent(event.type, eventParams);
    }
    // @ts-ignore
    eventObject._detail = extraParameters;
    // @ts-ignore
    eventObject._ns = event.ns;
    return this.each(function () {
        this.dispatchEvent(eventObject);
    });
};

function extend(target, object1, ...objectN) {
    objectN.unshift(object1);
    each(objectN, (_, object) => {
        each(object, (prop, value) => {
            if (!isUndefined(value)) {
                target[prop] = value;
            }
        });
    });
    return target;
}

/**
 * 将数组或对象序列化，序列化后的字符串可作为 URL 查询字符串使用
 *
 * 若传入数组，则格式必须和 serializeArray 方法的返回值一样
 * @param obj 对象或数组
 * @example
```js
param({ width: 1680, height: 1050 });
// width=1680&height=1050
```
 * @example
```js
param({ foo: { one: 1, two: 2 }})
// foo[one]=1&foo[two]=2
```
 * @example
```js
param({ids: [1, 2, 3]})
// ids[]=1&ids[]=2&ids[]=3
```
 * @example
```js
param([
  {"name":"name","value":"mdui"},
  {"name":"password","value":"123456"}
])
// name=mdui&password=123456
```
 */
function param(obj) {
    if (!isObjectLike(obj) && !Array.isArray(obj)) {
        return '';
    }
    const args = [];
    function destructure(key, value) {
        let keyTmp;
        if (isObjectLike(value)) {
            each(value, (i, v) => {
                if (Array.isArray(value) && !isObjectLike(v)) {
                    keyTmp = '';
                }
                else {
                    keyTmp = i;
                }
                destructure(`${key}[${keyTmp}]`, v);
            });
        }
        else {
            if (value == null || value === '') {
                keyTmp = '=';
            }
            else {
                keyTmp = `=${encodeURIComponent(value)}`;
            }
            args.push(encodeURIComponent(key) + keyTmp);
        }
    }
    if (Array.isArray(obj)) {
        each(obj, function () {
            destructure(this.name, this.value);
        });
    }
    else {
        each(obj, destructure);
    }
    return args.join('&');
}

// 全局配置参数
const globalOptions = {};
// 全局事件名
const ajaxEvents = {
    ajaxStart: 'start.mdui.ajax',
    ajaxSuccess: 'success.mdui.ajax',
    ajaxError: 'error.mdui.ajax',
    ajaxComplete: 'complete.mdui.ajax',
};

/**
 * 判断此请求方法是否通过查询字符串提交参数
 * @param method 请求方法，大写
 */
function isQueryStringData(method) {
    return ['GET', 'HEAD'].indexOf(method) >= 0;
}
/**
 * 添加参数到 URL 上，且 URL 中不存在 ? 时，自动把第一个 & 替换为 ?
 * @param url
 * @param query
 */
function appendQuery(url, query) {
    return `${url}&${query}`.replace(/[&?]{1,2}/, '?');
}
/**
 * 合并请求参数，参数优先级：options > globalOptions > defaults
 * @param options
 */
function mergeOptions(options) {
    // 默认参数
    const defaults = {
        url: '',
        method: 'GET',
        data: '',
        processData: true,
        async: true,
        cache: true,
        username: '',
        password: '',
        headers: {},
        xhrFields: {},
        statusCode: {},
        dataType: 'text',
        contentType: 'application/x-www-form-urlencoded',
        timeout: 0,
        global: true,
    };
    // globalOptions 中的回调函数不合并
    each(globalOptions, (key, value) => {
        const callbacks = [
            'beforeSend',
            'success',
            'error',
            'complete',
            'statusCode',
        ];
        // @ts-ignore
        if (callbacks.indexOf(key) < 0 && !isUndefined(value)) {
            defaults[key] = value;
        }
    });
    return extend({}, defaults, options);
}
/**
 * 发送 ajax 请求
 * @param options
 * @example
```js
ajax({
  method: "POST",
  url: "some.php",
  data: { name: "John", location: "Boston" }
}).then(function( msg ) {
  alert( "Data Saved: " + msg );
});
```
 */
function ajax(options) {
    // 是否已取消请求
    let isCanceled = false;
    // 事件参数
    const eventParams = {};
    // 参数合并
    const mergedOptions = mergeOptions(options);
    let url = mergedOptions.url || window.location.toString();
    const method = mergedOptions.method.toUpperCase();
    let data = mergedOptions.data;
    const processData = mergedOptions.processData;
    const async = mergedOptions.async;
    const cache = mergedOptions.cache;
    const username = mergedOptions.username;
    const password = mergedOptions.password;
    const headers = mergedOptions.headers;
    const xhrFields = mergedOptions.xhrFields;
    const statusCode = mergedOptions.statusCode;
    const dataType = mergedOptions.dataType;
    const contentType = mergedOptions.contentType;
    const timeout = mergedOptions.timeout;
    const global = mergedOptions.global;
    // 需要发送的数据
    // GET/HEAD 请求和 processData 为 true 时，转换为查询字符串格式，特殊格式不转换
    if (data &&
        (isQueryStringData(method) || processData) &&
        !isString(data) &&
        !(data instanceof ArrayBuffer) &&
        !(data instanceof Blob) &&
        !(data instanceof Document) &&
        !(data instanceof FormData)) {
        data = param(data);
    }
    // 对于 GET、HEAD 类型的请求，把 data 数据添加到 URL 中
    if (data && isQueryStringData(method)) {
        // 查询字符串拼接到 URL 中
        url = appendQuery(url, data);
        data = null;
    }
    /**
     * 触发事件和回调函数
     * @param event
     * @param params
     * @param callback
     * @param args
     */
    function trigger(event, params, callback, ...args) {
        // 触发全局事件
        if (global) {
            $(document).trigger(event, params);
        }
        // 触发 ajax 回调和事件
        let result1;
        let result2;
        if (callback) {
            // 全局回调
            if (callback in globalOptions) {
                // @ts-ignore
                result1 = globalOptions[callback](...args);
            }
            // 自定义回调
            if (mergedOptions[callback]) {
                // @ts-ignore
                result2 = mergedOptions[callback](...args);
            }
            // beforeSend 回调返回 false 时取消 ajax 请求
            if (callback === 'beforeSend' &&
                (result1 === false || result2 === false)) {
                isCanceled = true;
            }
        }
    }
    // XMLHttpRequest 请求
    function XHR() {
        let textStatus;
        return new Promise((resolve, reject) => {
            // GET/HEAD 请求的缓存处理
            if (isQueryStringData(method) && !cache) {
                url = appendQuery(url, `_=${Date.now()}`);
            }
            // 创建 XHR
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, async, username, password);
            if (contentType ||
                (data && !isQueryStringData(method) && contentType !== false)) {
                xhr.setRequestHeader('Content-Type', contentType);
            }
            // 设置 Accept
            if (dataType === 'json') {
                xhr.setRequestHeader('Accept', 'application/json, text/javascript');
            }
            // 添加 headers
            if (headers) {
                each(headers, (key, value) => {
                    // undefined 值不发送，string 和 null 需要发送
                    if (!isUndefined(value)) {
                        xhr.setRequestHeader(key, value + ''); // 把 null 转换成字符串
                    }
                });
            }
            // 检查是否是跨域请求，跨域请求时不添加 X-Requested-With
            const crossDomain = /^([\w-]+:)?\/\/([^/]+)/.test(url) &&
                RegExp.$2 !== window.location.host;
            if (!crossDomain) {
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            }
            if (xhrFields) {
                each(xhrFields, (key, value) => {
                    // @ts-ignore
                    xhr[key] = value;
                });
            }
            eventParams.xhr = xhr;
            eventParams.options = mergedOptions;
            let xhrTimeout;
            xhr.onload = function () {
                if (xhrTimeout) {
                    clearTimeout(xhrTimeout);
                }
                // AJAX 返回的 HTTP 响应码是否表示成功
                const isHttpStatusSuccess = (xhr.status >= 200 && xhr.status < 300) ||
                    xhr.status === 304 ||
                    xhr.status === 0;
                let responseData;
                if (isHttpStatusSuccess) {
                    if (xhr.status === 204 || method === 'HEAD') {
                        textStatus = 'nocontent';
                    }
                    else if (xhr.status === 304) {
                        textStatus = 'notmodified';
                    }
                    else {
                        textStatus = 'success';
                    }
                    if (dataType === 'json') {
                        try {
                            responseData =
                                method === 'HEAD' ? undefined : JSON.parse(xhr.responseText);
                            eventParams.data = responseData;
                        }
                        catch (err) {
                            textStatus = 'parsererror';
                            trigger(ajaxEvents.ajaxError, eventParams, 'error', xhr, textStatus);
                            reject(new Error(textStatus));
                        }
                        if (textStatus !== 'parsererror') {
                            trigger(ajaxEvents.ajaxSuccess, eventParams, 'success', responseData, textStatus, xhr);
                            resolve(responseData);
                        }
                    }
                    else {
                        responseData =
                            method === 'HEAD'
                                ? undefined
                                : xhr.responseType === 'text' || xhr.responseType === ''
                                    ? xhr.responseText
                                    : xhr.response;
                        eventParams.data = responseData;
                        trigger(ajaxEvents.ajaxSuccess, eventParams, 'success', responseData, textStatus, xhr);
                        resolve(responseData);
                    }
                }
                else {
                    textStatus = 'error';
                    trigger(ajaxEvents.ajaxError, eventParams, 'error', xhr, textStatus);
                    reject(new Error(textStatus));
                }
                // statusCode
                each([globalOptions.statusCode, statusCode], (_, func) => {
                    if (func && func[xhr.status]) {
                        if (isHttpStatusSuccess) {
                            func[xhr.status](responseData, textStatus, xhr);
                        }
                        else {
                            func[xhr.status](xhr, textStatus);
                        }
                    }
                });
                trigger(ajaxEvents.ajaxComplete, eventParams, 'complete', xhr, textStatus);
            };
            xhr.onerror = function () {
                if (xhrTimeout) {
                    clearTimeout(xhrTimeout);
                }
                trigger(ajaxEvents.ajaxError, eventParams, 'error', xhr, xhr.statusText);
                trigger(ajaxEvents.ajaxComplete, eventParams, 'complete', xhr, 'error');
                reject(new Error(xhr.statusText));
            };
            xhr.onabort = function () {
                let statusText = 'abort';
                if (xhrTimeout) {
                    statusText = 'timeout';
                    clearTimeout(xhrTimeout);
                }
                trigger(ajaxEvents.ajaxError, eventParams, 'error', xhr, statusText);
                trigger(ajaxEvents.ajaxComplete, eventParams, 'complete', xhr, statusText);
                reject(new Error(statusText));
            };
            // ajax start 回调
            trigger(ajaxEvents.ajaxStart, eventParams, 'beforeSend', xhr);
            if (isCanceled) {
                reject(new Error('cancel'));
                return;
            }
            // Timeout
            if (timeout > 0) {
                xhrTimeout = setTimeout(() => {
                    xhr.abort();
                }, timeout);
            }
            // 发送 XHR
            xhr.send(data);
        });
    }
    return XHR();
}

$.ajax = ajax;

/**
 * 为 Ajax 请求设置全局配置参数
 * @param options 键值对参数
 * @example
```js
ajaxSetup({
  dataType: 'json',
  method: 'POST',
});
```
 */
function ajaxSetup(options) {
    return extend(globalOptions, options);
}

$.ajaxSetup = ajaxSetup;

$.contains = contains;

const dataNS = '_mduiElementDataStorage';

/**
 * 在元素上设置键值对数据
 * @param element
 * @param object
 */
function setObjectToElement(element, object) {
    // @ts-ignore
    if (!element[dataNS]) {
        // @ts-ignore
        element[dataNS] = {};
    }
    each(object, (key, value) => {
        // @ts-ignore
        element[dataNS][toCamelCase(key)] = value;
    });
}
function data(element, key, value) {
    // 根据键值对设置值
    // data(element, { 'key' : 'value' })
    if (isObjectLike(key)) {
        setObjectToElement(element, key);
        return key;
    }
    // 根据 key、value 设置值
    // data(element, 'key', 'value')
    if (!isUndefined(value)) {
        setObjectToElement(element, { [key]: value });
        return value;
    }
    // 获取所有值
    // data(element)
    if (isUndefined(key)) {
        // @ts-ignore
        return element[dataNS] ? element[dataNS] : {};
    }
    // 从 dataNS 中获取指定值
    // data(element, 'key')
    key = toCamelCase(key);
    // @ts-ignore
    if (element[dataNS] && key in element[dataNS]) {
        // @ts-ignore
        return element[dataNS][key];
    }
    return undefined;
}

$.data = data;

$.each = each;

$.extend = function (...objectN) {
    if (objectN.length === 1) {
        each(objectN[0], (prop, value) => {
            this[prop] = value;
        });
        return this;
    }
    return extend(objectN.shift(), objectN.shift(), ...objectN);
};

function map(elements, callback) {
    let value;
    const ret = [];
    each(elements, (i, element) => {
        value = callback.call(window, element, i);
        if (value != null) {
            ret.push(value);
        }
    });
    return [].concat(...ret);
}

$.map = map;

$.merge = merge;

$.param = param;

/**
 * 移除指定元素上存放的数据
 * @param element 存放数据的元素
 * @param name
 * 数据键名
 *
 * 若未指定键名，将移除元素上所有数据
 *
 * 多个键名可以用空格分隔，或者用数组表示多个键名
  @example
```js
// 移除元素上键名为 name 的数据
removeData(document.body, 'name');
```
 * @example
```js
// 移除元素上键名为 name1 和 name2 的数据
removeData(document.body, 'name1 name2');
```
 * @example
```js
// 移除元素上键名为 name1 和 name2 的数据
removeData(document.body, ['name1', 'name2']);
```
 * @example
```js
// 移除元素上所有数据
removeData(document.body);
```
 */
function removeData(element, name) {
    // @ts-ignore
    if (!element[dataNS]) {
        return;
    }
    const remove = (nameItem) => {
        nameItem = toCamelCase(nameItem);
        // @ts-ignore
        if (element[dataNS][nameItem]) {
            // @ts-ignore
            element[dataNS][nameItem] = null;
            // @ts-ignore
            delete element[dataNS][nameItem];
        }
    };
    if (isUndefined(name)) {
        // @ts-ignore
        element[dataNS] = null;
        // @ts-ignore
        delete element[dataNS];
        // @ts-ignore
    }
    else if (isString(name)) {
        name
            .split(' ')
            .filter((nameItem) => nameItem)
            .forEach((nameItem) => remove(nameItem));
    }
    else {
        each(name, (_, nameItem) => remove(nameItem));
    }
}

$.removeData = removeData;

/**
 * 过滤掉数组中的重复元素
 * @param arr 数组
 * @example
```js
unique([1, 2, 12, 3, 2, 1, 2, 1, 1]);
// [1, 2, 12, 3]
```
 */
function unique(arr) {
    const result = [];
    each(arr, (_, val) => {
        if (result.indexOf(val) === -1) {
            result.push(val);
        }
    });
    return result;
}

$.unique = unique;

$.fn.add = function (selector) {
    return new JQ(unique(merge(this.get(), $(selector).get())));
};

each(['add', 'remove', 'toggle'], (_, name) => {
    $.fn[`${name}Class`] = function (className) {
        if (name === 'remove' && !arguments.length) {
            return this.each((_, element) => {
                element.setAttribute('class', '');
            });
        }
        return this.each((i, element) => {
            if (!isElement(element)) {
                return;
            }
            const classes = (isFunction(className)
                ? className.call(element, i, element.getAttribute('class') || '')
                : className)
                .split(' ')
                .filter((name) => name);
            each(classes, (_, cls) => {
                element.classList[name](cls);
            });
        });
    };
});

each(['insertBefore', 'insertAfter'], (nameIndex, name) => {
    $.fn[name] = function (target) {
        const $element = nameIndex ? $(this.get().reverse()) : this; // 顺序和 jQuery 保持一致
        const $target = $(target);
        const result = [];
        $target.each((index, target) => {
            if (!target.parentNode) {
                return;
            }
            $element.each((_, element) => {
                const newItem = index
                    ? element.cloneNode(true)
                    : element;
                const existingItem = nameIndex ? target.nextSibling : target;
                result.push(newItem);
                target.parentNode.insertBefore(newItem, existingItem);
            });
        });
        return $(nameIndex ? result.reverse() : result);
    };
});

/**
 * 是否不是 HTML 字符串（包裹在 <> 中）
 * @param target
 */
function isPlainText(target) {
    return (isString(target) && (target[0] !== '<' || target[target.length - 1] !== '>'));
}
each(['before', 'after'], (nameIndex, name) => {
    $.fn[name] = function (...args) {
        // after 方法，多个参数需要按参数顺序添加到元素后面，所以需要将参数顺序反向处理
        if (nameIndex === 1) {
            args = args.reverse();
        }
        return this.each((index, element) => {
            const targets = isFunction(args[0])
                ? [args[0].call(element, index, element.innerHTML)]
                : args;
            each(targets, (_, target) => {
                let $target;
                if (isPlainText(target)) {
                    $target = $(getChildNodesArray(target, 'div'));
                }
                else if (index && isElement(target)) {
                    $target = $(target.cloneNode(true));
                }
                else {
                    $target = $(target);
                }
                $target[nameIndex ? 'insertAfter' : 'insertBefore'](element);
            });
        });
    };
});

$.fn.off = function (types, selector, callback) {
    // types 是对象
    if (isObjectLike(types)) {
        each(types, (type, fn) => {
            // this.off('click', undefined, function () {})
            // this.off('click', '.box', function () {})
            this.off(type, selector, fn);
        });
        return this;
    }
    // selector 不存在
    if (selector === false || isFunction(selector)) {
        callback = selector;
        selector = undefined;
        // this.off('click', undefined, function () {})
    }
    // callback 传入 `false`，相当于 `return false`
    if (callback === false) {
        callback = returnFalse;
    }
    return this.each(function () {
        remove(this, types, callback, selector);
    });
};

$.fn.on = function (types, selector, data, callback, one) {
    // types 可以是 type/func 对象
    if (isObjectLike(types)) {
        // (types-Object, selector, data)
        if (!isString(selector)) {
            // (types-Object, data)
            data = data || selector;
            selector = undefined;
        }
        each(types, (type, fn) => {
            // selector 和 data 都可能是 undefined
            // @ts-ignore
            this.on(type, selector, data, fn, one);
        });
        return this;
    }
    if (data == null && callback == null) {
        // (types, fn)
        callback = selector;
        data = selector = undefined;
    }
    else if (callback == null) {
        if (isString(selector)) {
            // (types, selector, fn)
            callback = data;
            data = undefined;
        }
        else {
            // (types, data, fn)
            callback = data;
            data = selector;
            selector = undefined;
        }
    }
    if (callback === false) {
        callback = returnFalse;
    }
    else if (!callback) {
        return this;
    }
    // $().one()
    if (one) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _this = this;
        const origCallback = callback;
        callback = function (event) {
            _this.off(event.type, selector, callback);
            // eslint-disable-next-line prefer-rest-params
            return origCallback.apply(this, arguments);
        };
    }
    return this.each(function () {
        add(this, types, callback, data, selector);
    });
};

each(ajaxEvents, (name, eventName) => {
    $.fn[name] = function (fn) {
        return this.on(eventName, (e, params) => {
            fn(e, params.xhr, params.options, params.data);
        });
    };
});

$.fn.map = function (callback) {
    return new JQ(map(this, (element, i) => callback.call(element, i, element)));
};

$.fn.clone = function () {
    return this.map(function () {
        return this.cloneNode(true);
    });
};

$.fn.is = function (selector) {
    let isMatched = false;
    if (isFunction(selector)) {
        this.each((index, element) => {
            if (selector.call(element, index, element)) {
                isMatched = true;
            }
        });
        return isMatched;
    }
    if (isString(selector)) {
        this.each((_, element) => {
            if (isDocument(element) || isWindow(element)) {
                return;
            }
            // @ts-ignore
            const matches = element.matches || element.msMatchesSelector;
            if (matches.call(element, selector)) {
                isMatched = true;
            }
        });
        return isMatched;
    }
    const $compareWith = $(selector);
    this.each((_, element) => {
        $compareWith.each((_, compare) => {
            if (element === compare) {
                isMatched = true;
            }
        });
    });
    return isMatched;
};

$.fn.remove = function (selector) {
    return this.each((_, element) => {
        if (element.parentNode && (!selector || $(element).is(selector))) {
            element.parentNode.removeChild(element);
        }
    });
};

each(['prepend', 'append'], (nameIndex, name) => {
    $.fn[name] = function (...args) {
        return this.each((index, element) => {
            const childNodes = element.childNodes;
            const childLength = childNodes.length;
            const child = childLength
                ? childNodes[nameIndex ? childLength - 1 : 0]
                : document.createElement('div');
            if (!childLength) {
                element.appendChild(child);
            }
            let contents = isFunction(args[0])
                ? [args[0].call(element, index, element.innerHTML)]
                : args;
            // 如果不是字符串，则仅第一个元素使用原始元素，其他的都克隆自第一个元素
            if (index) {
                contents = contents.map((content) => {
                    return isString(content) ? content : $(content).clone();
                });
            }
            $(child)[nameIndex ? 'after' : 'before'](...contents);
            if (!childLength) {
                element.removeChild(child);
            }
        });
    };
});

each(['appendTo', 'prependTo'], (nameIndex, name) => {
    $.fn[name] = function (target) {
        const extraChilds = [];
        const $target = $(target).map((_, element) => {
            const childNodes = element.childNodes;
            const childLength = childNodes.length;
            if (childLength) {
                return childNodes[nameIndex ? 0 : childLength - 1];
            }
            const child = document.createElement('div');
            element.appendChild(child);
            extraChilds.push(child);
            return child;
        });
        const $result = this[nameIndex ? 'insertBefore' : 'insertAfter']($target);
        $(extraChilds).remove();
        return $result;
    };
});

each(['attr', 'prop', 'css'], (nameIndex, name) => {
    function set(element, key, value) {
        // 值为 undefined 时，不修改
        if (isUndefined(value)) {
            return;
        }
        switch (nameIndex) {
            // attr
            case 0:
                if (isNull(value)) {
                    element.removeAttribute(key);
                }
                else {
                    element.setAttribute(key, value);
                }
                break;
            // prop
            case 1:
                // @ts-ignore
                element[key] = value;
                break;
            // css
            default:
                key = toCamelCase(key);
                // @ts-ignore
                element.style[key] = isNumber(value)
                    ? `${value}${cssNumber.indexOf(key) > -1 ? '' : 'px'}`
                    : value;
                break;
        }
    }
    function get(element, key) {
        switch (nameIndex) {
            // attr
            case 0:
                // 属性不存在时，原生 getAttribute 方法返回 null，而 jquery 返回 undefined。这里和 jquery 保持一致
                const value = element.getAttribute(key);
                return isNull(value) ? undefined : value;
            // prop
            case 1:
                // @ts-ignore
                return element[key];
            // css
            default:
                return getStyle(element, key);
        }
    }
    $.fn[name] = function (key, value) {
        if (isObjectLike(key)) {
            each(key, (k, v) => {
                // @ts-ignore
                this[name](k, v);
            });
            return this;
        }
        if (arguments.length === 1) {
            const element = this[0];
            return isElement(element) ? get(element, key) : undefined;
        }
        return this.each((i, element) => {
            set(element, key, isFunction(value) ? value.call(element, i, get(element, key)) : value);
        });
    };
});

$.fn.children = function (selector) {
    const children = [];
    this.each((_, element) => {
        each(element.childNodes, (__, childNode) => {
            if (!isElement(childNode)) {
                return;
            }
            if (!selector || $(childNode).is(selector)) {
                children.push(childNode);
            }
        });
    });
    return new JQ(unique(children));
};

$.fn.slice = function (...args) {
    return new JQ([].slice.apply(this, args));
};

$.fn.eq = function (index) {
    const ret = index === -1 ? this.slice(index) : this.slice(index, +index + 1);
    return new JQ(ret);
};

function dir($elements, nameIndex, node, selector, filter) {
    const ret = [];
    let target;
    $elements.each((_, element) => {
        target = element[node];
        // 不能包含最顶层的 document 元素
        while (target && isElement(target)) {
            // prevUntil, nextUntil, parentsUntil
            if (nameIndex === 2) {
                if (selector && $(target).is(selector)) {
                    break;
                }
                if (!filter || $(target).is(filter)) {
                    ret.push(target);
                }
            }
            // prev, next, parent
            else if (nameIndex === 0) {
                if (!selector || $(target).is(selector)) {
                    ret.push(target);
                }
                break;
            }
            // prevAll, nextAll, parents
            else {
                if (!selector || $(target).is(selector)) {
                    ret.push(target);
                }
            }
            // @ts-ignore
            target = target[node];
        }
    });
    return new JQ(unique(ret));
}

each(['', 's', 'sUntil'], (nameIndex, name) => {
    $.fn[`parent${name}`] = function (selector, filter) {
        // parents、parentsUntil 需要把元素的顺序反向处理，以便和 jQuery 的结果一致
        const $nodes = !nameIndex ? this : $(this.get().reverse());
        return dir($nodes, nameIndex, 'parentNode', selector, filter);
    };
});

$.fn.closest = function (selector) {
    if (this.is(selector)) {
        return this;
    }
    const matched = [];
    this.parents().each((_, element) => {
        if ($(element).is(selector)) {
            matched.push(element);
            return false;
        }
    });
    return new JQ(matched);
};

const rbrace = /^(?:{[\w\W]*\}|\[[\w\W]*\])$/;
// 从 `data-*` 中获取的值，需要经过该函数转换
function getData(value) {
    if (value === 'true') {
        return true;
    }
    if (value === 'false') {
        return false;
    }
    if (value === 'null') {
        return null;
    }
    if (value === +value + '') {
        return +value;
    }
    if (rbrace.test(value)) {
        return JSON.parse(value);
    }
    return value;
}
// 若 value 不存在，则从 `data-*` 中获取值
function dataAttr(element, key, value) {
    if (isUndefined(value) && element.nodeType === 1) {
        const name = 'data-' + toKebabCase(key);
        value = element.getAttribute(name);
        if (isString(value)) {
            try {
                value = getData(value);
            }
            catch (e) { }
        }
        else {
            value = undefined;
        }
    }
    return value;
}
$.fn.data = function (key, value) {
    // 获取所有值
    if (isUndefined(key)) {
        if (!this.length) {
            return undefined;
        }
        const element = this[0];
        const resultData = data(element);
        // window, document 上不存在 `data-*` 属性
        if (element.nodeType !== 1) {
            return resultData;
        }
        // 从 `data-*` 中获取值
        const attrs = element.attributes;
        let i = attrs.length;
        while (i--) {
            if (attrs[i]) {
                let name = attrs[i].name;
                if (name.indexOf('data-') === 0) {
                    name = toCamelCase(name.slice(5));
                    resultData[name] = dataAttr(element, name, resultData[name]);
                }
            }
        }
        return resultData;
    }
    // 同时设置多个值
    if (isObjectLike(key)) {
        return this.each(function () {
            data(this, key);
        });
    }
    // value 传入了 undefined
    if (arguments.length === 2 && isUndefined(value)) {
        return this;
    }
    // 设置值
    if (!isUndefined(value)) {
        return this.each(function () {
            data(this, key, value);
        });
    }
    // 获取值
    if (!this.length) {
        return undefined;
    }
    return dataAttr(this[0], key, data(this[0], key));
};

$.fn.empty = function () {
    return this.each(function () {
        this.innerHTML = '';
    });
};

$.fn.extend = function (obj) {
    each(obj, (prop, value) => {
        // 在 JQ 对象上扩展方法时，需要自己添加 typescript 的类型定义
        $.fn[prop] = value;
    });
    return this;
};

$.fn.filter = function (selector) {
    if (isFunction(selector)) {
        return this.map((index, element) => selector.call(element, index, element) ? element : undefined);
    }
    if (isString(selector)) {
        return this.map((_, element) => $(element).is(selector) ? element : undefined);
    }
    const $selector = $(selector);
    return this.map((_, element) => $selector.get().indexOf(element) > -1 ? element : undefined);
};

$.fn.first = function () {
    return this.eq(0);
};

$.fn.has = function (selector) {
    const $targets = isString(selector) ? this.find(selector) : $(selector);
    const { length } = $targets;
    return this.map(function () {
        for (let i = 0; i < length; i += 1) {
            if (contains(this, $targets[i])) {
                return this;
            }
        }
        return;
    });
};

$.fn.hasClass = function (className) {
    return this[0].classList.contains(className);
};

/**
 * 值上面的 padding、border、margin 处理
 * @param element
 * @param name
 * @param value
 * @param funcIndex
 * @param includeMargin
 * @param multiply
 */
function handleExtraWidth(element, name, value, funcIndex, includeMargin, multiply) {
    // 获取元素的 padding, border, margin 宽度（两侧宽度的和）
    const getExtraWidthValue = (extra) => {
        return (getExtraWidth(element, name.toLowerCase(), extra) *
            multiply);
    };
    if (funcIndex === 2 && includeMargin) {
        value += getExtraWidthValue('margin');
    }
    if (isBorderBox(element)) {
        // IE 为 box-sizing: border-box 时，得到的值不含 border 和 padding，这里先修复
        // 仅获取时需要处理，multiply === 1 为 get
        if (isIE() && multiply === 1) {
            value += getExtraWidthValue('border');
            value += getExtraWidthValue('padding');
        }
        if (funcIndex === 0) {
            value -= getExtraWidthValue('border');
        }
        if (funcIndex === 1) {
            value -= getExtraWidthValue('border');
            value -= getExtraWidthValue('padding');
        }
    }
    else {
        if (funcIndex === 0) {
            value += getExtraWidthValue('padding');
        }
        if (funcIndex === 2) {
            value += getExtraWidthValue('border');
            value += getExtraWidthValue('padding');
        }
    }
    return value;
}
/**
 * 获取元素的样式值
 * @param element
 * @param name
 * @param funcIndex 0: innerWidth, innerHeight; 1: width, height; 2: outerWidth, outerHeight
 * @param includeMargin
 */
function get(element, name, funcIndex, includeMargin) {
    const clientProp = `client${name}`;
    const scrollProp = `scroll${name}`;
    const offsetProp = `offset${name}`;
    const innerProp = `inner${name}`;
    // $(window).width()
    if (isWindow(element)) {
        // outerWidth, outerHeight 需要包含滚动条的宽度
        return funcIndex === 2
            ? element[innerProp]
            : toElement(document)[clientProp];
    }
    // $(document).width()
    if (isDocument(element)) {
        const doc = toElement(element);
        return Math.max(
        // @ts-ignore
        element.body[scrollProp], doc[scrollProp], 
        // @ts-ignore
        element.body[offsetProp], doc[offsetProp], doc[clientProp]);
    }
    const value = parseFloat(getComputedStyleValue(element, name.toLowerCase()) || '0');
    return handleExtraWidth(element, name, value, funcIndex, includeMargin, 1);
}
/**
 * 设置元素的样式值
 * @param element
 * @param elementIndex
 * @param name
 * @param funcIndex 0: innerWidth, innerHeight; 1: width, height; 2: outerWidth, outerHeight
 * @param includeMargin
 * @param value
 */
function set(element, elementIndex, name, funcIndex, includeMargin, value) {
    let computedValue = isFunction(value)
        ? value.call(element, elementIndex, get(element, name, funcIndex, includeMargin))
        : value;
    if (computedValue == null) {
        return;
    }
    const $element = $(element);
    const dimension = name.toLowerCase();
    // 特殊的值，不需要计算 padding、border、margin
    if (['auto', 'inherit', ''].indexOf(computedValue) > -1) {
        $element.css(dimension, computedValue);
        return;
    }
    // 其他值保留原始单位。注意：如果不使用 px 作为单位，则算出的值一般是不准确的
    const suffix = computedValue.toString().replace(/\b[0-9.]*/, '');
    const numerical = parseFloat(computedValue);
    computedValue =
        handleExtraWidth(element, name, numerical, funcIndex, includeMargin, -1) +
            (suffix || 'px');
    $element.css(dimension, computedValue);
}
each(['Width', 'Height'], (_, name) => {
    each([`inner${name}`, name.toLowerCase(), `outer${name}`], (funcIndex, funcName) => {
        $.fn[funcName] = function (margin, value) {
            // 是否是赋值操作
            const isSet = arguments.length && (funcIndex < 2 || !isBoolean(margin));
            const includeMargin = margin === true || value === true;
            // 获取第一个元素的值
            if (!isSet) {
                return this.length
                    ? get(this[0], name, funcIndex, includeMargin)
                    : undefined;
            }
            // 设置每个元素的值
            return this.each((index, element) => set(element, index, name, funcIndex, includeMargin, margin));
        };
    });
});

$.fn.hide = function () {
    return this.each(function () {
        this.style.display = 'none';
    });
};

each(['val', 'html', 'text'], (nameIndex, name) => {
    const props = {
        0: 'value',
        1: 'innerHTML',
        2: 'textContent',
    };
    const propName = props[nameIndex];
    function get($elements) {
        // text() 获取所有元素的文本
        if (nameIndex === 2) {
            // @ts-ignore
            return map($elements, (element) => toElement(element)[propName]).join('');
        }
        // 空集合时，val() 和 html() 返回 undefined
        if (!$elements.length) {
            return undefined;
        }
        // val() 和 html() 仅获取第一个元素的内容
        const firstElement = $elements[0];
        // select multiple 返回数组
        if (nameIndex === 0 && $(firstElement).is('select[multiple]')) {
            return map($(firstElement).find('option:checked'), (element) => element.value);
        }
        // @ts-ignore
        return firstElement[propName];
    }
    function set(element, value) {
        // text() 和 html() 赋值为 undefined，则保持原内容不变
        // val() 赋值为 undefined 则赋值为空
        if (isUndefined(value)) {
            if (nameIndex !== 0) {
                return;
            }
            value = '';
        }
        if (nameIndex === 1 && isElement(value)) {
            value = value.outerHTML;
        }
        // @ts-ignore
        element[propName] = value;
    }
    $.fn[name] = function (value) {
        // 获取值
        if (!arguments.length) {
            return get(this);
        }
        // 设置值
        return this.each((i, element) => {
            const computedValue = isFunction(value)
                ? value.call(element, i, get($(element)))
                : value;
            // value 是数组，则选中数组中的元素，反选不在数组中的元素
            if (nameIndex === 0 && Array.isArray(computedValue)) {
                // select[multiple]
                if ($(element).is('select[multiple]')) {
                    map($(element).find('option'), (option) => (option.selected =
                        computedValue.indexOf(option.value) >
                            -1));
                }
                // 其他 checkbox, radio 等元素
                else {
                    element.checked =
                        computedValue.indexOf(element.value) > -1;
                }
            }
            else {
                set(element, computedValue);
            }
        });
    };
});

$.fn.index = function (selector) {
    if (!arguments.length) {
        return this.eq(0).parent().children().get().indexOf(this[0]);
    }
    if (isString(selector)) {
        return $(selector).get().indexOf(this[0]);
    }
    return this.get().indexOf($(selector)[0]);
};

$.fn.last = function () {
    return this.eq(-1);
};

each(['', 'All', 'Until'], (nameIndex, name) => {
    $.fn[`next${name}`] = function (selector, filter) {
        return dir(this, nameIndex, 'nextElementSibling', selector, filter);
    };
});

$.fn.not = function (selector) {
    const $excludes = this.filter(selector);
    return this.map((_, element) => $excludes.index(element) > -1 ? undefined : element);
};

/**
 * 返回最近的用于定位的父元素
 */
$.fn.offsetParent = function () {
    return this.map(function () {
        let offsetParent = this.offsetParent;
        while (offsetParent && $(offsetParent).css('position') === 'static') {
            offsetParent = offsetParent.offsetParent;
        }
        return offsetParent || document.documentElement;
    });
};

function floatStyle($element, name) {
    return parseFloat($element.css(name));
}
$.fn.position = function () {
    if (!this.length) {
        return undefined;
    }
    const $element = this.eq(0);
    let currentOffset;
    let parentOffset = {
        left: 0,
        top: 0,
    };
    if ($element.css('position') === 'fixed') {
        currentOffset = $element[0].getBoundingClientRect();
    }
    else {
        currentOffset = $element.offset();
        const $offsetParent = $element.offsetParent();
        parentOffset = $offsetParent.offset();
        parentOffset.top += floatStyle($offsetParent, 'border-top-width');
        parentOffset.left += floatStyle($offsetParent, 'border-left-width');
    }
    return {
        top: currentOffset.top - parentOffset.top - floatStyle($element, 'margin-top'),
        left: currentOffset.left -
            parentOffset.left -
            floatStyle($element, 'margin-left'),
    };
};

function get$1(element) {
    if (!element.getClientRects().length) {
        return { top: 0, left: 0 };
    }
    const rect = element.getBoundingClientRect();
    const win = element.ownerDocument.defaultView;
    return {
        top: rect.top + win.pageYOffset,
        left: rect.left + win.pageXOffset,
    };
}
function set$1(element, value, index) {
    const $element = $(element);
    const position = $element.css('position');
    if (position === 'static') {
        $element.css('position', 'relative');
    }
    const currentOffset = get$1(element);
    const currentTopString = $element.css('top');
    const currentLeftString = $element.css('left');
    let currentTop;
    let currentLeft;
    const calculatePosition = (position === 'absolute' || position === 'fixed') &&
        (currentTopString + currentLeftString).indexOf('auto') > -1;
    if (calculatePosition) {
        const currentPosition = $element.position();
        currentTop = currentPosition.top;
        currentLeft = currentPosition.left;
    }
    else {
        currentTop = parseFloat(currentTopString);
        currentLeft = parseFloat(currentLeftString);
    }
    const computedValue = isFunction(value)
        ? value.call(element, index, extend({}, currentOffset))
        : value;
    $element.css({
        top: computedValue.top != null
            ? computedValue.top - currentOffset.top + currentTop
            : undefined,
        left: computedValue.left != null
            ? computedValue.left - currentOffset.left + currentLeft
            : undefined,
    });
}
$.fn.offset = function (value) {
    // 获取坐标
    if (!arguments.length) {
        if (!this.length) {
            return undefined;
        }
        return get$1(this[0]);
    }
    // 设置坐标
    return this.each(function (index) {
        set$1(this, value, index);
    });
};

$.fn.one = function (types, selector, data, callback) {
    // @ts-ignore
    return this.on(types, selector, data, callback, true);
};

each(['', 'All', 'Until'], (nameIndex, name) => {
    $.fn[`prev${name}`] = function (selector, filter) {
        // prevAll、prevUntil 需要把元素的顺序倒序处理，以便和 jQuery 的结果一致
        const $nodes = !nameIndex ? this : $(this.get().reverse());
        return dir($nodes, nameIndex, 'previousElementSibling', selector, filter);
    };
});

$.fn.removeAttr = function (attributeName) {
    const names = attributeName.split(' ').filter((name) => name);
    return this.each(function () {
        each(names, (_, name) => {
            this.removeAttribute(name);
        });
    });
};

$.fn.removeData = function (name) {
    return this.each(function () {
        removeData(this, name);
    });
};

$.fn.removeProp = function (name) {
    return this.each(function () {
        try {
            // @ts-ignore
            delete this[name];
        }
        catch (e) { }
    });
};

$.fn.replaceWith = function (newContent) {
    this.each((index, element) => {
        let content = newContent;
        if (isFunction(content)) {
            content = content.call(element, index, element.innerHTML);
        }
        else if (index && !isString(content)) {
            content = $(content).clone();
        }
        $(element).before(content);
    });
    return this.remove();
};

$.fn.replaceAll = function (target) {
    return $(target).map((index, element) => {
        $(element).replaceWith(index ? this.clone() : this);
        return this.get();
    });
};

/**
 * 将表单元素的值组合成键值对数组
 * @returns {Array}
 */
$.fn.serializeArray = function () {
    const result = [];
    this.each((_, element) => {
        const elements = element instanceof HTMLFormElement ? element.elements : [element];
        $(elements).each((_, element) => {
            const $element = $(element);
            const type = element.type;
            const nodeName = element.nodeName.toLowerCase();
            if (nodeName !== 'fieldset' &&
                element.name &&
                !element.disabled &&
                ['input', 'select', 'textarea', 'keygen'].indexOf(nodeName) > -1 &&
                ['submit', 'button', 'image', 'reset', 'file'].indexOf(type) === -1 &&
                (['radio', 'checkbox'].indexOf(type) === -1 ||
                    element.checked)) {
                const value = $element.val();
                const valueArr = Array.isArray(value) ? value : [value];
                valueArr.forEach((value) => {
                    result.push({
                        name: element.name,
                        value,
                    });
                });
            }
        });
    });
    return result;
};

$.fn.serialize = function () {
    return param(this.serializeArray());
};

const elementDisplay = {};
/**
 * 获取元素的初始 display 值，用于 .show() 方法
 * @param nodeName
 */
function defaultDisplay(nodeName) {
    let element;
    let display;
    if (!elementDisplay[nodeName]) {
        element = document.createElement(nodeName);
        document.body.appendChild(element);
        display = getStyle(element, 'display');
        element.parentNode.removeChild(element);
        if (display === 'none') {
            display = 'block';
        }
        elementDisplay[nodeName] = display;
    }
    return elementDisplay[nodeName];
}
/**
 * 显示指定元素
 * @returns {JQ}
 */
$.fn.show = function () {
    return this.each(function () {
        if (this.style.display === 'none') {
            this.style.display = '';
        }
        if (getStyle(this, 'display') === 'none') {
            this.style.display = defaultDisplay(this.nodeName);
        }
    });
};

/**
 * 取得同辈元素的集合
 * @param selector {String=}
 * @returns {JQ}
 */
$.fn.siblings = function (selector) {
    return this.prevAll(selector).add(this.nextAll(selector));
};

/**
 * 切换元素的显示状态
 */
$.fn.toggle = function () {
    return this.each(function () {
        getStyle(this, 'display') === 'none' ? $(this).show() : $(this).hide();
    });
};

export default $;
//# sourceMappingURL=jq.esm.js.map
