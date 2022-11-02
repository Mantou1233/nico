/* eslint-disable-no-var */
import icons from "~/assets/icons.json";
import CommandManager from "@core/CommandManager";
import PluginLoader from "@core/PluginLoader";
import { langTypes, langKeys, langs } from "@services/i18n";
import { Client } from "discord.js";
import { Database } from "quickmongo";

declare global {
	var i18n: {
		parse: (lang: string, string: langKeys, ...opt) => string;
		globe: {
			color: any;
		};
		icon: typeof icons;
	};
	var random: (min: number, max: number) => number;
	var storage: {
		client: Client;
		db: Database;
	};
	var ap: (msg: string, mode?: boolean, flags?: any) => string[];
}

declare module "discord.js" {
	interface Client {
		manager: CommandManager;
		loader: PluginLoader;
	}
	interface Message {
		lang: langTypes;
	}
	interface EmbedBuilder {
		setConfig: () => this;
	}
}
export {};
