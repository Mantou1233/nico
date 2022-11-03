import { Client, EmbedBuilder } from "discord.js";
import CommandManager from "../../../core/CommandManager";
import translate from "@iamtraction/google-translate";
import axios from "axios";
import { UserProfile } from "~/core/databases";
/**
 * @returns void
 */
async function load(client: Client, cm: CommandManager) {
	cm.register({
		command: "hitokoto",
		category: "Fun",
		desc: "Say something you want to say -> ([json builder](https://glitchii.github.io/embedbuilder/?username=FDYBoT&guitabs=title,fields,description&avatar=https://cdn.discordapp.com/avatars/977542041670152212/cf54c7c185fa433014bfd2ec79df0f21.png&data=JTdCJTIyZW1iZWQlMjIlM0ElN0IlMjJ0aXRsZSUyMiUzQSUyMkxvcmVtJTIwaXBzdW0lMjIlMkMlMjJkZXNjcmlwdGlvbiUyMiUzQSUyMkRvbG9yJTIwc2l0JTIwYW1ldC4uLiUyMiUyQyUyMmNvbG9yJTIyJTNBMzkxMjklN0QlN0Q=))",
		handler: async msg => {
			const args = ap(msg.content, true);
			try {
				var {
					hitokoto,
					creator: author,
					id
				} = (await axios.get("https://international.v1.hitokoto.cn/"))
					.data;

				var { text: translated } = await translate(hitokoto, {
					to: "en"
				});
			} catch (e) {
				throw e;
			}
			msg.channel.send({
				embeds: [
					new EmbedBuilder()
						.setConfig()
						.setDescription(
							`${translated}\n\n${hitokoto}\n- ${author}`
						)
						.setFooter({
							text: `${id}`
						})
				]
			});
		}
	});

	cm.register({
		command: "feed",
		category: "Fun",
		desc: "feed a duck from 2020.",
		handler: async msg => {
			const args = ap(msg.content, true);
			const p = await UserProfile(msg);
			if (!p.ducks) p.ducks = 0;
			p.ducks++;
			msg.reply(
				`wawa!! you have feed ${p.ducks} ducks!\n哇哇，你喂了${p.ducks}只鴨子！`
			);
			await p.save();
		}
	});
}

module.exports = load;
