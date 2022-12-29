import { command, DefinePlugin, Inject } from "~/core/Decorators";
import { Client, Message } from "discord.js";
import { Schema, UserProfile } from "~/core/Profile";
import { Database } from "quickmongo";

@DefinePlugin()
class BasicPlugin {
	@Inject client: Client;
	@Inject db: Database;

	@command()
	async dbinfo(msg: Message) {
		const p = await UserProfile(msg);
		p.ducks++;
		msg.reply(
			`db ping is ${Math.floor(await this.db.ping())}ms! u also got ${
				p.ducks
			} ducks gg`
		);
		p.save();
	}
}

export default BasicPlugin;
