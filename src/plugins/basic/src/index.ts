import { ButtonStyle, version } from "discord.js";
import { inspect } from "util";

import * as Discord from "discord.js";
import * as child_process from "child_process";

import os from "os";
import ms from "ms";

import Manager from "../../../core/Manager";

import { langs, langAlias } from "../../../services/i18n";
import pb from "../../../services/pb";
import { GuildProfile, UserProfile } from "~/core/Profile";

/**
 * @returns void
 */
async function load(client: Discord.Client, cm: Manager) {
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
						.setConfig()
						.setTitle(
							`nico - ${(
								(process.env.BUILD as string) || "Stable"
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
							} [${client.user!.id}]\nping: ${Math.abs(
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
							// my
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
								).toFixed(2)} MB Heap\n${
									os.cpus()[0].model
								} (${os
									.cpus()
									.length.toString()} Threads)\`\`\``
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
		handler: async (msg, { prefix }) => {
			client.loader.expo();
		}
	});
	cm.register({
		command: "choose",
		category: "Basic",
		desc: "Choose a random",
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
	// cm.register({
	// 	command: "lang",
	// 	category: "Basic",
	// 	desc: "set language of your usage",
	// 	handler: async msg => {
	// 		let args = ap(msg.content);
	// 		const p = await UserProfile(msg.author.id);

	// 		let pass = (function (pa) {
	// 			for (let [key, [...rest]] of Object.entries(langAlias)) {
	// 				if (rest.includes(pa)) return key;
	// 			}
	// 			return false;
	// 		})(args[1]);
	// 		if (args.length == 1 || !pass)
	// 			return msg.channel.send(
	// 				i18n.parse(
	// 					msg.lang,
	// 					"basic.lang.current",
	// 					msg.lang,
	// 					Object.keys(langs).length,
	// 					`\`${(function () {
	// 						let r = "";
	// 						for (let [key, ...rest] of Object.values(
	// 							langAlias
	// 						)) {
	// 							r += `\n${key} - ${rest.join(",")}`;
	// 						}
	// 						return r;
	// 					})()}\``
	// 				)
	// 			);

	// 		p.save();
	// 		msg.channel.send(i18n.parse(pass, "basic.lang.set", pass));
	// 	}
	// });
	cm.register({
		command: "first-msg",
		category: "Basic",
		desc: "Get the first message sent on this channel",
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
		handler: async (msg, { prefix }) => {
			const args = ap(msg.content, true)
				.slice(1)
				.filter(v => !(v === ""));
			//start
			// change emojis according to your category
			let emojis = {
				basic: "ℹ️",
				owner: "👑",
				info: "📊",
				fun: "😂"
			};

			//limit of commands shown every page
			let limit = 5;
			//end

			if (!args.length) {
				const categoryList = [
					...new Set(client.manager.commands.map(cmd => cmd.category))
				];

				const categorys = categoryList.map(cat => {
					return {
						category: cat?.toLowerCase(),
						commands: [
							...client.manager.commands
								.filter(
									cmd => !cmd.hidden && cmd.category === cat
								)
								.values()
						].map(cmd => {
							return {
								name: cmd.command,
								description: (i18n
									.parse(
										msg.lang ?? "en",
										`-${cmd.category?.toLowerCase()}.${cmd.command!.toLowerCase()}.description`
									)
									.endsWith(".description")
									? cmd.desc || `${prefix}${cmd.command}`
									: i18n.parse(
											msg.lang ?? "en",
											`-${cmd.category?.toLowerCase()}.${cmd.command!.toLowerCase()}.description`
									  )
								).replaceAll("%p", prefix)
							};
						})
					};
				});

				let capf = (baa: string) => {
					const [first, ...rst] = baa.split("");
					return first.toUpperCase() + rst.join("");
				};
				let menu = boo =>
					new Discord.ActionRowBuilder().addComponents(
						new Discord.SelectMenuBuilder()
							.setPlaceholder("Select...")
							.setCustomId("h-menu")
							.setDisabled(boo)
							.addOptions([
								{
									label: "main menu",
									emoji: "🏡",
									value: "menu",
									description: "going back to the home menu"
								},
								...categorys.map(c => {
									return {
										label: c.category!,
										value: c.category?.toLowerCase()!,
										emoji:
											emojis[
												c.category?.toLowerCase() || ""
											] || ("❓" as string)
									};
								})
							] as any)
					);

				let nav = (b1, b2) =>
					new Discord.ActionRowBuilder().addComponents([
						new Discord.ButtonBuilder()
							.setStyle(ButtonStyle.Secondary)
							.setEmoji("⏪")
							.setCustomId("h-prev")
							.setDisabled(b1),
						new Discord.ButtonBuilder()
							.setStyle(ButtonStyle.Secondary)
							.setEmoji("⏩")
							.setCustomId("h-next")
							.setDisabled(b2)
					]);

				let int = new Discord.EmbedBuilder()
					.setConfig()
					.setTitle(`nico help menu`)
					.setDescription(
						i18n.parse(
							msg.lang,
							"basic.help.description",
							prefix,
							prefix
						)
					)
					.setThumbnail(client.user!.displayAvatarURL());

				let msg2 = await msg.channel.send({
					embeds: [int],
					components: [menu(false) as any]
				});

				let collector = await msg2.createMessageComponentCollector({
					time: 60000
				});

				let ch;
				let page = 0;
				let home = true;

				collector.on("collect", async (i: any) => {
					if (i.user.id !== msg.author.id)
						return i.reply({
							content: "You can't interact in this message",
							ephemeral: true
						});

					await i.deferUpdate();

					collector.resetTimer();

					if (i.isSelectMenu() && i.customId === "h-menu") {
						let [dir] = i.values;
						if (dir === "menu") {
							home = true;
							return i.editReply({
								embeds: [int],
								components: [menu(false)]
							});
						}

						ch = dir;

						const cg = categorys.find(
							m => m.category!.toLowerCase() === dir
						)!.commands;
						let max = Math.ceil(cg.length / limit);

						page = 0;

						if (page + 1 > max) page = max;

						let em = new Discord.EmbedBuilder()
							.setConfig()
							.setTitle(
								`${
									emojis[dir || ""] || ("❓" as string)
								} ${capf(dir)} commands`
							)
							.addFields(
								cg!
									.map(c => {
										return {
											name: `• ${c.name}`,
											value:
												c.description || "Not provided",
											inline: false
										};
									})
									.slice(0, (page + 1) * limit)
							)
							.setFooter({
								text: `page 1 of ${max}`
							});

						home = false;

						if (page + 1 === 1 && max === 1) {
							return i.editReply({
								embeds: [em],
								components: [menu(false), nav(true, true)]
							});
						} else {
							return i.editReply({
								embeds: [em],
								components: [menu(false), nav(true, false)]
							});
						}
					}

					if (i.isButton()) {
						const cg = categorys.find(
							m => m.category!.toLowerCase() === ch
						)!.commands;

						let max = Math.ceil(cg.length / limit);
						if (page + 1 > max) page = max;

						home = false;

						let eg = start => {
							return new Discord.EmbedBuilder()
								.setConfig()
								.setTitle(
									`${
										emojis[ch || ""] || ("❓" as string)
									} ${capf(ch)} commands`
								)
								.addFields(
									cg!
										.map(c => {
											return {
												name: `• ${c.name}`,
												value:
													c.description ||
													"Not provided",
												inline: false
											};
										})
										.slice(
											(start + 1) * limit - limit,
											(start + 1) * limit
										)
								)

								.setFooter({
									text: `page ${start + 1} of ${max}`
								});
						};

						if (i.customId === "h-prev") {
							page = page > 0 ? --page : cg!.length - 1;
						}

						if (i.customId === "h-next") {
							page = page + 1 < cg!.length ? ++page : 0;
						}

						if (page + 1 === 1 && max === 1) {
							return i.editReply({
								embeds: [eg(page)],
								components: [menu(false), nav(true, true)]
							});
						}

						if (page + 1 === 1) {
							return i.editReply({
								embeds: [eg(page)],
								components: [menu(false), nav(true, false)]
							});
						}

						if (page + 1 === max) {
							return i.editReply({
								embeds: [eg(page)],
								components: [menu(false), nav(false, true)]
							});
						} else {
							return i.editReply({
								embeds: [eg(page)],
								components: [menu(false), nav(false, false)]
							});
						}
					}
				});

				collector.on("end", async () => {
					if (!home) {
						return void msg2.edit({
							components: [menu(true), nav(true, true)] as any[]
						});
					} else {
						return void msg2.edit({
							components: [menu(true)] as any[]
						});
					}
				});
			} else {
				const command = client.manager.commands.find(
					a =>
						(a.alias ?? []).includes(args[1]) ||
						a.command === args[1]
				);
				if (!command)
					return msg.channel.send({
						embeds: [
							new Discord.EmbedBuilder()
								.setColor("#B33A3A")
								.setDescription(
									i18n.parse(msg.lang, "basic.help.notfound")
								)
						]
					});
				/*
        args[0] = 'help'
        var path = `../../commands/${args[0]}.js`;
        //
        try{
            require(`../commands/${args[0]}`)
        }catch (err){
            exists = 0
        }
        ///
        fs.access(path, (err) => {
            if (!err) {
              exists = 1
              return;
            }
        })*/
				let [desc, usage] = [
					i18n.parse(
						msg.lang ?? "en",
						`-${command.category?.toLowerCase()}.${command.command!.toLowerCase()}.description`
					),
					i18n.parse(
						msg.lang ?? "en",
						`-${command.category?.toLowerCase()}.${command.command!.toLowerCase()}.usage`
					)
				].map(v =>
					v.endsWith(".usage") || v.endsWith(".description")
						? undefined
						: v
				);
				usage = (
					usage ??
					(command.usage || `${prefix}${command.command}`)
				).replaceAll("%p", prefix);
				desc = (
					desc ??
					(command.desc || `${prefix}${command.command}`)
				).replaceAll("%p", prefix);
				const newEmbed = new Discord.EmbedBuilder()
					.setColor(i18n.globe.color)
					.setTitle(
						`\`${prefix}${command.command}\`` +
							(command.alias ?? []).reduce(
								(p, v) => p + ` **/** \`${prefix}${v}\``,
								""
							)
					)
					.setDescription(`${desc}`)
					.addFields({
						name: "Usage",
						value: `${usage}`,
						inline: true
					})
					.setFooter({
						text: `category: ${
							emojis[command.category || ""] || "❓"
						} ${command.category}`
					});
				msg.channel.send({ embeds: [newEmbed] });
			}
			//help(client, msg, prefix);
		}
	});

	// cm.register({
	// 	command: "prefix",
	// 	category: "Basic",
	// 	desc: "Display bot information",
	// 	handler: async (msg, { prefix: oprefix }) => {
	// 		const args = ap(msg.content, true);
	// 		const g = await GuildProfile(msg);

	// 		const prefix = args[1].trim();
	// 		if (prefix.length > 5)
	// 			return msg.reply(
	// 				"prefix too long!! you will forgor it probably so set a shorter one"
	// 			);
	// 		if (prefix.includes(" ")) return msg.reply("no space!!!@");

	// 		g.prefix = prefix;
	// 		msg.reply(
	// 			`server prefix has been changed from ${oprefix} to ${prefix}`
	// 		);
	// 		await g.save();
	// 	}
	// });

	cm.register({
		command: "ping",
		category: "Basic",
		desc: "Display bot information",
		handler: async (msg, { prefix }) => {
			msg.reply(
				i18n.parse(
					msg.lang,
					"basic.ping.pong",
					process.env.BUILD ? "Pang" : "Pong",
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
