"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionHandler = exports.CommandHandler = void 0;
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
const ap_1 = require("../services/ap");
const parsers_1 = __importDefault(require("../services/parsers"));
const Profile_1 = require("./Profile");
const Cooldown = new discord_js_1.Collection();
const client = storage.client;
let prefix = process.env.PREFIX;
async function CommandHandler(msg) {
    if (msg.author.bot)
        return;
    const p = await (0, Profile_1.UserProfile)(msg);
    await p.checkAndUpdate();
    const g = await (0, Profile_1.GuildProfile)(msg);
    await g.checkAndUpdate();
    prefix = g.prefix ?? process.env.PREFIX;
    msg.lang = p.lang ?? "en";
    const mappings = client.manager.commands;
    const isp = msg.content.startsWith(prefix);
    const launch = msg.content.trim().split(" ")[0].replace(prefix, "");
    const command = mappings.find(cmd => ((cmd.command === launch || (cmd.alias ?? []).includes(launch)) &&
        isp) ||
        (cmd.alias2 ?? []).includes(launch));
    if (!command)
        return;
    if (command.disabled)
        return;
    if (command.cooldown && Cooldown.has(msg.author.id))
        return msg.channel.send(i18n
            .parse(msg.lang, "command.run.cooldown")
            .replaceAll("%s", `${(0, ms_1.default)(Cooldown.get(msg.author.id))}`));
    const flags = (0, ap_1.flagParser)(ap(msg.content), {
        dout: parsers_1.default.Boolean
    });
    try {
        await command.handler(msg, {
            prefix
        });
    }
    catch (e) {
        if (flags["dout"])
            console.log(e);
        return msg.channel.send(i18n
            .parse(msg.lang, "command.run.error")
            .replaceAll("%s", `${e.message}`));
    }
    if (command.cooldown) {
        Cooldown.set(msg.author.id, command.cooldown);
        setTimeout(() => Cooldown.delete(msg.author.id), command.cooldown);
    }
}
exports.CommandHandler = CommandHandler;
async function InteractionHandler(interaction) {
    if (interaction.user.bot)
        return;
    const p = await (0, Profile_1.UserProfile)(interaction);
    await p.checkAndUpdate();
    const g = await (0, Profile_1.GuildProfile)(interaction);
    await g.checkAndUpdate();
    console.log(client.manager.interactions);
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