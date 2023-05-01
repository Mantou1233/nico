import fs from "fs";
import { SourceMapConsumer } from "source-map-js";
import { inspect } from "util";

// you should not call the logs in this function or it will omit it!

const logColors = {
	log: "\x1b[38;5;15m",
	info: "\x1b[38;5;214m",
	success: "\x1b[38;5;10m",
	error: "\x1b[38;5;9m",
	warn: "\x1b[38;5;228m",
	event: "\x1b[38;5;123m",
	debug: "\x1b[38;5;213m"
} as const;

const extraColors = {
	timestamp: "\u001b[34;1m",
	logType: "\u001b[34;1m",
	fileName: "\u001b[36;1m",

	reset: "\u001b[0m"
};

type Traceable = {
	filename: string | null;
	line: number | null;
	column: number | null;
};

export type logTypes = keyof typeof logColors;

export function createLogger(name: string) {
	function logger(type: keyof typeof logColors, ...args: any[]) {
		let text = "";
		for (let arg of args) {
			if (text !== "") text += " ";
			if (typeof arg !== "object") text += arg;
			else {
				text += inspect(arg, {
					depth: 2,
					colors: false
				});
			}
		}
		if (!Object.keys(logColors).includes(type.toLowerCase())) throw new Error("invaild type.");

		const [time, date] = getDates();
		const file = getTSTrace(getFileTrace());
		console.log(
			`${extraColors.logType}(${name})${extraColors.reset} ${extraColors.timestamp}[${time}]${extraColors.reset} - ${extraColors.logType}[${type}]${
				extraColors.reset
			} ~ ${extraColors.fileName}[${file.filename!.split(/[\\/]/).pop()}]${extraColors.reset} ${logColors[type]}${text}${extraColors.reset}`
		);
		writeLog(`(${name}) [${time}] - [${type}] ~ ${file.filename}:${file.line}:${file.column} > ${text}\n`, date);
	}
	function writeLog(content: string, date = getDates()[1]) {
		if (!fs.existsSync("./logs")) {
			fs.mkdirSync("./logs");
		}
		fs.writeFileSync(`./logs/${date}.log`, content, { flag: "a+" });
	}
	logger.writeLog = writeLog;
	for (let key of Object.keys(logColors) as (keyof typeof logColors)[]) {
		logger[key] = logger.bind(null, key);
	}
	return logger;
}

function getFileTrace(): Traceable {
	let _pst = Error.prepareStackTrace;
	Error.prepareStackTrace = function (_err, stack) {
		return stack;
	};
	const err = new Error();
	const stacks = (<any>err.stack) as NodeJS.CallSite[];
	Error.prepareStackTrace = _pst;
	for (let stack of stacks) {
		if (__filename === stack.getFileName()) {
			continue;
		}
		return stack
			? {
					filename: stack.getFileName(),
					line: stack.getLineNumber(),
					column: stack.getColumnNumber()
			  }
			: {
					filename: "?.js",
					line: -1,
					column: -1
			  };
	}
	return {
		filename: "?.js",
		line: -1,
		column: -1
	};
}

function getTSTrace(file: Traceable): Traceable {
	if (!file.line || !file.column || file.filename == "?.js" || !file.filename) return file;
	if (fs.existsSync(`${file.filename}.map`)) {
		let result;
		try {
			result = JSON.parse(
				fs.readFileSync(`${file.filename}.map`, {
					encoding: "utf-8"
				})
			);

			const originPos = new SourceMapConsumer(result).originalPositionFor({
				line: file.line,
				column: file.column
			});

			return {
				filename: `${file.filename?.split("/dist")[0]}/${originPos.source.replaceAll("../", "")}`,
				line: originPos.line,
				column: originPos.column
			};
		} catch {
			return file;
		}
	} else return file;
}

function getDates(date: Date = new Date()) {
	return [
		date.toISOString().replace("T", " ").replace("Z", "").split(".")[0],
		`${date.getDay().toString().padStart(2, "0")}-${date.getMonth().toString().padStart(2, "0")}-${date.getFullYear().toString().replace("20", "")}`
	];
}