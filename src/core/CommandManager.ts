import { TypedEmitter } from "tiny-typed-emitter";
import { Collection, Client, ClientEvents } from "discord.js";

import type { Command } from "./structure/Types";
import { Copy } from "./Utils";

type ToSignature<T extends Record<string, any[]>> = {
	[K in keyof T]: (...args: T[K]) => any;
};

class CommandManager extends TypedEmitter<
	ToSignature<Copy<Pick<ClientEvents, "interactionCreate">>>
> {
	client: Client;
	commands = new Collection<string, Command>();

	constructor(client) {
		super();
		this.client = client;
	}

	register(cmd: Command) {
		if (this.commands.get(cmd.command) !== undefined)
			throw new Error("Naming conflict!");
		this.commands.set(cmd.command, {
			disabled: false,
			hidden: false,
			from: global.loading as string,
			category: "Basic",
			desc: "",
			usage: `%p${cmd.command}`,
			...cmd
		});
	}
}

export default CommandManager;
