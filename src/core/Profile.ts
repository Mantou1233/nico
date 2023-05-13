import z, { ZodSchema } from "zod";
import { UserSchema } from "./structure/Schema";
import { Copy } from "./Utils";
import { Database } from "quickmongo";
const { db } = storage;

const createDBAccessor = (id: string, prefix: string) => {
	return {
		get: async () => {
			return await db.get(`${prefix}:${id}`);
		},
		set: async data => {
			return await db.set(`${prefix}:${id}`, data);
		},
		has: async () => {
			return await db.has(`${prefix}:${id}`);
		}
	};
};

const createSchema = <T extends Record<any, any>>(
	schema: ZodSchema,
	prefix: string
) => {
	const profile = async (id: string): Promise<ProfileImpl<T>> => {
		const dbA = createDBAccessor(id, prefix);
		let dt: any = {};

		if (await dbA.has()) {
			dt = await dbA.get();
			const parseResult = schema.safeParse(dt);

			if (parseResult.success) {
				dt = parseResult.data;
			} else {
				logger.error(
					`entry "${prefix}:${id}" has type error! logging JSON to log...`
				);
				logger.writeLog(JSON.stringify(dt));
				dt = schema.safeParse({});
			}
		} else dt = schema.safeParse({});

		const save = () => {
			dbA.set(dt);
		};

		return <ProfileImpl<T>>new Proxy(dt, {
			get: (_obj, key) => {
				switch (key) {
					case "raw":
						const raw: any = (schema.safeParse(dt) as any).data;
						return raw ? raw : dt;
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
						return false;
						break;

					default:
						dt[key] = value;
						return true;
						break;
				}
			}
		});
	};
	return profile;
};
type ProfileImpl<T> = Copy<
	T & {
		save: () => ProfileImpl<T>;
		raw: T;
		db: Database;
	}
>;

export const UserProfile = createSchema<z.infer<typeof UserSchema>>(
	UserSchema,
	"user"
);
export const GuildProfile = createSchema<z.infer<typeof UserSchema>>(
	UserSchema,
	"user"
);
