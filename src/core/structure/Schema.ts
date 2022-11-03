import { langTypes } from "@services/i18n";

const UserSchema = {
	lang: "en",
	lastUsed: 0,
	ducks: 0
} satisfies UserSchema;

const GuildSchema = {
	lang: "en",
	lastUsed: 0
} satisfies GuildSchema;

interface UserSchema {
	lang: langTypes;
	lastUsed: number;
	ducks: number;
}

interface GuildSchema {
	lang: langTypes;
	lastUsed: number;
}

export { UserSchema, GuildSchema };
