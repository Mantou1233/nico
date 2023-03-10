import {
	Client,
	Collection,
	EmbedBuilder,
	Interaction,
	Message
} from "discord.js";
import ms from "ms";
import { MessageCommand } from "./structure/Types";
import { flagParser } from "@services/ap";
import Parsers from "@services/parsers";
import { UserProfile, GuildProfile } from "./Profile";
import NanaApi from "@lordzagreus/nana-api-cf";
const nana = new NanaApi();

const Cooldown = new Collection<string, number>();
const client: Client = storage.client;

let prefix: string;

async function idkTbh(msg: Message) {
	if (msg.channelId !== "981378087646285864") return false;
	const match = /#[0-9]{1,6}/.exec(msg.content);
	if (!match) return false;
	const n = parseInt(match[0].slice(1));
	const rst = await nana.g(n);
	if (!rst) return false;
	else {
		msg.reply({
			embeds: [
				new EmbedBuilder().setTitle(rst.title.pretty).setDescription(
					`page: ${rst.num_pages}\ntags: ${rst.tags
						.filter(v => v.type == "tag")
						.map(v => `\`${v.name}\``)
						.join(",")}`
				)
			]
		});
		return true;
	}
	return false;
}

async function CommandHandler(msg: Message) {
	if (msg.author.bot) return;
	if (await idkTbh(msg)) return;

	const p = await UserProfile(msg);
	await p.checkAndUpdate();

	const g = await GuildProfile(msg);
	await g.checkAndUpdate();

	prefix = process.env.FORCE_PREFIX! || g.prefix || process.env.PREFIX!;
	msg.lang = p.lang ?? "en";
	const mappings = client.manager.commands as Collection<
		string,
		MessageCommand
	>;

	const isp = msg.content.startsWith(prefix);
	const launch = msg.content.trim().split(" ")[0].replace(prefix, "");
	const command = mappings.find(
		cmd =>
			((cmd.command === launch || (cmd.alias ?? []).includes(launch)) &&
				isp) ||
			(cmd.alias2 ?? []).includes(launch)
	) as MessageCommand;
	if (!command) return;
	if (command.disabled) return;
	if (command.cooldown && Cooldown.has(msg.author.id))
		return msg.channel.send(
			i18n
				.parse(msg.lang, "command.run.cooldown")
				.replaceAll("%s", `${ms(Cooldown.get(msg.author.id))}`)
		);

	const flags = flagParser(ap(msg.content), {
		dout: Parsers.Boolean
	});
	try {
		await command.handler(msg, {
			prefix
		});
	} catch (e) {
		if (flags["dout"]) console.log(e);
		return msg.channel.send(
			i18n
				.parse(msg.lang, "command.run.error")
				.replaceAll("%s", `${e.message}`)
		);
	}
	if (command.cooldown) {
		Cooldown.set(msg.author.id, command.cooldown);
		setTimeout(() => Cooldown.delete(msg.author.id), command.cooldown);
	}
}

async function InteractionHandler(interaction: Interaction) {
	const p = await UserProfile(interaction);
	await p.checkAndUpdate();

	const g = await GuildProfile(interaction);
	await g.checkAndUpdate();

	let handlers: any[] = [];
	if (interaction.isButton())
		handlers = client.manager.interactions.filter(v => v.type === "button");
	if (interaction.isSelectMenu())
		handlers = client.manager.interactions.filter(
			v => v.type === "selectMenu"
		);
	if (interaction.isModalSubmit())
		handlers = client.manager.interactions.filter(v => v.type === "modal");
	if (interaction.isMessageContextMenuCommand())
		handlers = client.manager.interactions.filter(
			v => v.type === "messageContext"
		);
	if (interaction.isUserContextMenuCommand())
		handlers = client.manager.interactions.filter(
			v => v.type === "userContext"
		);
	for (let handler of handlers) {
		handler.handler(interaction);
	}
}

export { CommandHandler, InteractionHandler };
