"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionHandler = exports.CommandHandler = void 0;
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
//import { MessageCommand } from "./structure/Types.js";
const Profile_1 = require("./Profile");
const Cooldown = new discord_js_1.Collection();
const client = storage.client;
let prefix = process.env.PREFIX;
async function CommandHandler(msg) {
    if (!client.loader.ready)
        return;
    if (msg.author.bot)
        return;
    const p = await (0, Profile_1.UserProfile)(msg);
    await p.checkAndUpdate();
    const g = await (0, Profile_1.GuildProfile)(msg);
    await g.checkAndUpdate();
    prefix = process.env.PREFIX;
    msg.lang = "en";
    const mappings = client.manager.commands;
    const isp = msg.content.startsWith(prefix);
    const launch = msg.content.trim().split(" ")[0].replace(prefix, "");
    const command = mappings.find(cmd => (cmd.command === launch || (cmd.alias ?? []).includes(launch)) &&
        isp);
    if (!command)
        return;
    if (command.disabled)
        return;
    if (command.cooldown && Cooldown.has(msg.author.id))
        return msg.channel.send(`You need to wait ${(0, ms_1.default)(Cooldown.get(msg.author.id))} to use this command again!!`);
    global.d = Date.now();
    try {
        await command.handler(msg, {
            prefix
        });
    }
    catch (e) {
        return msg.channel.send(`wawa!! something wrong happened...\n${e.message}`);
    }
    if (command.cooldown) {
        Cooldown.set(msg.author.id, command.cooldown);
        setTimeout(() => Cooldown.delete(msg.author.id), command.cooldown);
    }
}
exports.CommandHandler = CommandHandler;
async function InteractionHandler(interaction) {
    if (!client.loader.ready)
        return;
    if (interaction.user.bot)
        return;
    const p = await (0, Profile_1.UserProfile)(interaction);
    await p.checkAndUpdate();
    const g = await (0, Profile_1.GuildProfile)(interaction);
    await g.checkAndUpdate();
    let handlers = [];
    if (interaction.isButton())
        handlers = client.manager.interactions.filter(v => v.type === "button");
    if (interaction.isSelectMenu())
        handlers = client.manager.interactions.filter(v => v.type === "selection");
    if (interaction.isModalSubmit())
        handlers = client.manager.interactions.filter(v => v.type === "modal");
    if (interaction.isAutocomplete())
        handlers = client.manager.interactions.filter(v => v.type === "autocomplete");
    for (let handler of handlers) {
        await handler.handler(interaction);
    }
}
exports.InteractionHandler = InteractionHandler;
//# sourceMappingURL=Handlers.js.map