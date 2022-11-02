"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./services/i18n");
require("./services/random");
require("./services/djsAddition");
require("./services/ap");
require("dotenv/config");
require("reflect-metadata");
const discord_js_1 = require("discord.js");
const PluginLoader_1 = __importDefault(require("./core/PluginLoader"));
const CommandHandler_1 = __importDefault(require("./core/CommandHandler"));
const { client } = storage;
console.log("Starting nico...");
const fnMain = async () => {
    console.log(`[miraicle] DiscordJS logged in as ${client.user?.tag}!`);
    await botMain(client);
};
async function main() {
    // Legacy DiscordJS Client
    client.once("ready", fnMain);
    client.on("messageCreate", async (msg) => {
        await (0, CommandHandler_1.default)(client, msg);
    });
    if (!client.isReady())
        client.login(process.env.TOKEN).then(r => { });
    else
        fnMain();
}
main();
//Main Function
async function botMain(client) {
    try {
        // Load Plugins
        const loader = new PluginLoader_1.default(client);
        client.loader = loader;
        await loader.load();
        console.log("-> miraicle has started!");
        console.log(`-> watching ${client.guilds.cache.size} Servers, ${client.channels.cache.size} channels & ${client.guilds.cache.reduce((users, value) => users + value.memberCount, 0)} users`);
        const botPresence = "{server} Servers | +help";
        const active = botPresence
            .replace(/{server}/g, `${client.guilds.cache.size}`)
            .replace(/{channels}/g, `${client.channels.cache.size}`)
            .replace(/{users}/g, `${client.guilds.cache.reduce((users, value) => users + value.memberCount, 0)}`);
        client.user.setPresence({
            activities: [{ name: active, type: discord_js_1.ActivityType.Watching }]
        });
    }
    catch (e) {
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
//# sourceMappingURL=main.js.map