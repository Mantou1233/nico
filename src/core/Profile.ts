import { GuildSchema, UserSchema } from "./structure/Schema";
const { db } = storage;

export class Profile<
	T extends { [key: string]: any } = { [key: string]: any }
> {
	__id: string;
	__prefix: string;
	__schema: T;

	constructor(id, prefix: string, schema: T) {
		this.__id = id;
		this.__schema = schema;
		this.__prefix = `${prefix}:`;
	}
	async init() {
		const data = (await db.get(`${this.__prefix}${this.__id}`)) ?? -1;
		if (data == -1) return this;
		for (const [key, value] of Object.entries(data)) {
			this[key] = value;
		}
		return this;
	}

	async check(): Promise<boolean> {
		return (await db.get(`${this.__prefix}${this.__id}`)) ? true : false;
	}

	async checkAndUpdate(): Promise<true> {
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
		if (!this.__schema) return false;
		Object.assign(this, this.__schema);
		return void this.save();
	}

	async updateSchema() {
		if (!this.__schema) return false;
		let raw = this.raw;
		Object.assign(this, this.__schema, raw);
		return this.save();
	}

	async save() {
		return (
			void (await db.set(`${this.__prefix}${this.__id}`, this.raw)) ??
			this
		);
	}

	get raw() {
		const data = JSON.parse(JSON.stringify(this));
		delete data["__id"];
		delete data["__schema"];
		delete data["__prefix"];
		return data;
	}
}

export async function GuildProfile(
	id
): Promise<Profile<UserSchema> & { [K in keyof GuildSchema]: GuildSchema[K] }> {
	return (await new Profile<GuildSchema>(
		id?.guild?.id ?? id,
		"guild",
		GuildSchema
	).init()) as unknown as Profile<UserSchema> & {
		[K in keyof GuildSchema]: GuildSchema[K];
	};
}

export async function UserProfile(
	id
): Promise<Profile<UserSchema> & { [K in keyof UserSchema]: UserSchema[K] }> {
	return (await new Profile<UserSchema>(
		id?.author?.id ?? id?.user?.id ?? id,
		"user",
		UserSchema
	).init()) as unknown as Profile<UserSchema> & {
		[K in keyof UserSchema]: UserSchema[K];
	};
}
