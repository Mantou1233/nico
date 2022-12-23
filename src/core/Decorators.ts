import md from "@services/Reflector";
import { EventMeta, Events, PluginMeta, RawEventMeta } from "./structure/Types";
import path from "path";
import { log } from "./PluginLoader";
import { Registries } from "~/services/Registries";
function DefinePlugin(meta: PluginMeta = {}) {
	return function PluginPatcher<T extends { new (...args: any[]): {} }>(
		plugin: T
	) {
		md.set(plugin, "PluginMeta", {
			name: plugin.name.toLowerCase().replace("plugin", ""),
			...meta
		});
		global.sb = plugin;
	};
}

function Inject(obj, key) {
	if (!storage[key]) return;
	md.append(obj, "PluginInjector", key);
}

function Cogs(extenstions: string[]) {
	return function CogSetter(obj, ext) {
		if (md.get(obj, "PluginCogs")) throw new Error("Already setted cogs");
		if (ext !== "extenstions") throw new Error("notExtendErrorAlias");
		md.set(obj, "PluginCogs", extenstions);
	};
}

function command(meta: RawEventMeta<"command"> = {}) {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		md.set(descriptor.value, "EventMeta", {
			command: propertyKey,
			disabled: false,
			cooldown: 0,
			...meta,
			__type__: "command"
		});
	};
}
function interactionDecoratorMixin(type) {
	return function interaction(meta?: RawEventMeta<"interaction">) {
		return function (
			target: any,
			propertyKey: string,
			descriptor: PropertyDescriptor
		) {
			md.set(descriptor.value, "EventMeta", {
				...meta,
				type,
				__type__: "interaction"
			});
		};
	};
}

function _handleInjector(inst) {
	const _injects = md.get(inst, "PluginInjector");
	if (Array.isArray(_injects)) {
		for (let k of _injects) {
			console.log(k);
			inst[k] = storage[k];
		}
	}
	console.log(JSON.stringify(_injects));
	return inst;
}

function _handleCogs(inst, _path, name) {
	const _cogs = md.get(inst, "PluginCogs");
	if (!_cogs) return;
	for (let c of _cogs) {
		let entry;
		console.log(
			`../../${_path}${c
				.replace(".ts", "")
				.replace(".js", "")
				.replace("./", "")}`
		);
		try {
			entry = require(`../../${_path}${c
				.replace(".ts", "")
				.replace(".js", "")
				.replace("./", "")}`);
		} catch (e) {
			return log(2, `Cog ${c} of ${name} fail: not a entry`);
		}

		entry = typeof entry == "function" ? entry : entry.default;
		if (!(typeof entry == "function")) continue;
		Registries["Loaders"][2](entry, {
			name: `${name}_Cog`,
			path: _path,
			isCog: true
		});
		log(4, `Loaded cog ${c} of ${name}`);
	}
}

const interaction = {
	button: interactionDecoratorMixin("button"),
	select_menu: interactionDecoratorMixin("selectmenu"),
	modal: interactionDecoratorMixin("modal")
} as const;

// prettier-ignore
export {
    DefinePlugin,
    Inject,
    Cogs,
    
    command,
    interaction,

	_handleInjector,
	_handleCogs
};
