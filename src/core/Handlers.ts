import { Client, Collection, Interaction, Message } from "discord.js";
import ms from "ms";
//import { MessageCommand } from "./structure/Types";
import { UserProfile, GuildProfile } from "./Profile";
import { EventMeta } from "./structure/Types";
import { argumentTransformer } from "~/services/args";

const Cooldown = new Collection<string, number>();
const client: Client = storage.client;

let prefix: string = process.env.PREFIX as string;

async function CommandHandler(msg: Message) {
	if (!client.loader?.ready ?? false) return;
	if (msg.author.bot) return;

	const p = await UserProfile(msg);
	await p.checkAndUpdate();

	const g = await GuildProfile(msg);
	await g.checkAndUpdate();

	prefix = process.env.PREFIX as string;
	msg.lang = "en";
	const mappings = client.manager.commands as Collection<
		string,
		EventMeta<"command"> //MessageCommand
	>;

	const isp = msg.content.startsWith(prefix);
	const launch = msg.content.trim().split(" ")[0].replace(prefix, "");
	const command = mappings.find(
		cmd =>
			(cmd.command === launch || (cmd.alias ?? []).includes(launch)) &&
			isp
	) as EventMeta<"command">;
	if (!command) return;
	if (command.disabled) return;
	if (command.cooldown && Cooldown.has(msg.author.id))
		return msg.channel.send(
			`You need to wait ${ms(
				Cooldown.get(msg.author.id)
			)} to use this command again!!`
		);
	const args = await argumentTransformer(
		"command",
		[
			msg,
			{
				prefix,
				p,
				g
			}
		],
		command as EventMeta
	);
	try {
		await command.handler(...(args as [Message]));
	} catch (e) {
		return msg.channel.send(
			`wawa!! something wrong happened...\n${e.message}`
		);
	}
	if (command.cooldown) {
		Cooldown.set(msg.author.id, command.cooldown);
		setTimeout(() => Cooldown.delete(msg.author.id), command.cooldown);
	}
}

async function InteractionHandler(interaction: Interaction) {
	if (!client.loader.ready) return;
	if (interaction.user.bot) return;

	const p = await UserProfile(interaction);
	await p.checkAndUpdate();

	const g = await GuildProfile(interaction);
	await g.checkAndUpdate();

	let handlers: any[] = [];
	if (interaction.isButton())
		handlers = client.manager.interactions.filter(
			v => v.type === "button" && (v.filter || (() => true))(interaction)
		);
	if (interaction.isSelectMenu())
		handlers = client.manager.interactions.filter(
			v =>
				v.type === "selectmenu" &&
				(v.filter || (() => true))(interaction)
		);
	if (interaction.isModalSubmit())
		handlers = client.manager.interactions.filter(
			v => v.type === "modal" && (v.filter || (() => true))(interaction)
		);
	for (let handler of handlers) {
		await handler.handler(interaction);
	}
}

export { CommandHandler, InteractionHandler };
