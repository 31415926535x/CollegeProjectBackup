import $ from 'mdui.jq/es/$';
import { isUndefined } from 'mdui.jq/es/utils';
const GUID = {};
$.guid = function (name) {
    if (!isUndefined(name) && !isUndefined(GUID[name])) {
        return GUID[name];
    }
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    const guid = '_' +
        s4() +
        s4() +
        '-' +
        s4() +
        '-' +
        s4() +
        '-' +
        s4() +
        '-' +
        s4() +
        s4() +
        s4();
    if (!isUndefined(name)) {
        GUID[name] = guid;
    }
    return guid;
};
