/* eslint-disable-no-var */
import icons from "~/assets/icons.json";
import Manager from "~/core/Manager";
import PluginLoader from "@core/PluginLoader";
import { langTypes, langKeys, langs } from "@services/i18n";
import { Client, Interaction } from "discord.js";
import { Database } from "quickmongo";
import { TAp } from "./services/ap";
import { TI18n } from "./services/i18n";

declare global {
	var i18n: TI18n;
	var random: (min: number, max: number) => number;
	var storage: {
		client: Client;
		db: Database;
	};
	var ap: TAp;
}

declare module "discord.js" {
	interface Client {
		manager: Manager;
		loader: PluginLoader;
	}
	interface Message {
		lang: langTypes;
	}
	interface Interaction {
		lang: langTypes;
	}
	interface EmbedBuilder {
		setConfig: () => this;
	}
}
export {};
