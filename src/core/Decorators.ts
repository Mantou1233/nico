import { i18n } from './../services/i18n';
import md from "@services/Reflector";
import { EventMeta, Events, PluginMeta, RawEventMeta } from "./structure/Types";
import path from "path";
import { log } from "./PluginLoader";
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

function argumentPutDecoratorMixin(transformer: (...args) => any) {
	return function ad(...args) {
		return function argumentDec(target: any, key: string, index: number) {
			const obj = md.get(target, "PluginDecArgs") || {};
			const arr = obj[key] || [
				{
					transformer: (or, ext) => or,
					args: []
				},
				{
					transformer: (or, ext) => ext,
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
	const _cogs = md.get(inst, "PluginCogs");
	if (!_cogs) return;
	for (let c of _cogs) {
		let entry;
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

const Msg = argumentPutDecoratorMixin((msg: Message) => msg);
const Args = argumentPutDecoratorMixin((msg: Message, ext, parser) =>
	parser(msg.content)
);
const Ext = argumentPutDecoratorMixin((msg: Message, ext) => ext);
const I18n = argumentPutDecoratorMixin((msg: Message) => i18n.bind(null, msg.lang));
const Tr = I18n

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
	I18n,
	Tr
};
