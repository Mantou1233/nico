import { command, DefinePlugin, Inject } from "~/core/Decorators";
import { Client, Message } from "discord.js";
import { UserProfile } from "~/core/Profile";
import { Database } from "quickmongo";

@DefinePlugin()
class EconomyPlugin {
	@Inject client: Client;
	@Inject db: Database;

	@command()
	async dbinfo(msg: Message) {
		const p = await UserProfile(msg.author.id);
		p.ducks++;
		msg.reply(
			`db ping is ${Math.floor(await this.db.ping())}ms! u also got ${
				p.ducks
			} ducks gg`
		);
		p.save();
	}
}

export default EconomyPlugin;
