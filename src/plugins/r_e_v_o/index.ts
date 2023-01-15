import {
	Args,
	Cogs,
	command,
	DefinePlugin,
	Inject,
	Tr
} from "~/core/Decorators";
import { Client, Message } from "discord.js";
import { TTr } from "~/services/i18n";

@DefinePlugin()
class TestingPlugin {
	@Inject client: Client;

	@command()
	async replacer(msg: Message, @Args(ap.old) args: string[], @Tr() tr: TTr) {
		msg.reply(
			tr(
				args[1] as "--ignore",
				{
					holy_shit: "test"
				},
				"this is 0th index",
				"this is 1st index",
				"this is 2nd index",
				"this is 3rd index (which should not appear)"
			)
		);
	}
}

export default TestingPlugin;
