import { TypedEmitter } from "tiny-typed-emitter";
import {
	Collection,
	Client,
	ButtonInteraction,
	SelectMenuInteraction,
	ModalSubmitInteraction
} from "discord.js";

import type { EventMeta } from "./structure/Types";
import { Copy } from "./Utils";

type ToSignature<T extends Record<string, any[]>> = {
	[K in keyof T]: (...args: T[K]) => any;
};

class Manager {
	nowLoading: string | number = -1;
	client: Client;
	commands = new Collection<string, EventMeta<"command">>();
	interactions: EventMeta<"interaction">[] = [];

	constructor(client) {
		this.client = client;
	}

	register(ctx: EventMeta<"interaction"> | EventMeta<"command">): void;
	register(ctx): void {
		if (ctx.__type__ == "command") {
			delete ctx["__type__"];
			if (this.commands.has(ctx.command))
				throw new Error("Naming conflict!");
			this.commands.set(ctx.command, {
				disabled: false,
				hidden: false,
				from: this.nowLoading as unknown as string,
				category: "Basic",
				desc: "",
				usage: `%p${ctx.command}`,
				...ctx
			});
		} else {
			this.interactions.push({
				type: "none",
				from: this.nowLoading as unknown as string,
				...ctx
			});
		}
	}
}

export default Manager;
