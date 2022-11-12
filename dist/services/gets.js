"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRole = exports.getMessageId = exports.getUser = void 0;
const messageLinkRegex = /https?:\/\/?(?<sp>www\.|canary\.)?discord\.com\/channels\/(?<guild>[0-9]{17,20})\/(?<channel>[0-9]{17,20})\/(?<message>[0-9]{17,20})/;
const roleMentionRegex = /<@&(?<id>\d{17,20})>/;
const getUser = async (msg, arg) => {
    if (!arg)
        return null;
    arg = arg.toLowerCase();
    if (msg.mentions.users.first())
        return msg.mentions.users.first();
    if (!Number.isNaN(Number(arg))) {
        const fetched = await msg.client.users.fetch(arg).catch(() => null);
        if (fetched)
            return fetched;
    }
    return msg.client.users.cache.find(target => target.username.toLowerCase().startsWith(arg) ||
        target.username.toLowerCase().includes(arg) ||
        target.tag.toLowerCase().includes(arg));
};
exports.getUser = getUser;
const getMessageId = arg => {
    return messageLinkRegex.exec(arg)?.groups?.message || arg;
};
exports.getMessageId = getMessageId;
const getRole = arg => {
    return roleMentionRegex.exec(arg)?.groups?.id || arg;
};
exports.getRole = getRole;
//# sourceMappingURL=gets.js.map