import { Client, Message } from "discord.js";
import {
	Args,
	Cogs,
	command,
	DefinePlugin,
	Inject,
	interaction,
	Msg
} from "~/core/Decorators";

@DefinePlugin()
class TestyCog {
	@Inject client: Client;

	@command()
	async test1(@Msg() msg: Message, @Args(ap) args: any[]) {
		msg.reply(`test1! ${args.length} args: ${args.join(",")}`);
	}

	@command()
	async test2(@Msg() msg: Message, @Args(ap.old) args: any[]) {
		msg.reply(`test2! ${args.length} args: ${args.join(",")}`);
	}
}

export default TestyCog;
