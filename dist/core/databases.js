"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfile = exports.GuildProfile = exports.Profile = void 0;
const discord_js_1 = require("discord.js");
const Schema_1 = require("./structure/Schema");
const { db } = storage;
class Profile {
    __id;
    prefix;
    schema;
    constructor(id, prefix, schema) {
        this.__id = id;
        this.schema = schema;
        this.prefix = `${prefix}:`;
    }
    async init() {
        const data = (await db.get(`${this.prefix}${this.__id}`)) ?? -1;
        if (data == -1)
            return this;
        for (const [key, value] of Object.entries(data)) {
            this[key] = value;
        }
        return this;
    }
    async check() {
        return (await db.get(`${this.prefix}${this.__id}`)) ? true : false;
    }
    get db() {
        return db;
    }
    async newSchema(initType = "user") {
        if (!this.schema)
            return false;
        Object.assign(this, this.schema);
        return void this.save();
    }
    async updateSchema() {
        if (!this.schema)
            return false;
        let raw = this.raw;
        Object.assign(this, this.schema, raw);
        return this.save();
    }
    async save() {
        const data = JSON.parse(JSON.stringify(this));
        delete data["__id"];
        delete data["schema"];
        delete data["prefix"];
        return void (await db.set(`${this.prefix}${this.__id}`, data)) ?? this;
    }
    get raw() {
        const data = JSON.parse(JSON.stringify(this));
        delete data["__id"];
        delete data["schema"];
        delete data["prefix"];
        return data;
    }
}
exports.Profile = Profile;
async function GuildProfile(id) {
    return (await new Profile(id instanceof discord_js_1.Message ? id.guild?.id : id, "guild:", Schema_1.GuildSchema).init());
}
exports.GuildProfile = GuildProfile;
async function UserProfile(id) {
    return (await new Profile(id instanceof discord_js_1.Message ? id.author.id : id, "user", Schema_1.UserSchema).init());
}
exports.UserProfile = UserProfile;
//# sourceMappingURL=databases.js.map