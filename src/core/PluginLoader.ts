/* eslint-disable @typescript-eslint/no-var-requires */
import { Client } from "discord.js";
import fg from "fast-glob";
import { md } from "@services/Reflector";
import { EventMeta } from "./structure/Types";
const outpath = "../../";
const log = (times: number, message: string): void =>
	console.log(`${"  ".repeat(times)}-> ${message}`);
class PluginLoader {
	client: Client;
	ready: boolean;
	loadedList: string[];
	loadedNames: string[];
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

		log(
			0,
			`fetched ${plugins.length} plugin${plugins.length > 1 ? "s" : ""}!`
		);

		log(1, "Loading plugin...");
		for (const plugin of plugins) {
			let pluginName = plugin
				.replace(path, "")
				.split("/")
				.pop() as string;
			let temp: any = {};
			try {
				temp = require(`${outpath}${plugin}.plugin.json`);
			} catch (e) {
				log(3, `Loading config ${pluginName} fail: ${e.message}`);
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

			const meta = md.get(entry, "pluginMeta");
			const data = md.get(entry, "pluginData");
			const inst = new entry();
			if (!meta || !data) {
				console.log(`${pluginName} isnt a vaild plugin, rejecting.`);
				continue;
			}
			(Object.values(data.handlers) as EventMeta[]).map((pr: any) =>
				pr.map(pr =>
					this.client.manager.register({
						...pr,
						handler: pr.handler.bind(inst)
					})
				)
			);
			log(2, `Loaded plugin ${pluginName}!`);
			continue;
		}

		log(1, "Plugin loaded!");
		log(0, "Bot started!");
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
