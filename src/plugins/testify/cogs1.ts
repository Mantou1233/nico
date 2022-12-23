import { Client, Message } from "discord.js";
import {
	Cogs,
	command,
	DefinePlugin,
	Inject,
	interaction
} from "~/core/Decorators";

@DefinePlugin()
class TestifyCog {
	@Inject client: Client;

	@Cogs(["./cogs1.ts"]) extenstions;

	@command()
	async testcog(msg: Message) {
		msg.reply(
			"HOLY SHIT cog runs well!! fuck you + congrats" + this.client
		);
		console.log(this.client);
	}
}

export default TestifyCog;
