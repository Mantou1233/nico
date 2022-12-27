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
const util_1 = require("util");
let BasicPlugin = class BasicPlugin {
    client;
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
        console.log(1);
        response.reply(`woo, ${response.fields.getTextInputValue("name")}, you poem is ${response.fields.getTextInputValue("desc")}`);
    }
    async eval(msg, args) {
        if (msg.author.id !== "644504218798915634")
            return msg.channel.send("Insuffent permission.");
        const code = args[1];
        if (code.trim() === "")
            return msg.channel.send("Dont give me nothing u dumb!!");
        let msg2 = await msg.channel.send("evaling...");
        try {
            let output = await eval(code);
            if (output instanceof Promise ||
                (Boolean(output) &&
                    typeof output.then === "function" &&
                    typeof output.catch === "function"))
                output = await output;
            output = (0, util_1.inspect)(output, {
                depth: 0,
                maxArrayLength: null
            });
            msg2.edit({
                embeds: [
                    {
                        author: {
                            name: "Evaluation Completed!"
                        },
                        description: `**Input**\n\`\`\`js\n${code}\`\`\`\n**Output**\n\`\`\`js\n${output}\`\`\``,
                        color: 0x2f3136
                    }
                ]
            }).catch(() => { });
        }
        catch (err) {
            msg2.edit({
                embeds: [
                    {
                        author: {
                            name: "Error!"
                        },
                        description: `**Input**\n\`\`\`js\n${code}\`\`\`\n**Error**\n\`\`\`js\n${err}\`\`\``,
                        color: 0x2f3136
                    }
                ]
            }).catch(() => { });
        }
    }
};
__decorate([
    Decorators_1.Inject,
    __metadata("design:type", discord_js_1.Client)
], BasicPlugin.prototype, "client", void 0);
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
    (0, Decorators_1.command)({ command: "restart" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.Message]),
    __metadata("design:returntype", Promise)
], BasicPlugin.prototype, "restart", null);
__decorate([
    Decorators_1.interaction.button(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.ButtonInteraction]),
    __metadata("design:returntype", Promise)
], BasicPlugin.prototype, "PingHandler", null);
__decorate([
    Decorators_1.interaction.button(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.ButtonInteraction]),
    __metadata("design:returntype", Promise)
], BasicPlugin.prototype, "MenuHandler", null);
__decorate([
    (0, Decorators_1.command)(),
    __param(0, (0, Decorators_1.Msg)()),
    __param(1, (0, Decorators_1.Args)(ap.modern)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.Message, Array]),
    __metadata("design:returntype", Promise)
], BasicPlugin.prototype, "eval", null);
BasicPlugin = __decorate([
    (0, Decorators_1.DefinePlugin)()
], BasicPlugin);
exports.default = BasicPlugin;
//# sourceMappingURL=index.js.map