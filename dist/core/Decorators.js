"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interaction = exports.command = exports.Cogs = exports.Inject = exports.DefinePlugin = void 0;
const Reflector_1 = require("@services/Reflector");
function DefinePlugin(meta = {}) {
    return function PluginPatcher(C) {
        Reflector_1.md.set(C, "pluginMeta", {
            name: C.name.toLowerCase().replace("plugin", ""),
            ...meta
        });
        const handlers = {};
        for (let name of Object.getOwnPropertyNames(C.prototype)) {
            if (name == "constructor" ||
                typeof C.prototype[name] !== "function")
                continue;
            const fn = C.prototype[name];
            const data = Reflector_1.md.get(fn, "meta");
            if (!data)
                continue;
            if (!Object.hasOwn(handlers, data.__type__))
                handlers[data.__type__] = [];
            handlers[data.__type__].push({
                ...data,
                __type__: data.__type__,
                from: C.name,
                at: name,
                handler: fn
            });
        }
        Reflector_1.md.set(C, "pluginData", { handlers });
    };
}
exports.DefinePlugin = DefinePlugin;
function Inject(obj, key) {
    if (!storage[key])
        return;
    return (0, Reflector_1.md)("Inject");
}
exports.Inject = Inject;
function Cogs(extenstions) {
    return function (obj, key) {
        if (key !== "extensions")
            return;
        obj[extenstions] = extenstions;
    };
}
exports.Cogs = Cogs;
function command(meta = {}) {
    return function (target, propertyKey, descriptor) {
        Reflector_1.md.set(descriptor.value, "meta", {
            command: propertyKey,
            disabled: false,
            cooldown: 0,
            ...meta,
            __type__: "command"
        });
    };
}
exports.command = command;
function interaction(meta) {
    return function (target, propertyKey, descriptor) {
        Reflector_1.md.set(descriptor.value, "meta", {
            ...meta,
            __type__: "interaction"
        });
    };
}
exports.interaction = interaction;
//# sourceMappingURL=Decorators.js.map