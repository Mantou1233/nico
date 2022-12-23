"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("reflect-metadata");
require("discord.js");
require("./services/djsAddition");
const discord_js_1 = require("discord.js");
const quickmongo_1 = require("quickmongo");
(0, discord_js_1.disableValidators)();
(async () => {
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
    let db = new quickmongo_1.Database(process.env.MONGO);
    await db.connect();
    if (process.env.MONGO_TABLE) {
        db = new db.table(process.env.MONGO_TABLE);
    }
    globalThis.storage = { client, db };
    require("./main.js");
})();
//# sourceMappingURL=index.js.map