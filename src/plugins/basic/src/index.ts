import { version } from "discord.js";
import { inspect } from "util";

import * as Discord from "discord.js";
import * as child_process from "child_process";
import * as lodash from "lodash";

import axios from "axios";
import os from "os";
import ms from "ms";
import fs from "fs/promises";

import CommandManager from "../../../core/CommandManager";

import { convertSnowflakeToDate } from "../../../services/snowflake";
import { langs, langAlias } from "../../../services/i18n";
import pb from "../../../services/pb";
import help from "../../../services/help";

/**
 * @returns void
 */
async function load(client: Discord.Client, cm: CommandManager) {
	cm.register({
		command: "say",
		category: "Basic",
		desc: "Say something you want to say -> ([json builder](https://glitchii.github.io/embedbuilder/?username=FDYBoT&guitabs=title,fields,description&avatar=https://cdn.discordapp.com/avatars/977542041670152212/cf54c7c185fa433014bfd2ec79df0f21.png&data=JTdCJTIyZW1iZWQlMjIlM0ElN0IlMjJ0aXRsZSUyMiUzQSUyMkxvcmVtJTIwaXBzdW0lMjIlMkMlMjJkZXNjcmlwdGlvbiUyMiUzQSUyMkRvbG9yJTIwc2l0JTIwYW1ldC4uLiUyMiUyQyUyMmNvbG9yJTIyJTNBMzkxMjklN0QlN0Q=))",
		handler: async msg => {
			const args = ap(msg.content, true);
			if (!args[1])
				return msg.channel.send({
					embeds: [
						{
							description: i18n.parse(
								msg.lang,
								"basic.say.error.noargs"
							),
							color: parseInt(i18n.globe["color"], 16)
						}
					]
				});
			if (!IsJsonString(args[1]))
				return msg.channel.send({
					embeds: [
						{
							description: args[1],
							color: parseInt(i18n.globe["color"], 16)
						}
					]
				});
			let data = JSON.parse(args[1]);
			if (data.length)
				return msg.channel.send({
					embeds: [
						{
							description: "No arrays!!",
							color: parseInt(i18n.globe["color"], 16)
						}
					]
				});
			let result = data;
			if (data.embed) {
				result.embeds = [...(result.embeds ?? []), data.embed];
				delete result.embed;
			}
			msg.channel.send(result).catch(() => {
				msg.channel.send(
					i18n.parse(msg.lang, "basic.say.error.invaildparams")
				);
			});
		}
	});
	cm.register({
		command: "edit",
		category: "Basic",
		desc: "edit something the bot said -> ([json builder](https://glitchii.github.io/embedbuilder/?username=FDYBoT&guitabs=title,fields,description&avatar=https://cdn.discordapp.com/avatars/977542041670152212/cf54c7c185fa433014bfd2ec79df0f21.png&data=JTdCJTIyZW1iZWQlMjIlM0ElN0IlMjJ0aXRsZSUyMiUzQSUyMkxvcmVtJTIwaXBzdW0lMjIlMkMlMjJkZXNjcmlwdGlvbiUyMiUzQSUyMkRvbG9yJTIwc2l0JTIwYW1ldC4uLiUyMiUyQyUyMmNvbG9yJTIyJTNBMzkxMjklN0QlN0Q=))",
		handler: async (msg, ext) => {
			let args: any = ap(msg.content, true)[1].split("/");
			args = [args.splice(0, 1)[0], args.join("/")];

			if (args.length < 2)
				return msg.channel.send({
					embeds: [
						{
							description: i18n.parse(
								msg.lang,
								"basic.say.error.noargs"
							),
							color: parseInt(i18n.globe["color"], 16)
						}
					]
				});

			try {
				BigInt(args[0]);
			} catch (e) {
				return msg.channel.send({
					embeds: [
						{
							description: `snowflake error: ${args[0]} not a snowflake`,
							color: parseInt(i18n.globe["color"], 16)
						}
					]
				});
			}
			let msg2: Discord.Message<boolean>;

			try {
				msg2 = (await msg.channel.messages.fetch(args[0]))!;
			} catch (e) {
				return msg.channel.send({
					embeds: [
						{
							description: `nah, ${e.message}`,
							color: parseInt(i18n.globe["color"], 16)
						}
					]
				});
			}

			if (!msg2 || !msg2.editable)
				return msg.channel.send({
					embeds: [
						{
							description: "nah, error dont exist",
							color: parseInt(i18n.globe["color"], 16)
						}
					]
				});
			if (!IsJsonString(args[1]))
				return msg2.edit({
					embeds: [
						{
							description: args[1],
							color: parseInt(i18n.globe["color"], 16)
						}
					]
				});
			let data = JSON.parse(args[1]);
			if (data.length)
				return msg.channel.send({
					embeds: [
						{
							description: "No arrays!!",
							color: parseInt(i18n.globe["color"], 16)
						}
					]
				});
			let result = data;
			if (data.embed) {
				result.embeds = [...(result.embeds ?? []), data.embed];
				delete result.embed;
			}
			msg2.edit(result).catch(() => {
				msg.channel.send(
					i18n.parse(msg.lang, "basic.say.error.invaildparams")
				);
			});
		}
	});
	cm.register({
		command: "toggle",
		category: "Basic",
		desc: "toggle commands.",
		force: true,
		hidden: true,
		handler: async msg => {
			let args = ap(msg.content);

			if (args[1].toLowerCase() === "category") {
				let used: [any[], any[]] = [[], []],
					amount = [0, 0];

				client.manager.commands.each((cmd, key) => {
					if (cmd.force) return;
					if (cmd.category!.toLowerCase() === args[2].toLowerCase()) {
						client.manager.commands.set(key, {
							...cmd,
							disabled: !cmd.disabled
						});

						if (!cmd.disabled) {
							used[0].push(cmd.command);
							amount[0]++;
						}
						if (cmd.disabled) {
							used[1].push(cmd.command);
							amount[1]++;
						}
					}
				});
				return msg.reply(
					`done! enabled ${amount[0]} commands [${used[0].join(
						", "
					)}], disabled ${amount[1]} commands [${used[1].join(
						", "
					)}].`
				);
			}

			if (args[1].toLowerCase() === "command") {
				let bool: boolean | number = -1;
				client.manager.commands.each((cmd, key) => {
					if (cmd.force) return;
					if (cmd.command.toLowerCase() === args[2].toLowerCase()) {
						client.manager.commands.set(key, {
							...cmd,
							disabled: !cmd.disabled
						});

						bool = !cmd.disabled;
					}
				});
				if (bool === -1)
					return msg.reply(
						i18n.parse(msg.lang, "command.run.notfound")
					);
				return msg.reply(
					i18n.parse(
						msg.lang,
						"basic.toggle.command.toggled",
						args[2],
						bool
							? i18n.parse(
									msg.lang,
									"basic.toggle.command.disabledText"
							  )
							: i18n.parse(
									msg.lang,
									"basic.toggle.command.enabledText"
							  )
					)
				);
			}

			msg.reply(i18n.parse(msg.lang, "command.run.notfound"));
		}
	});
	const ux = (name, value, inline = false) => ({ name, value, inline });
	cm.register({
		command: "botstats",
		category: "Basic",
		desc: "Display bot information",
		handler: async msg => {
			let gitHash = "stable build";
			try {
				gitHash = child_process
					.execSync("git rev-parse HEAD")
					.toString()
					.trim();
			} catch {}
			msg.channel.send({
				embeds: [
					new Discord.EmbedBuilder()
						.setColor("#CFF2FF")
						.setTitle(
							`nico ${"0.1"} ${(
								(process.env.BUILD as string) || "Development "
							).toLowerCase()}`
						)
						.setThumbnail(
							client.user!.displayAvatarURL({
								dynamic: true
							} as any)
						)
						.setDescription(
							`\`\`\`yml\n${client.user!.username}#${
								client.user!.discriminator
							} [${client.user!.id}]\nping: ${Math.floor(
								msg.createdTimestamp - Date.now()
							)}ms ping\n‎      ${
								client.ws.ping
							}ms heartbeat\nUptime: ${ms(client.uptime)}\n\`\`\``
						)
						.setFields(
							ux(
								":bar_chart: General statistics",
								`\`\`\`yml\n${
									client.guilds.cache.size
								} guilds\n${client.guilds.cache.reduce(
									(users, value) =>
										users + (+value.memberCount || 0),
									0
								)} users\n\`\`\``,
								true
							),
							ux(
								":paperclip: Cache statistics",
								`\`\`\`yml\n${client.users.cache.size} users\n${client.channels.cache.size} channels\n${client.emojis.cache.size} emojis\`\`\``,
								true
							),
							ux(
								":gear: Performance statistics",
								`\`\`\`yml\nTotal Memory: ${pb(
									os.totalmem()
								)}\nFree Memory: ${pb(
									os.freemem()
								)} (${percentage(
									os.freemem(),
									os.totalmem()
								).toFixed(1)}%)\nUsed Memory: ${pb(
									os.totalmem() - os.freemem()
								)} (${percentage(
									os.totalmem() - os.freemem(),
									os.totalmem()
								).toFixed(1)}%)\n\`\`\``
							),
							ux(
								":computer: System statistics",
								`\`\`\`yml\n${process.platform} ${
									process.arch
								}\n${ms(os.uptime() * 1000)} uptime\n${(
									process.memoryUsage().rss /
									1024 /
									1024
								).toFixed(2)} MB RSS\n${(
									process.memoryUsage().heapUsed /
									1024 /
									1024
								).toFixed(2)} MB Heap\n\`\`\``
							),
							ux(
								"Miscellaneous Statistics",
								`\`\`\`yml\n${client.manager.commands.size} cmds\ndiscord.js ${version}\nnode ${process.version}\n\`\`\``
							)
						)
						.setFooter({ text: `${gitHash}` })
				]
			});
		}
	});
	cm.register({
		command: "expo",
		category: "Basic",
		hidden: true,
		handler: async (msg, { prefix }) => {
			client.loader.expo();
		}
	});
	cm.register({
		command: "choose",
		category: "Basic",
		desc: "Display bot information",
		handler: async msg => {
			const args = ap(msg.content, true);
			let arr = args[1].split(";");
			msg.reply({
				embeds: [
					new Discord.EmbedBuilder()
						.setColor(i18n.globe.color)
						.setDescription(
							`:thinking:\n${
								arr[random(0, arr.length - 1)] ?? "NOTHING"
							}`
						)
				]
			});
		}
	});
	cm.register({
		command: "first-msg",
		category: "Basic",
		desc: "Display bot information",
		handler: async msg => {
			const messages = await msg.channel.messages.fetch({
				limit: 1,
				after: "0"
			});
			const msg2 = messages.first() as Discord.Message;
			msg2.reply(`${msg.url}`);
		}
	});
	cm.register({
		command: "help",
		category: "Basic",
		desc: "Display bot information",
		alias: ["h"],
		force: true,
		handler: async (msg, { prefix }) => {
			help(client, msg, prefix);
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

			let embed = new Discord.EmbedBuilder();
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
		command: "ping",
		category: "Basic",
		desc: "Display bot information",
		handler: async (msg, { prefix }) => {
			await msg.reply(
				i18n.parse(
					msg.lang,
					"basic.ping.pong",
					`${Math.abs(Date.now() - msg.createdTimestamp)}`
				)
			);
		}
	});

	cm.register({
		command: "eval",
		category: "Basic",
		desc: "Display bot information",
		hidden: true,
		handler: async (msg, ext) => {
			if (msg.author.id !== "644504218798915634")
				return msg.channel.send("Insuffent permission.");
			let args = ap(msg.content, true);
			const code = args[1];
			if (code.trim() === "")
				return msg.channel.send("Dont give me nothing u dumb!!");
			let msg2 = await msg.channel.send("evaling...");
			try {
				let output = await eval(code);
				if (
					output instanceof Promise ||
					(Boolean(output) &&
						typeof output.then === "function" &&
						typeof output.catch === "function")
				)
					output = await output;
				output = inspect(output, {
					depth: 0,
					maxArrayLength: null
				});
				msg2.edit({
					embeds: [
						{
							author: {
								name: "Evaluation Completed!"
							},
							description: `**Input**\n\`\`\`js\n${code}\`\`\`\n**Output**\n\`\`\`js\n${output}\`\`\``,
							color: 0x2f3136
						}
					]
				}).catch(() => {});
			} catch (err) {
				msg2.edit({
					embeds: [
						{
							author: {
								name: "Error!"
							},
							description: `**Input**\n\`\`\`js\n${code}\`\`\`\n**Error**\n\`\`\`js\n${err}\`\`\``,
							color: 0x2f3136
						}
					]
				}).catch(() => {});
			}
		}
	});
}

module.exports = load;

function IsJsonString(str: string) {
	let o;
	try {
		o = JSON.parse(str);
	} catch (e) {
		return false;
	}
	if (o && typeof o === "object") return true;
	return false;
}

function percentage(pv, tv) {
	return Math.round((pv / tv) * 100);
}
