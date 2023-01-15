import {
	Cogs,
	command,
	DefinePlugin,
	Inject,
	interaction
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

@DefinePlugin()
class TestyPlugin {
	@Inject client: Client;

	@Cogs(["./cogs1.ts"]) extensions;

	@command()
	async testify(msg: Message) {
		msg.reply("test");
	}
}

export default TestyPlugin;
