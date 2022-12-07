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
        return Reflect.getMetadata(key, obj, ...([prop] ?? []));
    },
    set(obj, key, value, prop) {
        return Reflect.defineMetadata(key, value, obj, ...([prop] ?? []));
    },
    delete(obj, key, prop) {
        return Reflect.deleteMetadata(key, obj, ...([prop] ?? []));
    },
    keys(obj, prop) {
        return Reflect.getMetadataKeys(obj, ...([prop] ?? []));
    }
});
//# sourceMappingURL=Reflector.js.map