import { Message } from "discord.js";
import { EventMeta, Events } from "~/core/structure/Types";

export async function argumentTransformer<
	K extends Exclude<keyof Events, "any" | "unknown">
>(type: K, origin: any[], handler: EventMeta<K>) {
	const _args: any[] = [];
	let i = 0;
	for (let { transformer, args } of handler.args || [
		{
			transformer: (or, ext) => or,
			args: []
		},
		{
			transformer: (or, ext) => ext,
			args: []
		}
	]) {
		_args[i++] = await transformer(...origin, ...args);
	}
	return _args;
}
