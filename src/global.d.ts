/* eslint-disable-no-var */
import icons from "~/assets/icons.json";
import Manager from "~/core/Manager";
import PluginLoader from "@core/PluginLoader";
import { langTypes, langKeys, langs } from "@services/i18n";
import { Client, Interaction } from "discord.js";
import { Database } from "quickmongo";
import { TAp } from "./services/ap";
import { TI18n } from "./services/i18n";
import type { logTypes } from "./services/logger";

declare global {
	var __root: string;
	var i18n: TI18n;
	var random: (min: number, max: number) => number;
	var storage: {
		client: Client;
		db: Database;
	};
	var ap: TAp;
	var logger: Omit<
		{
			[K in logTypes]: (...args: any[]) => void;
		} & {
			(type: logTypes, ...args: any[]): void;
			writeLog: (content: any, date?: any) => void;
		},
		keyof Function
	>;

	interface Date {
		toTSVString(): string;
		toShortDate(): string;
	}
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
