import { rf, md, ij } from "@services/Reflector";
import { EventMeta, Events, PluginMeta, RawEventMeta } from "./structure/Types";

function DefinePlugin(meta: PluginMeta = {}) {
	return function PluginPatcher<T extends { new (...args: any[]): {} }>(
		plugin: T
	) {
		ij.patch(plugin, "PluginMeta", {
			name: plugin.name.toLowerCase().replace("plugin", ""),
			...meta
		});

		const handlers: {
			[K in keyof Events]?: EventMeta<K>[];
		} = {};
		for (let name of Object.getOwnPropertyNames(plugin.prototype)) {
			if (
				name == "constructor" ||
				typeof plugin.prototype[name] !== "function"
			)
				continue;

			const fn = plugin.prototype[name];
			const data = rf.get(fn, "EventMeta");
			if (!data) continue;
			if (!Object.hasOwn(handlers, data.__type__))
				handlers[data.__type__] = [];
			handlers[data.__type__]!.push({
				...data,
				__type__: data.__type__,
				from: plugin.name,
				at: name,
				handler: fn
			});
		}
		ij.patch(plugin, "pluginData", { handlers });
	};
}

function Inject(obj, key) {
	if (!storage[key]) return;
	return md.append("PluginInjector", key);
}

function Cogs(extenstions: string[]) {
	return md.set("PluginCogs", extenstions);
}

function command(meta: RawEventMeta<"command"> = {}) {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		return md.set("EventMeta", {
			command: propertyKey,
			disabled: false,
			cooldown: 0,
			...meta,
			__type__: "command"
		});
	};
}
function interaction(meta: RawEventMeta<"interaction">) {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		return md.set("EventMeta", {
			...meta,
			__type__: "interaction"
		});
	};
}

// prettier-ignore
export {
    DefinePlugin,
    Inject,
    Cogs,
    
    command,
    interaction
};
