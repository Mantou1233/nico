import zod from "zod";

const UserSchema = zod.object({
	a: zod.number().default(0),
    hi: zod.object({
        a: zod.object({

        })
    }).default({})
})

