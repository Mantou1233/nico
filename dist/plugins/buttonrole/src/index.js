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
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = __importStar(require("discord.js"));
const snowflake_1 = require("../../../services/snowflake");
const Profile_1 = require("../../../core/Profile");
const gets_1 = require("../../../services/gets");
/**
 * @returns void
 */
async function load(client, cm) {
    cm.register({
        type: "button",
        handler: async (interaction) => {
            if (interaction.customId.startsWith("grole/") &&
                interaction.member.roles instanceof
                    Discord.GuildMemberRoleManager) {
                const but_id = parseInt(interaction.customId.slice(6));
                const g = await (0, Profile_1.GuildProfile)(interaction);
                const id = g.buttonroles[but_id].id;
                // prettier-ignore
                if (!interaction.guild?.members.me?.permissions.has("ManageRoles"))
                    return void interaction.reply({
                        content: "i cannot give you roles.",
                        ephemeral: true
                    });
                if (interaction.member.roles.cache.has(id)) {
                    try {
                        interaction.member.roles.remove(id);
                    }
                    catch (e) {
                        return void interaction.reply({
                            content: "i cannot remove your roles.",
                            ephemeral: true
                        });
                    }
                    interaction.reply({
                        content: g.buttonroles[but_id].remove ?? "roles removed!",
                        ephemeral: true
                    });
                }
                else {
                    try {
                        interaction.member.roles.add(id);
                    }
                    catch (e) {
                        return void interaction.reply({
                            content: "i cannot give you roles.",
                            ephemeral: true
                        });
                    }
                    interaction.reply({
                        content: g.buttonroles[but_id].add ?? "roles added!",
                        ephemeral: true
                    });
                }
            }
        }
    });
    cm.register({
        command: "buttonrole",
        category: "Moderation",
        desc: "make a button on a existing message of me so when people press it they can get roles boo",
        usage: "`%pbuttonrole <MessageID> <buttontext> <role> [addmessage] [removemessage]`",
        handler: async (msg, { prefix }) => {
            if (!msg.member?.permissions.has("ManageRoles"))
                return msg.reply(i18n.parse(msg.lang, "moderation.buttonrole.error.noperms"));
            if (!msg.guild?.members.me?.permissions.has("ManageRoles"))
                return msg.reply(i18n.parse(msg.lang, "moderation.buttonrole.error.botnoperms"));
            const g = await (0, Profile_1.GuildProfile)(msg);
            const args = ap(msg.content);
            args[1] = (0, gets_1.getMessageId)(args[1]);
            const vl = (0, snowflake_1.validateSnowflake)(args[1]);
            if (typeof vl == "string")
                return msg.reply(vl);
            let msg2;
            try {
                msg2 = await msg.channel.messages.fetch(args[1]);
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
            if (!msg2.editable)
                return msg.reply(i18n.parse(msg.lang, "moderation.buttonrole.error.cantedit", prefix));
            //{"content":"aaa","components":[{"type":1,"components":[{"type":2,"label":"aa","style":1,"custom_id":"ff"}]}]}
            const buttons = [];
            for (let compo of (msg2.components[0]?.components ??
                [])) {
                buttons.push({
                    custom_id: compo.customId,
                    label: compo.label,
                    type: 2,
                    style: 1
                });
            }
            args[3] = (0, gets_1.getRole)(args[3]);
            const vl2 = (0, snowflake_1.validateSnowflake)(args[3]);
            if (typeof vl2 == "string")
                return msg.reply(vl2);
            if (!msg.guild.roles.cache.get(args[3]))
                return msg.reply(`the role does not exist!!`);
            buttons.push({
                custom_id: `grole/${g.buttonroles.n}`,
                label: args[2],
                type: 2,
                style: 1
            });
            if (buttons.length > 5)
                return msg.reply("aa i cant take 5 buttons");
            const opts = {
                id: args[3]
            };
            if (args[4])
                opts.add = args[4];
            if (args[5])
                opts.remove = args[5];
            g.buttonroles[g.buttonroles.n++] = opts;
            g.save();
            msg2.edit({ components: [{ type: 1, components: buttons }] });
        }
    });
}
module.exports = load;
//# sourceMappingURL=index.js.map