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
const discord_js_1 = require("discord.js");
const Decorators_1 = require("../../core/Decorators");
let TestifyCog = class TestifyCog {
    client;
    extenstions;
    async testcog(msg) {
        msg.reply("HOLY SHIT cog runs well!! fuck you + congrats" + this.client);
        console.log(this.client);
    }
};
__decorate([
    Decorators_1.Inject,
    __metadata("design:type", discord_js_1.Client)
], TestifyCog.prototype, "client", void 0);
__decorate([
    (0, Decorators_1.Cogs)(["./cogs1.ts"]),
    __metadata("design:type", Object)
], TestifyCog.prototype, "extenstions", void 0);
__decorate([
    (0, Decorators_1.command)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.Message]),
    __metadata("design:returntype", Promise)
], TestifyCog.prototype, "testcog", null);
TestifyCog = __decorate([
    (0, Decorators_1.DefinePlugin)()
], TestifyCog);
exports.default = TestifyCog;
//# sourceMappingURL=cogs1.js.map