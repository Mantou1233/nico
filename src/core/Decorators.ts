import { md } from "@services/Reflector";
import { EventMeta, Events, PluginMeta, RawEventMeta } from "./structure/Types";

function DefinePlugin(meta: PluginMeta = {}) {
	return function PluginPatcher<T extends { new (...args: any[]): {} }>(
		C: T
	) {
		md.set(C, "pluginMeta", {
			name: C.name.toLowerCase().replace("plugin", ""),
			...meta
		});

		const handlers: {
			[K in keyof Events]?: EventMeta<K>[];
		} = {};
		for (let name of Object.getOwnPropertyNames(C.prototype)) {
			if (
				name == "constructor" ||
				typeof C.prototype[name] !== "function"
			)
				continue;

			const fn = C.prototype[name];
			const data = md.get(fn, "meta") as EventMeta | null | undefined;
			if (!data) continue;
			if (!Object.hasOwn(handlers, data.__type__))
				handlers[data.__type__] = [];
			handlers[data.__type__]!.push({
				...data,
				__type__: data.__type__,
				from: C.name,
				at: name,
				handler: fn
			});
		}
		md.set(C, "pluginData", { handlers });
	};
}

function Inject(obj, key) {
	if (!storage[key]) return;
	console.log("uh");
	obj.constructor = function constructor() {
		this[key] = storage[key];
		console.log(this);
		return obj.constructor();
	};
	console.log(obj.constructor);
}

function Cogs(extenstions) {
	return function (obj, key: string) {
		if (key !== "extensions") return;
		obj[extenstions] = extenstions;
	};
}

function command(meta: RawEventMeta<"command"> = {}) {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		md.set(descriptor.value, "meta", {
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
		md.set(descriptor.value, "meta", {
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
