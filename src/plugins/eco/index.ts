import {
	Args,
	Cogs,
	command,
	DefinePlugin,
	Inject,
	interaction,
	Msg
} from "~/core/Decorators";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	Client,
	Message,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle
} from "discord.js";
import { inspect } from "util";

@DefinePlugin()
class BasicPlugin {
	@Inject client: Client;

	@command()
	async ping(msg: Message) {
		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId("pong")
				.setLabel("Click me!")
				.setStyle(ButtonStyle.Primary)
		);
		msg.reply({
			components: [row as any],
			content: `pong!! ${msg.createdTimestamp - Date.now()}ms`
		});
	}

	@command()
	async menu(msg: Message) {
		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId("menu")
				.setLabel("Click me open menu")
				.setStyle(ButtonStyle.Primary)
		);
		msg.reply({
			components: [row as any]
		});
	}

	@command({ command: "restart" })
	async restart(msg: Message) {
		msg.reply("ending;;");
		this.client.loader.expo();
	}

	@interaction.button()
	async PingHandler(interaction: ButtonInteraction) {
		if (interaction.customId !== "pong") return;
		interaction.reply({
			ephemeral: true,
			content: `pong x2!!!! ${Math.abs(
				interaction.createdTimestamp - Date.now()
			)}ms`
		});
	}

	@interaction.button()
	async MenuHandler(interaction: ButtonInteraction) {
		if (interaction.customId !== "menu") return;
		const modal = new ModalBuilder()
			.setCustomId("myModal")
			.setTitle("hi u!");

		// Add components to modal

		// Create the text input components
		const favoriteColorInput = new TextInputBuilder()
			.setCustomId("name")
			// The label is the prompt the user sees for this input
			.setLabel("whats your name")
			// Short means only a single line of text
			.setStyle(TextInputStyle.Short);

		const hobbiesInput = new TextInputBuilder()
			.setCustomId("desc")
			.setLabel("some description about chu'?")
			// Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph);

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(
			favoriteColorInput
		);
		const secondActionRow = new ActionRowBuilder().addComponents(
			hobbiesInput
		);

		// Add inputs to the modal
		modal.addComponents(firstActionRow as any, secondActionRow as any);

		await interaction.showModal(modal as any);
		const response = await interaction.awaitModalSubmit({
			time: 10000000
		});

		console.log(1);
		response.reply(
			`woo, ${response.fields.getTextInputValue(
				"name"
			)}, you poem is ${response.fields.getTextInputValue("desc")}`
		);
	}

	@command()
	async eval(@Msg() msg: Message, @Args(ap.modern) args: string[]) {
		if (msg.author.id !== "644504218798915634")
			return msg.channel.send("Insuffent permission.");
		const code = args[1];
		if (code.trim() === "")
			return msg.channel.send("Dont give me nothing u dumb!!");
		let msg2 = await msg.channel.send("evaling...");
		try {
			let output = await eval(code);
			if (
				output instanceof Promise ||
				(Boolean(output) &&
					typeof output.then === "function" &&
					typeof output.catch === "function")
			)
				output = await output;
			output = inspect(output, {
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
			}).catch(() => {});
		} catch (err) {
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
			}).catch(() => {});
		}
	}
}

export default BasicPlugin;
