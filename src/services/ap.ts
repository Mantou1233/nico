import { memo } from "./fn";

const oldAP = memo(oldArgumentParser);
const newAP = memo(modernArgumentParser);

export function argumentParser(msg, mode = false) {
	if (mode) return oldAP(msg);
	else return newAP(msg);
}

export function modernArgumentParser(msg) {
	return [...msg.matchAll(/(?<=^| )("?)(.+?)\1(?= |$)/g)].map(match =>
		match[0].replaceAll('"', "")
	);
}

export function oldArgumentParser(msg) {
	let temp = msg.split(/ +/);
	temp.shift();
	return [msg.split(/ +/)[0], temp.join(" ")];
}

export function flagParser(args, options) {
	const flags = {};
	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		const flag =
			Object.keys(options).filter(
				str => arg === `--${str}` || arg === `-${str[0]}`
			)[0] ?? false;
		if (flag) {
			flags[flag] = options[flag](args, i);
		}
	}
	return flags;
}

const __ap = argumentParser.bind(null) as TAp;
__ap.old = oldAP.bind(null);

global.ap = __ap as TAp;

export interface TAp {
	(msg: string): string[];
	/**
	 * @deprecated use `ap.old` instead.
	 */
	(msg: string, mode: boolean): string[];
	old(msg: string): string[];
}
