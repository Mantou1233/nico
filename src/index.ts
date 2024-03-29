import "dotenv/config";
import "reflect-metadata";

import "discord.js";

import "@services/djsAddition";

import * as Discord from "discord.js";

import { Client as Hypixel } from "hypixel-api-reborn";
import {
	Client,
	GatewayIntentBits,
	Partials,
	disableValidators
} from "discord.js";
import { Database } from "quickmongo";
disableValidators();

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

	let hypixel = new Hypixel(process.env.HYPIXEL_API_KEY!);
	let db = new Database(process.env.MONGO!);
	await db.connect();
	if (process.env.MONGO_TABLE) {
		db = new db.table(process.env.MONGO_TABLE);
	}
	globalThis.storage = { client, db, hypixel };
	require("./main.js");
})();
