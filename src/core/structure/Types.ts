import { Message } from "discord.js";
import { langs } from "./../../services/i18n";
import { Awaitable } from "../Utils";
import { Parser } from "./../../services/parsers";

type OverrideLangString<T> = {
	[key in keyof typeof langs]?: T;
};
type snowflake = string;
interface Command {
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
	from?: string;
	handler: (message: Message, ext: any) => Awaitable<void | any>;
}

export type { Command, Message };
