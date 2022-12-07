import { AllKeysOf, KeyOfUnion } from "@core/Utils";

import en from "~/assets/lang/en.json";
import tw from "~/assets/lang/zh_tw.json";

import icons from "~/assets/icons.json";

export let langs = { en, tw };

export const langAlias = {
	en: ["en", "english"],
	tw: ["tw", "zh-tw", "繁體中文"]
};

export type langKeys =
	| Exclude<AllKeysOf<KeyOfUnion<typeof langs>>, `item.${string}`>
	| `-${string}`;

export type langTypes = keyof typeof langs;

export let globes = {
	color: "CFF2FF"
};
class i18n {
	public globe: typeof globes;
	public icon: typeof icons;
	constructor() {
		this.globe = globes;
		this.icon = icons;
	}
	parse(lang: string, string: langKeys, ...opt): string {
		if (string.startsWith("-")) string = string.slice(1) as `-${string}`;
		if (!Object.keys(langs).includes(lang))
			throw new Error("No lang specified found!");
		let str =
			langs[lang][string] ??
			langs["en"][string] ??
			`${string}${opt.length ? `(${opt.join(", ")})` : ""}`;
		if (typeof str != "string") return str;
		for (let ot of opt) str = str.replace("%s", `${ot}`);
		return str;
	}
}

global.i18n = new i18n();
