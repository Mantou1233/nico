import "@services/i18n";
import "@services/random";
import "@services/ap";

import {
	ActivityType,
	ApplicationCommandType,
	Client,
	ContextMenuCommandBuilder
} from "discord.js";

import PluginLoader from "@core/PluginLoader";
import { CommandHandler, InteractionHandler } from "~/core/Handlers";

const __T__T = [
	new ContextMenuCommandBuilder()
		.setName("Steal emojis")
		.setType(ApplicationCommandType.Message)
		.toJSON()
];

let { client, db } = storage;

console.log("Starting nico...");

const fnMain = async () => {
	console.log(`[miraicle] DiscordJS logged in as ${client.user?.tag}!`);
	await botMain(client);
};

async function main() {
	// Legacy DiscordJS Client

	client.on("messageCreate", CommandHandler as any);
	client.on("interactionCreate", InteractionHandler as any);

	if (!client.isReady()) {
		(client as Client).once("ready", fnMain);
		(client as Client).login(process.env.TOKEN).then(r => {});
	} else fnMain();
}

main();
//Main Function
async function botMain(client: Client) {
	try {
		// Load Plugins

		let _tmp = Date.now();
		await db.add("sys:time", 1);
		console.log(
			`connected to mongo! DB ping: ${require("ms")(
				Date.now() - _tmp
			)}, s: ${await db.get("sys:time")}`
		);
		const loader = new PluginLoader(client);

		client.loader = loader;
		await loader.load();

		// Register for a single guild

		// await client.guilds.cache
		// 	.get("1026816602588590100")!
		// 	.commands.set(__T__T);

		// Register for all the guilds the bot is in
		await client.application!.commands.set(__T__T);

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
