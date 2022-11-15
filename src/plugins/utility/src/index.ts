import { Client, Embed, EmbedBuilder, Message, User } from "discord.js";

import axios from "axios";
import translate from "@iamtraction/google-translate";

import Manager from "~/core/Manager";
import { UserProfile, GuildProfile } from "~/core/Profile";

import { convertSnowflakeToDate } from "@services/snowflake";
import { getUser } from "@services/gets";
import { emojiParser } from "~/services/ap";

/**
 * @returns void
 */
async function load(client: Client, cm: Manager) {
	cm.register({
		command: "hitokoto",
		category: "Fun",
		desc: "get a quote from internet.",
		handler: async msg => {
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
		command: "billwurtz",
		category: "Fun",
		desc: "get a q&a from bill wurtz's website",
		handler: async msg => {
			const rst = await axios.get(
				"https://billwurtz.com/questions/random.php"
			);
			const vbt = antirn(antinbsp(rst.data.split("</br>")[2]));

			var date, title, ctx;
			try {
				date = vbt.split("<dco>")[1].split("</dco>")[0].trim();
				title = vbt.split("<qco>")[1].split("</qco>")[0].trim();
				ctx = vbt.split("</h3>")[1].trim();
			} catch (e) {
				date = vbt.split("<dco>")[1].split("</dco>")[0].trim();
				title = vbt
					.split(/\<font color=#[0-9A-F]{6,6}\>/)[1]
					.split("</font>")[0]
					.trim();
				ctx = vbt.split("</h3>")[1].trim();
			}
			msg.channel.send({
				embeds: [
					new EmbedBuilder()
						.setConfig()
						.setTitle(title)
						.setDescription(antitag(`${ctx}`))
						.setFooter({
							text: `${date}`
						})
				]
			});
		}
	});

	cm.register({
		command: "userinfo",
		category: "Basic",
		desc: "Display user information from snowflake.",
		cooldown: 5 * 1000,
		force: true,
		handler: async (msg, { prefix }) => {
			const args = ap(msg.content, true);
			const id =
				msg.mentions.users.first()?.id || args[1] || msg.author.id;
			let response = await axios
				.get(`https://discord.com/api/users/${id}`, {
					headers: {
						Authorization: `Bot ${process.env.TOKEN}`
					}
				})
				.catch(e => {
					throw e;
				});
			let { username, discriminator, banner, avatar, banner_color } =
				response.data;
			let _0 = "discord.com";

			let embed = new EmbedBuilder();
			embed.setTitle(`${username}#${discriminator}`);
			if (avatar)
				embed.setThumbnail(
					`https://cdn.discordapp.com/avatars/${id}/${avatar}${
						avatar.startsWith("a_") ? ".gif" : ".png"
					}?size=256`
				);
			if (banner)
				_0 = `https://cdn.discordapp.com/banners/${id}/${banner}${
					banner.startsWith("a_") ? ".gif" : ".png"
				}?size=2048`;
			else
				_0 = `https://serux.pro/rendercolour?hex=${banner_color?.replace(
					"#",
					""
				)}&height=200&width=512`;
			embed.setImage(_0);
			embed.setColor(banner_color);
			embed.setDescription(
				`Account Created on ${convertSnowflakeToDate(
					id
				).toUTCString()} | [Avatar](${`https://cdn.discordapp.com/avatars/${id}/${avatar}${
					avatar.startsWith("a_") ? ".gif" : ".png"
				}?size=256`}) | [Banner](${_0}) | Color: ${banner_color}`
			);
			//snowflake
			//       .convertSnowflakeToDate(id)
			//       .toDateString()

			msg.channel.send({ embeds: [embed] });
			//if (banner) {
			//    let extension = banner.startsWith("a_") ? ".gif" : ".png";
			//    let url = `https://cdn.discordapp.com/banners/${member.id}/${banner}${extension}?size=2048`;
			//    embed.setImage(url)
			//    return message.channel.send({ embeds: [embed] });
			//}
		}
	});

	cm.register({
		command: "steal",
		category: "Basic",
		desc: "Adding emotes you specified",
		usage: "%psteal :tairitsu_cat: :a_bonk:",
		force: true,
		handler: async (msg: Message, { prefix }) => {
			const args = ap(msg.content, true);
			const U_emotes = emojiParser(args[1]);
			if (U_emotes.length === 0)
				return msg.channel.send(
					"please give me a emoji to add in the argument!!"
				);
			const msg2 = await msg.channel.send({
				embeds: [
					new EmbedBuilder()
						.setConfig()
						.setDescription(
							U_emotes.reduce(
								(i, v) => i + `${v.display} \`${v.name}\`\n`,
								"**Adding emotes**: \n"
							)
						)
				]
			});
			const success = U_emotes.reduce((i, v) => {
				i[v.name] = {
					display: ":x:",
					reason: ""
				};
				return i;
			}, {});
			for (let emote of U_emotes) {
				try {
					const newEmote = await msg.guild?.emojis.create({
						name: emote.name,
						attachment: emote.url
					});
					success[emote.name].display = newEmote?.toString();
				} catch (e) {
					success[emote.name].reason = ` (${e.message})`;
				}
			}
			await msg2.edit({
				embeds: [
					new EmbedBuilder()
						.setConfig()
						.setDescription(
							U_emotes.reduce(
								(i, v) =>
									i +
									`${success[v.name].display} \`${v.name}${
										success[v.name].reason
									}\`\n`,
								"**Added emotes**: \n"
							)
						)
				]
			});
		}
	});

	cm.register({
		command: "avatar",
		category: "Basic",
		alias: ["av"],
		desc: "Display user's avatar",
		force: true,
		handler: async (msg, { prefix }) => {
			const args = ap(msg.content, true);
			const user: User = (await getUser(msg, args[1])) || msg.author;

			msg.channel.send({
				content: `${
					msg.author.id == user.id
						? i18n.parse(msg.lang, "basic.avatar.self")
						: i18n.parse(
								msg.lang,
								"basic.avatar.others",
								user.username
						  )
				}`,
				embeds: [
					new EmbedBuilder()
						.setColor(
							user.accentColor ?? parseInt(i18n.globe.color, 16)
						)
						.setImage(user.displayAvatarURL())
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
			const g = await GuildProfile(msg);
			p.ducks++;
			g.ducks++;
			msg.reply(
				`wawa!! you have feed ${p.ducks} ducks! the people here feed ${g.ducks}!!`
			);
			await p.save();
			await g.save();
		}
	});
}

module.exports = load;

function antinbsp(str) {
	return str.replaceAll("&nbsp;", " ");
}
function antirn(str) {
	return str.replaceAll("\r", "").replaceAll("\n", "");
}
function antitag(str) {
	return str.replace(/\<([0-9a-zA-Z="])\>/g, "");
}
