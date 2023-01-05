import { Args, Cogs, command, DefinePlugin, Inject } from "~/core/Decorators";
import { Client, Message } from "discord.js";
import translate from "@iamtraction/google-translate";

@DefinePlugin()
class TestingPlugin {
	@Inject client: Client;

	@command()
	async trans(msg: Message, @Args(ap.modern) args: string[]) {
		
	}
}

export default TestingPlugin;
