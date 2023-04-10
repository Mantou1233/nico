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
class VVVPlugin {
	@Inject client: Client;

	@command()
	async replacer(msg: Message, @Args(ap.old) args: string[], @Tr() $: TTr) {}
}

export default VVVPlugin;
