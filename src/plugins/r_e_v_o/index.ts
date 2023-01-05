import { Args, Cogs, command, DefinePlugin, Inject } from "~/core/Decorators";
import { Client, Message } from "discord.js";

@DefinePlugin()
class TestingPlugin {
	@Inject client: Client;

	@command()
	async nbnhhsh(msg: Message, @Args(ap.modern) args: string[]) {
		const content = args[1];
		msg.reply(args[1]);
	}
}

export default TestingPlugin;
