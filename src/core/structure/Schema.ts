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
	buttons: { n: 0 }
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
	buttons: {
		[K: number]:
			| {
					type: "role";
					id: string;
					add: string;
					remove: string;
			  }
			| {
					type: "text";
					text: string;
			  };
	} & { n: number };
}

export { UserSchema, GuildSchema };
