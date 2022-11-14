
import { Copy } from "../Utils";

const UserSchema = {
	lastUsed: 0,
	ducks: 0
} satisfies UserSchema;

const GuildSchema = {
	prefix: process.env.PREFIX as string,
	lastUsed: 0,
	ducks: 0,
	buttonroles: {n: 0}
} satisfies GuildSchema;

interface UserSchema {
	lastUsed: number;
	ducks: number;
}

interface GuildSchema {
	prefix: string;
	lastUsed: number;
	ducks: number;
	buttonroles: {
		[K: number]: {
			id: string,
			add: string,
			remove: string
		}
	} & {n: number};
}

export { UserSchema, GuildSchema };
