"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const util_1 = require("util");
// sbTest!!!
const Discord = __importStar(require("discord.js"));
const child_process = __importStar(require("child_process"));
const os_1 = __importDefault(require("os"));
const ms_1 = __importDefault(require("ms"));
const i18n_1 = require("../../../services/i18n");
const pb_1 = __importDefault(require("../../../services/pb"));
const Profile_1 = require("../../../core/Profile");
/**
 * @returns void
 */
async function load(client, cm) {
    cm.register({
        command: "say",
        category: "Basic",
        desc: "Say something you want to say -> ([json builder](https://glitchii.github.io/embedbuilder/?username=FDYBoT&guitabs=title,fields,description&avatar=https://cdn.discordapp.com/avatars/977542041670152212/cf54c7c185fa433014bfd2ec79df0f21.png&data=JTdCJTIyZW1iZWQlMjIlM0ElN0IlMjJ0aXRsZSUyMiUzQSUyMkxvcmVtJTIwaXBzdW0lMjIlMkMlMjJkZXNjcmlwdGlvbiUyMiUzQSUyMkRvbG9yJTIwc2l0JTIwYW1ldC4uLiUyMiUyQyUyMmNvbG9yJTIyJTNBMzkxMjklN0QlN0Q=))",
        handler: async (msg) => {
            const args = ap(msg.content, true);
            if (!args[1])
                return msg.channel.send({
                    embeds: [
                        {
                            description: i18n.parse(msg.lang, "basic.say.error.noargs"),
                            color: parseInt(i18n.globe["color"], 16)
                        }
                    ]
                });
            if (!IsJsonString(args[1]))
                return msg.channel.send({
                    embeds: [
                        {
                            description: args[1],
                            color: parseInt(i18n.globe["color"], 16)
                        }
                    ]
                });
            let data = JSON.parse(args[1]);
            if (data.length)
                return msg.channel.send({
                    embeds: [
                        {
                            description: "No arrays!!",
                            color: parseInt(i18n.globe["color"], 16)
                        }
                    ]
                });
            let result = data;
            if (data.embed) {
                result.embeds = [...(result.embeds ?? []), data.embed];
                delete result.embed;
            }
            msg.channel.send(result).catch(() => {
                msg.channel.send(i18n.parse(msg.lang, "basic.say.error.invaildparams"));
            });
        }
    });
    cm.register({
        command: "edit",
        category: "Basic",
        desc: "edit something the bot said -> ([json builder](https://glitchii.github.io/embedbuilder/?username=FDYBoT&guitabs=title,fields,description&avatar=https://cdn.discordapp.com/avatars/977542041670152212/cf54c7c185fa433014bfd2ec79df0f21.png&data=JTdCJTIyZW1iZWQlMjIlM0ElN0IlMjJ0aXRsZSUyMiUzQSUyMkxvcmVtJTIwaXBzdW0lMjIlMkMlMjJkZXNjcmlwdGlvbiUyMiUzQSUyMkRvbG9yJTIwc2l0JTIwYW1ldC4uLiUyMiUyQyUyMmNvbG9yJTIyJTNBMzkxMjklN0QlN0Q=))",
        handler: async (msg, ext) => {
            let args = ap(msg.content, true)[1].split("/");
            args = [args.splice(0, 1)[0], args.join("/")];
            if (args.length < 2)
                return msg.channel.send({
                    embeds: [
                        {
                            description: i18n.parse(msg.lang, "basic.say.error.noargs"),
                            color: parseInt(i18n.globe["color"], 16)
                        }
                    ]
                });
            try {
                BigInt(args[0]);
            }
            catch (e) {
                return msg.channel.send({
                    embeds: [
                        {
                            description: `snowflake error: ${args[0]} not a snowflake`,
                            color: parseInt(i18n.globe["color"], 16)
                        }
                    ]
                });
            }
            let msg2;
            try {
                msg2 = (await msg.channel.messages.fetch(args[0]));
            }
            catch (e) {
                return msg.channel.send({
                    embeds: [
                        {
                            description: `nah, ${e.message}`,
                            color: parseInt(i18n.globe["color"], 16)
                        }
                    ]
                });
            }
            if (!msg2 || !msg2.editable)
                return msg.channel.send({
                    embeds: [
                        {
                            description: "nah, error dont exist",
                            color: parseInt(i18n.globe["color"], 16)
                        }
                    ]
                });
            if (!IsJsonString(args[1]))
                return msg2.edit({
                    embeds: [
                        {
                            description: args[1],
                            color: parseInt(i18n.globe["color"], 16)
                        }
                    ]
                });
            let data = JSON.parse(args[1]);
            if (data.length)
                return msg.channel.send({
                    embeds: [
                        {
                            description: "No arrays!!",
                            color: parseInt(i18n.globe["color"], 16)
                        }
                    ]
                });
            let result = data;
            if (data.embed) {
                result.embeds = [...(result.embeds ?? []), data.embed];
                delete result.embed;
            }
            msg2.edit(result).catch(() => {
                msg.channel.send(i18n.parse(msg.lang, "basic.say.error.invaildparams"));
            });
        }
    });
    cm.register({
        command: "toggle",
        category: "Basic",
        desc: "toggle commands.",
        force: true,
        hidden: true,
        handler: async (msg) => {
            let args = ap(msg.content);
            if (args[1].toLowerCase() === "category") {
                let used = [[], []], amount = [0, 0];
                client.manager.commands.each((cmd, key) => {
                    if (cmd.force)
                        return;
                    if (cmd.category.toLowerCase() === args[2].toLowerCase()) {
                        client.manager.commands.set(key, {
                            ...cmd,
                            disabled: !cmd.disabled
                        });
                        if (!cmd.disabled) {
                            used[0].push(cmd.command);
                            amount[0]++;
                        }
                        if (cmd.disabled) {
                            used[1].push(cmd.command);
                            amount[1]++;
                        }
                    }
                });
                return msg.reply(`done! enabled ${amount[0]} commands [${used[0].join(", ")}], disabled ${amount[1]} commands [${used[1].join(", ")}].`);
            }
            if (args[1].toLowerCase() === "command") {
                let bool = -1;
                client.manager.commands.each((cmd, key) => {
                    if (cmd.force)
                        return;
                    if (cmd.command.toLowerCase() === args[2].toLowerCase()) {
                        client.manager.commands.set(key, {
                            ...cmd,
                            disabled: !cmd.disabled
                        });
                        bool = !cmd.disabled;
                    }
                });
                if (bool === -1)
                    return msg.reply(i18n.parse(msg.lang, "command.run.notfound"));
                return msg.reply(i18n.parse(msg.lang, "basic.toggle.command.toggled", args[2], bool
                    ? i18n.parse(msg.lang, "basic.toggle.command.disabledText")
                    : i18n.parse(msg.lang, "basic.toggle.command.enabledText")));
            }
            msg.reply(i18n.parse(msg.lang, "command.run.notfound"));
        }
    });
    const ux = (name, value, inline = false) => ({ name, value, inline });
    cm.register({
        command: "botstats",
        category: "Basic",
        desc: "Display bot information",
        handler: async (msg) => {
            let gitHash = "stable build";
            try {
                gitHash = child_process
                    .execSync("git rev-parse HEAD")
                    .toString()
                    .trim();
            }
            catch { }
            msg.channel.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setConfig()
                        .setTitle(`nico - ${(process.env.BUILD || "Development").toLowerCase()}`)
                        .setThumbnail(client.user.displayAvatarURL({
                        dynamic: true
                    }))
                        .setDescription(`\`\`\`yml\n${client.user.username}#${client.user.discriminator} [${client.user.id}]\nping: ${Math.floor(msg.createdTimestamp - Date.now())}ms ping\n‎      ${client.ws.ping}ms heartbeat\nUptime: ${(0, ms_1.default)(client.uptime)}\n\`\`\``)
                        .setFields(ux(":bar_chart: General statistics", `\`\`\`yml\n${client.guilds.cache.size} guilds\n${client.guilds.cache.reduce((users, value) => users + (+value.memberCount || 0), 0)} users\n\`\`\``, true), ux(":paperclip: Cache statistics", `\`\`\`yml\n${client.users.cache.size} users\n${client.channels.cache.size} channels\n${client.emojis.cache.size} emojis\`\`\``, true), ux(":gear: Performance statistics", `\`\`\`yml\nTotal Memory: ${(0, pb_1.default)(os_1.default.totalmem())}\nFree Memory: ${(0, pb_1.default)(os_1.default.freemem())} (${percentage(os_1.default.freemem(), os_1.default.totalmem()).toFixed(1)}%)\nUsed Memory: ${(0, pb_1.default)(os_1.default.totalmem() - os_1.default.freemem())} (${percentage(os_1.default.totalmem() - os_1.default.freemem(), os_1.default.totalmem()).toFixed(1)}%)\n\`\`\``), ux(":computer: System statistics", `\`\`\`yml\n${process.platform} ${process.arch}\n${(0, ms_1.default)(os_1.default.uptime() * 1000)} uptime\n${(process.memoryUsage().rss /
                        1024 /
                        1024).toFixed(2)} MB RSS\n${(process.memoryUsage().heapUsed /
                        1024 /
                        1024).toFixed(2)} MB Heap\nCPU:${os_1.default.cpus()[0].model} (${os_1.default.cpus().length.toString()} Threads)\`\`\``), ux("Miscellaneous Statistics", `\`\`\`yml\n${client.manager.commands.size} cmds\ndiscord.js ${discord_js_1.version}\nnode ${process.version}\n\`\`\``))
                        .setFooter({ text: `${gitHash}` })
                ]
            });
        }
    });
    cm.register({
        command: "expo",
        category: "Basic",
        hidden: true,
        handler: async (msg, { prefix }) => {
            client.loader.expo();
        }
    });
    cm.register({
        command: "choose",
        category: "Basic",
        desc: "Choose a random",
        handler: async (msg) => {
            const args = ap(msg.content, true);
            let arr = args[1].split(";");
            msg.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(i18n.globe.color)
                        .setDescription(`:thinking:\n${arr[random(0, arr.length - 1)] ?? "NOTHING"}`)
                ]
            });
        }
    });
    cm.register({
        command: "lang",
        category: "Basic",
        desc: "set language of your usage",
        handler: async (msg) => {
            let args = ap(msg.content);
            const p = await (0, Profile_1.UserProfile)(msg.author.id);
            let pass = (function (pa) {
                for (let [key, [...rest]] of Object.entries(i18n_1.langAlias)) {
                    if (rest.includes(pa))
                        return key;
                }
                return false;
            })(args[1]);
            if (args.length == 1 || !pass)
                return msg.channel.send(i18n.parse(msg.lang, "basic.lang.current", msg.lang, Object.keys(i18n_1.langs).length, `\`${(function () {
                    let r = "";
                    for (let [key, ...rest] of Object.values(i18n_1.langAlias)) {
                        r += `\n${key} - ${rest.join(",")}`;
                    }
                    return r;
                })()}\``));
            p.lang = pass;
            p.save();
            msg.channel.send(i18n.parse(pass, "basic.lang.set", pass));
        }
    });
    cm.register({
        command: "first-msg",
        category: "Basic",
        desc: "Get the first message sent on this channel",
        handler: async (msg) => {
            const messages = await msg.channel.messages.fetch({
                limit: 1,
                after: "0"
            });
            const msg2 = messages.first();
            msg2.reply(`${msg.url}`);
        }
    });
    cm.register({
        command: "help",
        category: "Basic",
        desc: "Display bot information",
        alias: ["h"],
        force: true,
        handler: async (msg, { prefix }) => {
            const args = ap(msg.content, true)
                .slice(1)
                .filter(v => !(v === ""));
            //start
            // change emojis according to your category
            let emojis = {
                basic: "ℹ️",
                owner: "👑",
                info: "📊",
                fun: "😂"
            };
            //limit of commands shown every page
            let limit = 5;
            //end
            if (!args.length) {
                const categoryList = [
                    ...new Set(client.manager.commands.map(cmd => cmd.category))
                ];
                const categorys = categoryList.map(cat => {
                    return {
                        category: cat?.toLowerCase(),
                        commands: [
                            ...client.manager.commands
                                .filter(cmd => !cmd.hidden && cmd.category === cat)
                                .values()
                        ].map(cmd => {
                            return {
                                name: cmd.command,
                                description: (i18n
                                    .parse(msg.lang ?? "en", `-${cmd.category?.toLowerCase()}.${cmd.command.toLowerCase()}.description`)
                                    .endsWith(".description")
                                    ? cmd.desc || `${prefix}${cmd.command}`
                                    : i18n.parse(msg.lang ?? "en", `-${cmd.category?.toLowerCase()}.${cmd.command.toLowerCase()}.description`)).replaceAll("%p", prefix)
                            };
                        })
                    };
                });
                let capf = (baa) => {
                    const [first, ...rst] = baa.split("");
                    return first.toUpperCase() + rst.join("");
                };
                let menu = boo => new Discord.ActionRowBuilder().addComponents(new Discord.SelectMenuBuilder()
                    .setPlaceholder("Select...")
                    .setCustomId("h-menu")
                    .setDisabled(boo)
                    .addOptions([
                    {
                        label: "main menu",
                        emoji: "🏡",
                        value: "menu",
                        description: "going back to the home menu"
                    },
                    ...categorys.map(c => {
                        return {
                            label: c.category,
                            value: c.category?.toLowerCase(),
                            emoji: emojis[c.category?.toLowerCase() || ""] || "❓"
                        };
                    })
                ]));
                let nav = (b1, b2) => new Discord.ActionRowBuilder().addComponents([
                    new Discord.ButtonBuilder()
                        .setStyle(discord_js_1.ButtonStyle.Secondary)
                        .setEmoji("⏪")
                        .setCustomId("h-prev")
                        .setDisabled(b1),
                    new Discord.ButtonBuilder()
                        .setStyle(discord_js_1.ButtonStyle.Secondary)
                        .setEmoji("⏩")
                        .setCustomId("h-next")
                        .setDisabled(b2)
                ]);
                let int = new Discord.EmbedBuilder()
                    .setConfig()
                    .setTitle(`nico help menu`)
                    .setDescription(i18n.parse(msg.lang, "basic.help.description", prefix, prefix))
                    .setThumbnail(client.user.displayAvatarURL());
                let msg2 = await msg.channel.send({
                    embeds: [int],
                    components: [menu(false)]
                });
                let collector = await msg2.createMessageComponentCollector({
                    time: 60000
                });
                let ch;
                let page = 0;
                let home = true;
                collector.on("collect", async (i) => {
                    if (i.user.id !== msg.author.id)
                        return i.reply({
                            content: "You can't interact in this message",
                            ephemeral: true
                        });
                    await i.deferUpdate();
                    collector.resetTimer();
                    if (i.isSelectMenu() && i.customId === "h-menu") {
                        let [dir] = i.values;
                        if (dir === "menu") {
                            home = true;
                            return i.editReply({
                                embeds: [int],
                                components: [menu(false)]
                            });
                        }
                        ch = dir;
                        const cg = categorys.find(m => m.category.toLowerCase() === dir).commands;
                        let max = Math.ceil(cg.length / limit);
                        page = 0;
                        if (page + 1 > max)
                            page = max;
                        let em = new Discord.EmbedBuilder()
                            .setConfig()
                            .setTitle(`${emojis[dir || ""] || "❓"} ${capf(dir)} commands`)
                            .addFields(cg
                            .map(c => {
                            return {
                                name: `• ${c.name}`,
                                value: c.description || "Not provided",
                                inline: false
                            };
                        })
                            .slice(0, (page + 1) * limit))
                            .setFooter({
                            text: `page 1 of ${max}`
                        });
                        home = false;
                        if (page + 1 === 1 && max === 1) {
                            return i.editReply({
                                embeds: [em],
                                components: [menu(false), nav(true, true)]
                            });
                        }
                        else {
                            return i.editReply({
                                embeds: [em],
                                components: [menu(false), nav(true, false)]
                            });
                        }
                    }
                    if (i.isButton()) {
                        const cg = categorys.find(m => m.category.toLowerCase() === ch).commands;
                        let max = Math.ceil(cg.length / limit);
                        if (page + 1 > max)
                            page = max;
                        home = false;
                        let eg = start => {
                            return new Discord.EmbedBuilder()
                                .setConfig()
                                .setTitle(`${emojis[ch || ""] || "❓"} ${capf(ch)} commands`)
                                .addFields(cg
                                .map(c => {
                                return {
                                    name: `• ${c.name}`,
                                    value: c.description ||
                                        "Not provided",
                                    inline: false
                                };
                            })
                                .slice((start + 1) * limit - limit, (start + 1) * limit))
                                .setFooter({
                                text: `page ${start + 1} of ${max}`
                            });
                        };
                        if (i.customId === "h-prev") {
                            page = page > 0 ? --page : cg.length - 1;
                        }
                        if (i.customId === "h-next") {
                            page = page + 1 < cg.length ? ++page : 0;
                        }
                        if (page + 1 === 1 && max === 1) {
                            return i.editReply({
                                embeds: [eg(page)],
                                components: [menu(false), nav(true, true)]
                            });
                        }
                        if (page + 1 === 1) {
                            return i.editReply({
                                embeds: [eg(page)],
                                components: [menu(false), nav(true, false)]
                            });
                        }
                        if (page + 1 === max) {
                            return i.editReply({
                                embeds: [eg(page)],
                                components: [menu(false), nav(false, true)]
                            });
                        }
                        else {
                            return i.editReply({
                                embeds: [eg(page)],
                                components: [menu(false), nav(false, false)]
                            });
                        }
                    }
                });
                collector.on("end", async () => {
                    if (!home) {
                        return void msg2.edit({
                            components: [menu(true), nav(true, true)]
                        });
                    }
                    else {
                        return void msg2.edit({
                            components: [menu(true)]
                        });
                    }
                });
            }
            else {
                const command = client.manager.commands.find(a => (a.alias ?? []).includes(args[1]) ||
                    a.command === args[1]);
                if (!command)
                    return msg.channel.send({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setColor("#B33A3A")
                                .setDescription(i18n.parse(msg.lang, "basic.help.notfound"))
                        ]
                    });
                /*
        args[0] = 'help'
        var path = `../../commands/${args[0]}.js`;
        //
        try{
            require(`../commands/${args[0]}`)
        }catch (err){
            exists = 0
        }
        ///
        fs.access(path, (err) => {
            if (!err) {
              exists = 1
              return;
            }
        })*/
                let [desc, usage] = [
                    i18n.parse(msg.lang ?? "en", `-${command.category?.toLowerCase()}.${command.command.toLowerCase()}.description`),
                    i18n.parse(msg.lang ?? "en", `-${command.category?.toLowerCase()}.${command.command.toLowerCase()}.usage`)
                ].map(v => v.endsWith(".usage") || v.endsWith(".description")
                    ? undefined
                    : v);
                usage = (usage ??
                    (command.usage || `${prefix}${command.command}`)).replaceAll("%p", prefix);
                desc = (desc ??
                    (command.desc || `${prefix}${command.command}`)).replaceAll("%p", prefix);
                const newEmbed = new Discord.EmbedBuilder()
                    .setColor(i18n.globe.color)
                    .setTitle(`\`${prefix}${command.command}\`` +
                    (command.alias ?? []).reduce((p, v) => p + ` **/** \`${prefix}${v}\``, ""))
                    .setDescription(`${desc}`)
                    .addFields({
                    name: "Usage",
                    value: `${usage}`,
                    inline: true
                })
                    .setFooter({
                    text: `category: ${emojis[command.category || ""] || "❓"} ${command.category}`
                });
                msg.channel.send({ embeds: [newEmbed] });
            }
            //help(client, msg, prefix);
        }
    });
    cm.register({
        command: "prefix",
        category: "Basic",
        desc: "Display bot information",
        handler: async (msg, { prefix: oprefix }) => {
            const args = ap(msg.content, true);
            const g = await (0, Profile_1.GuildProfile)(msg);
            const prefix = args[1].trim();
            if (prefix.length > 5)
                return msg.reply("prefix too long!! you will forgor it probably so set a shorter one");
            if (prefix.includes(" "))
                return msg.reply("no space!!!@");
            g.prefix = prefix;
            msg.reply(`server prefix has been changed from ${oprefix} to ${prefix}`);
            await g.save();
        }
    });
    cm.register({
        command: "ping",
        category: "Basic",
        desc: "Display bot information",
        handler: async (msg, { prefix }) => {
            msg.reply(i18n.parse(msg.lang, "basic.ping.pong", `${Math.abs(Date.now() - msg.createdTimestamp)}`));
        }
    });
    cm.register({
        command: "eval",
        category: "Basic",
        desc: "Display bot information",
        hidden: true,
        handler: async (msg, ext) => {
            if (msg.author.id !== "644504218798915634")
                return msg.channel.send("Insuffent permission.");
            let args = ap(msg.content, true);
            const code = args[1];
            if (code.trim() === "")
                return msg.channel.send("Dont give me nothing u dumb!!");
            let msg2 = await msg.channel.send("evaling...");
            try {
                let output = await eval(code);
                if (output instanceof Promise ||
                    (Boolean(output) &&
                        typeof output.then === "function" &&
                        typeof output.catch === "function"))
                    output = await output;
                output = (0, util_1.inspect)(output, {
                    depth: 0,
                    maxArrayLength: null
                });
                msg2.edit({
                    embeds: [
                        {
                            author: {
                                name: "Evaluation Completed!"
                            },
                            description: `**Input**\n\`\`\`js\n${code}\`\`\`\n**Output**\n\`\`\`js\n${output}\`\`\``,
                            color: 0x2f3136
                        }
                    ]
                }).catch(() => { });
            }
            catch (err) {
                msg2.edit({
                    embeds: [
                        {
                            author: {
                                name: "Error!"
                            },
                            description: `**Input**\n\`\`\`js\n${code}\`\`\`\n**Error**\n\`\`\`js\n${err}\`\`\``,
                            color: 0x2f3136
                        }
                    ]
                }).catch(() => { });
            }
        }
    });
}
module.exports = load;
function IsJsonString(str) {
    let o;
    try {
        o = JSON.parse(str);
    }
    catch (e) {
        return false;
    }
    if (o && typeof o === "object")
        return true;
    return false;
}
function percentage(pv, tv) {
    return Math.round((pv / tv) * 100);
}
//# sourceMappingURL=index.js.map