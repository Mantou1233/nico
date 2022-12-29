import { Args, Cogs, command, DefinePlugin, Inject } from "~/core/Decorators";
import { Client, Message } from "discord.js";

@DefinePlugin()
class TestyPlugin {
	@Inject client: Client;

	@Cogs(["./cogs1.ts"]) extenstions;

	@command()
	async mcparse(msg: Message, @Args(ap.modern) args: string[]) {
		const content = args[1];
		parse(content);
		msg.reply("");
	}
}

export default TestyPlugin;
