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

function isObject(value) {
	return Object.prototype.toString.call(value) === "[object Object]";
}

function __i18n__parse(lang: string, string: langKeys, ...opt): string {
	if (string.startsWith("-")) string = string.slice(1) as `-${string}`;
	if (!Object.keys(langs).includes(lang))
		throw new Error("No lang specified found!");
	let str =
		langs[lang][string] ??
		langs["en"][string] ??
		`${string}${opt.length ? `(${opt.join(", ")})` : ""}`;
	if (typeof str != "string") return str;
	if (isObject(opt[0])) {
		for (let [k, v] of opt[0]) {
			str = str.replace(`<${k}>`, `${v}`);
		}
		opt = opt.slice();
	}
	if (opt.length) {
		let i = 0;
		for (let ot of opt) {
			str = str.replace("%s", `${ot}`);
			str = str.replace(`%${i++}%`, `${ot}`);
		}
	}
	return str;
}

const i18n = __i18n__parse.bind(null);

i18n.globe = globes;
i18n.icon = icons;
i18n.parse = __i18n__parse.bind(null);

global.i18n = i18n;

export interface I18n {
	(lang: string, string: langKeys, ...opt): string;
	parse: (lang: string, string: langKeys, ...opt) => string;
	globe: {
		color: any;
	};
	icon: typeof icons;
}
