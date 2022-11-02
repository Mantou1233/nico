import {
	Client,
	Collection,
	Message,
	Guild,
	TextChannel,
	GuildChannelManager
} from "discord.js";
import ms from "ms";
import { Command } from "./structure/Types";
import { langs } from "./../services/i18n";
import { flagParser } from "./../services/ap";
import Parsers from "./../services/parsers";

const Cooldown = new Collection<string, number>();

const prefix = process.env.PREFIX as string;

async function HandleCommands(client: Client, msg: Message) {
	if (msg.author.bot) return;

	msg.lang = "en";
	//msg.lang = p.lang as keyof typeof langs;
	const mappings = client.manager.commands as Collection<string, Command>;

	const isp = msg.content.startsWith(prefix);
	const launch = msg.content.trim().split(" ")[0].replace(prefix, "");
	const command = mappings.find(
		cmd =>
			((cmd.command === launch || (cmd.alias ?? []).includes(launch)) &&
				isp) ||
			(cmd.alias2 ?? []).includes(launch)
	) as Command;
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

export default HandleCommands;
