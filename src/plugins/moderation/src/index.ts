import * as Discord from "discord.js";

import { validateSnowflake } from "@services/snowflake";
import CommandManager from "@core/CommandManager";
import { GuildProfile } from "@core/databases";

/**
 * @returns void
 */
async function load(client: Discord.Client, cm: CommandManager) {
	cm.on("interactionCreate", async interaction => {
		if (interaction.isButton()) {
			if (
				interaction.customId.startsWith("grole/") &&
				interaction.member!.roles instanceof
					Discord.GuildMemberRoleManager
			) {
				const but_id = parseInt(interaction.customId.slice(6));
				const g = await GuildProfile(interaction);

				const id = g.buttonroles[but_id].id;
				// prettier-ignore
				if (!interaction.guild?.members.me?.permissions.has("ManageRoles"))
					return void interaction.reply({
						content: "i cannot give you roles.",
						ephemeral: true
					});

				if (interaction.member!.roles.cache.has(id)) {
					try {
						interaction.member!.roles.remove(id);
					} catch (e) {
						return void interaction.reply({
							content: "i cannot remove your roles.",
							ephemeral: true
						});
					}
					interaction.reply({
						content:
							g.buttonroles[but_id].remove ?? "roles removed!",
						ephemeral: true
					});
				} else {
					try {
						interaction.member!.roles.add(id);
					} catch (e) {
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
		desc: "",
		usage: "`%pbuttonrole <MessageID> <buttontext> <role> [addmessage] [removemessage]`",
		handler: async (msg, { prefix }) => {
			if (!msg.member?.permissions.has("ManageRoles"))
				return msg.reply(
					i18n.parse(msg.lang, "moderation.buttonrole.error.noperms")
				);
			if (!msg.guild?.members.me?.permissions.has("ManageRoles"))
				return msg.reply(
					i18n.parse(
						msg.lang,
						"moderation.buttonrole.error.botnoperms"
					)
				);

			const g = await GuildProfile(msg);
			const args = ap(msg.content);
			const vl = validateSnowflake(args[1]);
			if (typeof vl == "string") return msg.reply(vl);

			let msg2: Discord.Message;
			try {
				msg2 = await msg.channel.messages.fetch(args[1]);
			} catch (e) {
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
				return msg.reply(
					i18n.parse(
						msg.lang,
						"moderation.buttonrole.error.cantedit",
						prefix
					)
				);
			//{"content":"aaa","components":[{"type":1,"components":[{"type":2,"label":"aa","style":1,"custom_id":"ff"}]}]}
			const buttons: {
				custom_id: string;
				label: string;
				type: 2;
				style: 1;
			}[] = [];
			for (let compo of (msg2.components[0]?.components ??
				[]) as Discord.ButtonComponent[]) {
				buttons.push({
					custom_id: compo.customId!,

					label: compo.label!,
					type: 2,
					style: 1
				});
			}
			args[3] =
				/<@&(?<id>\d{17,20})>/.exec(args[3])?.groups?.id || args[3];

			const vl2 = validateSnowflake(args[3]);
			if (typeof vl2 == "string") return msg.reply(vl2);

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

			const opts: any = {
				id: args[3]
			};
			if (args[4]) opts.add = args[4];
			if (args[5]) opts.remove = args[5];

			g.buttonroles[g.buttonroles.n++] = opts;
			g.save();
			msg2.edit({ components: [{ type: 1, components: buttons }] });
		}
	});
}

module.exports = load;
