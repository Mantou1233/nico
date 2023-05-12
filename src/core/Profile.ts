import z, { ZodSchema, string} from "zod";
import {  UserSchema } from "./structure/Schema";
import { Copy } from "./Utils";
import { User } from "discord.js";
const { db } = storage;

// export class Profile<
// 	T extends { [key: string]: any } = { [key: string]: any }
// > {
// 	__id: string;
// 	__prefix: string;
// 	__schema: ZodSchema<T>;

// 	constructor(id, prefix: string, schema: ZodSchema<T>) {
// 		this.__id = id;
// 		this.__schema = schema;
// 		this.__prefix = `${prefix}:`;
// 	}
// 	async init() {
// 		const data = (await db.get(`${this.__prefix}${this.__id}`)) ?? -1;
// 		if (data == -1) return this;
// 		for (const [key, value] of Object.entries(data)) {
// 			this[key] = value;
// 		}
// 		return this;
// 	}

// 	async check(): Promise<boolean> {
// 		return (await db.get(`${this.__prefix}${this.__id}`)) ? true : false;
// 	}

// 	async checkAndUpdate(): Promise<true> {
// 		if (!(await this.check())) {
// 			await this.newSchema();
// 		}
// 		this.updateSchema();
// 		return true;
// 	}

// 	get db() {
// 		return db;
// 	}

// 	async newSchema(initType = "user") {
// 		if (!this.__schema) return false;
// 		for(let thisKey of Object.keys(this) as keyof this)
// 		this.__schema.parse()
// 		return void this.save();
// 	}

// 	async updateSchema() {
// 		if (!this.__schema) return false;
// 		let raw = this.raw;
// 		Object.assign(this, this.__schema, raw);
// 		return this.save();
// 	}

// 	async save() {
// 		const data = JSON.parse(JSON.stringify(this));
// 		delete data["__id"];
// 		delete data["__schema"];
// 		delete data["__prefix"];
// 		return (
// 			void (await db.set(`${this.__prefix}${this.__id}`, data)) ?? this
// 		);
// 	}

// 	get raw() {
// 		const data = JSON.parse(JSON.stringify(this));
// 		delete data["__id"];
// 		delete data["__schema"];
// 		delete data["__prefix"];
// 		return data;
// 	}
// }

// export async function GuildProfile(
// 	id
// ): Promise<Profile<UserSchema> & { [K in keyof GuildSchema]: GuildSchema[K] }> {
// 	return (await new Profile<GuildSchema>(
// 		id?.guild?.id ?? id,
// 		"guild",
// 		GuildSchema
// 	).init()) as unknown as Profile<UserSchema> & {
// 		[K in keyof GuildSchema]: GuildSchema[K];
// 	};
// }

// export async function UserProfile(
// 	id
// ): Promise<Profile<UserSchema> & { [K in keyof UserSchema]: UserSchema[K] }> {
// 	return (await new Profile<UserSchema>(
// 		id?.author?.id ?? id?.user?.id ?? id,
// 		"user",
// 		UserSchema
// 	).init()) as unknown as Profile<UserSchema> & {
// 		[K in keyof UserSchema]: UserSchema[K];
// 	};
// }

const createDBAccessor = (id: string, prefix: string) => {
	return {
		get: async () => {
			return await db.get(`${prefix}:${id}`)
		},
		set: async (data) => {
			return await db.set(`${prefix}:${id}`, data)
		},
		has: async () => {
			return await db.has(`${prefix}:${id}`)
		}
	}
}


const createSchema = <T extends Record<any, any>>(schema: ZodSchema, prefix: string) => {
	const profile = async (id: string): Promise<ProfileImpl<T>> => {
		const dbA = createDBAccessor(id, prefix);
		let dt: any = {};

		if(await dbA.has()) {
			dt = await dbA.get();
			const parseResult = schema.safeParse(dt);

			if(parseResult.success) {
				dt = parseResult.data;
			}
			else {
				logger.error(`entry "${prefix}:${id}" has type error! logging JSON to log...`);
				logger.writeLog(JSON.stringify(dt));
				dt = schema.safeParse({});
			}
		} else dt = schema.safeParse({});
		

		const save = () => {
			dbA.set(dt);
		}
		
		return <ProfileImpl<T>>(new Proxy(dt, {
			get: (_obj, key) => {
				switch (key) {
					case "raw":
						return dt;
						break;
						
					case "save":
						return save;	
						break;

					case "db":
						return db;
						break;
					
					default:
						return dt[key];
						break;
				}
			},
			set(_obj, key, value) {
				switch (key) {
					case "raw":
					case "save":
					case "db":
						return false
						break;
					
					default:
						dt[key] = value;
						return true;
						break;
				}
				
			},
		}))
	};
	return profile
}
type ProfileImpl<T> = Copy<T & {
	save: () => ProfileImpl<T>;
}>

export const UserProfile = createSchema<z.infer<typeof UserSchema>>(UserSchema, "user");