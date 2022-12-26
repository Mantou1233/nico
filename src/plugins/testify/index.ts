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

	@Cogs(["./cogs1.ts"]) extenstions;

	@command()
	async testify(msg: Message) {
		msg.reply(
			"HOLY SHIT IS THAT TESTYFI 測試乳鴿歪 FROM ARCAKA??? IS THAT A ACRAEA REFERCET???!" +
				this.client
		);
	}
}

export default TestyPlugin;
