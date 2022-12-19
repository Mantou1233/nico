import * as Discord from "discord.js";

import { validateSnowflake } from "@services/snowflake";
import Manager from "~/core/Manager";
import { GuildProfile } from "~/core/Profile";
import { getMessageId, getRole } from "../../../services/gets";
import { ModalActionRowComponentBuilder, TextInputStyle } from "discord.js";

/**
 * @returns void
 */
async function load(client: Discord.Client, cm: Manager) {
	cm.register({
		type: "button",
		filter: i => i.customId.startsWith("abut/"),
		handler: async interaction => {
			const type = interaction.customId.slice(5) as
				| "role"
				| "text"
				| "url";

			const modal = new Discord.ModalBuilder()
				.setCustomId("myModal")
				.setTitle("My Modal");

			// Add components to modal

			// Create the text input components
			const favoriteColorInput = new Discord.TextInputBuilder()
				.setCustomId("favoriteColorInput")
				// The label is the prompt the user sees for this input
				.setLabel("What's your favorite color?")
				// Short means only a single line of text
				.setStyle(TextInputStyle.Short);

			const hobbiesInput = new Discord.TextInputBuilder()
				.setCustomId("hobbiesInput")
				.setLabel(`sus !! ${type}`)
				// Paragraph means multiple lines of text.
				.setStyle(TextInputStyle.Paragraph);

			// An action row only holds one text input,
			// so you need one action row per text input.
			const firstActionRow =
				new Discord.ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
					favoriteColorInput
				);
			const secondActionRow =
				new Discord.ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
					hobbiesInput
				);

			// Add inputs to the modal
			modal.addComponents(firstActionRow, secondActionRow);

			// Show the modal to the user
			await interaction.showModal(modal);
			// const buttons: {
			// 	custom_id: string;
			// 	label: string;
			// 	type: 2;
			// 	style: 1;
			// }[] = [];
			// for (let compo of (msg2.components[0]?.components ??
			// 	[]) as Discord.ButtonComponent[]) {
			// 	buttons.push({
			// 		custom_id: compo.customId!,
			// 		label: compo.label!,
			// 		type: 2,
			// 		style: 1
			// 	});
			// }
		}
	});

	cm.register({
		type: "modal",
		filter: (i) => i.customId == "myModal",
		handler: (i) => {
			console.log(i)
		}
	})

	cm.register({
		type: "button",
		filter: i => i.customId.startsWith("but/"),
		handler: async interaction => {
			if (
				interaction.member!.roles instanceof
				Discord.GuildMemberRoleManager
			) {
				const but_id = parseInt(interaction.customId.slice(4));
				const g = await GuildProfile(interaction);

				const button = g.buttons[but_id];
				if (button.type == "role") {
					const id = button.id;
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
							content: button.remove ?? "roles removed!",
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
							content: button.add ?? "roles added!",
							ephemeral: true
						});
					}
				}
			}
		}
	});
	cm.register({
		command: "addbutton",
		category: "Moderation",
		desc: "make a button on a existing message of me so when people press it they can get roles boo",
		usage: "`%pbuttonrole <MessageID> <buttontext> <role> [addmessage] [removemessage]`",
		handler: async (msg, { prefix }) => {
			msg.reply({
				content: i18n(msg, "moderation.addbutton.message"),
				components: [
					new Discord.ActionRowBuilder<Discord.ButtonBuilder>().addComponents(
						new Discord.ButtonBuilder()
							.setLabel("Role buttons")
							.setCustomId("abut/role")
							.setStyle(Discord.ButtonStyle.Success),
						new Discord.ButtonBuilder()
							.setLabel("Text buttons")
							.setCustomId("abut/text")
							.setStyle(Discord.ButtonStyle.Secondary),
						new Discord.ButtonBuilder()
							.setLabel("Link buttons")
							.setCustomId("abut/url")
							.setStyle(Discord.ButtonStyle.Primary)
					)
				]
			});

			// if (!msg.member?.permissions.has("ManageRoles"))
			// 	return msg.reply(
			// 		i18n.parse(msg.lang, "moderation.buttonrole.error.noperms")
			// 	);
			// if (!msg.guild?.members.me?.permissions.has("ManageRoles"))
			// 	return msg.reply(
			// 		i18n.parse(
			// 			msg.lang,
			// 			"moderation.buttonrole.error.botnoperms"
			// 		)
			// 	);

			// const g = await GuildProfile(msg);

			// const args = ap(msg.content);
			// args[1] = getMessageId(args[1]);
			// const vl = validateSnowflake(args[1]);
			// if (typeof vl == "string") return msg.reply(vl);

			// let msg2: Discord.Message;
			// try {
			// 	msg2 = await msg.channel.messages.fetch(args[1]);
			// } catch (e) {
			// 	return msg.channel.send({
			// 		embeds: [
			// 			{
			// 				description: `nah, ${e.message}`,
			// 				color: parseInt(i18n.globe["color"], 16)
			// 			}
			// 		]
			// 	});
			// }
			// if (!msg2.editable)
			// 	return msg.reply(
			// 		i18n.parse(
			// 			msg.lang,
			// 			"moderation.buttonrole.error.cantedit",
			// 			prefix
			// 		)
			// 	);
			// //{"content":"aaa","components":[{"type":1,"components":[{"type":2,"label":"aa","style":1,"custom_id":"ff"}]}]}
			// const buttons: {
			// 	custom_id: string;
			// 	label: string;
			// 	type: 2;
			// 	style: 1;
			// }[] = [];
			// for (let compo of (msg2.components[0]?.components ??
			// 	[]) as Discord.ButtonComponent[]) {
			// 	buttons.push({
			// 		custom_id: compo.customId!,
			// 		label: compo.label!,
			// 		type: 2,
			// 		style: 1
			// 	});
			// }
			// args[3] = getRole(args[3]);

			// const vl2 = validateSnowflake(args[3]);
			// if (typeof vl2 == "string") return msg.reply(vl2);

			// if (!msg.guild.roles.cache.get(args[3]))
			// 	return msg.reply(`the role does not exist!!`);
			// buttons.push({
			// 	custom_id: `but/${g.buttons.n}`,
			// 	label: args[2],
			// 	type: 2,
			// 	style: 1
			// });
			// if (buttons.length > 5)
			// 	return msg.reply("aa i cant take 5 buttons");

			// const opts: any = {
			// 	id: args[3]
			// };
			// if (args[4]) opts.add = args[4];
			// if (args[5]) opts.remove = args[5];

			// g.buttons[g.buttons.n++] = opts;
			// g.save();
			// msg2.edit({ components: [{ type: 1, components: buttons }] });
		}
	});
}

module.exports = load;
