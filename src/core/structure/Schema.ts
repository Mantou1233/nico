import { langTypes } from "@services/i18n";
import { Copy } from "../Utils";

const UserSchema = {
	lang: "en",
	lastUsed: 0,
	ducks: 0
} satisfies UserSchema;

const GuildSchema = {
	lang: "en",
	prefix: process.env.PREFIX as string,
	lastUsed: 0,
	ducks: 0,
	buttonroles: {n: 0}
} satisfies GuildSchema;

interface UserSchema {
	lang: langTypes;
	lastUsed: number;
	ducks: number;
}

interface GuildSchema {
	lang: langTypes;
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
