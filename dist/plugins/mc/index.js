"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const Decorators_1 = require("../../core/Decorators");
const discord_js_1 = require("discord.js");
let TestyPlugin = class TestyPlugin {
    client;
    extenstions;
    async mcparse(msg, args) {
        const content = args[1];
        msg.reply(args[1]);
    }
};
__decorate([
    Decorators_1.Inject,
    __metadata("design:type", discord_js_1.Client)
], TestyPlugin.prototype, "client", void 0);
__decorate([
    (0, Decorators_1.Cogs)(["./cogs1.ts"]),
    __metadata("design:type", Object)
], TestyPlugin.prototype, "extenstions", void 0);
__decorate([
    (0, Decorators_1.command)(),
    __param(1, (0, Decorators_1.Args)(ap.modern)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.Message, Array]),
    __metadata("design:returntype", Promise)
], TestyPlugin.prototype, "mcparse", null);
TestyPlugin = __decorate([
    (0, Decorators_1.DefinePlugin)()
], TestyPlugin);
exports.default = TestyPlugin;
//# sourceMappingURL=index.js.map