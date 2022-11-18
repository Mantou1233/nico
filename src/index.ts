import "dotenv/config";
import "reflect-metadata";

import "discord.js";

import "@services/djsAddition";

import * as Discord from "discord.js";
import {
	Client,
	GatewayIntentBits,
	Partials,
	disableValidators
} from "discord.js";
import { Database } from "quickmongo";
disableValidators();

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

const db = new Database(process.env.MONGO!);

globalThis.storage = { client, db };

import "./main.js";
