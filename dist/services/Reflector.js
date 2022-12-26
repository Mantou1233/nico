"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.md = void 0;
require("reflect-metadata");
const md = function md(key, value) {
    return Reflect.metadata(key, value);
};
exports.md = md;
Object.assign(md, {
    get(obj, key, prop) {
        return Reflect.getMetadata(key, obj, ...[prop]);
    },
    set(obj, key, value, prop) {
        return Reflect.defineMetadata(key, value, obj, ...[prop]);
    },
    append(obj, key, value, prop) {
        const arr = Reflect.getMetadata(key, obj, ...[prop]) ?? [];
        if (!Array.isArray(arr))
            throw new Error("obj origin not a array");
        arr.push(value);
        return Reflect.defineMetadata(key, arr, obj);
    },
    appendMap(obj, key, key2, value, prop) {
        const arr = Reflect.getMetadata(key, obj, ...[prop]) ?? {};
        if (!isObj(arr))
            throw new Error("obj origin not a object");
        arr[key2] = value;
        return Reflect.defineMetadata(key, arr, obj);
    },
    delete(obj, key, prop) {
        return Reflect.deleteMetadata(key, obj, ...[prop]);
    },
    keys(obj, prop) {
        return Reflect.getMetadataKeys(obj, ...[prop]);
    }
});
function isObj(arg) {
    return Object.prototype.toString.call(arg) == "[object Object]";
}
exports.default = md;
//# sourceMappingURL=Reflector.js.map