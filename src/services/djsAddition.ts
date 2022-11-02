import { EmbedBuilder, GuildMember, User } from "discord.js";

Object.defineProperties(EmbedBuilder.prototype, {
	setConfig: {
		value: function (
			this: EmbedBuilder,
			member: GuildMember | null,
			authorText: string,
			footerText?: string
		): EmbedBuilder {
			return this.setColor(parseInt(i18n.globe.color, 16));
		}
	}
});
