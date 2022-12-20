import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
	Message
} from "discord.js";

export async function pagination(
	msg: Message,
	embeds: EmbedBuilder[],
	{
		color = "CFF2FF",
		footer = ""
	}: { color?: string | number; footer?: string } = {}
) {
	const ctx = Date.now().toString(36);
	let but1 = new ButtonBuilder()
		.setStyle(1)
		.setCustomId("first")
		.setLabel("<<")
		//.setEmoji(":rewind:")
		.setDisabled(false);

	let but2 = new ButtonBuilder()
		.setStyle(1)
		.setCustomId("previous")
		.setLabel("<")
		//.setEmoji(":arrow_left:")
		.setDisabled(false);

	let but3 = new ButtonBuilder()
		.setStyle(4)
		.setCustomId("delete")
		.setLabel("x")
		//.setEmoji(":x:")
		.setDisabled(false);

	let but4 = new ButtonBuilder()
		.setStyle(1)
		.setCustomId("next")
		.setLabel(">")
		//.setEmoji(":arrow_right:")
		.setDisabled(false);

	let but5 = new ButtonBuilder()
		.setStyle(1)
		.setCustomId("last")
		.setLabel(">>")
		//.setEmoji(":fast_forward:")
		.setDisabled(false);

	const row = new ActionRowBuilder().addComponents(
		but1.setDisabled(false),
		but2.setDisabled(false),
		but3.setDisabled(false),
		but4.setDisabled(false),
		but5.setDisabled(false)
	);

	embeds = embeds.map((embed, index) => {
		return embed
			.setColor(embed.data.color || parseInt(i18n.globe.color, 16))
			.setFooter({
				text: `${footer || footer === "" ? `${footer} | ` : ""}Page: ${
					index + 1
				}/${embeds.length}`,
				iconURL: msg.guild!.iconURL()!
			});
	});

	if (embeds.length == 1) {
		return msg.reply({
			embeds: [embeds[0]],
			components: [
				new ActionRowBuilder().addComponents([
					but1.setDisabled(true),
					but2.setDisabled(true),
					but3.setDisabled(true),
					but4.setDisabled(true),
					but5.setDisabled(true)
				]) as any
			]
		});
	}

	const msg2 = await msg.reply({
		embeds: [embeds[0]],
		components: [
			new ActionRowBuilder().addComponents(
				but1.setDisabled(true),
				but2.setDisabled(true),
				but3.setDisabled(false),
				but4.setDisabled(false),
				but5.setDisabled(false)
			) as any
		]
	});

	let filter = m => m.member.id === msg.member!.id;

	const collector = msg2.createMessageComponentCollector({
		//filter,
		time: 60000,
		componentType: ComponentType.Button
	});

	let page = 0;

	collector.on("collect", async b => {
		if ((b.member! as any).id !== msg.member!.id)
			return void (await b.reply({
				content: "this isnt your button!!! dont click",
				ephemeral: true
			}));

		await b.deferUpdate().catch(() => null);

		switch (b.customId) {
			case "next": {
				page++;
				if (page !== embeds.length - 1) {
					await msg2.edit({
						embeds: [embeds[page]],
						components: [
							new ActionRowBuilder().addComponents(
								but1.setDisabled(false),
								but2.setDisabled(false),
								but3.setDisabled(false),
								but4.setDisabled(false),
								but5.setDisabled(false)
							) as any
						]
					});
				} else {
					await msg2.edit({
						embeds: [embeds[page]],
						components: [
							new ActionRowBuilder().addComponents(
								but1.setDisabled(false),
								but2.setDisabled(false),
								but3.setDisabled(false),
								but4.setDisabled(true),
								but5.setDisabled(true)
							) as any
						]
					});
				}
				break;
			}

			case "previous": {
				page--;
				if (page !== 0) {
					msg2.edit({
						embeds: [embeds[page]],
						components: [
							new ActionRowBuilder().addComponents(
								but1.setDisabled(false),
								but2.setDisabled(false),
								but3.setDisabled(false),
								but4.setDisabled(false),
								but5.setDisabled(false)
							) as any
						]
					});
					break;
				} else {
					msg2.edit({
						embeds: [embeds[page]],
						components: [
							new ActionRowBuilder().addComponents(
								but1.setDisabled(true),
								but2.setDisabled(true),
								but3.setDisabled(false),
								but4.setDisabled(false),
								but5.setDisabled(false)
							) as any
						]
					});
				}
				break;
			}

			case "first": {
				page = 0;
				await msg2.edit({
					embeds: [embeds[page]],
					components: [
						new ActionRowBuilder().addComponents(
							but1.setDisabled(true),
							but2.setDisabled(true),
							but3.setDisabled(false),
							but4.setDisabled(false),
							but5.setDisabled(false)
						) as any
					]
				});
				break;
			}

			case "last": {
				page = embeds.length - 1;
				await msg2.edit({
					embeds: [embeds[page]],
					components: [
						new ActionRowBuilder().addComponents(
							but1.setDisabled(false),
							but2.setDisabled(false),
							but3.setDisabled(false),
							but4.setDisabled(true),
							but5.setDisabled(true)
						) as any
					]
				});
				break;
			}

			case "delete": {
				row.components.forEach((btn: any) => btn.setDisabled(true));

				await msg2.edit({
					embeds: [embeds[page]],
					components: [row as any]
				});
				break;
			}
		}
	});

	collector.on("end", async () => {
		row.components.forEach((btn: any) => btn.setDisabled(true));

		if (msg2.editable) {
			await msg2.edit({
				embeds: [embeds[page]],
				components: [row as any]
			});
		}
	});
}
