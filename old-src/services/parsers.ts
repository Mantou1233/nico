export class Parser {
	Boolean() {
		return true;
	}
	Next(args, i) {
		return !args[i + 1].startsWith("-") ? args[i + 1] : undefined;
	}
}

export default new Parser();
