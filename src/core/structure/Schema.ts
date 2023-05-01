const UserSchema = {
	ducks: 0
} satisfies UserSchema;

const GuildSchema = {
	ducks: 0,
} satisfies GuildSchema;

interface UserSchema {
	ducks: number;
}

interface GuildSchema {
	ducks: number;
}

export {
	UserSchema,
	GuildSchema
};
