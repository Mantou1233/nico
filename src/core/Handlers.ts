import { Client, Collection, Interaction, Message } from "discord.js";
import ms from "ms";
import { MessageCommand } from "./structure/Types";
import { flagParser } from "@services/ap";
import Parsers from "@services/parsers";
import { UserProfile, GuildProfile } from "./Profile";

const Cooldown = new Collection<string, number>();
const client: Client = storage.client;

let prefix: string = process.env.PREFIX as string;

async function CommandHandler(msg: Message) {
	if (msg.author.bot) return;

	const p = await UserProfile(msg);
	await p.checkAndUpdate();

	const g = await GuildProfile(msg);
	await g.checkAndUpdate();

	prefix = g.prefix ?? (process.env.PREFIX as string);
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
		handlers = client.manager.interactions.filter(
			v => v.type === "button" && (v.filter ?? (() => true))(interaction)
		);
	if (interaction.isSelectMenu())
		handlers = client.manager.interactions.filter(
			v =>
				v.type === "selectMenu" &&
				(v.filter ?? (() => true))(interaction)
		);
	if (interaction.isModalSubmit())
		handlers = client.manager.interactions.filter(
			v => v.type === "modal" && (v.filter ?? (() => true))(interaction)
		);
	if (interaction.isMessageContextMenuCommand())
		handlers = client.manager.interactions.filter(
			v => v.type === "messageContext" && (v.filter ?? (() => true))(interaction)
		);
	if (interaction.isUserContextMenuCommand())
		handlers = client.manager.interactions.filter(
			v =>
				v.type === "userContext" &&
				(v.filter ?? (() => true))(interaction)
		);
	for (let handler of handlers) {
		handler.handler(interaction);
	}
}

export { CommandHandler, InteractionHandler };
