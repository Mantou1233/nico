import { EventMeta, PluginMeta, RawEventMeta } from "@core/structure/Types";
import { rf } from "./Reflector";

export namespace Registries {
	export const Decorators = {};

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
		1 /* version */: function loader() {},
		2: function loader(plugin, { name }) {
			const meta = rf.get("PluginMeta", plugin);
			const inst = new plugin();
			if (!meta)
				return console.log(`${name} isnt a vaild plugin, rejecting.`);
			(Object.values(data.handlers) as EventMeta[]).map((pr: any) =>
				pr.map(pr =>
					this.client.manager.register({
						...pr,
						handler: pr.handler.bind(inst)
					})
				)
			);
		}
	};
}
