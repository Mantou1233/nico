import zod from "zod";

const UserSchema = zod.object({
	ducks: zod.number().default(0)
	/*
	complex example:
    hi: zod.object({
        a: zod.number().default(0)
    }).default({})
	*/
});
type UserSchema = zod.infer<typeof UserSchema>;

export { UserSchema };
