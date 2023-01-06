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
	| `-${string}` // any key
	| `>${string}` // any string
	;

export type langTypes = keyof typeof langs;

export let globes = {
	color: "CFF2FF"
};

function isObject(value) {
	return Object.prototype.toString.call(value) === "[object Object]";
}

function __i18n__parse(lang: string, string: langKeys, ...opt): string {
	let str: string;
	if (string.startsWith("-")) string = string.slice(1) as `-${string}`;
	if (!Object.keys(langs).includes(lang))
		throw new Error("No lang specified found!");
	const constants = {
		lang,
		...(isObject(opt[0]) ? opt.shift() : {})
	} as Record<string, string>;

	str =
		string.startsWith(">") ? 
		 string.slice(1) : (langs[lang][string] ||
			langs["en"][string] ||
			`${string}${opt.length ? `(${opt.join(", ")})` : ""}`);

	console.log(str)
	if (typeof str != "string") return str;

	for (let [k, v] of Object.entries(constants)) {
		str = str.replace(`<${k}>`, `${v}`);
	}

	if (opt.length) {
		let i = 0;
		for (let ot of opt) str = str.replace("%s", `${ot}`).replaceAll(`%${i++}`, `${ot}`);;
	}
	
	str = str.replaceAll("%\\", "%").replaceAll("<\\", "<").replaceAll("\\>", ">")

	return str;
}

export const i18n = __i18n__parse.bind(null) as TI18n;

i18n.globe = globes;
i18n.icon = icons;
i18n.parse = __i18n__parse.bind(null);

global.i18n = i18n as TI18n;

export interface TI18n {
	(lang: string, string: langKeys, ...opt): string;
	parse: (lang: string, string: langKeys, ...opt) => string;
	globe: {
		color: any;
	};
	icon: typeof icons;
}

export interface TTr {
	(string: langKeys, ...opt): string;
}