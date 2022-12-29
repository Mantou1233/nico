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
Object.defineProperty(exports, "__esModule", { value: true });
const Decorators_1 = require("../../core/Decorators");
const discord_js_1 = require("discord.js");
const Profile_1 = require("../../core/Profile");
const quickmongo_1 = require("quickmongo");
let BasicPlugin = class BasicPlugin {
    client;
    db;
    async dbinfo(msg) {
        const p = await (0, Profile_1.UserProfile)(msg);
        p.ducks++;
        msg.reply(`db ping is ${Math.floor(await this.db.ping())}ms! u also got ${p.ducks} ducks gg`);
        p.save();
    }
};
__decorate([
    Decorators_1.Inject,
    __metadata("design:type", discord_js_1.Client)
], BasicPlugin.prototype, "client", void 0);
__decorate([
    Decorators_1.Inject,
    __metadata("design:type", quickmongo_1.Database)
], BasicPlugin.prototype, "db", void 0);
__decorate([
    (0, Decorators_1.command)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.Message]),
    __metadata("design:returntype", Promise)
], BasicPlugin.prototype, "dbinfo", null);
BasicPlugin = __decorate([
    (0, Decorators_1.DefinePlugin)()
], BasicPlugin);
exports.default = BasicPlugin;
//# sourceMappingURL=index.js.map