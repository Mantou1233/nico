"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Args = exports.Msg = exports._handleCogs = exports._handleInjector = exports.interaction = exports.command = exports.Cogs = exports.Inject = exports.DefinePlugin = void 0;
const Reflector_1 = __importDefault(require("../services/Reflector"));
const PluginLoader_1 = require("./PluginLoader");
const Registries_1 = require("../services/Registries");
function DefinePlugin(meta = {}) {
    return function PluginPatcher(plugin) {
        Reflector_1.default.set(plugin, "PluginMeta", {
            name: plugin.name.toLowerCase().replace("plugin", ""),
            ...meta
        });
    };
}
exports.DefinePlugin = DefinePlugin;
function Inject(obj, key) {
    if (!storage[key])
        return;
    Reflector_1.default.append(obj, "PluginInjector", key);
}
exports.Inject = Inject;
function Cogs(extenstions) {
    return function CogSetter(obj, ext) {
        if (Reflector_1.default.get(obj, "PluginCogs"))
            throw new Error("Already setted cogs");
        if (ext !== "extenstions")
            throw new Error("notExtendErrorAlias");
        Reflector_1.default.set(obj, "PluginCogs", extenstions);
    };
}
exports.Cogs = Cogs;
function command(meta = {}) {
    return function (target, propertyKey, descriptor) {
        Reflector_1.default.set(descriptor.value, "EventMeta", {
            command: propertyKey,
            disabled: false,
            cooldown: 0,
            ...meta,
            __type__: "command"
        });
    };
}
exports.command = command;
function interactionDecoratorMixin(type) {
    return function interaction(meta) {
        return function (target, propertyKey, descriptor) {
            Reflector_1.default.set(descriptor.value, "EventMeta", {
                ...meta,
                type,
                __type__: "interaction"
            });
        };
    };
}
function argumentPutDecoratorMixin(transformer) {
    return function ad(...args) {
        return function argumentDec(target, key, index) {
            const obj = Reflector_1.default.get(target, "PluginDecArgs") || {};
            const arr = obj[key] || [];
            arr[index] = {
                transformer,
                args
            };
            Reflector_1.default.appendMap(target, "PluginDecArgs", key, arr);
        };
    };
}
function _handleInjector(inst) {
    const _injects = Reflector_1.default.get(inst, "PluginInjector");
    if (Array.isArray(_injects)) {
        for (let k of _injects) {
            inst[k] = storage[k];
        }
    }
    return inst;
}
exports._handleInjector = _handleInjector;
function _handleCogs(inst, _path, name) {
    const _cogs = Reflector_1.default.get(inst, "PluginCogs");
    if (!_cogs)
        return;
    for (let c of _cogs) {
        let entry;
        try {
            entry = require(`../../${_path}${c
                .replace(".ts", "")
                .replace(".js", "")
                .replace("./", "")}`);
        }
        catch (e) {
            return (0, PluginLoader_1.log)(2, `Cog ${c} of ${name} fail: not a entry`);
        }
        entry = typeof entry == "function" ? entry : entry.default;
        if (!(typeof entry == "function"))
            continue;
        Registries_1.Registries["Loaders"][2](entry, {
            name: `${name}_Cog`,
            path: _path,
            isCog: true
        });
        (0, PluginLoader_1.log)(4, `Loaded cog ${c} of ${name}`);
    }
}
exports._handleCogs = _handleCogs;
const Msg = argumentPutDecoratorMixin((msg) => msg);
exports.Msg = Msg;
const Args = argumentPutDecoratorMixin((msg, ext, parser) => parser(msg.content));
exports.Args = Args;
const interaction = {
    button: interactionDecoratorMixin("button"),
    select_menu: interactionDecoratorMixin("selectmenu"),
    modal: interactionDecoratorMixin("modal")
};
exports.interaction = interaction;
//# sourceMappingURL=Decorators.js.map