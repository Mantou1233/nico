import ms from "ms";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Client,
	ComponentType,
	Embed,
	EmbedBuilder,
	Message,
	SortOrderType,
	User
} from "discord.js";

import axios from "axios";

import Manager from "~/core/Manager";
import { pagination } from "~/services/pagination";
import { makeFetch } from "~/services/makeFetch";
import removeMd from "~/services/removeMd";

type Stats = [
	[
		tps: `${number}.${number}`,
		playercount: `${number}`,
		queue: `${number}`,
		idktbh: boolean
	],
	PlayerStats
];

export interface PlayerStats {
	[key: string]: PlayerStatsInfo;
}

export interface PlayerStatsInfo {
	cooldown: number;
	uuid: string;
	spamscore: number;
	playtime: number;
}

/**
 * @returns void
 */
async function load(client: Client, cm: Manager) {
	cm.register({
		command: "status",
		category: "2b2t",
		desc: "get 2b2t's server status",
		handler: async msg => {
			const [base, players] = await makeFetch<Stats>(
				"https://api.2b2t.dev/status"
			);
			const [rc, prio, expt] = await makeFetch<[number, number, number]>(
				"https://api.2b2t.dev/prioq"
			);
			const but = new ButtonBuilder()
				.setCustomId("2bstatus/viewp")
				.setLabel("点我查看在线玩家列表")
				.setStyle(ButtonStyle.Primary);
			const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
				but
			);

			const msg2 = await msg.reply({
				embeds: [
					new EmbedBuilder()
						.setConfig()
						.setTitle("2b2t服務器信息")
						.addField(
							"信息",
							`\`\`\`yml\nTPS: ${base[0] || "N/A"}\n在线人数: ${
								base[1] || "N/A"
							}\n运行时间：${base[3] || "N/A"}\`\`\``,
							true
						)
						.addField(
							"队列",
							`\`\`\`yml\n优先: ${prio} (${ms(
								Date.now() - rc
							)} ago)\n预计排队时间: ${
								(expt || "N/A") === "N/A" ? "N/A" : ms(expt)
							}\n\n普通: ${base[2]}\n预计排队时间: N/A\`\`\``,
							true
						)
				],
				components: [row]
			});

			const collector = msg2.createMessageComponentCollector({
				componentType: ComponentType.Button,
				time: 15000
			});

			collector.on("collect", b => {
				if (b.user.id !== msg.author.id)
					return void b.reply({
						content: "不要乱按 >_<",
						ephemeral: true
					});
				let index = -1,
					embeds: EmbedBuilder[] = [];
				Object.entries(players[0])
					.sort()
					.forEach(([k], ix) => {
						if (ix % 10 == 0) {
							index++;
							embeds[index] = new EmbedBuilder().setTitle(
								"玩家列表"
							);
						}
						embeds[index].setDescription(
							(embeds[index].data.description || "") +
								`\n${removeMd(k)}`
						);
					});
				b.reply({
					ephemeral: true,
					content: "已开启"
				});
				collector.stop();
				pagination(msg, embeds, {
					footer: "nico nico ni!!"
				});
			});
			collector.on("end", () => {
				but.setDisabled(true);
				row.setComponents(but);
				msg2.edit({
					components: [row]
				});
			});
		}
	});
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
