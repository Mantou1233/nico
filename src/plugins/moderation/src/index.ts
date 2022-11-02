import * as Discord from "discord.js";

import { validateSnowflake } from "../../../services/snowflake";
import CommandManager from "../../../core/CommandManager";

/**
 * @returns void
 */
async function load(client: Discord.Client, cm: CommandManager) {
	cm.register({
		command: "inspect",
		category: "Moderation",
		desc: "",
		usage: "%pbuttonrole <MessageID> <buttontext> <role> <buttontext> <role> ...",
		handler: async (msg, { prefix }) => {
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
			console.log(msg2.components[0].components);
		}
	});
	client.on("interactionCreate", interaction => {
		if (interaction.isButton()) {
			if (interaction.customId.startsWith("grole/")) {
				if (
					!interaction.guild?.members.me?.permissions.has(
						"ManageRoles"
					)
				)
					return void interaction.reply({
						content: "i cannot give you roles.",
						ephemeral: true
					});

				const id = interaction.customId.slice(6);
				if (
					(
						interaction.member!
							.roles as Discord.GuildMemberRoleManager
					).cache.has(id)
				) {
					try {
						(
							interaction.member!
								.roles as Discord.GuildMemberRoleManager
						).remove(id);
					} catch (e) {
						return void interaction.reply({
							content: "i cannot remove your roles.",
							ephemeral: true
						});
					}
					interaction.reply({
						content: "roles removed!",
						ephemeral: true
					});
				} else {
					try {
						(
							interaction.member!
								.roles as Discord.GuildMemberRoleManager
						).add(id);
					} catch (e) {
						return void interaction.reply({
							content: "i cannot give you roles.",
							ephemeral: true
						});
					}
					interaction.reply({
						content: "roles added!",
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
		usage: "%pbuttonrole <MessageID> <buttontext> <role> <buttontext> <role> ...",
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
			if ((args.length - 2) % 2 == 1)
				return msg.reply("aa you probably missed some of the args");
			for (let i = 0; i < args.length - 2; i += 2) {
				args[i + 3] =
					/<@&(?<id>\d{17,20})>/.exec(args[i + 3])?.groups?.id ||
					args[i + 3];

				const vl2 = validateSnowflake(args[i + 3]);
				if (typeof vl2 == "string") return msg.reply(vl2);

				if (!msg.guild.roles.cache.get(args[i + 1 + 2]))
					return msg.reply(`the ${i}th role does not exist!!`);
				buttons.push({
					custom_id: `grole/${args[i + 3]}`,
					label: args[i + 2],
					type: 2,
					style: 1
				});
			}
			if (buttons.length > 5)
				return msg.reply("aa i cant take 5 buttons");
			msg2.edit({ components: [{ type: 1, components: buttons }] });
		}
	});
}

module.exports = load;
