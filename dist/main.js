"use strict";
/*
    main code part
    this should be simple to read
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import "./services/i18n.js";
require("./services/random");
require("./services/ap");
const discord_js_1 = require("discord.js");
const PluginLoader_1 = __importDefault(require("./core/PluginLoader"));
const Handlers_1 = require("./core/Handlers");
const Manager_1 = __importDefault(require("./core/Manager"));
const { client, db } = storage;
console.log("Starting nico...");
async function main() {
    // Legacy DiscordJS Client
    client.on("messageCreate", Handlers_1.CommandHandler);
    client.on("interactionCreate", Handlers_1.InteractionHandler);
    if (!client.isReady()) {
        client.once("ready", botMain);
        client.login(process.env.TOKEN).then(r => { });
    }
    else
        botMain(client);
}
main();
async function botMain(client) {
    console.log(`[miraicle] DiscordJS logged in as ${client.user?.tag}!`);
    try {
        // Load Plugins
        if (!db.ready) {
            await db.connect();
            let _tmp = Date.now();
            await db.add("sys:time", 1);
            console.log(`connected to mongo! DB ping: ${require("ms")(Date.now() - _tmp)}`);
        }
        const loader = new PluginLoader_1.default(client);
        client.loader = loader;
        client.manager = new Manager_1.default(client);
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
//# sourceMappingURL=main.js.map