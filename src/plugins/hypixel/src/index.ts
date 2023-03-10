import ms from "ms";
import Manager from "~/core/Manager";
import { makeFetch } from "~/services/makeFetch";
import { Client } from "discord.js";
/**
 * @returns void
 */
async function load(client: Client, cm: Manager) {
	cm.register({
		command: "seen",
		category: "2b2t",
		desc: "get 2b2t's server status",
		handler: async msg => {
			const args = ap(msg.content, true);
			let seen;
			try {
				seen = await makeFetch<
					{
						seen: string;
					}[]
				>(`https://api.2b2t.dev/seen?username=${args[1]}`);
			} catch {
				return msg.reply("这个用户没有记录！");
			}

			if (seen.length == 0) return msg.reply("这个用户没有记录！");
			return msg.reply(
				`上次见到${args[1]}是在: ${new Date(`${seen[0].seen} UTC-5`)
					.toISOString()
					.replace("T", " ")
					.replace("Z", "")}`
			);
		}
	});
}

module.exports = load;
