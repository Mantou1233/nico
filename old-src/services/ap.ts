function argumentParser(msg, mode = false, flags = []) {
	if (mode) {
		let temp = msg.split(/ +/);
		temp.shift();
		return [msg.split(/ +/)[0], temp.join(" ")];
	}
	return [...msg.matchAll(/(?<=^| )("?)(.+?)\1(?= |$)/g)].map(match =>
		match[0].replaceAll('"', "")
	);
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

global.ap = argumentParser;