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

export function emojiParser(pr: string) {
	const emojis: {
		animated: boolean;
		name: string;
		id: string;
		url: string;
		display: string;
	}[] = [];
	pr.replace(
		/<(?<animated>a)?:(?<name>\w{2,32}):(?<id>\d{17,20})>/g,
		(
			display,
			_1,
			_2,
			_3,
			_4,
			_5,
			group: {
				animated: "a" | undefined;
				name: string;
				id: string;
			}
		) =>
			void emojis.push({
				...group,
				animated: Boolean(group.animated ?? false),
				// prettier-ignore
				url: `https://cdn.discordapp.com/emojis/${group.id}.${Boolean(group.animated ?? false) ? "gif" : "png"}`,

				// prettier-ignore
				display
			}) ?? display
	);
	return emojis;
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
