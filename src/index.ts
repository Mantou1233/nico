import "dotenv/config";
import "reflect-metadata";

import "discord.js";

import "@services/djsAddition";

import {
	Client,
	GatewayIntentBits,
	Partials,
	disableValidators
} from "discord.js";

disableValidators();

import { Database } from "quickmongo";

process.on("unhandledRejection", (reason, promise) => {
	console.log("Unhandled Rejection at:", promise, "reason:", reason);
	// Application specific logging, throwing an error, or other logic here.
});

process.on("uncaughtException", (err, origin) => {
	console.log(err);
});

(async () => {
	const client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildPresences,
			GatewayIntentBits.GuildMessageReactions,
			GatewayIntentBits.DirectMessages,
			GatewayIntentBits.MessageContent
		],
		partials: [
			Partials.Channel,
			Partials.Message,
			Partials.User,
			Partials.GuildMember,
			Partials.Reaction
		],
		allowedMentions: {
			parse: ["users"],
			repliedUser: false
		}
	});

	let db = new Database(process.env.MONGO!);
	await db.connect();
	if (process.env.MONGO_TABLE) {
		db = new db.table(process.env.MONGO_TABLE);
	}
	global.storage = { client, db };
	require("./main.js");
})();
