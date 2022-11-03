"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
const ap_1 = require("../services/ap");
const parsers_1 = __importDefault(require("../services/parsers"));
const databases_1 = require("./databases");
const Cooldown = new discord_js_1.Collection();
const prefix = process.env.PREFIX;
async function HandleCommands(client, msg) {
    if (msg.author.bot)
        return;
    const p = await (0, databases_1.UserProfile)(msg);
    if (!(await p.check())) {
        await p.newSchema();
    }
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
exports.default = HandleCommands;
//# sourceMappingURL=CommandHandler.js.map