/*
	main code part
	this should be simple to read
 */

//import "./services/i18n";
import "./services/random";
import "./services/ap";

import { ActivityType, Client } from "discord.js";

import PluginLoader from "./core/PluginLoader";
import { CommandHandler, InteractionHandler } from "./core/Handlers";
import Manager from "./core/Manager";

const { client, db } = storage;

console.log("Starting nico...");

async function main() {
	// Legacy DiscordJS Client

	client.on("messageCreate", CommandHandler as any);
	client.on("interactionCreate", InteractionHandler as any);

	if (!client.isReady()) {
		(client as Client).once("ready", botMain);
		(client as Client).login(process.env.TOKEN).then(r => {});
	} else botMain(client);
}
main();
async function botMain(client: Client) {
	logger.success(`logged in as ${client.user?.tag}!`);
	try {
		// Load Plugins
		let _tmp = Date.now();
		await db.add("sys:time", 1);
		logger.info(`connected to database! database ping: ${Date.now() - _tmp} ms`);
		const loader = new PluginLoader(client);
		client.loader = loader;
		client.manager = new Manager(client);
		await loader.load();

		logger.success("loaded all plugins!");
		logger.info(
			`watching ${client.guilds.cache.size} Servers, ${
				client.channels.cache.size
			} channels & ${client.guilds.cache.reduce(
				(users, value) => users + value.memberCount,
				0
			)} users`
		);
		const botPresence = "{server} Servers | {prefix}help";

		const active = botPresence
			.replace(/{server}/g, `${client.guilds.cache.size}`)
			.replace(/{channels}/g, `${client.channels.cache.size}`)
			.replace(
				/{users}/g,
				`${client.guilds.cache.reduce(
					(users, value) => users + value.memberCount,
					0
				)}`
			).replace(/{prefix}/g, process.env.PREFIX || "+");

		client.user!.setPresence({
			activities: [{ name: active, type: ActivityType.Watching }]
		});
	} catch (e) {
		console.error("Failed to start miraicle:");
		console.error(e);
		process.exit(1);
	}
}
