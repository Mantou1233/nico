import { Message } from "discord.js";
import { EventMeta, Events } from "~/core/structure/Types";

export function argumentTransformer<
	K extends Exclude<keyof Events, "any" | "unknown">
>(type: K, origin: any[], handler: EventMeta<K>) {
	if (!handler.args) return origin;
	const _args: any[] = [];
	let i = 0;
	for (let { transformer, args } of handler.args) {
		_args[i++] = transformer(...origin, ...args);
	}
	return _args;
}
