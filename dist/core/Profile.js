"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfile = exports.GuildProfile = exports.Profile = void 0;
const Schema_1 = require("./structure/Schema");
const { db } = storage;
class Profile {
    __id;
    __prefix;
    __schema;
    constructor(id, prefix, schema) {
        this.__id = id;
        this.__schema = schema;
        this.__prefix = `${prefix}:`;
    }
    async init() {
        const data = (await db.get(`${this.__prefix}${this.__id}`)) ?? -1;
        if (data == -1)
            return this;
        for (const [key, value] of Object.entries(data)) {
            this[key] = value;
        }
        return this;
    }
    async check() {
        return (await db.get(`${this.__prefix}${this.__id}`)) ? true : false;
    }
    async checkAndUpdate() {
        if (!(await this.check())) {
            await this.newSchema();
        }
        this.updateSchema();
        return true;
    }
    get db() {
        return db;
    }
    async newSchema() {
        if (!this.__schema)
            return false;
        Object.assign(this, this.__schema);
        return void this.save();
    }
    async updateSchema() {
        if (!this.__schema)
            return false;
        let raw = this.raw;
        Object.assign(this, this.__schema, raw);
        return this.save();
    }
    async save() {
        return (void (await db.set(`${this.__prefix}${this.__id}`, this.raw)) ??
            this);
    }
    get raw() {
        const data = JSON.parse(JSON.stringify(this));
        delete data["__id"];
        delete data["__schema"];
        delete data["__prefix"];
        return data;
    }
}
exports.Profile = Profile;
async function GuildProfile(id) {
    return (await new Profile(id?.guild?.id ?? id, "guild", Schema_1.GuildSchema).init());
}
exports.GuildProfile = GuildProfile;
async function UserProfile(id) {
    return (await new Profile(id?.author?.id ?? id?.user?.id ?? id, "user", Schema_1.UserSchema).init());
}
exports.UserProfile = UserProfile;
//# sourceMappingURL=Profile.js.map