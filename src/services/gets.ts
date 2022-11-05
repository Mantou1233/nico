export const getUser = async (msg, arg) => {
	if (!arg) return null;

	arg = arg.toLowerCase();

	if (msg.mentions.users.first()) return msg.mentions.users.first();

	if (!Number.isNaN(Number(arg))) {
		const fetched = await msg.client.users.fetch(arg).catch(() => null);

		if (fetched) return fetched;
	}

	return msg.client.users.cache.find(
		target =>
			target.username.toLowerCase().startsWith(arg) ||
			target.username.toLowerCase().includes(arg) ||
			target.tag.toLowerCase().includes(arg)
	);
};
