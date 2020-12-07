/**
 * touch 事件后的 500ms 内禁用 mousedown 事件
 *
 * 不支持触控的屏幕上事件顺序为 mousedown -> mouseup -> click
 * 支持触控的屏幕上事件顺序为 touchstart -> touchend -> mousedown -> mouseup -> click
 *
 * 在每一个事件中都使用 TouchHandler.isAllow(event) 判断事件是否可执行
 * 在 touchstart 和 touchmove、touchend、touchcancel
 *
 * (function () {
 *   $document
 *     .on(start, function (e) {
 *       if (!isAllow(e)) {
 *         return;
 *       }
 *       register(e);
 *       console.log(e.type);
 *     })
 *     .on(move, function (e) {
 *       if (!isAllow(e)) {
 *         return;
 *       }
 *       console.log(e.type);
 *     })
 *     .on(end, function (e) {
 *       if (!isAllow(e)) {
 *         return;
 *       }
 *       console.log(e.type);
 *     })
 *     .on(unlock, register);
 * })();
 */
declare const startEvent = "touchstart mousedown";
declare const moveEvent = "touchmove mousemove";
declare const endEvent = "touchend mouseup";
declare const cancelEvent = "touchcancel mouseleave";
declare const unlockEvent = "touchend touchmove touchcancel";
/**
 * 该事件是否被允许，在执行事件前调用该方法判断事件是否可以执行
 * 若已触发 touch 事件，则阻止之后的鼠标事件
 * @param event
 */
declare function isAllow(event: Event): boolean;
/**
 * 在 touchstart 和 touchmove、touchend、touchcancel 事件中调用该方法注册事件
 * @param event
 */
declare function register(event: Event): void;
export { startEvent, moveEvent, endEvent, cancelEvent, unlockEvent, isAllow, register, };
