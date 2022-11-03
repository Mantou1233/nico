"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("reflect-metadata");
const discord_js_1 = require("discord.js");
const quickmongo_1 = require("quickmongo");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildPresences,
        discord_js_1.GatewayIntentBits.GuildMessageReactions,
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.MessageContent
    ],
    partials: [
        discord_js_1.Partials.Channel,
        discord_js_1.Partials.Message,
        discord_js_1.Partials.User,
        discord_js_1.Partials.GuildMember,
        discord_js_1.Partials.Reaction
    ],
    allowedMentions: {
        parse: ["users"],
        repliedUser: false
    }
});
const db = new quickmongo_1.Database(process.env.MONGO);
globalThis.storage = { client, db };
require("./main.js");
//# sourceMappingURL=index.js.map