/* eslint-disable @typescript-eslint/no-var-requires */
import { Client } from "discord.js";
import fg from "fast-glob";
import { Registries } from "./../services/Registries";
const outpath = "../../";

class PluginLoader {
	client: Client;
	ready: boolean;
	loadedList: string[];
	loadedNames: string[];
	__tmp_loadedCogs: string[] = [];
	loadArgs: any;
	constructor(client: Client) {
		this.client = client;
		this.ready = false;
		this.loadedList = [];
		this.loadedNames = [];
	}

	async load(path = "src/plugins") {
		const plugins = await (await fg(["**/.plugin.json"], { dot: true }))
			.map(e => e.replace(".plugin.json", ""))
			.filter(e => e.includes("dist"));

		logger.log(
			`fetched ${plugins.length} plugin${plugins.length > 1 ? "s" : ""}!`
		);

		logger.log("Loading plugin...");
		for (const plugin of plugins) {
			let pluginName = plugin
				.replace(path, "")
				.split("/")
				.pop() as string;
			let temp: any = {};
			try {
				temp = require(`${outpath}${plugin}.plugin.json`);
			} catch (e) {
				logger.log(`Loading config of ${pluginName} fail: ${e.message}`);
				continue;
			}
			pluginName = temp.name;
			if (this.loadedNames.includes(pluginName))
				throw new Error("Plugin Names should be unique!");
			this.loadedNames.push(pluginName);
			this.client.manager.nowLoading = pluginName;
			let entry = await import(
				`${outpath}${plugin}${temp.entry
					.replace(".ts", "")
					.replace(".js", "")
					.replace("./", "")}`
			);
			entry = typeof entry == "function" ? entry : entry.default;

			const cogs = await Registries["Loaders"][temp.vl || 2](entry, {
				name: pluginName,
				path: plugin,
				client: this.client
			});

			logger.log(
				`loaded plugin ${pluginName}!${
					cogs !== -1 && cogs?.length >= 1
						? ` also loaded ${cogs.length} cog${cogs.length > 1 ? "s" : ""}: ${cogs.join(",")}`
						: ""
				}`
			);
			continue;
		}
		this.ready = true;
	}
	async expo() {
		this.client.removeAllListeners();
		for (let k3 of Object.keys(require.cache)) {
			if (k3.includes("node_modules")) continue;
			delete require.cache[k3];
		}
		require("../main");
	}
}

export default PluginLoader;
