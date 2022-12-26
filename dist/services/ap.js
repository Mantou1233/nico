"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flagParser = exports.modernArgumentParser = exports.argumentParser = void 0;
function argumentParser(msg, mode = false) {
    if (mode)
        return modernArgumentParser(msg);
    return [...msg.matchAll(/(?<=^| )("?)(.+?)\1(?= |$)/g)].map(match => match[0].replaceAll('"', ""));
}
exports.argumentParser = argumentParser;
function modernArgumentParser(msg) {
    let temp = msg.split(/ +/);
    temp.shift();
    return [msg.split(/ +/)[0], temp.join(" ")];
}
exports.modernArgumentParser = modernArgumentParser;
function flagParser(args, options) {
    const flags = {};
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        const flag = Object.keys(options).filter(str => arg === `--${str}` || arg === `-${str[0]}`)[0] ?? false;
        if (flag) {
            flags[flag] = options[flag](args, i);
        }
    }
    return flags;
}
exports.flagParser = flagParser;
const __ap = argumentParser.bind(null);
__ap.modern = modernArgumentParser.bind(null);
global.ap = __ap;
//# sourceMappingURL=ap.js.map