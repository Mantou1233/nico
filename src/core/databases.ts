import { Message } from "discord.js";
import lodash from "lodash";
import { GuildSchema, UserSchema } from "./structure/Schema";

const { db } = storage;

export class Profile<
	T extends { [key: string]: any } = { [key: string]: any }
> {
	__id: string;
	prefix: string;
	schema: T;

	constructor(id, prefix: string, schema: T) {
		this.__id = id;
		this.schema = schema;
		this.prefix = `${prefix}:`;
	}
	async init() {
		const data = (await db.get(`${this.prefix}${this.__id}`)) ?? -1;
		if (data == -1) return this;
		for (const [key, value] of Object.entries(data)) {
			this[key] = value;
		}
		return this;
	}

	async check(): Promise<boolean> {
		return (await db.get(`${this.prefix}${this.__id}`)) ? true : false;
	}

	get db() {
		return db;
	}

	async newSchema(initType = "user") {
		if (!this.schema) return false;
		Object.assign(this, this.schema);
		return void this.save();
	}

	async updateSchema() {
		if (!this.schema) return false;
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

export async function GuildProfile(
	id
): Promise<Profile<UserSchema> & { [K in keyof GuildSchema]: GuildSchema[K] }> {
	return (await new Profile<GuildSchema>(
		id instanceof Message ? id.guild?.id : id,
		"guild:",
		GuildSchema
	).init()) as Profile<UserSchema> & {
		[K in keyof GuildSchema]: GuildSchema[K];
	};
}

export async function UserProfile(
	id
): Promise<Profile<UserSchema> & { [K in keyof UserSchema]: UserSchema[K] }> {
	return (await new Profile<UserSchema>(
		id instanceof Message ? id.author.id : id,
		"user",
		UserSchema
	).init()) as Profile<UserSchema> & {
		[K in keyof UserSchema]: UserSchema[K];
	};
}
