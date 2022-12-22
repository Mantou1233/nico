"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globes = exports.langAlias = exports.langs = void 0;
const en_json_1 = __importDefault(require("../assets/lang/en.json"));
const zh_tw_json_1 = __importDefault(require("../assets/lang/zh_tw.json"));
const icons_json_1 = __importDefault(require("../assets/icons.json"));
exports.langs = { en: en_json_1.default, tw: zh_tw_json_1.default };
exports.langAlias = {
    en: ["en", "english"],
    tw: ["tw", "zh-tw", "繁體中文"]
};
exports.globes = {
    color: "CFF2FF"
};
function isObject(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
}
function __i18n__parse(lang, string, ...opt) {
    if (string.startsWith("-"))
        string = string.slice(1);
    if (!Object.keys(exports.langs).includes(lang))
        throw new Error("No lang specified found!");
    let str = exports.langs[lang][string] ??
        exports.langs["en"][string] ??
        `${string}${opt.length ? `(${opt.join(", ")})` : ""}`;
    if (typeof str != "string")
        return str;
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
i18n.globe = exports.globes;
i18n.icon = icons_json_1.default;
i18n.parse = __i18n__parse.bind(null);
global.i18n = i18n;
//# sourceMappingURL=i18n.js.map