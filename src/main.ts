import "./services/i18n";
import "./services/random";
import "./services/ap";

import "dotenv/config";
import "reflect-metadata";

import { ActivityType, Client, GatewayIntentBits, Partials } from "discord.js";

import { Database } from "quickmongo";

import PluginLoader from "./core/PluginLoader";
import CommandHandler from "./core/CommandHandler";

const { client } = storage;

console.log("Starting nico...");

const fnMain = async () => {
	console.log(`[miraicle] DiscordJS logged in as ${client.user?.tag}!`);
	await botMain(client);
};

async function main() {
	// Legacy DiscordJS Client

	client.once("ready", fnMain);

	client.on("messageCreate", async msg => {
		await CommandHandler(client, msg);
	});

	if (!client.isReady())
		(client as Client).login(process.env.TOKEN).then(r => {});
	else fnMain();
}

main();
//Main Function
async function botMain(client: Client) {
	try {
		// Load Plugins

		const loader = new PluginLoader(client);

		client.loader = loader;
		await loader.load();

		console.log("-> miraicle has started!");
		console.log(
			`-> watching ${client.guilds.cache.size} Servers, ${
				client.channels.cache.size
			} channels & ${client.guilds.cache.reduce(
				(users, value) => users + value.memberCount,
				0
			)} users`
		);
		const botPresence = "{server} Servers | +help";

		const active = botPresence
			.replace(/{server}/g, `${client.guilds.cache.size}`)
			.replace(/{channels}/g, `${client.channels.cache.size}`)
			.replace(
				/{users}/g,
				`${client.guilds.cache.reduce(
					(users, value) => users + value.memberCount,
					0
				)}`
			);

		client.user!.setPresence({
			activities: [{ name: active, type: ActivityType.Watching }]
		});
	} catch (e) {
		console.error("Failed to start miraicle:");
		console.error(e);
		process.exit(1);
	}
}

process.on("unhandledRejection", (reason, promise) => {
	console.log("Unhandled Rejection at:", promise, "reason:", reason);
	// Application specific logging, throwing an error, or other logic here.
});

process.on("uncaughtException", (err, origin) => {
	console.log(err);
});
