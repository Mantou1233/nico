"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metadata = exports.md = void 0;
class Metadata {
    get(obj, key, prop) {
        return Reflect.getMetadata(key, obj, ...([prop] ?? []));
    }
    set(obj, key, value, prop) {
        return Reflect.defineMetadata(key, value, obj, ...([prop] ?? []));
    }
    delete(obj, key, prop) {
        return Reflect.deleteMetadata(key, obj, ...([prop] ?? []));
    }
    keys(obj, prop) {
        return Reflect.getMetadataKeys(obj, ...([prop] ?? []));
    }
}
exports.Metadata = Metadata;
const md = new Metadata();
exports.md = md;
//# sourceMappingURL=Reflector.js.map