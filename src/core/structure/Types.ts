import { Message, Interaction } from "discord.js";
import { Awaitable } from "../Utils";

interface Events {
	unknown: {
		params: [];
	};
	any: {
		params: [];
	};
	command: {
		command?: string;
		disabled?: boolean;
		cooldown?: number;
		alias?: string[];
		params: [msg: Message, ext: any];
	};
	interaction: {
		type: "button" | "selection" | "modal" | "autocomplete";
		params: [interaction: Interaction, ext: any];
	};
}

type EventMeta<K extends keyof Events = "unknown"> = {
	__type__: K extends "unknown" ? any : K;
	from: string;
	at: string;
	handler: (...args: Events[K]["params"]) => Awaitable<any>;
} & Omit<Events[K], "params">;
type RawEventMeta<K extends keyof Events = "unknown"> = Omit<
	Events[K],
	"params"
>;

interface PluginMeta {
	name?: string;
}

// prettier-ignore
export type { 
	Events,

	RawEventMeta,
	EventMeta,
	
	PluginMeta
};
