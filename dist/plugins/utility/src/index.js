"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const google_translate_1 = __importDefault(require("@iamtraction/google-translate"));
const axios_1 = __importDefault(require("axios"));
const databases_1 = require("../../../core/databases");
/**
 * @returns void
 */
async function load(client, cm) {
    cm.register({
        command: "hitokoto",
        category: "Fun",
        desc: "Say something you want to say -> ([json builder](https://glitchii.github.io/embedbuilder/?username=FDYBoT&guitabs=title,fields,description&avatar=https://cdn.discordapp.com/avatars/977542041670152212/cf54c7c185fa433014bfd2ec79df0f21.png&data=JTdCJTIyZW1iZWQlMjIlM0ElN0IlMjJ0aXRsZSUyMiUzQSUyMkxvcmVtJTIwaXBzdW0lMjIlMkMlMjJkZXNjcmlwdGlvbiUyMiUzQSUyMkRvbG9yJTIwc2l0JTIwYW1ldC4uLiUyMiUyQyUyMmNvbG9yJTIyJTNBMzkxMjklN0QlN0Q=))",
        handler: async (msg) => {
            const args = ap(msg.content, true);
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
        command: "feed",
        category: "Fun",
        desc: "feed a duck from 2020.",
        handler: async (msg) => {
            const args = ap(msg.content, true);
            const p = await (0, databases_1.UserProfile)(msg);
            if (!p.ducks)
                p.ducks = 0;
            p.ducks++;
            msg.reply(`wawa!! you have feed ${p.ducks} ducks!\n哇哇，你喂了${p.ducks}只鴨子！`);
            await p.save();
        }
    });
}
module.exports = load;
//# sourceMappingURL=index.js.map