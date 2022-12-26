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
	};
	interaction: {
		type: "button" | "selectmenu" | "modal";
		filter?: (interaction: Interaction) => boolean;
	};
}

type EventMeta<K extends keyof Events = "unknown"> = {
	__type__: K extends "unknown" ? any : K;
	from: string;
	at: string;
	args:
		| {
				transformer: (...arg) => any;
				args: any[];
		  }[]
		| undefined;
	handler: (...args: any) => Awaitable<any>;
} & Events[K];
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
