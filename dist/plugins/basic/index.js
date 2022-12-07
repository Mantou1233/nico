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
const Decorators_1 = require("~/core/Decorators");
const discord_js_1 = require("discord.js");
let BasicPlugin = class BasicPlugin {
    client;
    extenstions;
    async ping(msg) {
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId("pong")
            .setLabel("Click me!")
            .setStyle(discord_js_1.ButtonStyle.Primary));
        msg.reply({
            components: [row],
            content: `pong!! ${msg.createdTimestamp - Date.now()}ms`
        });
    }
    async menu(msg) {
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId("menu")
            .setLabel("Click me open menu")
            .setStyle(discord_js_1.ButtonStyle.Primary));
        msg.reply({
            components: [row]
        });
    }
    async restart(msg) {
        msg.reply("ending;;");
        this.client.loader.expo();
    }
    async PingHandler(interaction) {
        if (interaction.customId !== "pong")
            return;
        interaction.reply({
            ephemeral: true,
            content: `pong x2!!!! ${Math.abs(interaction.createdTimestamp - Date.now())}ms`
        });
    }
    async MenuHandler(interaction) {
        if (interaction.customId !== "menu")
            return;
        const modal = new discord_js_1.ModalBuilder()
            .setCustomId("myModal")
            .setTitle("hi u!");
        // Add components to modal
        // Create the text input components
        const favoriteColorInput = new discord_js_1.TextInputBuilder()
            .setCustomId("name")
            // The label is the prompt the user sees for this input
            .setLabel("whats your name")
            // Short means only a single line of text
            .setStyle(discord_js_1.TextInputStyle.Short);
        const hobbiesInput = new discord_js_1.TextInputBuilder()
            .setCustomId("desc")
            .setLabel("some description about chu'?")
            // Paragraph means multiple lines of text.
            .setStyle(discord_js_1.TextInputStyle.Paragraph);
        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow = new discord_js_1.ActionRowBuilder().addComponents(favoriteColorInput);
        const secondActionRow = new discord_js_1.ActionRowBuilder().addComponents(hobbiesInput);
        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow);
        await interaction.showModal(modal);
        const response = await interaction.awaitModalSubmit({
            time: 10000000
        });
        response.reply(`woo, ${response.fields.getTextInputValue("name")}, you poem is ${response.fields.getTextInputValue("desc")}`);
    }
};
__decorate([
    Decorators_1.Inject,
    __metadata("design:type", discord_js_1.Client)
], BasicPlugin.prototype, "client", void 0);
__decorate([
    (0, Decorators_1.Cogs)(["./cogs1.ts", "./cogs2.ts", "./cogs3.ts"]),
    __metadata("design:type", Object)
], BasicPlugin.prototype, "extenstions", void 0);
__decorate([
    (0, Decorators_1.command)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.Message]),
    __metadata("design:returntype", Promise)
], BasicPlugin.prototype, "ping", null);
__decorate([
    (0, Decorators_1.command)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.Message]),
    __metadata("design:returntype", Promise)
], BasicPlugin.prototype, "menu", null);
__decorate([
    (0, Decorators_1.command)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.Message]),
    __metadata("design:returntype", Promise)
], BasicPlugin.prototype, "restart", null);
__decorate([
    (0, Decorators_1.interaction)({
        type: "button"
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.ButtonInteraction]),
    __metadata("design:returntype", Promise)
], BasicPlugin.prototype, "PingHandler", null);
__decorate([
    (0, Decorators_1.interaction)({
        type: "button"
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.ButtonInteraction]),
    __metadata("design:returntype", Promise)
], BasicPlugin.prototype, "MenuHandler", null);
BasicPlugin = __decorate([
    (0, Decorators_1.DefinePlugin)()
], BasicPlugin);
exports.default = BasicPlugin;
//# sourceMappingURL=index.js.map