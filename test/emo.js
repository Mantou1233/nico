console.log(
	parse(
		"<:slash:1015435995828727929>, <a:dalao:858185426442911754> , <:sword:1015425584228216862>"
	)
);

function parse(pr) {
	const emojis = [];
	pr.replace(
		/<(?<animated>a)?:(?<name>\w{2,32}):(?<id>\d{17,20})>/g,
		(...args) =>
			void emojis.push({
				...args[6],
				animated: Boolean(args[6].animated ?? false),
				url: `https://cdn.discordapp.com/emojis/${args[6].id}.${
					Boolean(args[6].animated ?? false) ? "gif" : "png"
				}`
			}) ?? args[0]
	);
	return emojis;
}
