"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildSchema = exports.UserSchema = void 0;
const UserSchema = {
    lang: "en",
    lastUsed: 0,
    ducks: 0
};
exports.UserSchema = UserSchema;
const GuildSchema = {
    lang: "en",
    prefix: process.env.PREFIX,
    lastUsed: 0,
    ducks: 0,
    buttonroles: { n: 0 }
};
exports.GuildSchema = GuildSchema;
//# sourceMappingURL=Schema.js.map