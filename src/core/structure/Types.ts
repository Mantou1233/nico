import { Message, Interaction } from "discord.js";
import { Awaitable } from "../Utils";

interface RawMessageHandler {
	from?: string;
	handler: (message: Message, ext: any) => Awaitable<void | any>;
}

interface MessageCommand extends RawMessageHandler {
	display?: string;
	command: string;
	force?: boolean;
	refer?: string;
	desc?: string;
	usage?: string;
	cooldown?: number;
	category?: string;
	alias?: string[];
	alias2?: string[];
	disabled?: boolean;
	hidden?: boolean;
}

interface InteractionContext<T extends Interaction = Interaction> {
	type: "button" | "messageContext" | "userContext" | "selectMenu" | "modal";
	from?: string;
	handler: (interaction: T, ext: any) => Awaitable<void | any>;
}

export type { MessageCommand, InteractionContext, RawMessageHandler };
