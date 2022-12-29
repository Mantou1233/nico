export function argumentParser(msg, mode = false) {
	if (mode) return modernArgumentParser(msg);
	return [...msg.matchAll(/(?<=^| )("?)(.+?)\1(?= |$)/g)].map(match =>
		match[0].replaceAll('"', "")
	);
}

export function modernArgumentParser(msg) {
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

const __ap = argumentParser.bind(null) as Ap;
__ap.modern = modernArgumentParser.bind(null);

global.ap = __ap as Ap;

export interface Ap {
	(msg: string): string[];
	/**
	 * @deprecated use `ap.modern` instead.
	 */
	(msg: string, mode: boolean): string[];
	modern(msg: string): string[];
}