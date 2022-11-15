"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emojiParser = exports.flagParser = void 0;
function argumentParser(msg, mode = false, flags = []) {
    if (mode) {
        let temp = msg.split(/ +/);
        temp.shift();
        return [msg.split(/ +/)[0], temp.join(" ")];
    }
    return [...msg.matchAll(/(?<=^| )("?)(.+?)\1(?= |$)/g)].map(match => match[0].replaceAll('"', ""));
}
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
function emojiParser(pr) {
    const emojis = [];
    pr.replace(/<(?<animated>a)?:(?<name>\w{2,32}):(?<id>\d{17,20})>/g, (display, _1, _2, _3, _4, _5, group) => void emojis.push({
        ...group,
        animated: Boolean(group.animated ?? false),
        // prettier-ignore
        url: `https://cdn.discordapp.com/emojis/${group.id}.${Boolean(group.animated ?? false) ? "gif" : "png"}`,
        // prettier-ignore
        display
    }) ?? display);
    return emojis;
}
exports.emojiParser = emojiParser;
global.ap = argumentParser;
//# sourceMappingURL=ap.js.map