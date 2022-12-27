import {
	EventMeta,
	Events,
	PluginMeta,
	RawEventMeta
} from "@core/structure/Types";
import md from "./Reflector";
import { _handleCogs, _handleInjector } from "~/core/Decorators";
import { log } from "~/core/PluginLoader";

export namespace Registries {
	export type MetadataMap = {
		// @sector plugins
		PluginMeta: PluginMeta;
		PluginCogs: string[];

		// @sector "events"
		EventMeta: RawEventMeta | EventMeta;
	};
	export type MetadataArrayMap = {
		PluginInjector: string;

		EventKeys: string;
	};

	export const Loaders = {
		1 /* version */: async function loader(
			entry: (client, cm) => Promise<void>,
			{ name, client }
		) {
			try {
				await entry(client, client.manager);
			} catch (e) {
				console.log(e);
				log(3, `Launching plugin ${name} fail: ${e.message}`);
			}
		},
		2: function loader(
			plugin,
			{
				name,
				path,
				isCog = false
			}: { name: string; path: string; isCog: boolean }
		) {
			const meta = md.get(plugin, "PluginMeta");
			const inst = _handleInjector(new plugin());
			if (!isCog) _handleCogs(inst, path, name);
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
				const data = md.get(fn, "EventMeta");
				if (!data) continue;
				if (!Object.hasOwn(handlers, data.__type__))
					handlers[data.__type__] = [];
				handlers[data.__type__]!.push({
					...data,
					__type__: data.__type__,
					from: plugin.name,
					at: name,
					handler: fn.bind(inst),
					args: md.get(inst, "PluginDecArgs")?.[name] || undefined
				});
			}
			if (!meta)
				return console.log(`${name} isnt a vaild plugin, rejecting.`);
			(Object.values(handlers) as unknown as EventMeta[]).map((pr: any) =>
				pr.map(pr =>
					storage.client.manager.register({
						...pr,
						handler: pr.handler.bind(inst)
					})
				)
			);
		}
	};
}
