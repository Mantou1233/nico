"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registries = void 0;
const Reflector_1 = __importDefault(require("./Reflector"));
const Decorators_1 = require("../core/Decorators");
var Registries;
(function (Registries) {
    Registries.Loaders = {
        1 /* version */: function loader() { },
        2: function loader(plugin, { name, path, isCog = false }) {
            const meta = Reflector_1.default.get(plugin, "PluginMeta");
            const inst = (0, Decorators_1._handleInjector)(new plugin());
            if (!isCog)
                (0, Decorators_1._handleCogs)(inst, path, name);
            const handlers = {};
            for (let name of Object.getOwnPropertyNames(plugin.prototype)) {
                if (name == "constructor" ||
                    typeof plugin.prototype[name] !== "function")
                    continue;
                const fn = plugin.prototype[name];
                const data = Reflector_1.default.get(fn, "EventMeta");
                if (!data)
                    continue;
                if (!Object.hasOwn(handlers, data.__type__))
                    handlers[data.__type__] = [];
                handlers[data.__type__].push({
                    ...data,
                    __type__: data.__type__,
                    from: plugin.name,
                    at: name,
                    handler: fn.bind(inst)
                });
            }
            if (!meta)
                return console.log(`${name} isnt a vaild plugin, rejecting.`);
            Object.values(handlers).map((pr) => pr.map(pr => storage.client.manager.register({
                ...pr,
                handler: pr.handler.bind(inst)
            })));
        }
    };
})(Registries = exports.Registries || (exports.Registries = {}));
//# sourceMappingURL=Registries.js.map