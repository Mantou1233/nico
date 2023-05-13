import { i18n } from "./../services/i18n";
import md from "@services/Reflector";
import { PluginMeta, RawEventMeta } from "./structure/Types";
import { Registries } from "~/services/Registries";
import { Message } from "discord.js";

function DefinePlugin(meta: PluginMeta = {}) {
	return function PluginPatcher<T extends { new (...args: any[]): {} }>(
		plugin: T
	) {
		md.set(plugin, "PluginMeta", {
			name: plugin.name.toLowerCase().replace("plugin", ""),
			...meta
		});
	};
}

function Inject(obj, key) {
	if (!storage[key]) return;
	md.append(obj, "PluginInjector", key);
}

function Cogs(extenstions: string[]) {
	return function CogSetter(obj, ext) {
		if (md.get(obj, "PluginCogs")) throw new Error("Already setted cogs");
		if (ext !== "extensions") throw new Error("notExtendErrorAlias");
		md.set(obj, "PluginCogs", extenstions);
	};
}

function command(meta: RawEventMeta<"command"> = { command: "" }) {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		md.set(descriptor.value, "EventMeta", {
			disabled: false,
			cooldown: 0,
			...meta,
			command: meta.command || propertyKey,
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

function argumentPutDecoratorMixin(transformer: (...args) => any) {
	return function ad(...args) {
		return function argumentDec(target: any, key: string, index: number) {
			const obj = md.get(target, "PluginDecArgs") || {};
			const arr = obj[key] || [
				{
					transformer: (origin, _ext) => origin,
					args: []
				},
				{
					transformer: (_origin, ext) => ext,
					args: []
				}
			];
			arr[index] = {
				transformer,
				args
			};
			md.appendMap(target, "PluginDecArgs", key, arr);
		};
	};
}

function _handleInjector(inst) {
	const _injects = md.get(inst, "PluginInjector");
	if (Array.isArray(_injects)) {
		for (let k of _injects) {
			inst[k] = storage[k];
		}
	}
	return inst;
}

function _handleCogs(inst, _path, name) {
	const loadedCogs: string[] = [];
	const _cogs = md.get(inst, "PluginCogs");
	if (!_cogs) return [];
	for (let c of _cogs) {
		let entry;
		try {
			entry = require(`../../${_path}${c
				.replace(".ts", "")
				.replace(".js", "")
				.replace("./", "")}`);
		} catch (e) {
			return {
				error: `cog [${c}] from ${name} failed to load, no entry point found, rejecting...`
			};
		}

		entry = typeof entry == "function" ? entry : entry.default;
		if (!(typeof entry == "function")) continue;
		Registries["Loaders"][2](entry, {
			name: `${name}_Cog`,
			path: _path,
			cog: true
		});
		loadedCogs.push(c);
	}
	return loadedCogs;
}

const Msg = argumentPutDecoratorMixin((msg: Message) => msg);
const Args = argumentPutDecoratorMixin((msg: Message, ext, parser = ap) =>
	parser(msg.content)
);
const Ext = argumentPutDecoratorMixin((msg: Message, ext) => ext);
const Tr = argumentPutDecoratorMixin((msg: Message) =>
	i18n.bind(null, msg.lang)
);

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
	_handleCogs,
	
	Msg,
	Args,
	Ext,
	Tr
};
