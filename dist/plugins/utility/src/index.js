"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const axios_1 = __importDefault(require("axios"));
const google_translate_1 = __importDefault(require("@iamtraction/google-translate"));
const Profile_1 = require("../../../core/Profile");
const snowflake_1 = require("../../../services/snowflake");
const gets_1 = require("../../../services/gets");
/**
 * @returns void
 */
async function load(client, cm) {
    cm.register({
        command: "hitokoto",
        category: "Fun",
        desc: "get a quote from internet.",
        handler: async (msg) => {
            try {
                var { hitokoto, creator: author, id } = (await axios_1.default.get("https://international.v1.hitokoto.cn/"))
                    .data;
                var { text: translated } = await (0, google_translate_1.default)(hitokoto, {
                    to: "en"
                });
            }
            catch (e) {
                throw e;
            }
            msg.channel.send({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setConfig()
                        .setDescription(`${translated}\n\n${hitokoto}\n- ${author}`)
                        .setFooter({
                        text: `${id}`
                    })
                ]
            });
        }
    });
    cm.register({
        command: "billwurtz",
        category: "Fun",
        desc: "get a q&a from bill wurtz's website",
        handler: async (msg) => {
            const rst = await axios_1.default.get("https://billwurtz.com/questions/random.php");
            const vbt = antirn(antinbsp(rst.data.split("</br>")[2]));
            var date, title, ctx;
            try {
                date = vbt.split("<dco>")[1].split("</dco>")[0].trim();
                title = vbt.split("<qco>")[1].split("</qco>")[0].trim();
                ctx = vbt.split("</h3>")[1].trim();
            }
            catch (e) {
                date = vbt.split("<dco>")[1].split("</dco>")[0].trim();
                title = vbt
                    .split(/\<font color=#[0-9A-F]{6,6}\>/)[1]
                    .split("</font>")[0]
                    .trim();
                ctx = vbt.split("</h3>")[1].trim();
            }
            msg.channel.send({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setConfig()
                        .setTitle(title)
                        .setDescription(antitag(`${ctx}`))
                        .setFooter({
                        text: `${date}`
                    })
                ]
            });
        }
    });
    cm.register({
        command: "userinfo",
        category: "Basic",
        desc: "Display user information from snowflake.",
        cooldown: 5 * 1000,
        force: true,
        handler: async (msg, { prefix }) => {
            const args = ap(msg.content, true);
            const id = msg.mentions.users.first()?.id || args[1] || msg.author.id;
            let response = await axios_1.default
                .get(`https://discord.com/api/users/${id}`, {
                headers: {
                    Authorization: `Bot ${process.env.TOKEN}`
                }
            })
                .catch(e => {
                throw e;
            });
            let { username, discriminator, banner, avatar, banner_color } = response.data;
            let _0 = "discord.com";
            let embed = new discord_js_1.EmbedBuilder();
            embed.setTitle(`${username}#${discriminator}`);
            if (avatar)
                embed.setThumbnail(`https://cdn.discordapp.com/avatars/${id}/${avatar}${avatar.startsWith("a_") ? ".gif" : ".png"}?size=256`);
            if (banner)
                _0 = `https://cdn.discordapp.com/banners/${id}/${banner}${banner.startsWith("a_") ? ".gif" : ".png"}?size=2048`;
            else
                _0 = `https://serux.pro/rendercolour?hex=${banner_color?.replace("#", "")}&height=200&width=512`;
            embed.setImage(_0);
            embed.setColor(banner_color);
            embed.setDescription(`Account Created on ${(0, snowflake_1.convertSnowflakeToDate)(id).toUTCString()} | [Avatar](${`https://cdn.discordapp.com/avatars/${id}/${avatar}${avatar.startsWith("a_") ? ".gif" : ".png"}?size=256`}) | [Banner](${_0}) | Color: ${banner_color}`);
            //snowflake
            //       .convertSnowflakeToDate(id)
            //       .toDateString()
            msg.channel.send({ embeds: [embed] });
            //if (banner) {
            //    let extension = banner.startsWith("a_") ? ".gif" : ".png";
            //    let url = `https://cdn.discordapp.com/banners/${member.id}/${banner}${extension}?size=2048`;
            //    embed.setImage(url)
            //    return message.channel.send({ embeds: [embed] });
            //}
        }
    });
    cm.register({
        command: "avatar",
        category: "Basic",
        alias: ["av"],
        desc: "Display user's avatar",
        force: true,
        handler: async (msg, { prefix }) => {
            const args = ap(msg.content, true);
            const user = (await (0, gets_1.getUser)(msg, args[1])) || msg.author;
            msg.channel.send({
                content: `${msg.author.id == user.id
                    ? i18n.parse(msg.lang, "basic.avatar.self")
                    : i18n.parse(msg.lang, "basic.avatar.others", user.username)}`,
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor(user.accentColor ?? parseInt(i18n.globe.color, 16))
                        .setImage(user.displayAvatarURL())
                ]
            });
        }
    });
    cm.register({
        command: "feed",
        category: "Fun",
        desc: "feed a duck from 2020.",
        handler: async (msg) => {
            const args = ap(msg.content, true);
            const p = await (0, Profile_1.UserProfile)(msg);
            const g = await (0, Profile_1.GuildProfile)(msg);
            p.ducks++;
            g.ducks++;
            msg.reply(`wawa!! you have feed ${p.ducks} ducks! the people here feed ${g.ducks}!!`);
            await p.save();
            await g.save();
        }
    });
}
module.exports = load;
function antinbsp(str) {
    return str.replaceAll("&nbsp;", " ");
}
function antirn(str) {
    return str.replaceAll("\r", "").replaceAll("\n", "");
}
function antitag(str) {
    return str.replace(/\<([0-9a-zA-Z="])\>/g, "");
}
//# sourceMappingURL=index.js.map