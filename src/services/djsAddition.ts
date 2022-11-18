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
		},
		enumerable: false
	},
	addField: {
		value: function (
			this: EmbedBuilder,
			name: string,
			value: string,
			inline: boolean = false
		): EmbedBuilder {
			return this.addFields({
				name,
				value,
				inline
			});
		},
		enumerable: false
	}
});
